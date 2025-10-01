import axiosAuthInstance from "./axiosAuthInstance";

export const apiChatRequest = async (id: number, recipientId: string) => {
    console.log(id, recipientId);

    const response = await axiosAuthInstance.post(`/chat/room/${id}`, {
        recipientId: recipientId // 명확하게 필드 이름을 지정
    });
    return response.data;
};

export const apiLoadChatRooms = async () => {
    const response = await axiosAuthInstance.get(`/chat/rooms`);
    console.log(response);

    return response.data;
}