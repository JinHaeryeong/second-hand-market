// ChatListPopover.jsx (예시 파일)
import * as Popover from '@radix-ui/react-popover';
import { MessageCircle } from "lucide-react";
import React, { useState } from 'react';
import { apiLoadChatRooms } from '../api/chatApi';
import ChatRoomModal from './ChatRoomModal';
// 예시: API 호출 함수 (실제 구현 필요)
// import { apiLoadChatRooms } from "../api/chatApi"; 
interface ChatRoomItem {
    chatRoomId: number;
    partnerId: string;
    lastMessage: string;
    lastSentTime: Date;
}

const ChatListPopover = () => {
    const [open, setOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [currentChatRoomId, setCurrentChatRoomId] = useState<number | null>(null);


    const handleOpenChange = async (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            setIsLoading(true);
            try {
                const data = await apiLoadChatRooms();
                console.log("Chat Rooms Loaded:", data);
                setChatRooms(data as ChatRoomItem[]);
            } catch (error) {
                console.error("채팅 목록 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRoomClick = (roomId: number) => {
        setOpen(false); // 팝오버 닫기

        setTimeout(() => {
            setCurrentChatRoomId(roomId);
            setIsChatModalOpen(true);
        }, 50); // 50ms 후 모달 띄우기
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setCurrentChatRoomId(null);

    };

    return (
        <>
            <Popover.Root open={open} onOpenChange={handleOpenChange}>
                <Popover.Trigger asChild>
                    <li className="nav-list-item" style={{ cursor: 'pointer' }}>
                        <MessageCircle />
                    </li>
                </Popover.Trigger>

                <Popover.Portal>
                    <Popover.Content className="popover-content" sideOffset={5}>
                        <div className="popover-div">
                            <h4 className='popover-title'>채팅 목록</h4>
                            <div className="chat-list-scroll-area">
                                {isLoading && <div>로딩 중...</div>}

                                {!isLoading && chatRooms.length === 0 && <div>진행 중인 채팅이 없습니다.</div>}

                                {!isLoading && chatRooms.map((room) => (
                                    <div key={room.chatRoomId} className="chat-room-item"
                                        onClick={() => {
                                            handleRoomClick(room.chatRoomId);
                                        }}
                                    >
                                        <strong>{room.partnerId}</strong>
                                        <p style={{ margin: '3px 0 0 0', fontSize: '0.9em', color: '#666' }}>{room.lastMessage}</p>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <Popover.Arrow className="popover-arrow" />
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>

            {isChatModalOpen && currentChatRoomId !== null && (
                <ChatRoomModal
                    isOpen={isChatModalOpen}
                    onClose={closeChatModal}
                    chatRoomId={currentChatRoomId}
                />
            )}
        </>
    );
};

export default ChatListPopover;