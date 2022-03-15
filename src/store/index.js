import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showNav: true,
        showAdd: true,
        showLogin: true,
        token: '',
        username: '',
        userid: '',
        useravatar: '',
        message: [],
        messageRead: [],
        subscribedArea: [],
        isChatOpen: false,
    },
    mutations: {},
    actions: {},
    modules: {}
})