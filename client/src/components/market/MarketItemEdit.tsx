import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useItemStore } from "../../stores/marketStore";

declare const CKEDITOR: any;
const MarketItemEdit = () => {
    const { id } = useParams();
    const item = useItemStore((s) => s.item);
    const fetchItemById = useItemStore((s: any) => s.fetchItemById);
    const updateItem = useItemStore((s: any) => s.updateItem);
    const navigate = useNavigate();
    const authUser = useAuthStore((s: any) => s.authUser);

    const [sellItem, setSellItem] = useState({ title: "", content: "", category: "", price: "" });

    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const clearItem = useItemStore((s: any) => s.clearItem);
    const ckeditorInstance = useRef<any>(null);
    const postId = id ? Number(id) : null;

    useEffect(() => {
        if (postId) {
            fetchItemById(postId);
        }

        return () => {
            clearItem();
        };

    }, [postId, fetchItemById, clearItem]);


    useEffect(() => {
        if (item && typeof CKEDITOR !== 'undefined' && editorRef.current) {

            setSellItem(prev => ({
                ...prev,
                title: item.title,
                content: item.content,
                category: String(item.categoryId),
                price: String(item.price)
            }));

            if (!authUser || authUser.id !== item.userId) {
                alert("수정 권한이 없습니다. 작성자만 수정할 수 있습니다.");
                navigate(`/market/${id}`);
                return;
            }

            const instanceName = editorRef.current.name;

            if (CKEDITOR.instances[instanceName]) {
                CKEDITOR.instances[instanceName].destroy(true);
            }

            const editorInstance = CKEDITOR.replace(editorRef.current, {
                filebrowserUploadUrl: '/api/file/uploads',
            });

            ckeditorInstance.current = editorInstance;

            editorInstance.setData(item.content);

            editorInstance.on('change', () => {
                const data = editorInstance.getData();
                setSellItem(prevSellItem => ({ ...prevSellItem, content: data }));
            });


            return () => {
                if (ckeditorInstance.current) {
                    ckeditorInstance.current.removeAllListeners();
                    ckeditorInstance.current.destroy(true);
                    ckeditorInstance.current = null;
                }
            };
        }
    }, [item, authUser, navigate, id]); // item 데이터에 의존


    const handleChange = (e: any) => {
        setSellItem({ ...sellItem, [e.target.name]: e.target.value });
    }

    const check = (finalContent: string) => {
        const { title, category, price } = sellItem;

        if (!title.trim()) {
            alert("제목을 작성해주세요!");
            titleRef.current?.focus();
            return false;
        }
        if (!finalContent.trim()) {
            alert("본문을 작성해주세요!");
            ckeditorInstance.current?.focus(); // CKEditor 포커스로 변경
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
            category: Number(sellItem.category),
            price: Number(sellItem.price)
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
                alert("수정 실패: " + error.message);
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
            <h1>판매글 수정</h1>
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
                <textarea ref={editorRef} name="content" id="content" className="notice-write-text-area" defaultValue={item.content}></textarea>
                <div className="notice-write-btn-div">
                    <button className="notice-write-btn">수정 완료</button>
                    <button type="button" className="notice-write-cancel-btn" onClick={handleCancel}>취소</button>
                </div>
            </form>
        </div>
    );
}

export default MarketItemEdit;
