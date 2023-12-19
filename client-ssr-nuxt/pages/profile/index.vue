<template>
    <v-container class="fluid container-inner">
        <v-row>
            <v-col>
                <v-card class="heading-card">
                    <v-card-title class="px-3">
                        <h1 class="h1">
                            Hello, {{ getLoggedUser.fullName }}
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
                            <b>{{ getLoggedUser.numberOfLeaveDays }}</b>
                        </p>
                    </v-card-text>
                    <v-divider class="mx-1" horizontal />
                    <leave-list is-in-profile :leaves="getLeaves" />
                </v-card>
                <v-card class="details">
                    <contract-list :contracts="getContracts" is-in-profile />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import ContractList from '~/components/ContractList';
import LeaveList from '~/components/LeaveList';

export default {
    name: 'ProfileDetails',

    components: {
        ContractList,
        LeaveList
    },

    async asyncData({ store }) {
        try {
            await store.dispatch('users/getMe');
            await store.dispatch('contracts/fetchContracts');
            await store.dispatch('leaves/fetchLeaves');
        } catch (err) {
            console.error(err);
        }
    },

    computed: {
        ...mapGetters({
            getLoggedUser: 'users/getLoggedUser',
            getContracts: 'contracts/getContracts',
            getLeaves: 'leaves/getLeaves'
        })
    }
};
</script>
