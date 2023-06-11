import service from "./service";

export default function request(method, url, data = {}, headers = {}) {
    //根据请求方式来判断请求参数类型
    const dataType = method.toLocaleLowerCase() === 'get' ? 'params' : 'data';
    //定义一个新的对象
    const options = {
        method,
        url,
        //使用计算属性名语法 表示要根据 dataType 的值来设置请求参数类型
        //如果dataType的值为params,则表示使用GET传递请求数据，反之则是POST
        [dataType]: data,
        //设置 HTTP 请求头部信息，包括请求数据类型和其他自定义的请求头部信息
        headers: {
            'Content_Type': 'application/json; charset=utf-8',
            ...headers
        }
    }
    return service(options)
}