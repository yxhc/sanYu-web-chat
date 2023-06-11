<template>
    <div class="chat">
        <transition name="message-panel" mode="out-in">
            <div v-if="showChatPanel" class="chat-container">
                <div class="chat-container-header">
                    <chat-header ref="header" />
                </div>
                <div class="chat-container-content">
                    <message-panel :stop-load-more="stopLoadMore" @loadHistoryMessage="handlerLoadHistoryMessage" />
                    <transition name="msg-tips" mode="out-in">
                        <div v-if="un_read_msg_num" class="un-read">有{{ un_read_msg_num }}条新消息</div>
                    </transition>
                </div>
                <div class="chat-container-progress">
                    <chat-progress />
                </div>
                <div class="chat-container-footer">
                    <chat-message-frame ref="messageFrame" />
                    <chat-lrc />
                </div>
            </div>
        </transition>
        <music-player ref="minePlayer" />
    </div>
</template>
<script>
import Vue from 'vue'
import chatHeader from '@/components/chat/chatHeader'
import chatMessageFrame from '@/components/chat/chatMessageFrame'
import chatLrc from '@/components/chat/chatLrc'
import messagePanel from '@/components/chat/messagePanel'
import musicPlayer from '@/components/chat/musicPlayer'
import chatProgress from '@/components/chat/chatProgress'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
import { history } from "@/api/chat";
export default {
    data() {
        return {
            messageParams: {
                page: 1,
                pagesize: 20
            },
            stopLoadMore: false, // 是否加载完了历史消息
            showChatPanel: false,
            count: 1,
        }
    },
    components: {
        chatHeader,
        chatMessageFrame,
        chatLrc,
        messagePanel,
        musicPlayer,
        chatProgress
    },
    //监听自定义事件
    sockets: {
        //连接成功后初始化房间信息
        connect() {
            this.initLocalStorageConfig()
            this.getRoomInfo()
        },
        //无效用户
        authFail(data) {
            data && this.$message.error(data.msg);
            this.logout();
        },

        async initRoom(data) {
            await this.getHistoryMessage()
            const { room_admin_info, msg, on_line_user_list, room_list } = data
            this.setRoomAdminInfo(room_admin_info);
            this.setOnlineUserList(on_line_user_list);
            this.updateMusicInfo(data)
            this.setRoomList(room_list)
            this.showTipsJoinRoom &&
                this.setMessageDataList({ message_type: "info", message_content: msg });
        },

        //新用户上线，更新在线用户列表
        async online(data) {
            const { msg, on_line_user_list } = data;
            this.setOnlineUserList(on_line_user_list);
            this.showTipsJoinRoom &&
                this.setMessageDataList({ message_type: "info", message_content: msg });
        },
        async updateRoomList(data) {
            const { room_list, msg } = data;
            this.setRoomList(room_list);
            msg &&
                this.setMessageDataList({ message_type: "info", message_content: msg })
        },
        //用户离开进行对应操作
        async offline(data) {
            const { on_line_user_list, msg } = data;
            this.showTipsQuitRoom &&
                this.setMessageDataList({ message_type: "info", message_content: msg });
            this.setOnlineUserList(on_line_user_list);
        },
        updateOnLineUserList({ on_line_user_list }) {
            this.setOnlineUserList(on_line_user_list);
        },
        //新消息
        message(data) {
            this.newMsg = data.data
            this.setMessageDataList(data.data);
        },
        switchMusic(data) {
            const { msg, musicInfo } = data;
            this.updateMusicInfo(musicInfo);
            this.showTipsPlayMusic &&
                this.setMessageDataList({ message_type: "info", message_content: msg });
        },
        tips(data) {
            const { code, msg } = data;
            code === 1 && this.$message.success(msg);
            code === -1 && this.$message.error(msg);

            code === -2 && this.$message.error(msg);
            code === -2 && this.logout(false);

            code === -3 && this.$message.error(msg);
            code === -3 && this.setRoomId(888)

        }
    },
    computed: {
        ...mapState([
            "room_id",
            "un_read_msg_num",
            "showTipsJoinRoom",
            "showTipsQuitRoom",
            "theme",
            "showTipsNotice",
            "showTipsPlayMusic",
        ]),
        ...mapGetters([
            "room_info",
            "mine_room_bg"
        ])
    },
    watch: {
        room_id(n, o) {
            if (Number(n) === Number(o) || !n) return;
            this.$socket.client.disconnect();
            this.resetRoom();
            this.initSocket();
        },
    },
    created() {
        this.initLocalStorageConfig()
        localStorage.room_id &&
            this.setRoomId(localStorage.room_id);
        this.$confirm('请注意、加入聊天室将自动播放音乐!', '欢迎加入聊天室', {
            confirmButtonText: '加入房间',
            cancelButtonText: '取消',
        }).then(() => this.passJoin()).catch(() => this.logout())
    },
    mounted() {
        this.initUserAddress();
        document.addEventListener("keyup", this.keyboardEvent);
    },
    beforeDestroy() {
        this.$socket.connected && this.$socket.client.disconnect();
        document.removeEventListener("keyup", this.keyboardEvent, true);
    },
    methods: {
        ...mapActions([
            "getUserInfo",
            "logout",
            "getRoomInfo"
        ]),
        ...mapMutations([
            "setOnlineUserList",
            "setRoomList",
            "setRoomAdminInfo",
            "setMessageDataList",
            "emptyMessageDataList",
            "setRoomId",
            "setRoomInfo",
            "setUnReadMsgNum",
            "updateMessageList",
            "updateMusicInfo",
            "setCurrentMusicInfo",
            "setCurrentMusicStartTime",
            "setQueueMusicList",
        ]),
        resetRoom() {
            this.emptyMessageDataList();
            this.messageParams.page = 1;
        },
        //调用一个开发api拿到用户位置
        initUserAddress() {
            if (!document.querySelector("#address")) {
                const script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "address";
                script.src = "https://pv.sohu.com/cityjson?ie=utf-8";
                document.head.appendChild(script);
            }
        },
        updateMusicInfo(musicInfo) {
            const {
                music_info,
                music_lrc,
                music_src,
                music_start_time,
                music_queue_list,
            } = musicInfo;
            this.setQueueMusicList(music_queue_list);
            this.setCurrentMusicInfo({ music_info, music_lrc, music_src });
            music_start_time && this.setCurrentMusicStartTime(music_start_time);
        },

        //初始化ws需要的参数token room_id 地址 前去验证,然后挂载在全局
        async initSocket() {
            const token = localStorage.token
            if (!window.returnCitySN && this.count <= 3) {
                this.count++
                setTimeout(() => this.initSocket(), 50)
            } else {
                const cname = window.returnCitySN ? window.returnCitySN.cname : this.getRandomAddress();
                //然后服务端就可以在request的query中拿到token进行验证了
                this.$socket.client.io.opts.query = {
                    token,
                    address: cname,
                    room_id: this.room_id
                };
                localStorage.room_id = this.room_id;
                this.$socket.client.open()
                //将socket挂载在全局
                Vue.prototype.$socket = this.$socket;
            }
        },
        getRandomAddress() {
            const i = Math.round(Math.random() * 5);
            const randomAddr = ['金星', '木星', '水星', '火星', '土星', '月球']
            return randomAddr[i]
        },

        passJoin() {
            this.showPopup = false;
            this.showChatPanel = true;
            this.initSocket()
        },

        async getHistoryMessage() {
            const res = await history({
                room_id: this.room_id,
                ...this.messageParams
            });
            this.stopLoadMore = res.data.length < this.messageParams.pagesize;
            this.stopLoadMore &&
                this.messageParams.page > 1 &&
                this.$message.warning("已加载完全部历史消息了！");
            this.setMessageDataList(res.data);
        },

        handlerLoadHistoryMessage() {
            this.messageParams.page += 1;
            this.getHistoryMessage();
        },
        initLocalStorageConfig() {
            const storageKeys = [
                "showTipsJoinRoom",
                "showTipsQuitRoom",
                "showTipsSwitchMusic",
                "theme",
                "show_all_tips",
                "showTipsNotice",
                "showHistoryBarrageInfo",
                "showBarrageImg",
                "showBarrageAvatar"
            ];
            storageKeys.forEach(
                (key) =>
                    localStorage[key] &&
                    this.setGlobalRoomConfig({ key, value: key === "theme" ? localStorage[key] : JSON.parse(localStorage[key]) })
            );

        }
    }
}
</script>
<style lang="less" scoped>
@media screen and (max-width: 720px) {
    .chat-container {
        position: fixed;
        width: 100vw !important;
        height: 100vh !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: 0 !important;
        border-radius: 0 !important;
    }
}

.chat {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background: linear-gradient(200deg, #e3eeff, #f3e7e9);

    &-container {
        position: fixed;
        left: 8%;
        right: 8%;
        top: 5%;
        bottom: 5%;
        transition: all 0.5s;
        background: @message-panel-bg-color;
        box-shadow: @message-panel-box-shadow;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        z-index: 1;

        &-header {
            width: 100%;
            height: 50px;
            border-bottom: 1px solid @message-border-color;
        }

        &-content {
            flex: 1;
            height: 0;
            position: relative;
        }

        &-progress {
            height: 2px;
            margin-bottom: 5px;
        }

        &-footer {
            padding: 0;
        }
    }

}
</style>