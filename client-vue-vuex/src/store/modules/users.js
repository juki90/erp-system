import axios from '@/plugins/axios';

const initialState = {
    userList: [],
    currentUser: []
};

const state = () => ({
    ...initialState
});

const getters = {
    getUsers: state => state.userList,
    getCurrentUser: state => state.currentUser
};

const mutations = {
    SET_USERS: (state, users) => {
        state.userList = users;
    },
    SET_CURRENT_USER: (state, user) => {
        state.currentUser = user;
    }
};

const actions = {
    async saveUser({ dispatch }, user) {
        if (user.id) {
            await axios.put(`/users/${user.id}`, user);
        } else {
            await axios.post(`/users`, user);
        }

        dispatch('fetchAllUsers');
    },
    async fetchAllUsers({ commit }) {
        const { data } = await axios.get('/users');

        commit('SET_USERS', data);

        return data;
    },
    async fetchCurrentUser({ commit }, userId) {
        if (userId) {
            const { data } = await axios.get(`/users/${userId}`);
            const adminRights = data.roles.some(role => role.name === 'admin');

            const fullData = {
                ...data,
                adminRights
            };

            commit('SET_CURRENT_USER', fullData);

            return fullData;
        }

        const { data } = await axios.get('/me');

        commit('SET_CURRENT_USER', data);

        return data;
    },
    async deleteUser({ dispatch }, id) {
        await axios.delete(`/users/${id}`);

        dispatch('fetchAllUsers');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
