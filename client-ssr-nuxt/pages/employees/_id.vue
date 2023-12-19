<template>
    <v-container class="fluid container-inner">
        <v-row>
            <v-col>
                <v-card class="heading-card">
                    <v-card-title class="px-3">
                        <h1 class="h1">
                            Employee:
                            {{ getUser.fullName }}
                        </h1>
                    </v-card-title>
                    <v-divider class="mx-1" horizontal />
                    <v-card-subtitle>
                        Here you can find employee's all active contracts and
                        leaves
                    </v-card-subtitle>
                    <v-card-text>
                        <p>
                            Born in:
                            <b>{{ getUser.birthDate }}</b>
                        </p>
                        <p>
                            Email:
                            <b>{{ getUser.email }}</b>
                        </p>
                        <p>
                            Has admin rights:
                            <b>{{ getUser.adminRights ? 'YES' : 'NO' }}</b>
                        </p>
                        <p>
                            Total leave days to take:
                            <b>{{ getUser.numberOfLeaveDays }}</b>
                        </p>
                    </v-card-text>
                    <v-divider class="mx-1" horizontal />
                    <v-card-text class="px-2 pt-2 pb-0 d-flex flex-wrap">
                        <v-btn
                            class="ml-2 mb-3 mr-2"
                            color="primary"
                            @click="isCreateContractDialogVisible = true"
                        >
                            Create contract
                        </v-btn>
                        <v-btn
                            class="ml-2 mb-3 mr-2"
                            @click="isEditUserDialogVisible = true"
                        >
                            Edit employee
                        </v-btn>
                        <v-btn
                            class="ml-2 mr-3 mb-3 white--text red darken-4"
                            @click="isDeleteUserDialogVisible = true"
                            >Remove employee</v-btn
                        >
                        <create-or-update-user
                            :is-visible="isEditUserDialogVisible"
                            :user="getUser"
                            @close="isEditUserDialogVisible = false"
                        />
                        <create-or-update-contract
                            :is-visible="isCreateContractDialogVisible"
                            @close="isCreateContractDialogVisible = false"
                        />
                        <confirm-dialog
                            title="Are you sure?"
                            :message="`Are you sure that you want to delete ${getUser.fullName} from the database?`"
                            :is-visible="isDeleteUserDialogVisible"
                            @confirmDialog="deleteUserAndRedirect"
                            @closeDialog="isDeleteUserDialogVisible = false"
                        />
                    </v-card-text>
                    <leave-list :leaves="getLeaves" />
                </v-card>
                <contract-list :contracts="getContracts" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrUpdateUser from '~/components/CreateOrUpdateUser';
import CreateOrUpdateContract from '~/components/CreateOrUpdateContract';
import ConfirmDialog from '~/components/ConfirmDialog';
import ContractList from '~/components/ContractList';
import LeaveList from '~/components/LeaveList';

export default {
    name: 'EmployeeDetails',

    components: {
        CreateOrUpdateUser,
        CreateOrUpdateContract,
        ConfirmDialog,
        ContractList,
        LeaveList
    },

    async asyncData({ store, params }) {
        try {
            await store.dispatch('users/fetchUserById', params.id);
            await store.dispatch('contracts/fetchUserContracts', params.id);
            await store.dispatch('leaves/fetchUserLeaves', params.id);
        } catch (err) {
            console.error(err);
        }
    },

    data() {
        return {
            isDeleteUserDialogVisible: false,
            isCreateContractDialogVisible: false,
            isEditUserDialogVisible: false
        };
    },

    computed: {
        ...mapGetters({
            getUser: 'users/getUser',
            getContracts: 'contracts/getContracts',
            getLeaves: 'leaves/getLeaves'
        })
    },

    methods: {
        ...mapActions({
            deleteUser: 'users/deleteUser'
        }),

        async deleteUserAndRedirect() {
            try {
                await this.deleteUser(this.$route.params.id);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Deleted user successfully`
                });

                this.isDeleteUserDialogVisible = false;

                this.$router.push({ name: 'employees' });
            } catch (err) {
                this.$notify({
                    group: 'app',
                    type: 'error',
                    title: `An error occured deleting this user`
                });

                console.error(err);
            }
        }
    }
};
</script>
