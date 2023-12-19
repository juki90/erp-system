<template>
    <v-container>
        <v-row>
            <v-col align-self="center">
                <v-card class="mx-auto pt-7" max-width="1366">
                    <v-card-text>
                        <p class="display-1 text--primary text-center mb-7"
                            >Welcome to Employee ERP App</p
                        >
                        <p
                            v-if="getLoggedUser"
                            class="text--primary text-center mb-7"
                        >
                            Hello {{ getLoggedUser.firstName }}! Go to
                            <nuxt-link v-if="isUser" to="/profile"
                                >your profile</nuxt-link
                            >
                            <nuxt-link v-if="isAdmin" to="/employees"
                                >dashboard</nuxt-link
                            >
                        </p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'Home',

    computed: {
        ...mapGetters(['isAdmin', 'isUser', 'getLoggedUser'])
    }
};
</script>
