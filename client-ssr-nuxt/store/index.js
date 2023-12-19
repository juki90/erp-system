export const getters = {
    isLoggedIn: state => state.auth.loggedIn,
    getLoggedUser: state => state.auth.user,
    isAdmin: state =>
        state.auth.user &&
        state.auth.user.roles.some(role => role.name === 'admin'),
    isUser: state =>
        state.auth.user &&
        state.auth.user.roles.some(role => role.name === 'user')
};

export const actions = {
    nuxtServerInit(vuexContext, { app }) {
        const user = app.$cookies.get('auth.user');

        this.$auth.setUser(user);
    }
};
