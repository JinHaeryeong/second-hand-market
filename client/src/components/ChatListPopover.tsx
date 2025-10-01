// ChatListPopover.jsx (예시 파일)
import * as Popover from '@radix-ui/react-popover';
import { MessageCircle } from "lucide-react";
import React, { useState } from 'react';
import { apiLoadChatRooms } from '../api/chatApi';
import ChatRoomModal from './ChatRoomModal';

// 예시: API 호출 함수 (실제 구현 필요)
// import { apiLoadChatRooms } from "../api/chatApi"; 
interface ChatRoomItem {
    id: number;
    partnerId: string;
    lastMessage: string;
    unreadCount: number;
}

const ChatListPopover = () => {
    const [open, setOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoomItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 팝오버가 열릴 때만 채팅 목록을 불러오는 함수
    const handleOpenChange = async (newOpen: any) => {
        setOpen(newOpen);
        if (newOpen && chatRooms.length === 0) {
            setIsLoading(true);
            try {
                const data = await apiLoadChatRooms();
                console.log(data);
                setChatRooms(data);


            } catch (error) {
                console.error("채팅 목록 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Popover.Root open={open} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <li className="nav-list-item" style={{ cursor: 'pointer' }}>
                    <MessageCircle />
                </li>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content className="popover-content" sideOffset={5}>
                    <div style={{ padding: '10px', width: '300px' }}>
                        <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee' }}>채팅 목록</h4>

                        {isLoading && <div>로딩 중...</div>}

                        {!isLoading && chatRooms.length === 0 && <div>진행 중인 채팅이 없습니다.</div>}

                        {!isLoading && chatRooms.map(room => (
                            <div key={room.id} className="chat-room-item"
                                style={{ padding: '8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                                onClick={() => {
                                    console.log(`채팅방 ${room.id}로 이동`);
                                    setOpen(false);
                                }}
                            >
                                <strong>{room.partnerId}</strong>
                                <p style={{ margin: '3px 0 0 0', fontSize: '0.9em', color: '#666' }}>{room.lastMessage}</p>
                                {room.unreadCount > 0 &&
                                    <span style={{ float: 'right', color: 'red', fontWeight: 'bold' }}>
                                        {room.unreadCount}
                                    </span>
                                }
                            </div>
                        ))}
                    </div>

                    <Popover.Arrow className="popover-arrow" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default ChatListPopover;