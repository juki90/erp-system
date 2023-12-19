import axios from '@/plugins/axios';

const initialState = {
    contractList: []
};

const state = () => ({
    ...initialState
});

const getters = {
    getContracts: state => state.contractList
};

const mutations = {
    SET_CONTRACTS: (state, contracts) => {
        state.contractList = contracts;
    }
};

const actions = {
    async saveContract({ dispatch }, contract) {
        const { id, userId } = contract;

        if (id) {
            await axios.put(`/contracts/${id}`, contract);
        } else {
            await axios.post(`/contracts`, contract);
        }

        dispatch('fetchUserContracts', userId);
        dispatch('fetchCurrentUser', userId, { root: true });
    },
    async fetchUserContracts({ commit }, userId) {
        const { data } = await axios.get(`/users/${userId}/contracts`);

        commit('SET_CONTRACTS', data);

        return data;
    },
    async fetchContracts({ commit }) {
        const { data } = await axios.get(`/contracts`);

        commit('SET_CONTRACTS', data);

        return data;
    },
    async deleteContract({ dispatch }, { id, userId }) {
        await axios.delete(`/contracts/${id}`);

        dispatch('fetchUserContracts', userId);
        dispatch('fetchCurrentUser', userId, { root: true });
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};
