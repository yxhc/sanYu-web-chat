<template>
    <div class="header flex_between">
        <div class="header-left flex_start">
            <div class="header-left-id">
                <span class="visible-xl visible-lg">ID:</span>
                {{ (room_info && room_info.room_id) || 888 }}
            </div>
            <div class="header-left-name">
                <span class="visible-xl visible-lg">{{
                    (room_info && room_info.room_name) || "sanYu聊天室" }}
                </span>
            </div>
            <div class="header-left-share flex_center" :data-clipboard-text="copyText" @click="share">
                <icon name="chat-share" scale="1.8" class="icon" />
                <span class="visible-xl visible-lg">分享</span>
            </div>
            <chatTips class="visible-xl visible-lg" />
        </div>

        <!-- right -->
        <div class="header-right flex_center">
            <div class="header-right-item flex_center" @click="toGithub">
                <icon name="github" scale="1.8" />
                <span class="visible-xl visible-lg">项目源码</span>
            </div>
            <div :class="[
                'header-right-item',
                'flex_center',
                { 'active-menu': opt1.show },
            ]" @click.stop="openBox(1)">
                <icon name="chat-online" scale="1.8" class="icon" />
                <span class="visible-xl visible-lg">在线[{{ onLineUserNum }}]</span>
            </div>
            <div :class="[
                'header-right-item',
                'flex_center',
                { 'active-menu': opt2.show },
            ]" @click.stop="openBox(2)">
                <icon name="chat-room" scale="1.8" class="icon" />
                <span class="visible-xl visible-lg">房间[{{ onLineRoomNum }}]</span>
            </div>

            <div :class="[
                'header-right-item',
                'flex_center',
                { 'active-menu': opt3.show },
            ]" @click.stop="openBox(3)">
                <icon name="chat-mine" scale="1.8" class="icon" />
                <span class="visible-xl visible-lg">我的</span>
            </div>
            <div class="header-right-item flex_center" @click="handleLogout">
                <icon name="chat-go" scale="1.8" class="icon" />
                <span class="visible-xl visible-lg">登出</span>
            </div>
        </div>

        <!-- popup -->
        <chat-popup :options="opt1" :top="60" :right="10" title="在线用户">
            <online-list />
        </chat-popup>
        <chat-popup :options="opt3" :top="60" :right="10" :height="450" title="个人中心">
            <user-info />
        </chat-popup>

        <chat-popup :options="opt2" :top="60" :right="10" title="房间信息">
            <el-button v-if="!isMineRoom" slot="header" type="text" size="mini" @click="createOrJoinRoom">
                {{ btnText }}
            </el-button>
            <room-list :create-room-visible="createRoomVisible" @create-success="handlerCreateSuccess" @close="closeBox"
                @cancel="handlerCreateSuccess"></room-list>
        </chat-popup>
    </div>
</template>
<script>
import chatTips from '@/components/chat/chatTips'
import chatPopup from '@/components/chat/chatPopup/index.vue'
import UserInfo from './components/UserInfo.vue'
import RoomList from './components/RoomList.vue'
import OnlineList from './components/OnlineList.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    data() {
        return {
            opt1: {
                show: false
            },
            opt2: {
                show: false
            },
            opt3: {
                show: false
            },
            createRoomVisible: false
        }
    },
    components: {
        chatTips,
        chatPopup,
        UserInfo,
        RoomList,
        OnlineList
    },
    computed: {
        copyText() {
            return '分享内容'
        },
        btnText() {
            return !this.mine_room_id ? '创建房间' : '我的房间'
        },
        ...mapGetters([
            'room_id',
            'room_info',
            'user_info',
            'mine_room_id',
            'onLineRoomNum',
            'onLineUserNum',
        ]),
        isMineRoom() {
            return Number(this.room_id) === Number(this.mine_room_id)
        }
    },
    methods: {
        ...mapActions(['logout', 'getUserInfo']),
        ...mapMutations([
            'setRoomId',
        ]),
        share() {

        },


        //退出登录
        handleLogout() {
            this.$confirm('是否需要退出登录?', '退出登录', {
                confirmButtonText: '退出',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => this.logout()).catch()
        },

        toGithub() {
            window.open("https://github.com")
        },
        openBox(val) {
            //动态属性名写法
            if (this[`opt${val}`].show) return (this[`opt${val}`].show = false)
            this.closeBox();
            this[`opt${val}`].show = !this[`opt${val}`].show;
        },
        closeBox() {
            const self = this;
            const res = Object.keys(self._data).filter(
                (key) => key.search("opt") !== -1
            );
            res.forEach((t) => (self[t].show = false));
        },

        createOrJoinRoom() {
            if (!this.$socket.client.connected) return console.error('连接断开');
            if (!this.mine_room_id) return (this.createRoomVisible = true);
            if (Number(this.mine_room_id) === Number(this.room_id))
                return this.$message.warning("当前已经在这个房间里了");
            this.setRoomId(this.mine_room_id);
            this.closeBox();
        },
        handlerCreateSuccess() {
            this.createRoomVisible = false;
            this.getUserInfo();
        },

    },

}
</script>
<style lang="less" scoped>
.header {
    height: 100%;
    padding: 0 15px;
    user-select: none;
    color: @message-main-text-color;

    &-left {
        &-id {
            user-select: none;
            background-color: @message-main-text-color;
            color: @message-border-color;
            display: flex;
            padding: 0 5px;
            font-size: 14px;
            border-radius: 3px;
            margin-right: 5px;
        }

        &-name {
            font-size: 18px;
            user-select: none;
            margin-right: 12px;
        }

        &-share {
            cursor: pointer;
            padding: 4px 10px;
            border-radius: 5px;
            transition: all 0.3s;

            .icon {
                margin-right: 3px;
            }

            &:hover {
                background: @message-hover-bg-color;
            }
        }
    }

    &-right {
        &-item {
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;
            color: @message-main-text-color;
            border-radius: 5px;
            margin: 0 3px;
            z-index: 3001;

            .icon {
                margin-right: 3px;
            }

            &:hover {
                background: @message-hover-bg-color;
            }

            &:active {
                filter: brightness(1.2);
            }
        }
    }

    .active-menu {
        background: @message-hover-bg-color !important;
    }
}
</style>