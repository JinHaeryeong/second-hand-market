import { useEffect, useState } from "react";
import { useItemStore } from "../../stores/marketStore";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Link } from "react-router-dom";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import Modal from "../modal";
import { useAuthStore } from "../../stores/authStore";

const ItemList = () => {
    const itemList = useItemStore((s: any) => s.itemList);
    const fetchItemList = useItemStore((s: any) => s.fetchItemList);
    const totalPages = useItemStore((s: any) => s.totalPages);
    const setPage = useItemStore((s: any) => s.setPage);
    const page = useItemStore((s: any) => s.page);
    const deleteItem = useItemStore((s: any) => s.deleteItem);
    const authUser = useAuthStore((s: any) => s.authUser);

    const [itemIdToDelete, setItemIdToDelete] = useState<number | null>(null);
    const [isOpenMdoal, setIsModalOpen] = useState(false);

    useEffect(() => {

        if (page !== 1) {
            setPage(1);
        }
    }, []);

    useEffect(() => {
        fetchItemList();
    }, [page]);

    const blockSize = 5;
    const startPage = Math.floor((page - 1) / blockSize) * blockSize + 1;
    const endPage = Math.min(startPage + (blockSize - 1), totalPages);



    const formatPrice = (price: number) => {
        if (price === undefined || price === null) return '';

        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const getRelativeTime = (dateString: string) => {
        if (!dateString) return '';

        return formatDistanceToNow(new Date(dateString), {
            addSuffix: true, // "전" 접미사를 추가합니다. (예: 5분 -> 5분 전)
            locale: ko
        });
    }
    const openDeleteInModal = (itemId: number) => {
        setItemIdToDelete(itemId);
        setIsModalOpen(true);
    };

    const closeDelteModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = async () => {

        const idToDelete = itemIdToDelete;
        if (!idToDelete) {
            alert("삭제할 상품 정보가 없습니다.");
            return;
        }
        closeDelteModal();
        if (authUser.role == "ROLE_ADMIN") {

            const b = await deleteItem(idToDelete);
            if (b) {
                fetchItemList();
                alert("삭제 성공했습니다");

            } else {
                alert("삭제에 실패했습니다");
            }
            // 5. 작업 완료 후 상태 초기화 및 모달 닫기
            setItemIdToDelete(null);
        }
    }
    return (
        <div>
            <div className="admin-item-container">
                <ul className="admin-item-list">
                    <li className="admin-item-list-li">
                        <div className="admin-li-item">썸네일</div>
                        <div className="admin-li-item">제목</div>
                        <div className="admin-li-item">상태</div>
                        <div className="admin-li-item">가격</div>
                        <div className="admin-li-item">시간</div>
                        <div className="admin-li-item">삭제</div>
                    </li>
                </ul>
                <ul className="admin-item-list">
                    {itemList && itemList.map((item: any, index: number) => (
                        <li key={index} className="admin-item-list-li">
                            <div className="admin-item-thumbnail">
                                {!item.thumbnailUrl && (
                                    <img src="/images/no-image.png" alt="이미지 없음" />
                                )}
                                {item.thumbnailUrl && (
                                    <img src={item.thumbnailUrl} alt={item.title} />
                                )}
                            </div>
                            <div className={`admin-item-status status-${item.status || '판매중'}`}>
                                {item.status || '판매중'}
                            </div>
                            <Link to={`/market/${item.id}`} className="admin-item-link">
                                <div>{item.title}</div></Link>
                            <div><strong>{formatPrice(item.price)}</strong>원</div>
                            <div className="admin-item-created-at">
                                {getRelativeTime(item.createdAt)}
                            </div>
                            <div>
                                <button className="admin-item-del-btn" onClick={() => openDeleteInModal(item.id)}>삭제</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="page-container">
                {startPage > 1 && (
                    <button className="prev-btn" onClick={() => setPage(startPage - 1)}>
                        <ChevronsLeft size={30} />
                    </button>
                )}
                <div className="page-numbers-wrapper">
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((n) => (
                        <button
                            className={`pagination-btn ${n === page ? "selected-page" : 'unselected-page'}`}
                            onClick={() => setPage(n)}
                        >
                            {n}
                        </button>
                    ))}
                </div>
                {endPage < totalPages && (
                    <button className="next-btn" onClick={() => setPage(endPage + 1)}>
                        <ChevronsRight size={30} />
                    </button>
                )}

            </div>
            {isOpenMdoal && (
                <Modal isOpen={isOpenMdoal} onClose={closeDelteModal} title="상품 삭제" actions={
                    <div className="delete-confirm">
                        <button onClick={handleDeleteConfirm} className="delete-confirm-btn" >삭제</button>
                        <button onClick={closeDelteModal} className="delete-cancel-btn">취소</button>
                    </div>
                }>
                    <div className="delete-content">유저가 등록한 상품을 삭제하면 되돌릴 수 없어요😥 정말 삭제하시겠어요?</div>
                </Modal>
            )}
        </div>
    );
}

export default ItemList;