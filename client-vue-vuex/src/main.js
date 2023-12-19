import Vue from 'vue';
import Notifications from 'vue-notification';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import './styles/global.scss';

Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
