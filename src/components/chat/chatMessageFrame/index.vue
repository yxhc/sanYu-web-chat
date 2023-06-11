<template>
    <div class="message-frame">
        <chatToolbar />
        <div :class="['message-frame-input']">
            <img v-if="fileInfo && allowImgExt.includes(fileInfo.ext)" :class="['message-frame-input-img']"
                :src="preImgBlob" />
            <textarea class="message-frame-input-text" ref="messageInput" placeholder="点击回车发送消息" @keydown="sendMsg"
                v-model.trim="message" />
        </div>
        <div class="message-frame-empty" @click="focusInput"></div>
    </div>
</template>
<script>
import chatToolbar from '@/components/chat/chatToolbar/index.vue'
export default {
    data() {
        return {
            message: '',
            fileInfo: null,
            preImgBlob: null,
            loading: false
        }
    },
    components: {
        chatToolbar
    },
    methods: {
        async sendMsg(e) {
            if (!this.$socket.client.connected)
                return this.$message.error('请重新登录');
            if (e.keyCode === 13) {
                if (this.loading) return
                this.loading = true
                if (this.message && !this.fileInfo) {
                    const data = {
                        message_type: 'text',
                        message_content: JSON.stringify(this.message)
                    }
                    this.$socket.client.emit("message", data);
                }
                this.clearData();
                // this.$nextTick(() => this.scrollToBottom())
                this.loading = false
                e.preventDefault();
            }
            if (e.keyCode === 8) {
                if (this.message) return
                //后续还有功能
            }
        },

        clearData() {
            this.message = '';
        },

        focusInput() {
            this.$refs.messageInput.focus();
        }
    }
}

</script>

<style lang="less" scoped>
.message-frame {
    height: 160px;
    display: flex;
    flex-direction: column;
    width: 100%;

    &-input {
        display: flex;
        padding: 0 15px;
        overflow: hidden;

        &-text {
            width: 100%;
            overflow: hidden;
            box-sizing: border-box;
            resize: none;
            outline: none;
            border: none;
            font-size: 15px;
            color: @message-main-text-color;
            background-color: transparent;
        }
    }

    &-empty {
        flex: 1;
    }
}
</style>