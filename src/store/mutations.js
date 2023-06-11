import getDefaultValue from "./default";
//一般情况下同步操作使用Mutations
export default {
    setToken(state, token) {
        state.token = token;
    },
    setUserInfo(state, user_info) {
        state.user_info = user_info
    },
    //设置房间当前所在的房间room_id 
    setRoomId(state, room_id) {
        state.room_id = Number(room_id)
    },
    //设置房间信息
    setRoomInfo(state, room_info) {
        state.room_info = room_info
    },
    // 房间列表信息 
    setRoomList(state, room_list) {
        state.room_list = room_list;
    },

    //房间在线用户列表 
    setOnlineUserList(state, on_line_user_list) {
        state.on_line_user_list = on_line_user_list;
    },

    //房间房主信息
    setRoomAdminInfo(state, room_admin_info) {
        state.room_admin_info = room_admin_info;
    },
    //变更消息列表
    setMessageDataList(state, messageInfo) {
        const isArray = Array.isArray(messageInfo);
        let result = [];
        isArray &&
            (result = [...messageInfo, ...state.messageList]);
        !isArray &&
            (result = [...state.messageList, ...[messageInfo]]);
        state.messageList = state.show_all_tips ? result : result.filter(t => t.message_type !== 'info');
    },

    setUnReadMsgNum(state, un_read_msg_num) {
        state.un_read_msg_num = un_read_msg_num;
    },

    setCurrentMusicInfo(state, currentMusicInfo) {
        const { music_info, music_lrc, music_src } = currentMusicInfo;
        state.music_info = music_info;
        state.music_lrc = music_lrc;
        state.music_src = music_src;
    },
    setCurrentMusicStartTime(state, music_start_time) {
        state.music_start_time = music_start_time;
    },

    setCurrentMusicTime(state, current_music_time) {
        state.current_music_time = current_music_time;
    },

    setQueueMusicList(state, music_queue_list) {
        state.music_queue_list = music_queue_list;
    },
    resetStore(state) {
        Object.assign(state, getDefaultValue());
    },

    emptyMessageDataList(state) {
        state.messageList = [];
    },

    setGlobalRoomConfig(state, { key, value }) {
        state[key] = value;
        localStorage.setItem(key, typeof value === 'boolean' ? JSON.stringify(value) : value);
    }
}