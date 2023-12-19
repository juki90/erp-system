<template>
    <div>
        <v-toolbar class="fixed" color="#ddd" dense>
            <v-row>
                <v-container class="container">
                    <div class="flex">
                        <v-btn to="/" text @click="closeNavigation">Employee ERP</v-btn>
                        <nav class="navigation" :class="{ open: navOpened }">
                            <v-btn
                                v-if="getLoggedUser"
                                class="navigation-link"
                                color="#333"
                                to="/profile"
                                text
                                @click="closeNavigation"
                            >
                                <v-icon>mdi-account-circle</v-icon>Profile
                            </v-btn>
                            <v-btn
                                v-if="isLoggedUserAdmin"
                                class="navigation-link"
                                color="#333"
                                to="/employees"
                                text
                                @click="closeNavigation"
                            >
                                <v-icon>mdi-desktop-mac-dashboard</v-icon>Employees
                            </v-btn>
                            <v-btn
                                v-if="!getLoggedUser"
                                class="navigation-link"
                                to="/login"
                                color="#333"
                                text
                                @click="closeNavigation"
                            >
                                <v-icon>mdi-account-key</v-icon>Login
                            </v-btn>
                            <v-btn
                                v-else
                                class="navigation-link"
                                to="/"
                                color="#333"
                                text
                                @click="onLogout"
                            >
                                <v-icon>mdi-logout-variant</v-icon>Logout
                            </v-btn>
                        </nav>
                        <v-btn class="navicon" color="#333" text @click="toggleNavigation">
                            <v-icon v-if="navOpened">mdi-close</v-icon>
                            <v-icon v-else>mdi-menu</v-icon>
                        </v-btn>
                    </div>
                </v-container>
            </v-row>
        </v-toolbar>
        <v-container class="container">
            <slot />
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'layout',
    data() {
        return {
            navOpened: false
        };
    },
    computed: {
        ...mapGetters(['getLoggedUser', 'isLoggedUserAdmin'])
    },
    watch: {
        getLoggedUser() {}
    },

    methods: {
        ...mapActions(['logout', 'fetchLoggedUser']),

        toggleNavigation() {
            this.navOpened = !this.navOpened;
        },
        closeNavigation() {
            this.navOpened = false;
        },
        async onLogout() {
            this.closeNavigation();
            await this.logout();
            this.$notify({
                group: 'app',
                type: 'success',
                title: 'Logged out successfully'
            });
            this.$router.push({ name: 'login' });
        }
    }
};
</script>
