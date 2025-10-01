import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/modal';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuthStore } from '../stores/authStore';
import axiosAuthInstance from '../api/axiosAuthInstance';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
    sender: string;
    message: string;
    createdAt: string;
}

interface ChatRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatRoomId: number;
}


const ChatRoomModal: React.FC<ChatRoomModalProps> = ({ isOpen, onClose, chatRoomId }) => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const stompClientRef = useRef<Stomp.CompatClient | null>(null);
    const [stompConnected, setStompConnected] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const senderId = authUser?.id;
    const subscriptionRef = useRef<Stomp.StompSubscription | null>(null);

    useEffect(() => {
        console.log(`ChatRoom ID: ${chatRoomId}, Sender ID: ${senderId}`);

        if (!chatRoomId || !senderId) {
            setLoading(false);
            return;
        }

        const loadHistory = async () => {
            try {
                // REST API 호출: /chat/room/{chatRoomId}/messages
                const res = await axiosAuthInstance.get(`/chat/room/${chatRoomId}/messages`);
                console.log("Chat History Loaded:", res.data);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to load chat history:", error);
            } finally {
                setLoading(false);
            }
        };

        const connect = () => {
            if (stompClientRef.current && stompClientRef.current.connected) {
                console.log("STOMP 클라이언트가 이미 연결되어 있습니다. 재연결을 건너뜁니다.");
                return stompClientRef.current; // 기존 클라이언트 반환
            }

            const socketUrl = 'http://localhost:8080/ws-stomp';

            const client = Stomp.Stomp.over(() => new SockJS(socketUrl));

            client.debug = () => { };

            client.reconnectDelay = 5000;

            client.connect({},
                (frame: any) => {
                    console.log('STOMP Connected: ' + frame);
                    setStompConnected(true);

                    // 구독: 서버의 /sub/chat/{chatRoomId} 경로 구독
                    const subscription = client.subscribe(`/sub/chat/${chatRoomId}`, (message) => {
                        const newMsg = JSON.parse(message.body);
                        setMessages(prev => [...prev, newMsg]);
                    });
                    subscriptionRef.current = subscription;
                },
                (error: any) => {
                    console.error("STOMP Connection Error:", error);
                    setStompConnected(false);
                }
            );

            stompClientRef.current = client;
            return client;
        };

        loadHistory();
        const clientInstance = connect();

        return () => {
            if (subscriptionRef.current) {
                console.log("STOMP Unsubscribing...");
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (clientInstance && clientInstance.connected) {
                console.log("STOMP Disconnecting...");
                clientInstance.disconnect(() => {
                    console.log("STOMP Disconnected.");
                    setStompConnected(false);
                });
            }
        };
    }, [chatRoomId, senderId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = () => {
        const client = stompClientRef.current;
        if (inputMessage.trim() === '' || !client || !client.connected) return;

        const chatMessage = {
            sender: senderId,
            message: inputMessage,
        };

        client.send(`/pub/chat/${chatRoomId}`, {}, JSON.stringify(chatMessage));

        setInputMessage('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`채팅방`} actions={
            <div className="chat-input-area">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                    placeholder={stompConnected ? "메시지를 입력하세요" : "연결 대기 중..."}
                    disabled={!stompConnected || loading}
                    className="chat-input"
                />
                <button className="chat-send-btn" onClick={sendMessage} disabled={!stompConnected || loading}>전송</button>
            </div>
        }>
            <div className="chat-messages">
                {loading ?
                    <div>대화 기록 로딩 중...</div> :
                    !stompConnected && messages.length === 0 ?
                        <div>연결 실패 또는 대화 기록이 없습니다.</div> :
                        messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.sender === senderId ? 'sender' : 'recipient'}`}>
                                <div style={{ fontWeight: 'bold' }}>{msg.sender === senderId ? '나' : msg.sender}</div> {msg.message}
                                <div style={{ fontSize: '0.7em', color: '#999' }}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
                            </div>
                        ))
                }
                <div ref={messagesEndRef} />
            </div>
        </Modal>
    );
};

export default ChatRoomModal;