<template>
    <v-card class="mb-4 employee-contract">
        <v-card-title class="mb-2">
            <h2 class="h2">Employment contract</h2>
        </v-card-title>
        <v-card-subtitle>
            <h3 class="h3">{{ contractDateRange }}</h3>
        </v-card-subtitle>
        <v-card-text
            >This contract has {{ numberOfLeaveDays }} day(s) off</v-card-text
        >
        <v-card-actions
            v-if="isAdmin && !isInProfile"
            class="px-0 d-flex justify-start"
        >
            <v-btn
                class="ml-4 mr-1 mb-3"
                color="primary"
                dense
                @click="openEditDialog"
                >Edit</v-btn
            >
            <v-btn
                color="white--text red darken-4 mb-3"
                @click="openDeleteDialog"
                >Delete</v-btn
            >
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ContractListItem',

    props: {
        contract: {
            type: Object,
            required: true,
            default: () => ({})
        },
        isInProfile: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    computed: {
        ...mapGetters(['isAdmin']),

        contractDateRange() {
            return `[${this.contract.startDate} - ${this.contract.endDate}]`;
        },
        numberOfLeaveDays() {
            return Math.round(
                (this.contract.daysOff * this.contract.duration) / 12
            );
        }
    },

    methods: {
        openEditDialog() {
            this.$emit('edit', this.contract);
        },
        openDeleteDialog() {
            this.$emit('delete', this.contract);
        }
    }
};
</script>
