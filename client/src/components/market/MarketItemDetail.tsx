import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useItemStore } from "../../stores/marketStore";
import Modal from "../modal";
import MarketComments from "./MarketComments";

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




    return (
        <div className="notice-container">
            <div>
                <div className="notice-title">
                    {item.title}
                </div>
                <div className="market-info">
                    <div className="market-info-item">작성자 {item.userId}</div>
                    <div className="market-info-item">조회수 {item.views}</div>
                    <div className="market-info-item">
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
                <div>{item.categoryName}</div>
                <div>{formatPrice(item.price)}원</div>
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
                <MarketComments />
            </div>
            {/* {item.nextNotice && (<div><Link to={`/notice/${post.nextNotice.id}`}><span className="notice-nav-label">다음글</span> {post.nextNotice.title}</Link></div>)}
            {post.prevNotice && (<div><Link to={`/notice/${post.prevNotice.id}`}><span className="notice-nav-label">이전글</span> {post.prevNotice.title}</Link></div>)} */}
        </div>

    );
}

export default MarketItemDetail;