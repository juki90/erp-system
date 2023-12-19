<template>
    <v-app>
        <div>
            <v-container class="container">
                <nuxt />
            </v-container>
            <notifications group="app" position="bottom center" />
        </div>
    </v-app>
</template>

<script>
export default {
    name: 'UnauthorizedLayout'
};
</script>
