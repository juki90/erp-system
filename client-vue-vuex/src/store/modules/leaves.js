import axios from '@/plugins/axios';

const initialState = {
    leaveList: []
};

const state = () => ({
    ...initialState
});

const getters = {
    getLeaves: state => state.leaveList
};

const mutations = {
    SET_LEAVES: (state, leaves) => {
        state.leaveList = leaves;
    }
};

const actions = {
    async saveLeave({ dispatch, rootGetters }, leave) {
        const { id, userId } = leave;

        if (id) {
            await axios.put(`/leaves/${id}`, leave);
        } else {
            await axios.post(`/leaves`, leave);
        }

        if (rootGetters.isLoggedUserAdmin) {
            dispatch('fetchUserLeaves', userId);
            dispatch('fetchCurrentUser', userId, { root: true });
        } else {
            dispatch('fetchLeaves');
            dispatch('fetchCurrentUser', null, { root: true });
        }
    },
    async confirmLeave({ dispatch }, { leaveId, userId }) {
        await axios.put(`/leaves/${leaveId}/confirm`);

        dispatch('fetchUserLeaves', userId);
    },
    async fetchUserLeaves({ commit }, userId) {
        const { data } = await axios.get(`/users/${userId}/leaves`);

        commit('SET_LEAVES', data);

        return data;
    },
    async fetchLeaves({ commit }) {
        const { data } = await axios.get(`/leaves`);

        commit('SET_LEAVES', data);

        return data;
    },
    async deleteLeave({ dispatch, rootGetters }, { id, userId }) {
        await axios.delete(`/leaves/${id}`);

        if (rootGetters.isLoggedUserAdmin) {
            dispatch('fetchUserLeaves', userId);
            dispatch('fetchCurrentUser', userId, { root: true });
        } else {
            dispatch('fetchLeaves');
            dispatch('fetchCurrentUser', null, { root: true });
        }
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
