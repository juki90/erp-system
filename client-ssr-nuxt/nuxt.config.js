import { apiUrl } from './config';

export default {
    head: {
        titleTemplate: '%s - employee-erp',
        title: 'employee-erp',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    css: [{ src: '~/assets/global.scss', lang: 'scss' }],

    plugins: [
        { src: '~/plugins/vuelidate.js', mode: 'client' },
        { src: '~/plugins/vue-notifications.js', mode: 'client' },
        { src: '~/plugins/axios.js', mode: 'client' }
    ],

    components: true,

    buildModules: [
        '@nuxtjs/style-resources',
        '@nuxtjs/eslint-module',
        '@nuxtjs/vuetify',
        '@nuxtjs/dotenv'
    ],

    modules: ['@nuxtjs/axios', '@nuxtjs/auth', 'cookie-universal-nuxt'],

    router: {
        middleware: ['protected-routes']
    },

    axios: {
        baseURL: apiUrl,
        credentials: true
    },

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/login',
                        method: 'post',
                        propertyName: false
                    },
                    logout: {
                        url: '/logout',
                        method: 'get'
                    },
                    user: {
                        url: '/me',
                        method: 'get',
                        propertyName: false
                    }
                }
            }
        }
    },

    vuetify: {},

    build: {
        transpile: ['vue-notifications']
    }
};
