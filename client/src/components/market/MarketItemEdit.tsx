import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { apiUpdateItem } from "../../api/marketApi";
import { useItemStore } from "../../stores/marketStore";

declare const CKEDITOR: any;
const MarketItemEdit = () => {
    const { id } = useParams();
    const item = useItemStore((s) => s.item);
    const fetchItemById = useItemStore((s: any) => s.fetchItemById);
    const updateItem = useItemStore((s: any) => s.updateItem);
    const navigate = useNavigate();
    const authUser = useAuthStore((s: any) => s.authUser); const [sellItem, setSellItem] = useState({ title: "", content: "", category: "", price: "" });
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const ckeditorInstance = useRef<any>(null);
    const postId = id ? Number(id) : null;

    useEffect(() => {
        if (postId) {
            fetchItemById(postId);
        }
        console.log(item);

    }, [postId, fetchItemById]);


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
                setSellItem(prevSellItem => ({ ...prevSellItem, content: data }));
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
        if (item) {
            setSellItem(prev => ({
                ...prev,
                title: item.title,
                content: item.content,
                category: String(item.categoryId),
                price: String(item.price)
            }));

            if (ckeditorInstance.current) {
                ckeditorInstance.current.setData(item.content);
            }

            if (!authUser || authUser.id !== item.userId) {
                alert("수정 권한이 없습니다. 작성자만 수정할 수 있습니다.");
                navigate(`/market/${id}`); // 해당 글 상세 페이지로 리다이렉트
            }
        }
    }, [item]);

    const handleChange = (e: any) => {
        setSellItem({ ...sellItem, [e.target.name]: e.target.value });
    }

    const check = (finalContent: string) => {
        const { title, category, price } = sellItem;

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
        if (!category.trim()) {
            alert("품목을 선택해주세요!");
            categoryRef.current?.focus();
            return false;
        }
        if (!price.trim()) {
            alert("가격을 작성해주세요!");
            priceRef.current?.focus();
            return false;
        }
        return true;
    }



    const requestSubmit = async (e: any) => {
        e.preventDefault();
        if (!authUser || authUser.id !== item?.userId) {
            alert("수정 권한이 없습니다.");
            navigate(`/market/${id}`);
            return;
        }

        const finalContent = ckeditorInstance.current ? ckeditorInstance.current.getData() : item.content;

        if (!check(finalContent)) {
            return;
        }

        const sellItemData = {
            title: sellItem.title,
            content: finalContent,
            category: sellItem.category,
            price: sellItem.price
        };
        try {
            if (postId) {
                const response = await updateItem(postId, sellItemData);

                if (response) {
                    alert("판매글 수정에 성공했습니다.");
                    navigate(`/market/${id}`);
                } else {
                    alert("판매글 수정에 실패했습니다.");
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                alert("목록 가져오기 실패: " + error.message);
            }
        }
    }

    const handleCancel = () => {
        navigate(`/market/${id}`);
    }


    if (!item || !item.title || !item.content || !item.categoryName || !item.categoryId || !item.price) {
        return <div className="loading">게시글을 불러오는 중입니다...</div>;
    }

    if (!authUser || authUser.id !== item.userId) {
        return null;
    }


    return (
        <div className="market-container">
            <h1>판매</h1>
            <form onSubmit={requestSubmit}>
                <div className="item-write-label">
                    <label htmlFor="title">제목</label>
                </div>
                <div className="item-write-input">
                    <input ref={titleRef} type="text" value={sellItem.title} name="title" id="title" placeholder="제목을 입력하세요" className="title" onChange={handleChange} />
                </div>
                <div className="item-write-label">
                    <label htmlFor="category">품목</label>
                </div>
                <div className="item-write-input">
                    <select ref={categoryRef} value={sellItem.category} name="category" id="category" onChange={handleChange}>
                        <option value="">-- 품목 --</option>
                        <option value="1">패션/잡화</option>
                        <option value="2">디지털/가전</option>
                        <option value="3">스포츠/레저</option>
                        <option value="4">도서/음반</option>
                        <option value="5">뷰티/미용</option>
                        <option value="6">가구/인테리어</option>
                        <option value="7">유아/출산</option>
                        <option value="8">취미/게임</option>
                        <option value="9">생활/주방</option>
                        <option value="10">차량/오토바이</option>
                    </select>
                </div>
                <div className="item-write-label">
                    <label htmlFor="price">가격</label>
                </div>
                <div className="item-write-input">
                    <input ref={priceRef} type="number" name="price" id="price" value={sellItem.price} placeholder="가격을 입력하세요" className="title" onChange={handleChange} />
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

export default MarketItemEdit;