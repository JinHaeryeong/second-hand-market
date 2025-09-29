// marketApi.ts
import axiosAuthInstance from './axiosAuthInstance';
import axiosInstance from './axiosInstance';
export const apiSellItemWrite = async (item: any) => {
    const response = await axiosAuthInstance.post("/market/write", item); // /api/auth/admin
    return response.data;
}
// export const apiFetchUsers = async (page = 1, size = 5, keyword = "") => {
//     console.log('page=====', page);
//     const response = await axiosAuthInstance.get(`/admin/users`, { params: { page, size, keyword } });
//     return response.data;
// };

export const apiFetchItemList = async (page = 1, size = 15, keyword = "") => {
    console.log('page=====', page);
    //alert(page);
    const response = await axiosInstance.get(`/market/list`, { params: { page, size, keyword } });
    // `/posts?page=${page}&size=${size}&query=${query}`
    return response.data;
};

export const apiDeleteItem = async (id: number) => {
    const response = await axiosAuthInstance.delete(`/market/${id}`,);
    return response.data;
};
//---notice 단건 가져오기 (spring과 연동시) -----------------------------
export const apiFetchItemByIdWithSpring = async (id: number) => {
    const response = await axiosInstance.get(`/market/${id}`);
    return response.data;
};
//---notice글 수정하기 -----------------------------------
export const apiUpdateItem = async (id: number, item: any) => {
    console.log(item);
    await axiosAuthInstance.put(`/market/${id}`, item);
    return
};