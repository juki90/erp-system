<template>
    <v-container class="fluid container-inner">
        <v-row>
            <v-col>
                <v-card class="heading-card">
                    <v-card-title class="px-3">
                        <h1 class="h1">
                            Hello, {{ getCurrentUser.firstName }}
                            {{ getCurrentUser.lastName }}
                        </h1>
                    </v-card-title>
                    <v-divider class="mx-1" horizontal />
                    <v-card-subtitle>
                        Here you can find your contracts and leaves. You can
                        request leaves.
                    </v-card-subtitle>
                    <v-card-text>
                        <p>
                            Total leave days to take:
                            <b>{{ getCurrentUser.numberOfLeaveDays }}</b>
                        </p>
                    </v-card-text>
                    <v-divider class="mx-1" horizontal />
                    <v-card-text>
                        <h3 class="mb-4">Leaves requested by you:</h3>
                        <v-container class="pa-0">
                            <v-row>
                                <leave-list-item
                                    v-for="leave in requestedLeaves"
                                    :key="leave.id"
                                    :leave="{ ...leave }"
                                    is-in-profile
                                />
                                <v-col v-if="!requestedLeaves.length">
                                    <p>No leave requests at the moment</p>
                                </v-col>
                            </v-row>
                            <create-or-update-leave
                                class="mb-4"
                                is-for-request
                            />
                        </v-container>
                        <h3 class="mb-4">Below are your leaves:</h3>
                        <v-container class="pa-0">
                            <v-row>
                                <leave-list-item
                                    v-for="leave in confirmedLeaves"
                                    :key="leave.id"
                                    :leave="leave"
                                    isConfirmed
                                    is-in-profile
                                />
                                <v-col v-if="!confirmedLeaves.length">
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
                        is-in-profile
                    />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ContractListItem from '@/components/ContractListItem';
import CreateOrUpdateLeave from '@/components/CreateOrUpdateLeave';
import LeaveListItem from '@/components/LeaveListItem';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        ContractListItem,
        CreateOrUpdateLeave,
        LeaveListItem
    },
    name: 'profileDetails',
    computed: {
        ...mapGetters([
            'getContracts',
            'getLeaves',
            'getCurrentUser',
            'isLoggedUserAdmin',
            'getLoggedUser'
        ]),

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
        try {
            await this.fetchCurrentUser();
            await this.fetchContracts();
            await this.fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    },
    methods: {
        ...mapActions([
            'fetchContracts',
            'fetchLeaves',
            'fetchCurrentUser',
            'fetchUserContracts',
            'fetchUserLeaves'
        ])
    }
};
</script>
