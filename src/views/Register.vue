<template>
    <div class="bigBox">
        <div class="box">
            <div class="pre-box">
                <h1>WELCOME</h1>
                <p>JOIN US!</p>
                <div class="img-box">
                    <img src="../assets/img/wuwu.jpeg" id="avatar" />
                </div>
            </div>
            <div class="register-form">
                <!-- 标题盒子 -->
                <div class="title-box">
                    <h1>注册</h1>
                </div>
                <!-- 输入框盒子 -->
                <el-form ref="registerForm" :model="registerForm" label-with="5px" :rules="rules">
                    <el-form-item prop="username">
                        <el-input type="text" placeholder="用户账号" v-model="registerForm.username" />
                    </el-form-item>
                    <el-form-item prop="nickname">
                        <el-input type="text" placeholder="用户昵称" v-model="registerForm.nickname" />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="registerForm.password" />
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input type="password" placeholder="用户邮箱" v-model="registerForm.email" />
                    </el-form-item>
                </el-form>
                <!-- 按钮盒子 -->
                <div class="btn-box">
                    <button @click="register">注册</button>
                    <!-- 绑定点击事件 -->
                    <p @click="$router.push('/login')">已有账号?去登录</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import { register, login } from '@/api/user';
import { nameRule, emailRule, passRule } from '@/utils/validate';
export default {
    data() {
        return {
            registerForm: {
                username: '',
                nickname: '',
                password: '',
                email: ''
            },
            rules: {
                username: [{ validator: nameRule, trigger: 'blur' }],
                nickname: [{ required: true, message: "请输入您的昵称", trigger: "blur" },
                { min: 1, max: 8, message: "长度在1到8个字符", trigger: "blur" },],
                password: [{ validator: passRule, trigger: 'blur' }],
                email: [{ validator: emailRule, trigger: 'blur' }]
            }
        }
    },
    methods: {
        register() {
            this.$refs.registerForm.validate(async (valid) => {
                if (!valid) return;
                await register(this.registerForm);
                this.$message.success('注册成功,即将登录');
                setTimeout(async () => {
                    const { username, password } = this.registerForm;
                    //获取登录后返回的响应数据
                    const { data } = await login({ username, password });
                    //然后从data中获得token
                    const { token } = data;
                    localStorage.token = token;
                    this.$router.push('/');
                    this.$message.success('登录成功了!')
                }, 1000);
            })
        }
    }

}
</script>
<style lang="less" scoped>
input {
    outline: none;
}

.bigBox {
    /* 溢出隐藏 */
    height: 100vh;
    overflow-x: hidden;
    display: flex;
    /* 渐变方向从左到右 */
    background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}

.box {
    width: 1050px;
    height: 600px;
    display: flex;
    /* 相对定位 */
    position: relative;
    z-index: 2;
    margin: auto;
    /* 设置圆角 */
    border-radius: 8px;
    /* 设置边框 */
    border: 1px solid rgba(255, 255, 255, 0.6);
    /* 设置盒子阴影 */
    box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
}

/* 最外层的大盒子 */
.pre-box {
    /* 宽度为大盒子的一半 */
    width: 50%;
    height: 100%;
    /* 绝对定位 */
    border-radius: 4px;
    background-color: #edd4dc;
    box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
    /* 动画过渡，先加速再减速 */
    transition: 0.5s ease-in-out;
}

.pre-box h1 {
    margin-top: 150px;
    text-align: center;
    /* 文字间距 */
    letter-spacing: 5px;
    color: white;
    /* 禁止选中 */
    user-select: none;
    /* 文字阴影 */
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 滑动盒子的文字 */
.pre-box p {
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin: 20px 0;
    /* 禁止选中 */
    user-select: none;
    font-weight: bold;
    color: white;
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片盒子 */
.img-box {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    /* 设置为圆形 */
    border-radius: 50%;
    /* 设置用户禁止选中 */
    user-select: none;
    overflow: hidden;
    box-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 图片 */
.img-box img {
    width: 100%;
}

.register-form {
    width: 50%;
    height: 100%;
}

/* 标题盒子 */
.title-box {
    height: 300px;
    line-height: 500px;
}

/* 标题 */
.title-box h1 {
    text-align: center;
    color: white;
    /* 禁止选中 */
    user-select: none;
    letter-spacing: 5px;
    text-shadow: 4px 4px 3px rgba(0, 0, 0, 0.1);
}

/* 输入框盒子 */
.el-form {
    display: flex;
    /* 纵向布局 */
    flex-direction: column;
    /* 水平居中 */
    align-items: center;
}

.el-form-item {
    width: 65%;
}

/* 输入框 */
input {
    /* width: 60%; */
    height: 40px;
    margin-bottom: 20px;
    text-indent: 10px;
    border: 1px solid #fff;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 120px;
    /* 增加磨砂质感 */
    backdrop-filter: blur(10px);
}

input:focus {
    /* 光标颜色 */
    color: #b0cfe9;
}

/* 聚焦时隐藏文字 */
input:focus::placeholder {
    opacity: 0;
}

/* 按钮盒子 */
.btn-box {
    display: flex;
    justify-content: center;
}

/* 按钮 */
button {
    width: 100px;
    height: 30px;
    margin: 0 7px;
    line-height: 30px;
    border: none;
    border-radius: 4px;
    background-color: #69b3f0;
    color: white;
}

/* 按钮悬停时 */
button:hover {
    /* 鼠标小手 */
    cursor: pointer;
    /* 透明度 */
    opacity: 0.8;
}

/* 按钮文字 */
.btn-box p {
    height: 30px;
    line-height: 30px;
    /* 禁止选中 */
    user-select: none;
    font-size: 14px;
    color: white;
}

.btn-box p:hover {
    cursor: pointer;
    border-bottom: 1px solid white;
}
</style>