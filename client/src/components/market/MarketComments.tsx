import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useItemStore } from "../../stores/marketStore";
import { apiCommentWirte } from "../../api/marketApi";
const MarketComments = ({ onCommentSuccess }: { onCommentSuccess: () => void }) => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const item = useItemStore((s: any) => s.item);
    const [comment, setComment] = useState({ price: item.price, txt: "" })
    const handleChange = (e: any) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
    }
    const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!authUser) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!authUser.id) {
            alert('유저가 존재하지않습니다');
            return;
        }
        if (!item) {
            alert('게시글이 없습니다.');
        }
        const commentData = {
            price: comment.price,
            txt: comment.txt,
            itemId: item.id,
            nickname: authUser.nickname
        };
        try {

            const response = await apiCommentWirte(commentData);
            const { result, message } = response;
            if (result === "success") {
                alert("댓글 작성에 성공했습니다")
                setComment({ price: item.price, txt: "" });
                onCommentSuccess();
                return;
            } else {
                alert(message);
            }
            setComment({ price: item.price, txt: "" });
        } catch (error) {
            console.log('댓글 작성중 오류발생')
        }
    }



    return (
        <div className="comment-container">

            <form onSubmit={handleComment} className="comment-form">
                <input type="number" className="comment-price" id="price" name="price" min={0} value={comment.price} onChange={handleChange} />
                <textarea id="txt" name="txt" className="comment-txt" value={comment.txt} onChange={handleChange} />
                <button className="comment-submit-btn">등록</button>
            </form>
        </div>);
}

export default MarketComments;