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
            v-if="isLoggedUserAdmin && !isInProfile"
            class="pa-0 d-flex justify-start"
        >
            <create-or-update-contract :contract="contract" />
            <confirm-dialog
                class="ml-2 mb-3"
                color="red darken-4 white--text"
                title="Are you sure?"
                :message="
                    `Are you sure that you want to delete employment contract ${contractDateRange} from the database?`
                "
                button-text="Remove"
                @confirmDialog="onDelete"
            />
        </v-card-actions>
    </v-card>
</template>

<script>
import createOrUpdateContract from '@/components/CreateOrUpdateContract';
import confirmDialog from '@/components/ConfirmDialog';
import { mapActions, mapGetters } from 'vuex';

export default {
    components: {
        createOrUpdateContract,
        confirmDialog
    },
    name: 'contractListItem',
    props: {
        contract: {
            type: Object,
            required: true,
            default: null
        },
        isInProfile: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        ...mapGetters(['isLoggedUserAdmin']),

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
        ...mapActions(['deleteContract']),

        async onDelete() {
            try {
                await this.deleteContract({
                    id: this.contract.id,
                    userId: this.contract.userId
                });

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Deleted contract successfully`
                });
            } catch (err) {
                this.$notify({
                    group: 'app',
                    type: 'error',
                    title: `An error occured during deleting this contract`
                });

                console.error(err);
            }
        }
    }
};
</script>
