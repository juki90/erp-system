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
                        <v-card-subtitle>This is a list of your employees</v-card-subtitle>
                        <v-card-text>Add new employee to your database:</v-card-text>
                        <v-card-actions>
                            <create-or-update-user />
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-if="getUsers.length" id="employees" class="fluid container-inner">
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
import EmployeeListItem from '@/components/EmployeeListItem';
import CreateOrUpdateUser from '@/components/CreateOrUpdateUser';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        EmployeeListItem,
        CreateOrUpdateUser
    },
    name: 'employees',
    data() {
        return {
            dialogVisible: false
        };
    },
    computed: {
        ...mapGetters(['getUsers'])
    },
    async created() {
        try {
            await this.fetchAllUsers();
        } catch (err) {
            console.error(err);
        }
    },
    methods: {
        ...mapActions(['fetchAllUsers']),

        openDialog() {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
        }
    }
};
</script>
