<template>
    <v-app>
        <layout>
            <router-view />
        </layout>
        <notifications group="app" position="bottom center" />
    </v-app>
</template>

<script>
import Layout from '@/layout/Layout';

export default {
    components: {
        Layout
    },
    name: 'App'
};
</script>
