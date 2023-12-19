export default ({ $axios, redirect, app }) => {
    $axios.onError(error => {
        if (process.server) {
            return;
        }

        if (!error.response || !error.response.request) {
            throw error;
        }

        const errUrl = error.response.request.responseURL;
        const fromUrl = errUrl.split('/').pop();
        const nonRedirectUrls = ['login', 'forgot-password'];

        if (
            error.response.status === 401 &&
            !nonRedirectUrls.includes(fromUrl)
        ) {
            app.$auth.setUser(null);
            app.$cookies.remove('auth.user');

            redirect('/login');
        }

        throw error;
    });

    $axios.onResponse(({ config, data }) => {
        if (config.url === '/me') {
            app.$cookies.set('auth.user', data);
        }
    });
};
