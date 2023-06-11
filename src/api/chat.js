import request from "@/utils/request";

export const history = data => request('post', '/chat/history', data)

export const createRoom = data => request('post', '/chat/createRoom', data)

export const showRoomInfo = data => request('get', '/chat/roomInfo', data)