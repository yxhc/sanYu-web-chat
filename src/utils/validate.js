// 用户名验证
export function nameRule(rule, value, callback) {
    let reg = /(^[a-zA-Z0-9]{4,10}$)/;
    if (value === "") {
        callback(new Error('请输入用户名'));
    } else if (!reg.test(value)) {
        callback(new Error("请输入4-10位用户名"))
    } else {
        callback();
    }
}
//密码验证
export function passRule(rule, value, callback) {
    let pass = /^[A-Za-z0-9]{6,20}$/
    if (value === "") {
        callback(new Error('请输入密码'));
    } else if (!pass.test(value)) {
        callback(new Error("请输入6-12位密码包含大小写字母和数字及特殊符号"))
    } else {
        callback();
    }
}

//邮箱验证
export function emailRule(rule, value, callback) {
    let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (value === '') {
        callback(new Error('请输入邮箱'));
    } else if (!email.test(value)) {
        callback(new Error('邮箱格式不对，请检查！'))
    } else {
        callback()
    }

};


//icon图标
export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}