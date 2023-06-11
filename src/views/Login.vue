<template>
    <div class="bigBox">
        <div class="box">
            <div class="pre-box">
                <h1>WELCOME</h1>
                <p>JOIN US!</p>
                <div class="img-box">
                    <img src="../assets/img/waoku.jpg" alt="" id="avatar" />
                </div>
            </div>
            <div class="login-form">
                <div class="title-box">
                    <h1>登录</h1>
                </div>
                <el-form ref="loginForm" :model="loginForm" label-with="5px" :rules="rules">
                    <el-form-item prop="username">
                        <el-input type="text" placeholder="用户名" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 按钮盒子 -->
                <div class="btn-box">
                    <button @click="login">登录</button>
                    <!-- 绑定点击事件 -->
                    <p @click="$router.push('/register')">没有账号?去注册</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { login } from '@/api/user';
import { nameRule, passRule } from '@/utils/validate';
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ validator: nameRule, trigger: 'blur' }],
                password: [{ validator: passRule, trigger: 'blur' }]
            }
        }
    },
    components: {

    },

    created() {
        localStorage.username &&
            (this.loginForm.username = localStorage.username);
        localStorage.password &&
            (this.loginForm.password = localStorage.password)
    },
    methods: {
        login() {
            this.$refs.loginForm.validate(async (valid) => {
                if (!valid)
                    return
                const { data } = await login(this.loginForm)
                const { token } = data
                localStorage.token = token
                this.$router.push('/');
                //将用户名和密码存入
                const { username, password } = this.loginForm;
                localStorage.username = username;
                localStorage.password = password
            })
        },
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
    justify-content: space-between;
    align-items: center;
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

.pre-box {
    /* 宽度为大盒子的一半 */
    width: 50%;
    height: 100%;
    border-radius: 4px;
    background-color: #edd4dc;
    box-shadow: 2px 1px 19px rgba(0, 0, 0, 0.1);
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

.login-form {
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
