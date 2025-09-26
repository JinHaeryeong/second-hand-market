import axiosAuthInstance from "./axiosAuthInstance";
import axiosInstance from "./axiosInstance";

export const apiNoticeWrite = async (notice: any) => {
    const response = await axiosAuthInstance.post("/notices/write", notice);
    return response.data;
}

// export const apiNoticesList = async (page: number, size: number, findType: number, keyword: string) => {
//     const params = {
//         page: page,
//         size: size,
//         findType: findType,
//         keyword: keyword
//     };
//     const response = await axiosInstance.get("/notice/list", { params });
//     return response.data;
// }


export const apiFetchPostList = async (page = 1, size = 5, keyword = "") => {
    console.log('page=====', page);
    //alert(page);
    const response = await axiosInstance.get(`/notices/list`, { params: { page, size, keyword } });
    // `/posts?page=${page}&size=${size}&query=${query}`
    return response.data;
};
//---notice 글 삭제하기 ----------------------------------
export const apiDeletePost = async (id: number) => {
    const response = await axiosInstance.delete(`/notices/${id}`);
    return response.data;
};
//---notice 단건 가져오기 (spring과 연동시) -----------------------------
export const apiFetchPostByIdWithSpring = async (id: number) => {
    const response = await axiosInstance.get(`/notices/${id}`);
    return response.data;
};
//---notice글 수정하기 -----------------------------------
export const apiUpdatePost = async (id: number, formData: any) => {
    await axiosInstance.put(`/notices/${id}`, formData);
    /*
    , {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    */
};