import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { apiNoticeWrite } from "../../api/noticeApi";
import axios from "axios";

declare const CKEDITOR: any;
const NoticeWrite = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const [notice, setNotice] = useState({ title: "", content: "" });
    const navigate = useNavigate();
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const ckeditorInstance = useRef<any>(null);


    useEffect(() => {
        if (!authUser || authUser.role !== "ROLE_ADMIN") {
            alert("접근 권한이 없습니다.")
            navigate("/notices");
        }
    }, [authUser]);
    if (!authUser || authUser.role !== "ROLE_ADMIN") {
        alert("접근 권한이 없습니다.");
        navigate("/notices");
        return null;
    }
    useEffect(() => {
        if (typeof CKEDITOR !== 'undefined' && editorRef.current) {
            const instanceName = editorRef.current.name;

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
    }, []);
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
            return;
        }


        const finalContent = ckeditorInstance.current ? ckeditorInstance.current.getData() : notice.content;
        const b = check(finalContent);
        if (!b) {
            return;
        }
        const noticeData = {
            userId: authUser.id,
            title: notice.title,
            content: finalContent
        };
        try {
            const response = await apiNoticeWrite(noticeData);

            const { result, message } = response;
            if (result === "success") {
                alert("공지사항 작성에 성공했습니다")
                navigate("/notices");
            } else {
                alert(message);
            }
            resetForm();
            navigate("/notices")
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
        navigate("/notices");
    }


    return (
        <div className="notice-write-container">
            <h1>공지사항 작성</h1>
            <form onSubmit={requestSubmit}>
                <div className="notice-write-title-label">
                    <label htmlFor="title">제목</label>
                </div>
                <div className="notice-write-title-input">
                    <input ref={titleRef} type="text" name="title" id="title" placeholder="제목을 입력하세요" className="title" onChange={handleChange} />
                </div>
                <textarea ref={editorRef} name="content" id="content" className="notice-write-text-area" onChange={handleChange}></textarea>
                <div className="notice-write-btn-div">
                    <button className="notice-write-btn">작성 완료</button>
                    <button type="button" className="notice-write-cancel-btn" onClick={handleCancel}>작성 취소</button>
                </div>
            </form>
        </div>

    );
}

export default NoticeWrite;