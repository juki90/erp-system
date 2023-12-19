const initialState = {
    contractList: []
};

export const state = () => ({
    ...initialState
});

export const getters = {
    getContracts: state => state.contractList
};

export const mutations = {
    SET_CONTRACTS: (state, contracts) => {
        state.contractList = contracts;
    },
    SAVE_CONTRACT: (state, contractData) => {
        const index = state.contractList.findIndex(
            contract => contract.id === contractData.id
        );

        state.contractList.splice(index, 1, contractData);
    },
    ADD_CONTRACT: (state, contract) => {
        state.contractList.unshift(contract);
    },
    DELETE_CONTRACT: (state, id) => {
        const index = state.contractList.findIndex(
            contract => contract.id === id
        );

        state.contractList.splice(index, 1);
    }
};

export const actions = {
    async saveContract({ commit, dispatch }, contractData) {
        let contract;

        if (contractData.id) {
            contract = await this.$axios.$put(
                `/contracts/${contractData.id}`,
                contractData
            );

            commit('SAVE_CONTRACT', contract);
        } else {
            contract = await this.$axios.$post('/contracts', contractData);

            commit('ADD_CONTRACT', contract);
        }

        await dispatch('users/fetchUserById', contract.userId, {
            root: true
        });

        return contract;
    },
    async fetchUserContracts({ commit }, userId) {
        const contracts = await this.$axios.$get(`/users/${userId}/contracts`);

        commit('SET_CONTRACTS', contracts);

        return contracts;
    },
    async fetchContracts({ commit }) {
        const contracts = await this.$axios.$get(`/contracts`);

        commit('SET_CONTRACTS', contracts);

        return contracts;
    },
    async deleteContract({ commit, dispatch }, { id, userId }) {
        await this.$axios.$delete(`/contracts/${id}`);

        commit('DELETE_CONTRACT', id);

        await dispatch('users/fetchUserById', userId, {
            root: true
        });
    }
};
