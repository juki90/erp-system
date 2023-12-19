<template>
    <v-app>
        <div>
            <navigation />
            <v-container class="container">
                <nuxt />
            </v-container>
            <notifications group="app" position="bottom center" />
        </div>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation';

export default {
    name: 'DefaultLayout',
    components: {
        Navigation
    }
};
</script>
