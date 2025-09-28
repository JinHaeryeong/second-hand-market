import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
import { apiNoticeWrite } from "../../api/noticeApi";
import axios from "axios";
import { usePostStore } from "../../stores/postStore";

declare const CKEDITOR: any;
const NoticeEdit = () => {
    const { id } = useParams();
    const post = usePostStore((s) => s.post);
    const fetchPostById = usePostStore((s) => s.fetchPostById);
    const updatePost = usePostStore((s) => s.updatePost);
    const navigate = useNavigate();
    const authUser = useAuthStore((s: any) => s.authUser);
    const [notice, setNotice] = useState({ title: "", content: "" });
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const ckeditorInstance = useRef<any>(null);
    const postId = id ? Number(id) : null;

    useEffect(() => {
        const fetchAndSet = async () => {
            if (postId) {
                await fetchPostById(postId);
            }
        };
        fetchAndSet(); //함수 호출
    }, [id, postId, fetchPostById]);

    useEffect(() => {
        if (post) {
            setNotice(prev => ({ ...prev, title: post.title, content: post.content }));
        }
    }, [post]);

    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            // 같은 관리자여도 아이디가 다르면 삭제못하게 해야하나? 굳이? 음
            alert("접근 권한이 없습니다.")
            navigate("/notices");
        }
    }, [authUser]);

    useEffect(() => {
        const postLoaded = post && post.content; // post 데이터가 완전히 로드되었는지 확인

        if (typeof CKEDITOR !== 'undefined' && editorRef.current && postLoaded) {
            const instanceName = editorRef.current.name;

            // 이미 인스턴스가 있으면 파괴
            if (CKEDITOR.instances[instanceName]) {
                CKEDITOR.instances[instanceName].destroy(true);
            }

            const editorInstance = CKEDITOR.replace(editorRef.current, {
                filebrowserUploadUrl: '/api/file/uploads',
            });

            ckeditorInstance.current = editorInstance;

            editorInstance.on('change', () => {
                const data = editorInstance.getData();

                // React State 업데이트
                setNotice(prevNotice => ({
                    ...prevNotice,
                    content: data
                }));
            });

            return () => {
                if (editorInstance) {
                    editorInstance.removeAllListeners();
                    editorInstance.destroy(true);
                }
            };
        }
    }, [post]);

    const handleChange = (e: any) => {
        setNotice({ ...notice, [e.target.name]: e.target.value });
    }

    const check = (finalContent: string) => {
        const { title } = notice;

        console.log("타이틀 : " + title + ", 본문: " + finalContent);

        if (!title.trim()) {
            alert("제목을 작성해주세요!");
            titleRef.current?.focus();
            return false;
        }
        if (!finalContent.trim()) {
            alert("본문을 작성해주세요!");
            editorRef.current?.focus();
            return false;
        }
        return true;
    }

    const resetForm = async () => {
        setNotice({ title: "", content: "" });
    }

    const requestSubmit = async (e: any) => {
        e.preventDefault();
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("작성 권한이 없습니다.");
            navigate(`/notice/${id}`);
            return;
        }
        const finalContent = ckeditorInstance.current ? ckeditorInstance.current.getData() : notice.content;
        const b = check(finalContent);
        if (!b) {
            return;
        }
        const noticeData = {
            title: notice.title,
            content: finalContent
        };
        try {
            if (postId) {
                const response = await updatePost(postId, noticeData);

                if (response) {
                    alert("공지사항 수정에 성공했습니다.")
                    navigate(`/notice/${id}`);
                } else {
                    alert("공지사항 수정에 실패했습니다.");
                }
                resetForm();
                navigate(`/notice/${id}`);
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                const errorCode = error.response.data.errorCode;
                alert(error.response.data.message);
            } else {
                alert("예상치 못한 에러가 발생했습니다");
                console.log(axios.isAxiosError(error) && error.response?.data?.message);

            }

        }

    }

    const handleCancel = () => {
        navigate(`/notice/${id}`);
    }


    if (!post || !post.title || !post.content) {
        return <div className="loading">게시글을 불러오는 중입니다...</div>;
    }

    if (!authUser || authUser.role !== "ROLE_ADMIN") {
        navigate(`/notice/${id}`);
        return null;
    }


    return (
        <div className="notice-write-container" key={postId}>
            <h1>공지사항 수정</h1>
            <form onSubmit={requestSubmit}>
                <div className="notice-write-title-label">
                    <label htmlFor="title">제목</label>
                </div>
                <div className="notice-write-title-input">
                    <input ref={titleRef} type="text" name="title" id="title" value={notice.title} placeholder="제목을 입력하세요" className="title" onChange={handleChange} />
                </div>
                <textarea ref={editorRef} name="content" id="content" value={notice.content} className="notice-write-text-area" onChange={handleChange}></textarea>
                <div className="notice-write-btn-div">
                    <button className="notice-write-btn">작성 완료</button>
                    <button type="button" className="notice-write-cancel-btn" onClick={handleCancel}>작성 취소</button>
                </div>
            </form>
        </div>

    );
}

export default NoticeEdit;