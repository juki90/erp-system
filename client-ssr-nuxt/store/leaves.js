const initialState = {
    leaveList: []
};

export const state = () => ({
    ...initialState
});

export const getters = {
    getLeaves: state => state.leaveList
};

export const mutations = {
    SET_LEAVES: (state, leaves) => {
        state.leaveList = leaves;
    },
    SAVE_LEAVE: (state, leaveData) => {
        const index = state.leaveList.findIndex(
            leave => leave.id === leaveData.id
        );

        state.leaveList.splice(index, 1, leaveData);
    },
    ADD_LEAVE: (state, leave) => {
        state.leaveList.unshift(leave);
    },
    CONFIRM_LEAVE: (state, leaveId) => {
        const index = state.leaveList.findIndex(leave => leave.id === leaveId);

        state.leaveList[index].isConfirmed = true;
    },
    DELETE_LEAVE: (state, id) => {
        const index = state.leaveList.findIndex(leave => leave.id === id);

        state.leaveList.splice(index, 1);
    }
};

export const actions = {
    async saveLeave(
        { dispatch, commit, rootGetters },
        { leaveData, isInProfile }
    ) {
        const { id, userId } = leaveData;
        let leave;

        if (id) {
            leave = await this.$axios.$put(`/leaves/${id}`, leaveData);

            commit('SAVE_LEAVE', leave);
        } else {
            leave = await this.$axios.$post(`/leaves`, leaveData);

            commit('ADD_LEAVE', leave);
        }

        if (rootGetters.isAdmin && !isInProfile) {
            dispatch('users/fetchUserById', userId, { root: true });
        } else {
            dispatch('users/getMe', null, { root: true });
        }

        return leave;
    },
    async confirmLeave({ commit }, leaveId) {
        const leave = await this.$axios.$put(`/leaves/${leaveId}/confirm`);

        commit('CONFIRM_LEAVE', leaveId);

        return leave;
    },
    async fetchUserLeaves({ commit }, userId) {
        const leaves = await this.$axios.$get(`/users/${userId}/leaves`);

        commit('SET_LEAVES', leaves);

        return leaves;
    },
    async fetchLeaves({ commit }) {
        const leaves = await this.$axios.$get('/leaves');

        commit('SET_LEAVES', leaves);

        return leaves;
    },
    async deleteLeave(
        { commit, dispatch, rootGetters },
        { id, userId, isInProfile }
    ) {
        await this.$axios.$delete(`/leaves/${id}`);

        commit('DELETE_LEAVE', id);

        if (rootGetters.isAdmin && !isInProfile) {
            dispatch('users/fetchUserById', userId, { root: true });
        } else {
            dispatch('users/getMe', null, { root: true });
        }
    }
};
