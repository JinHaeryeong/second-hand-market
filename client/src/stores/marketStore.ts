// postStore.js
// 서버 통신 로직 중심 스토어
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiDeleteItem, apiFetchItemByIdWithSpring, apiFetchItemList, apiUpdateItem } from "../api/marketApi";
import axios from "axios";
export interface ItemDataResponse {
    id: number;
    userId: string;
    title: string;
    content: string;
    createdAt: Date;
    price: number;
    categoryName: string; // ⬅️ 서버 DTO와 일치하도록 수정
    thumbnailUrl: string; // ⬅️ 썸네일 필드도 추가해야 합니다.
    views: number;
}

interface SpringPage<T> {
    content: T[]; // 실제 데이터 목록
    totalPages: number;
    totalElements: number; // 총 게시글 수
    number: number; // 현재 페이지 번호 (0-based)
    size: number;
    first: boolean;
    last: boolean;
}



// 최종적으로 목록 API가 반환하는 타입
interface ItemState {
    itemList: ItemDataResponse[]; // 실제 게시글 목록
    totalCount: number; // 총 게시글 수
    totalPages: number; // 총 페이지 수
    page: number; // 현재 페이지 번호 (1-based)
    size: number; // 한 페이지 당 목록 개수
    keyword: string; // 검색어
    item: any | null; // 특정 게시글
    itemErr: string | null; // 에러 메시지
}

// 액션 타입 정의 (PostActions)
interface ItemActions {
    setPage: (page: number) => void;
    setQuery: (q: string) => void;
    setSize: (size: number) => void;
    resetItemErr: () => void;
    // findType을 fetchPostList의 인자로 추가합니다.
    fetchItemList: (findType: number) => Promise<void>;
    deleteItem: (id: number) => Promise<boolean>; // id 타입을 string으로 가정
    fetchItemById: (id: number) => Promise<void>;
    updateItem: (id: number, notice: any) => Promise<boolean>;
}

// ⭐️ PostStore 타입을 PostState와 PostActions를 합친 것으로 정의
type ItemStore = ItemState & ItemActions;
export const useItemStore = create<ItemStore>()(
    devtools((set, get) => ({
        itemList: [], //글목록
        totalCount: 0, //총 게시글 수
        totalPages: 0, //총 페이지 수
        page: 1, //현재 페이지 번호
        size: 15, //한 페이지 당 목록 개수
        keyword: "", //검색어
        item: null, //특정 게시글
        itemErr: null, //특정 게시글을 가져오지 못할 경우

        setPage: (page: number) => set({ page: page }),
        setQuery: (q: string) => set({ keyword: q }),
        setSize: (size: number) => set({ size: size }),
        //글목록 가져오기
        resetItemErr: () => set({ itemErr: null }), //에러 메시지 초기화
        fetchItemList: async () => {
            //api호출=> 데이터 받아오면 ==> set()
            const { page, size, keyword } = get();

            try {
                const data = await apiFetchItemList(page, size, keyword);
                console.log(data);

                if (data.result === 'success' && data.data) {
                    const pageData = data.data;
                    set({
                        // ⭐️ postList는 Page 객체 안에 있는 'content' 배열이어야 합니다.
                        itemList: pageData.content || [],
                        totalCount: pageData.totalElements,
                        totalPages: pageData.totalPages,
                    });
                }

            } catch (error) {

                if (axios.isAxiosError(error) && error.response?.data) {
                    alert("목록 가져오기 실패: " + error.message);
                }
            }
        },
        //글 삭제 하기
        deleteItem: async (id: number) => {
            try {
                await apiDeleteItem(id);
                set({ item: null });
                return true;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data) {
                    alert("글 삭제 실패: " + error.message);
                }
                return false;
            }
        },
        //글번호로 글 가져오기
        fetchItemById: async (id: number) => {
            // apiFetchPostById(id)==> set( {post: response.data} )
            try {
                //const postData = await apiFetchPostById(id);//node.js와 연동시
                const postData = await apiFetchItemByIdWithSpring(id); //spring 연동시
                const { result } = postData;
                if (result === "success") {

                    set({ item: postData.data, itemErr: null });
                }
            } catch (error) {
                //alert('글 내용보기 실패: 해당 글은 없습니다');
                if (axios.isAxiosError(error) && error.response?.data) {
                    set({ item: null, itemErr: "글 내용 보기 실패: " + error.response.data.message });
                }
            }
        },
        //글 수정 처리
        updateItem: async (id: number, item: any) => {
            try {
                await apiUpdateItem(id, item);
                return true;
            } catch (error) {
                console.error(error);
                //alert('수정 실패: ' + error.message);
                return false;
            }
        },
    }))
);
