import { useEffect, useState } from "react";
import { usePostStore } from "../../stores/postStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Link } from "react-router-dom";
import Modal from "../modal";
import Avatar from "react-avatar";

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const authUser = useAuthStore((s) => s.authUser);
    const deletePost = usePostStore((s) => s.deletePost);

    const post = usePostStore((s) => s.post);
    const fetchPostById = usePostStore((s) => s.fetchPostById);
    const postErr = usePostStore((s) => s.postErr);
    const resetPostErr = usePostStore((s) => s.resetPostErr);
    const postId = id ? Number(id) : null;

    const [isOpenMdoal, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (postId && !isNaN(postId)) {
            fetchPostById(postId);
        }
    }, [id, fetchPostById]);


    useEffect(() => {
        if (postErr) {
            alert(postErr);
            resetPostErr();
            navigate('/notices');
        }
    }, [postErr]);

    if (!post) {
        return (
            <div className="notice-container loading">
                <h1>로딩중...</h1>
            </div>
        );
    }
    //공지사항 수정 관련
    const handleEditNotice = () => {
        navigate(`/notice/edit/${id}`);
    }

    //공지사항 삭제 모달 관련
    const openDeleteInModal = () => {
        setIsModalOpen(true);
    };

    const closeDelteModal = () => {
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (postId) {
            deletePost(postId);
        }
        alert("공지사항을 삭제했습니다.");
        navigate("/notices");
    }
    //




    return (
        <div className="notice-container">
            <div>
                <div className="notice-title">
                    {post.title}
                </div>
                <div className="notice-info">
                    <div className="notice-info-item"><strong>작성자</strong> <Avatar name={`${post.userId}`} size="20" round={true} /> {post.userId}</div>
                    <div className="notice-info-item notice-info-right">
                        <div>조회수 {post.views}</div>
                        <div>
                            작성일시 {new Intl.DateTimeFormat('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                            }).format(new Date(post.createdAt))}
                        </div>
                    </div>
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }} className="notice-content">
                </div>
            </div>
            {authUser && authUser.id === post.userId && (
                <div className="notice-btns">
                    <button className="notice-btn notice-edit" onClick={handleEditNotice}>수정하기</button>
                    <button className="notice-btn notice-delete" onClick={openDeleteInModal}>삭제하기</button>
                </div>
            )}
            {isOpenMdoal && (
                <Modal isOpen={isOpenMdoal} onClose={closeDelteModal} title="공지사항 삭제" actions={
                    <div className="delete-confirm">
                        <button onClick={handleDeleteConfirm} className="delete-confirm-btn" >삭제</button>
                        <button onClick={closeDelteModal} className="delete-cancel-btn">취소</button>
                    </div>
                }>
                    <div className="delete-content">삭제한 공지사항은 되돌릴 수 없습니다😥 정말 삭제하시겠습니까?</div>
                </Modal>
            )}
            <hr />

            {post.nextNotice && (<div className="next-notice"><Link to={`/notice/${post.nextNotice.id}`}><span className="notice-nav-label">다음글</span> {post.nextNotice.title}</Link></div>)}
            {post.prevNotice && (<div><Link to={`/notice/${post.prevNotice.id}`}><span className="notice-nav-label">이전글</span> {post.prevNotice.title}</Link></div>)}
        </div>

    );
}

export default NoticeDetail;