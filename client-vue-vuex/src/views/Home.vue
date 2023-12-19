<template>
    <v-container>
        <v-row>
            <v-col align-self="center">
                <v-card class="mx-auto pt-7" max-width="1366">
                    <v-card-text>
                        <p
                            class="display-1 text--primary text-center mb-7"
                        >Welcome to Employee ERP App</p>
                        <p v-if="getLoggedUser" class="text--primary text-center mb-7">
                            Hello {{ getLoggedUser.firstName }}! Go to
                            <router-link v-if="isLoggedUserUser" to="/profile">your profile</router-link>
                            <router-link v-if="isLoggedUserAdmin" to="/employees">dashboard</router-link>.
                        </p>
                        <p v-else class="text--primary text-center mb-7">
                            If you have an account, please
                            <router-link to="/login">log in</router-link>.
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'home',
    computed: {
        ...mapGetters([
            'getLoggedUser',
            'isLoggedUserAdmin',
            'isLoggedUserUser'
        ])
    },

    methods: {
        ...mapActions(['fetchLoggedUser'])
    }
};
</script>
