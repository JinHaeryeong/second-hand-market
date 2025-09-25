import axiosAuthInstance from "./axiosAuthInstance";

export const apiNoticeWrite = async (notice: any) => {
    const response = await axiosAuthInstance.post("/notice/write", notice);
    return response.data;
}