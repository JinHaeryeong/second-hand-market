import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useItemStore } from "../../stores/marketStore";
import Modal from "../modal";
import MarketComments from "./MarketComments";
import MarketCommentList from "./MarketCommentList";
import Avatar from "react-avatar";
import axios from "axios";
import { apiChatRequest } from "../../api/chatApi";
import ChatRoomModal from "../ChatRoomModal";
import { MessageCircle, MessageSquare } from "lucide-react";
const MarketItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const authUser = useAuthStore((s: any) => s.authUser);
    const deleteItem = useItemStore((s: any) => s.deleteItem);

    const item = useItemStore((s: any) => s.item);
    const fetchItemById = useItemStore((s: any) => s.fetchItemById);
    const itemErr = useItemStore((s: any) => s.itemErr);
    const resetItemErr = useItemStore((s: any) => s.resetItemErr);
    const itemId = id ? Number(id) : null;

    const [isOpenMdoal, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [currentChatRoomId, setCurrentChatRoomId] = useState(null);

    useEffect(() => {
        if (itemId && !isNaN(itemId)) {
            fetchItemById(itemId);
        }
    }, [id, fetchItemById]);


    useEffect(() => {
        if (itemErr) {
            alert(itemErr);
            resetItemErr();
            navigate('/market');
        }
    }, [itemErr]);

    if (!item) {
        return (
            <div className="notice-container loading">
                <h1>로딩중...</h1>
            </div>
        );
    }
    //공지사항 수정 관련
    const handleEditItem = () => {
        navigate(`/market/edit/${id}`);
    }

    //공지사항 삭제 모달 관련
    const openDeleteInModal = () => {
        setIsModalOpen(true);
    };

    const closeDelteModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = () => {

        if (itemId && authUser) {
            const b = deleteItem(itemId);
            if (b) {
                alert("판매글을 삭제했습니다.");
                navigate("/market");
            } else {
                alert("삭제에 실패했습니다");
                navigate(`/market/${id}`);
            }
        }
    }
    const formatPrice = (price: number) => {
        if (price === undefined || price === null) return '';

        return new Intl.NumberFormat('ko-KR').format(price);
    };


    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };
    const handleChatButtonClick = async (itemId: number) => {

        if (!authUser) {
            alert("채팅을 시작하려면 로그인해야 합니다.");
            return;
        }

        if (authUser.id === item.userId) {
            alert("자신이 작성한 게시글과는 채팅할 수 없습니다.");
            return;
        }

        if (!itemId) {
            alert("상품이 존재하지 않습니다.");
            return;
        }


        if (!item.userId) {
            alert("유저 아이디가 존재하지않아요");
            return;
        }
        try {
            const response = await apiChatRequest(itemId, item.userId);

            const chatRoomId = response;



            setCurrentChatRoomId(chatRoomId);
            setIsChatModalOpen(true);

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                console.error("채팅방 생성/조회 실패:", error);
                alert(error.response?.data || "채팅방을 열 수 없습니다.");
            }
        }
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setCurrentChatRoomId(null);
    };


    return (
        <div className="notice-container">
            <div>
                <div className="notice-title">
                    {item.title}
                </div>
                <div className="market-info">
                    <div className="market-info-item market-info-left">
                        <div><strong>작성자</strong> <Avatar name={`${item.userId}`} size="20" round={true} /> {item.userId}</div>
                        <div><button className="chat-btn" onClick={() => handleChatButtonClick(item.id)}>채팅하기</button></div>
                    </div>
                    <div className="market-info-item market-info-right">
                        <div>조회수 {item.views}</div>
                        <div>
                            작성일시 {new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            }).format(new Date(item.createdAt))}
                        </div>
                    </div>
                </div>
                <div>{item.categoryName}</div>
                <div className="market-item-price"><strong>{formatPrice(item.price)}</strong>원</div>
                <div
                    dangerouslySetInnerHTML={{ __html: item.content }} className="notice-content">
                </div>
            </div>
            {authUser && authUser.id === item.userId && (
                <div className="notice-btns">
                    <button className="notice-btn notice-edit" onClick={handleEditItem}>수정하기</button>
                    <button className="notice-btn notice-delete" onClick={openDeleteInModal}>삭제하기</button>
                </div>
            )}
            {isOpenMdoal && (
                <Modal isOpen={isOpenMdoal} onClose={closeDelteModal} title="판매글 삭제" actions={
                    <div className="delete-confirm">
                        <button onClick={handleDeleteConfirm} className="delete-confirm-btn" >삭제</button>
                        <button onClick={closeDelteModal} className="delete-cancel-btn">취소</button>
                    </div>
                }>
                    <div className="delete-content">삭제한 판매글은 되돌릴 수 없어요😥 정말 삭제하시겠어요?</div>
                </Modal>
            )}
            <hr />
            <div>
                <MarketCommentList refreshTrigger={refreshTrigger} />
            </div>
            <div>
                <MarketComments onCommentSuccess={triggerRefresh} />
            </div>
            {item.status === "판매완료" && (<div>판매가 완료된 상품입니다</div>)}
            {isChatModalOpen && currentChatRoomId !== null && itemId !== null && (
                <ChatRoomModal
                    isOpen={isChatModalOpen}
                    onClose={closeChatModal}
                    chatRoomId={currentChatRoomId}
                />
            )}
        </div>

    );
}

export default MarketItemDetail;