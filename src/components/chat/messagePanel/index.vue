<template>
    <div id="box" class="message-box">
        <div v-for="(item, index) in messageList" :key="index" :class="['message-box-item', messageClass(item)]"
            :ref="`message__${item.id || -1}`">
            <span class="message-box-item-info" v-if="!tipsMessageType.includes(item.message_type)">

                <div class="info-box">
                    <span :class="['name']">
                        {{ item.user_info && item.user_info.nickname }}
                    </span>
                    <!-- 文字消息 -->
                    <span v-if="item.message_type === 'text' && !isUrl(item.message_content)"
                        :class="['message', textClass(item)]" v-html="item.message_content">
                    </span>
                    <!-- 时间 -->
                    <span class="time">{{ formatChatTime(item.createTime) }}</span>
                </div>

                <img v-if="item.user_info" class="avatar" :src="item.user_info.avatar" />
            </span>
        </div>
        <!-- 该盒子用来确保进入房间后显示最新的消息定位到底部 -->
        <div id="panelEnd" ref="end"></div>
    </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { formatChatTime, throttle } from '@/utils/tools'
export default {
    props: {
        //判断还有历史记录没，还能往上加载吗
        stopLoadMore: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            firstNodeId: 0,
            isVisible: true, //可视区域
            unReadNum: 0,
            tipsMessageType: ["notice", "info"],
        }
    },
    computed: {
        ...mapGetters(['mine_id', 'room_admin_id']),
        ...mapState(['messageList', 'un_read_msg_num']),
        //消息归属
        messageClass() {
            return (item) => {
                const { user_id, message_type } = item;
                if (!["info", "notice"].includes(message_type)) {
                    return user_id === this.mine_id ? "mine" : "other";
                }
                return message_type;
            };
        },

        textClass() {
            return (item) => {
                if (!item.user_info) return;
                const { role, id } = item.user_info;
                if (role === "root") return "root-text";
                if (this.room_admin_id === id) return "homeowner";
            };
        },
        isUrl() {
            return (text) => {
                const reg =
                    /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                return reg.test(text);
            };
        },
    },
    mounted() {
        const panel = document.querySelector(`#box`);
        panel.addEventListener('scroll', this.scrollToTop)
        this.$once("hook:beforeDestroy", () =>
            panel.removeEventListener("scroll", this.scrollToTop)
        )
    },
    watch: {
        messageList(n, o) {
            if (!n.length) return
            //是否新增了一条消息
            const isOneMsg = n.length - o.length === 1;
            //记录旧的数据第一个id可以拿到所有消息的最顶部那条消息id 然后拿到节点
            const lastNodeId = o.length > 10 ? o[0].id : 0
            //不在可视列表区域时
            if (!this.isVisible && !isOneMsg) {
                /* 加载完成后将历史消息的第一条置于可视区域即可 */
                this.$nextTick(() => {
                    this.$refs[`message__${lastNodeId}`][0].scrollIntoView();
                });
            }
            //有新消息的时候才添加动画属性
            const params = isOneMsg ? { behavior: "smooth" } : {};
            this.$nextTick(() => this.isVisible && this.toEnd(params))
            //不在可是区域并且增加了一条消息 提示未读消息+1
            !this.isVisible &&
                isOneMsg &&
                this.setUnReadMsgNum(this.un_read_msg_num + 1);
        },
        stopLoadMore(n) {
            n &&
                document.querySelector('#box')
                    .removeEventListener("scroll", this.scrollToTop)
        }
    },
    methods: {
        formatChatTime,
        ...mapMutations([
            "setMessageDataList",
            "setUnReadMsgNum"
        ]),

        //监听窗口确定是否跳转到底部
        //1. 初始化的时候默认在消息底部
        //2. 在视窗高度450内的时候有消息自动滑到底部
        //3. 在视窗450以上说明去看历史消息了 这个时候不到底部 提示有新消息
        //4. 在显示有新消息的时候 再次到底部新消息提示消失
        scrollToTop: throttle(function () {
            const el = document.querySelector(`#box`);
            const { scrollTop } = el;
            const { scrollHeight } = el
            //  可视区域范围offsetHeight 属性表示元素的高度；
            //scrollTop 属性表示滚动条的位置；
            //scrollHeight 属性表示滚动区域的高度。
            this.isVisible = el.offsetHeight + scrollTop - scrollHeight > -450;
            //滑到可视区域那么未读消息自动变为0
            this.isVisible && this.setUnReadMsgNum(0);
            //滚动到顶部后调用加载历史消息
            if (scrollTop < 30 && this.messageList.length > 0) {
                this.loadHistoryMessage();
            }
        }, 200),
        loadHistoryMessage() {
            this.$emit("loadHistoryMessage")
        },

        toEnd(params) {
            this.$nextTick(() =>
                document.getElementById("panelEnd").scrollIntoView(params)
            );
        }
    },
}
</script>

<style lang="less" scoped>
.message-box {
    padding: 20px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    position: relative;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: block;
        width: 5px;
        height: 5px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 1em;
        background-color: rgba(50, 50, 50, 0.3);
    }

    &::-webkit-scrollbar-track {
        border-radius: 1em;
        background-color: rgba(50, 50, 50, 0.1);
    }

    &-item {
        display: flex;
        margin: 7px 0;

        &-info {
            display: flex;

            .info-box {
                display: flex;
                flex-direction: column;

                .message {
                    font-size: 13px;
                    padding: 4px 16px;
                    border-radius: 6px;
                    margin-top: 10px;
                    cursor: pointer;
                    text-align: justify;
                    line-height: 2;
                    max-width: 300px;
                    word-break: break-all;
                }

                .time {
                    font-size: 12px;
                    color: #9f9898;
                    margin-top: 5px;
                }

                .name {
                    font-size: 14px;
                    color: @message-main-text-color;
                }
            }

            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 6px;
            }
        }
    }
}

.mine {
    color: #000;
    justify-content: flex-end;

    .message-box-item-info {
        flex-direction: row;

        .info-box {
            align-items: flex-end;
            margin-right: 20px;

            .message {
                background-color: #a9e87a;
                color: #000;
                position: relative;
                font-size: 14px;

                &::before {
                    content: "";
                    position: absolute;
                    top: -5px;
                    left: auto;
                    right: -13px;
                    width: 15px;
                    height: 15px;
                    border: 0 solid transparent;
                    border-bottom-width: 12px;
                    border-bottom-color: currentColor;
                    border-radius: 0 0 15px 0;
                    color: #a9e87a;
                }
            }
        }
    }
}

.other {
    justify-content: flex-start;

    .message-box-item-info {
        flex-direction: row-reverse;

        .info-box {
            align-items: flex-start;
            margin-left: 20px;

            .message {
                background-color: #eee;
                color: #000;
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    top: -5px;
                    left: -13px;
                    right: auto;
                    width: 15px;
                    height: 15px;
                    border: 0 solid transparent;
                    border-bottom-width: 12px;
                    border-bottom-color: currentColor;
                    border-radius: 0 0 0 15px;
                    color: #eee;
                }
            }
        }
    }
}

.admin-text {
    background: #000 !important;
    color: #fff !important;

    &::before {
        color: #000 !important;
    }

    &::after {
        color: #000 !important;
    }
}

/* homeowner */
.homeowner {
    background: #f0bc77 !important;
    color: #fff !important;

    &::before {
        color: #f0bc77 !important;
    }

    &::after {
        color: #f0bc77 !important;
    }
}
</style>