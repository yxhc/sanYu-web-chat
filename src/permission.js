import { getToken } from "./utils/getToken";
import router from "./router";
import store from "./store/index";
const whiteList = ['/login', '/register']

router.beforeEach(async (to, from, next) => {
    document.title = 'sanYu';
    const hasToken = getToken();
    if (hasToken) {
        !store.state.user_info &&
            (await store.dispatch('getUserInfo'))
        next()
    } else if (whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        next('/login')
    }
})