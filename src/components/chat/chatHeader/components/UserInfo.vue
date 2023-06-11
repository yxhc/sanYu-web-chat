<template>
    <div class="perSion">
        <div class="header">
            <img :src="form.avatar" class="avatar">
        </div>
        <span class="uuid">UUID: {{ uuid }}</span>
        <div class="form">
            <el-form ref="userForm" :model="form" label-position="right" label-width="60px" size="mini" :rules="rules">
                <el-form-item prop="username" label="账号">
                    <el-input v-model="form.username" clearable placeholder="您的名称或邮箱账号" />
                </el-form-item>
                <el-form-item prop="nickname" label="昵称">
                    <el-input v-model="form.nickname" clearable placeholder="您的账户昵称" />
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "UserInfo",
    data() {
        return {
            form: {
                username: '',
                nickname: '',
                avatar: ''
            },
            rules: {
                username: [
                    { required: true, message: "请输入您的账号", trigger: "blur" },
                    {
                        min: 1,
                        max: 12,
                        message: "长度在 1 到 12 个字符",
                        trigger: "blur",
                    },
                ],
                nickname: [
                    { required: true, message: "请输入您的昵称", trigger: "blur" },
                    {
                        min: 1,
                        max: 10,
                        message: "长度在 1 到 10 个字符",
                        trigger: "blur",
                    },
                ],
            }
        }
    },
    computed: {
        ...mapGetters(['user_info',
            "on_line_user_list",
            "room_list"])
    },
    created() {
        this.initUserInfo()
    },
    methods: {
        ...mapActions([
            "getUserInfo"
        ]),
        initUserInfo() {
            if (!this.user_info) return;
            const { username, nickname, avatar, id } = this.user_info;
            Object.assign(this.form, {
                username,
                nickname,
                avatar
            })
            this.uuid = `10${id.toString().padStart(4, 0)}`;
        },
    }
}
</script>

<style lang="less" scoped>
.perSion {
    padding: 0 15px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .uuid {
        display: inline-block;
        font-size: 12px;
        background: #ccc;
        padding: 2px 5px;
        color: #fff;
        font-weight: 600;
        border-radius: 5px;
        margin-top: 5px;
    }

    .form {
        width: 100%;
        margin-top: 15px;
    }
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    display: block;
    border: 1px solid #ddd8d8;
}
</style>