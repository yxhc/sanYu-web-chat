export default {
    room_admin_info: state => state.room_admin_info,
    room_admin_id: state => state.room_admin_info.id,
    room_list: state => state.room_list,
    room_id: state => state.room_id,
    mine_room_id: state => state.user_info && state.user_info.user_room_id,
    mine_id: state => state.user_info && state.user_info.user_id,
    on_line_user_list: state => state.on_line_user_list,
    onLineUserNum: state => state.on_line_user_list.length,
    onLineRoomNum: state => state.room_list.length,
    user_info: state => state.user_info,
    room_info: state => state.room_list.find(t => t.room_id === state.room_id)
};

//获取状态数据 类似于vue中的computed，进行缓存，对于Store中的数据进行加工处理形成新的数据