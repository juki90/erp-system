<template>
    <div>
        <v-container class="fluid container-inner">
            <v-row>
                <v-col>
                    <v-card class="heading-card">
                        <v-card-title>
                            <h1>Dashboard</h1>
                        </v-card-title>
                        <v-divider class="mx-1" horizontal />
                        <v-card-subtitle
                            >This is a list of your employees</v-card-subtitle
                        >
                        <v-card-text
                            >Add new employee to your database:</v-card-text
                        >
                        <v-card-actions>
                            <v-btn
                                class="ml-2 mb-3 px-4"
                                color="primary"
                                @click="isCreateUserDialogVisible = true"
                            >
                                Create employee
                            </v-btn>
                            <create-or-update-user
                                :is-visible="isCreateUserDialogVisible"
                                @close="isCreateUserDialogVisible = false"
                            />
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container
            v-if="getUsers.length"
            id="employees"
            class="fluid container-inner"
        >
            <v-row>
                <employee-list-item
                    v-for="user in getUsers"
                    :key="`emp-${user.id}`"
                    :employee="user"
                />
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import EmployeeListItem from '~/components/EmployeeListItem';
import CreateOrUpdateUser from '~/components/CreateOrUpdateUser';

export default {
    name: 'Employees',

    components: {
        EmployeeListItem,
        CreateOrUpdateUser
    },

    async asyncData({ store }) {
        try {
            await store.dispatch('users/fetchAllUsers');
        } catch (err) {
            console.error(err);
        }
    },

    data() {
        return {
            isCreateUserDialogVisible: false
        };
    },

    computed: {
        ...mapGetters({ getUsers: 'users/getUsers' })
    },

    methods: {
        ...mapActions({ fetchAllUsers: 'users/fetchAllUsers' })
    }
};
</script>
