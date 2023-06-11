import { getInfo } from "@/api/user";
import { showRoomInfo } from "@/api/chat";
import router from "@/router";
//异步操作使用Actions
export default {
    //获取用户信息
    async getUserInfo({ commit }) {
        return new Promise(resolve => {
            getInfo().then(res => {
                const { user_info } = res.data;
                //commit用于提交 mutation 来修改和管理状态数据
                commit('setUserInfo', user_info);
                resolve(true)
            })
        })
    },

    //显示房间信息
    async getRoomInfo({ commit, state }) {
        return new Promise(resolve => {
            showRoomInfo({ room_id: state.room_id }).then(res => {
                commit('setRoomInfo', res.data);
                resolve(true);
            });
        });
    },

    async logout({ commit }) {
        return new Promise(resolve => {
            localStorage.removeItem('token');
            commit('setToken', null);
            commit('resetStore');
            router.push('/login');
            resolve()
        })
    }
}