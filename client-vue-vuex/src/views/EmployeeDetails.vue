<template>
    <v-container class="fluid container-inner">
        <v-row>
            <v-col>
                <v-card class="heading-card">
                    <v-card-title class="px-3">
                        <h1 class="h1">
                            Employee:
                            {{
                                `${getCurrentUser.firstName} ${getCurrentUser.lastName}`
                            }}
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
                            <b>{{ getCurrentUser.birthDate }}</b>
                        </p>
                        <p>
                            Email:
                            <b>{{ getCurrentUser.email }}</b>
                        </p>
                        <p>
                            Has admin rights:
                            <b>{{
                                getCurrentUser.adminRights ? 'YES' : 'NO'
                            }}</b>
                        </p>
                        <p>
                            Total leave days to take:
                            <b>{{ getCurrentUser.numberOfLeaveDays }}</b>
                        </p>
                    </v-card-text>
                    <v-divider class="mx-1" horizontal />
                    <v-card-text class="pa-2 d-flex flex-wrap">
                        <create-or-update-contract class="mr-4 pa-0" />
                        <create-or-update-user
                            class="pa-0 mr-2 ml-2 mb-3 activator-button"
                            @save="fetchCurrentUser($route.params.id)"
                            is-edit
                        />
                        <confirm-dialog
                            class="ml-1 mr-3 activator-button"
                            title="Are you sure?"
                            :message="`Are you sure that you want to delete ${getCurrentUser.firstName} ${getCurrentUser.lastName} from the database?`"
                            button-text="Remove employee"
                            @confirmDialog="deleteUserAndRedirect"
                        />
                    </v-card-text>
                    <v-card-text>
                        <h3 class="mb-4">Leave requested by this employee:</h3>
                        <v-container class="pa-0">
                            <v-row>
                                <leave-list-item
                                    v-for="leave in requestedLeaves"
                                    :key="leave.id"
                                    :leave="{ ...leave }"
                                />
                                <v-col v-if="!requestedLeaves.length">
                                    <p>No leave requests at the moment</p>
                                </v-col>
                            </v-row>
                        </v-container>
                        <h3 class="mb-4">Below are employee's leaves:</h3>
                        <create-or-update-leave class="mb-4" />
                        <v-container class="pa-0">
                            <v-row>
                                <leave-list-item
                                    v-for="leave in confirmedLeaves"
                                    :key="leave.id"
                                    :leave="{ ...leave }"
                                    isConfirmed
                                />
                                <v-col
                                    v-if="!confirmedLeaves.length"
                                    class="xs-12"
                                >
                                    <p>No leaves at the moment</p>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
                <v-card class="details">
                    <contract-list-item
                        v-for="contract in getContracts"
                        :key="contract.id"
                        :contract="{ ...contract }"
                    />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ContractListItem from '@/components/ContractListItem';
import CreateOrUpdateUser from '@/components/CreateOrUpdateUser';
import CreateOrUpdateContract from '@/components/CreateOrUpdateContract';
import CreateOrUpdateLeave from '@/components/CreateOrUpdateLeave';
import LeaveListItem from '@/components/LeaveListItem';
import ConfirmDialog from '@/components/ConfirmDialog';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        ContractListItem,
        CreateOrUpdateUser,
        CreateOrUpdateContract,
        CreateOrUpdateLeave,
        LeaveListItem,
        ConfirmDialog
    },
    name: 'employeeDetails',
    computed: {
        ...mapGetters(['getContracts', 'getLeaves', 'getCurrentUser']),

        requestedLeaves() {
            if (!this.getLeaves) {
                return [];
            }

            return this.getLeaves.filter(leave => !leave.isConfirmed);
        },
        confirmedLeaves() {
            if (!this.getLeaves) {
                return [];
            }

            return this.getLeaves.filter(leave => leave.isConfirmed);
        }
    },
    async created() {
        const id = this.$route.params.id;

        try {
            await this.fetchUserContracts(id);
            await this.fetchUserLeaves(id);
        } catch (err) {
            console.error(err);
        }
    },
    methods: {
        ...mapActions([
            'deleteUser',
            'fetchCurrentUser',
            'fetchUserContracts',
            'fetchUserLeaves'
        ]),

        async deleteUserAndRedirect() {
            try {
                await this.deleteUser(this.$route.params.id);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Deleted user successfully`
                });

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
