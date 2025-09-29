import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useItemStore } from "../../stores/marketStore";
const MarketComments = () => {
    const [content, setContent] = useState(''); //처음에 comment로 했을 때 오류가 나서 얘가 문제 일줄 알고 이름 content로 바꿈 -> 근데 얘 이름은 문제가 아니었다
    const authUser = useAuthStore((s: any) => s.authUser);
    const item = useItemStore((s: any) => s.item);
    const inputComment = (e: any) => {
        setContent(e.target.value);
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
        try {

            // await addComment({
            //     content,
            //     userId: authUser.id,
            //     userName: authUser.nickname
            // });
            setContent('');
        } catch (error) {
            console.log('댓글 작성중 오류발생')
        }
    }
    /* 
    
    <div className="flex w-full items-center space-x-2">
            <form onSubmit={handleComment} className="flex gap-2 w-full h-32" >
                <textarea
                    name="content"
                    value={content}
                    onChange={inputComment}
                    placeholder="댓글을 입력해주세요"
                    required
                    className="h-full w-full comment-textarea"
                    maxLength={200}
                />
                <Button type="submit" className="h-full">등록</Button>
            </form>
        </div>
    */
    return (
        <div className="comment-container">
            <form onSubmit={handleComment} className="comment-form">
                <textarea
                    name="content"
                    value={content}
                    onChange={inputComment}
                    placeholder="댓글을 입력해주세요"
                    required
                    className="comment-txt"
                    maxLength={200}
                />
                <button className="comment-submit-btn">등록</button>
            </form>
        </div>);
}

export default MarketComments;