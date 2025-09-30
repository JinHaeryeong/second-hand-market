import { useEffect, useState } from "react";
import Avatar from 'react-avatar';
import { apiCommentAccept, apiCommentDelete, apiCommentList } from "../../api/marketApi";
import { useItemStore } from "../../stores/marketStore";
import { useAuthStore } from "../../stores/authStore";
import Modal from "../modal";
import { useNavigate } from "react-router-dom";
const MarketCommentList = ({ refreshTrigger }: { refreshTrigger: number }) => {
    const [comments, setComments] = useState([]);
    const item = useItemStore((s: any) => s.item);
    const authUser = useAuthStore((s: any) => s.authUser);
    const [isOpenMdoal, setIsModalOpen] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState<number | null>(null);
    const navigate = useNavigate();

    const fetchComments = async () => {
        console.log(item.id);

        if (!item || !item.id) {
            setComments([]);
            return;
        }

        try {
            const response = await apiCommentList(item.id);
            console.log("API응답 데이터" + response.data);


            if (response && response.data) {
                setComments(response.data);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error("댓글 목록을 불러오는 데 실패했습니다:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [item?.id, refreshTrigger]);

    const openDeleteInModal = (commentId: number) => {
        setCommentIdToDelete(commentId);
        setIsModalOpen(true);
    };

    const closeDelteModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = async () => {

        const idToDelete = commentIdToDelete;
        if (!idToDelete) {
            alert("삭제할 댓글 정보가 없습니다.");
            return;
        }
        closeDelteModal();

        const response = await apiCommentDelete(idToDelete);
        if (response.result === "success") {
            await fetchComments();
            alert("댓글을 삭제했습니다.");

        } else {
            alert("삭제에 실패했습니다");
        }
        // 5. 작업 완료 후 상태 초기화 및 모달 닫기
        setCommentIdToDelete(null);
    }

    const handleAccept = async () => {
        try {
            if (item.id) {
                const response = await apiCommentAccept(item.id);
                if (response.result === "success") {
                    await fetchComments();
                    alert("거래를 수락했습니다.");

                } else {
                    alert("거래에 실패했습니다");
                }
            }
        } catch (error) {
            console.error("ㅁㄹ..실패함..하여튼 실패했습니다:", error);
        }
    }
    return (
        <div>
            {comments === undefined ? (
                <p>로딩중..</p>
            ) : comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
            ) : (
                <>
                    {

                        comments.map((comment: any) => (
                            <div key={comment.id} className="comment-box">
                                <Avatar githubHandle="sitebase" size="30" round={true} />
                                <div className="speech-bubble">
                                    <div className="comment-top"><strong>{comment.nickname}</strong><div className="comment-price-view">{comment.price}원</div></div>
                                    <div className="comment-text">{comment.txt}</div>


                                    {authUser && comment.userId === authUser.id &&
                                        <div className="comment-delte">
                                            <button onClick={() => openDeleteInModal(comment.id)}>삭제</button>
                                        </div>}
                                    {authUser && item.userId == authUser.id && (
                                        <div className="comment-confirm">
                                            <button className="comment-accept" onClick={handleAccept}>수락</button><button className="comment-reject">거절</button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ))}
                </>
            )}
            {isOpenMdoal && (
                <Modal isOpen={isOpenMdoal} onClose={closeDelteModal} title="제시 삭제" actions={
                    <div className="delete-confirm">
                        <button onClick={handleDeleteConfirm} className="delete-confirm-btn" >삭제</button>
                        <button onClick={closeDelteModal} className="delete-cancel-btn">취소</button>
                    </div>
                }>
                    <div className="delete-content">제시금액을 삭제하면 되돌릴 수 없어요😥 정말 삭제하시겠어요?</div>
                </Modal>
            )}
        </div>
    )
}

export default MarketCommentList;