import { useEffect, useRef, useState } from "react";
import "../../assets/styles/market.css"
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiSellItemWrite } from "../../api/marketApi";

declare const CKEDITOR: any;
const MarketItemWrite = () => {
    const authUser = useAuthStore((s: any) => s.authUser);
    const [sellItem, setSellItem] = useState({ title: "", content: "", category: "", price: "" });
    const navigate = useNavigate();
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const ckeditorInstance = useRef<any>(null);


    useEffect(() => {
        if (!authUser) {
            alert("로그인 후 이용해주세요")
            navigate("/market");
        }
    }, [authUser]);
    if (!authUser) {
        alert("로그인 후 이용해주세요");
        navigate("/market");
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
                setSellItem(prevSellItem => ({
                    ...prevSellItem,
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
        const { name, value } = e.target;
        setSellItem((prev) => ({ ...prev, [name]: value }));
    }
    // console.log(sellItem);

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

    const resetForm = async () => {
        setSellItem({ title: "", content: "", category: "", price: "" });
    }

    const requestSubmit = async (e: any) => {
        e.preventDefault();
        if (!authUser) {
            alert("로그인 후 이용해주세요");
            navigate("/market");
            return null;
        }


        const finalContent = ckeditorInstance.current ? ckeditorInstance.current.getData() : sellItem.content;
        const b = check(finalContent);
        if (!b) {
            return;
        }
        const sellItemData = {
            userId: authUser.id,
            title: sellItem.title,
            content: finalContent,
            category: sellItem.category,
            price: sellItem.price
        };
        try {
            const response = await apiSellItemWrite(sellItemData);

            const { result, message } = response;
            if (result === "success") {
                alert("판매글 작성에 성공했습니다")
                navigate("/market");
            } else {
                alert(message);
            }
            resetForm();
            navigate("/market")
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
        navigate("/market");
    }


    return (
        <div className="market-container">
            <h1>판매</h1>
            <form onSubmit={requestSubmit}>
                <div className="item-write-label">
                    <label htmlFor="title">제목</label>
                </div>
                <div className="item-write-input">
                    <input ref={titleRef} type="text" name="title" id="title" placeholder="제목을 입력하세요" className="title" onChange={handleChange} />
                </div>
                <div className="item-write-label">
                    <label htmlFor="category">품목</label>
                </div>
                <div className="item-write-input">
                    <select ref={categoryRef} name="category" id="category" onChange={handleChange}>
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

export default MarketItemWrite;