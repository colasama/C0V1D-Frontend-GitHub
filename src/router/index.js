import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        meta: { title: 'C0V1D - 新冠疫情综合信息平台', },
        component: Home
    },
    {
        path: '/test',
        name: 'test',
        meta: { title: '测试页面 - C0V1D 新冠疫情综合信息平台', },
        component: () =>
            import ('../views/Test.vue')
    },
    {
        path: '/resetpassword',
        name: 'ResetPassword',
        meta: { title: '忘记密码 - C0V1D 新冠疫情综合信息平台', },
        component: () =>
            import ('../views/ResetPassword.vue')
    },
    {
        path: '/knowledge/index*',
        name: 'VirusKnowledge',
        meta: { title: '防控知识 - C0V1D 新冠疫情综合信息平台', },
        component: () =>
            import ('../views/Forum.vue')
    },
    {
        path: '/knowledge/question',
        name: 'MyQuestion',
        meta: { title: '提问 - C0V1D 新冠疫情综合信息平台', },
        component: () =>
            import ('../components/forum/Question.vue')
    },
    {
        path: '/knowledge/content*',
        name: 'DetailContent',
        meta: { title: '详细知识 - C0V1D 新冠疫情综合信息平台', },
        component: () =>
            import ('../components/forum/Content.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

router.beforeResolve((to, from, next) => {
    if (store.state.token == '') {
        const token = window.localStorage.getItem('token');
        const userid = window.localStorage.getItem('userid');
        const username = window.localStorage.getItem('username');

        if (typeof token === 'string') {
            store.state.token = token;
            store.state.showLogin = false;
        }
        if (typeof username === 'string') store.state.username = username;
        if (typeof userid === 'string') store.state.userid = userid;
    }
    if (store.state.token == null && (to.name == "Home" || to.name == "Profile")) {
        next();
    } else {
        next();
    }
})

export default router