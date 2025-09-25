// userApi.js
import axiosAuthInstance from './axiosAuthInstance';
import axiosInstance from './axiosInstance';
export const apiSignUp = async (signUser: any) => {
    const response = await axiosInstance.post("/auth/signup", signUser);
    return response.data;
}

export const apiSignIn = async (signUser: any) => {
    const response = await axiosInstance.post(`/auth/signin`, signUser); // `/api/auth/login`
    return response.data;
};
export const apiSignOut = async ({ id }: { id: string }) => {
    const response = await axiosAuthInstance.post(`/auth/signout`, { id });
    return response.data;
};

export const apiAdminSignIn = async (signUser: any) => {
    const response = await axiosInstance.post("/admin/signin", signUser); // /api/auth/admin
    return response.data;
}