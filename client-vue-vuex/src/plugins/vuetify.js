import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#fff',
                secondary: '#26a69a',
                tertiary: '36404a',
                quaternary: '#4C5965',
                warning: '#ff5252',
                error: '#ff2a2a',
                deleteIcon: '#e61f40'
            },
            light: {
                primary: '#222',
                secondary: '#26a69a',
                //secondary: '#38414a',
                tertiary: '#fff',
                quaternary: '#6b7b8a',
                warning: '#ff5252',
                error: '#f11e53',
                deleteIcon: '#e61f40'
            }
        }
    }
});
