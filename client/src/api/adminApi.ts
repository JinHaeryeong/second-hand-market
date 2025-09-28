// userApi.js
import axiosAuthInstance from './axiosAuthInstance';
import axiosInstance from './axiosInstance';
export const apiAdminSignIn = async (signUser: any) => {
    const response = await axiosInstance.post("/admin/signin", signUser); // /api/auth/admin
    return response.data;
}
export const apiFetchUsers = async (page = 1, size = 5, keyword = "") => {
    console.log('page=====', page);
    const response = await axiosAuthInstance.get(`/admin/users`, { params: { page, size, keyword } });
    return response.data;
};