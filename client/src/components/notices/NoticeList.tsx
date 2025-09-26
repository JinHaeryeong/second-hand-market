import { useAuthStore } from "../../stores/authStore";
import { usePostStore } from '../../stores/postStore'
import "../../assets/styles/notices.css"
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
const NoticeList = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const postList = usePostStore((s: any) => s.postList);
    const fetchPostList = usePostStore((s: any) => s.fetchPostList);
    const totalPages = usePostStore((s: any) => s.totalPages);
    const setPage = usePostStore((s: any) => s.setPage);
    const page = usePostStore((s: any) => s.page);

    // console.log(authUser.id);
    useEffect(() => {
        fetchPostList();
    }, [page]);

    const blockSize = 5;
    const startPage = Math.floor((page - 1) / blockSize) * blockSize + 1;
    const endPage = Math.min(startPage + (blockSize - 1), totalPages);

    console.log(startPage);
    console.log(endPage);


    return (
        <div className="notices-container">
            <h1>공지사항</h1>
            <ul className="notice-list">
                {postList.map((post: any) => (
                    <Link key={post.id} to={`/notice/${post.id}`}>
                        <li className="notice-item">
                            <div className="item-title">{post.title}</div>
                            <div className="item-meta">
                                <span className="item-date">
                                    {new Intl.DateTimeFormat('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }).format(new Date(post.createdAt))}
                                </span>
                                <span className="item-views">조회수 {post.views}</span>
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>

            {/* 페이지네이션 */}
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
            <div className="notice-write-btn-div">
                {authUser && authUser.role === "ROLE_ADMIN" && (<Link to="/noticeWrite"><button className="notice-write-btn">글쓰기</button></Link>)}
            </div>
        </div>
    );
}

export default NoticeList;