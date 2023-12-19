import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import users from './modules/users';
import contracts from './modules/contracts';
import leaves from './modules/leaves';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        auth,
        users,
        contracts,
        leaves
    }
});
