import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
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
        if (postId) {
            fetchPostById(postId);
        }
    }, [postId, fetchPostById]);

    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.")
            navigate("/notices");
        }
    }, [authUser, navigate]);

    useEffect(() => {
        if (typeof CKEDITOR !== 'undefined' && editorRef.current && postId) {
            const instanceName = editorRef.current.name;

            // Strict Mode 대비: 이미 인스턴스가 있으면 파괴
            if (CKEDITOR.instances[instanceName]) {
                CKEDITOR.instances[instanceName].destroy(true);
            }

            const editorInstance = CKEDITOR.replace(editorRef.current, {
                filebrowserUploadUrl: '/api/file/uploads',
            });

            ckeditorInstance.current = editorInstance;

            // 이벤트 핸들러 바인딩
            editorInstance.on('change', () => {
                const data = editorInstance.getData();
                setNotice(prevNotice => ({ ...prevNotice, content: data }));
            });

            return () => {
                if (editorInstance) {
                    editorInstance.removeAllListeners();
                    editorInstance.destroy(true);
                }
            };
        }
    }, [postId]); // postId가 변경될 때 (마운트 시) CKEditor 생성

    useEffect(() => {
        if (post) {
            setNotice(prev => ({ ...prev, title: post.title, content: post.content }));

            if (ckeditorInstance.current) {
                ckeditorInstance.current.setData(post.content);
            }
        }
    }, [post]);

    const handleChange = (e: any) => {
        setNotice({ ...notice, [e.target.name]: e.target.value });
    }

    const check = (finalContent: string) => {
        const { title } = notice;
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



    const requestSubmit = async (e: any) => {
        e.preventDefault();
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("작성 권한이 없습니다.");
            navigate(`/notice/${id}`);
            return;
        }

        const finalContent = ckeditorInstance.current ? ckeditorInstance.current.getData() : notice.content;

        if (!check(finalContent)) {
            return;
        }

        const noticeData = { title: notice.title, content: finalContent };

        try {
            if (postId) {
                const response = await updatePost(postId, noticeData);

                if (response) {
                    alert("공지사항 수정에 성공했습니다.");
                    navigate(`/notice/${id}`);
                } else {
                    alert("공지사항 수정에 실패했습니다.");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                alert("목록 가져오기 실패: " + error.message);
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
                <textarea ref={editorRef} name="content" id="content" className="notice-write-text-area"></textarea>
                <div className="notice-write-btn-div">
                    <button className="notice-write-btn">수정 완료</button>
                    <button type="button" className="notice-write-cancel-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default NoticeEdit;