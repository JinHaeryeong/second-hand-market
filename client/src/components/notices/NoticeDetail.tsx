import { useEffect } from "react";
import { usePostStore } from "../../stores/postStore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

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


    return (
        <div className="notice-container">
            <div>
                <div>
                    {post.title}
                </div>
                <div>
                    <div>{post.userId}</div>
                    <div>
                        {new Intl.DateTimeFormat('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true
                        }).format(new Date(post.createdAt))}
                    </div>
                    <div>{post.views}</div>
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }} >
                </div>
            </div>
            {authUser && authUser.id === post.userId && (
                <div className="notice-btns">
                    <button className="notice-btn notice-edit">수정하기</button>
                    <button className="notice-btn notice-delete">삭제하기</button>
                </div>
            )}
        </div>

    );
}

export default NoticeDetail;