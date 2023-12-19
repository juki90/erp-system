const initialState = {
    userList: [],
    loggedUser: null,
    user: null
};

export const state = () => ({
    ...initialState
});

export const getters = {
    getUsers: state => state.userList,
    getLoggedUser: state => state.loggedUser,
    getUser: state => state.user
};

export const mutations = {
    SET_USERS: (state, users) => {
        state.userList = users;
    },
    SET_USER: (state, user) => {
        state.user = user;
    },
    SET_ME: (state, me) => {
        state.loggedUser = me;
    },
    SAVE_USER: (state, userData) => {
        const index = state.userList.findIndex(user => user.id === userData.id);

        state.userList.splice(index, 1, userData);
    },
    ADD_USER: (state, user) => {
        state.userList.unshift(user);
    },
    DELETE_USER: (state, id) => {
        const index = state.userList.findIndex(user => user.id === id);

        state.userList.splice(index, 1);
    }
};

export const actions = {
    async saveUser({ commit, dispatch }, userData) {
        let user;

        if (userData.id) {
            user = await this.$axios.$put(`/users/${userData.id}`, userData);

            commit('SAVE_USER', user);

            await dispatch('fetchUserById', user.id);
        } else {
            user = await this.$axios.$post(`/users`, userData);

            commit('ADD_USER', user);
        }

        return user;
    },
    async getMe({ commit }) {
        const me = await this.$axios.$get('/me');

        commit('SET_ME', me);

        return me;
    },
    async fetchUserById({ commit }, id) {
        const user = await this.$axios.$get(`/users/${id}`);

        const adminRights = user.roles.some(role => role.name === 'admin');

        commit('SET_USER', { ...user, adminRights });

        return { ...user, adminRights };
    },
    async fetchAllUsers({ commit }) {
        const users = await this.$axios.$get('/users');

        commit('SET_USERS', users);

        return users;
    },
    async deleteUser({ commit }, id) {
        await this.$axios.$delete(`/users/${id}`);

        commit('DELETE_USER', id);
    }
};
