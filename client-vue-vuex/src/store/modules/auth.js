import axios from '@/plugins/axios';

const initialState = {
    loggedUser: JSON.parse(localStorage.getItem('loggedUser'))
};

const state = () => ({
    ...initialState
});

const getters = {
    getLoggedUser: state => state.loggedUser,
    isLoggedUserAdmin: state =>
        state.loggedUser && state.loggedUser.roles.includes('admin'),
    isLoggedUserUser: state =>
        state.loggedUser && state.loggedUser.roles.includes('user')
};

const mutations = {
    SET_LOGGED_USER(state, loggedUser) {
        loggedUser.roles = loggedUser.roles.map(role => role.name);
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        state.loggedUser = loggedUser;
    },
    CLEAR_LOGGED_USER(state) {
        localStorage.removeItem('loggedUser');
        state.loggedUser = null;
    }
};

const actions = {
    async login({ commit }, formData) {
        const { email, password } = formData;

        const { data } = await axios.post('/login', { email, password });

        commit('SET_LOGGED_USER', data);
    },
    async logout({ commit }) {
        await axios.get('/logout');
        commit('CLEAR_LOGGED_USER');
    },
    async fetchLoggedUser({ commit }) {
        try {
            const { data } = await axios.get('/me');

            commit('SET_LOGGED_USER', data);

            return data;
        } catch (err) {
            commit('CLEAR_LOGGED_USER');
        }
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
