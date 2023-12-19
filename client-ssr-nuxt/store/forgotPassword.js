export const actions = {
    requestPasswordReset(vuexContext, email) {
        return this.$axios.$post('/reset-password', { email });
    },
    checkPasswordReset(vuexContext, token) {
        return this.$axios.$get(`/reset-password/${token}`);
    },
    resetPassword(vuexContext, { token, passwords }) {
        return this.$axios.$post(`/reset-password/${token}`, passwords);
    }
};
