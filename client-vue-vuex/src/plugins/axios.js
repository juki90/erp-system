import globalAxios from 'axios';
import config from '@/config';

const axios = globalAxios.create({
    baseURL: config.apiUrl,
    withCredentials: true
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (!error.response && !error.response.request) {
            throw error;
        }

        const errUrl = error.response.request.responseURL;
        const fromUrl = errUrl.split('/').pop();
        const nonRedirectUrls = ['login'];

        if (
            error.response.status === 401 &&
            !nonRedirectUrls.includes(fromUrl)
        ) {
            window.location.href = '/login';
            localStorage.clear();
        }

        throw error;
    }
);

export default axios;
