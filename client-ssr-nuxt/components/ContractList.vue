<template>
    <v-card class="details">
        <contract-list-item
            v-for="contract in contracts"
            :key="contract.id"
            :contract="contract"
            :is-in-profile="isInProfile"
            @edit="openEditContractDialog"
            @delete="openDeleteContractDialog"
        />
        <create-or-update-contract
            v-if="!isInProfile"
            :contract="currentContract"
            :is-visible="isEditDialogVisible"
            @close="closeEditContractDialog"
        />
        <confirm-dialog
            v-if="!isInProfile"
            title="Are you sure?"
            message="Are you sure that you want to delete this contract from the database?"
            :is-visible="isDeleteDialogVisible"
            @confirmDialog="onDelete"
            @closeDialog="closeDeleteContractDialog"
        />
    </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import createOrUpdateContract from '~/components/CreateOrUpdateContract';
import confirmDialog from '~/components/ConfirmDialog';

export default {
    name: 'ContractList',

    components: {
        createOrUpdateContract,
        confirmDialog
    },

    props: {
        contracts: {
            type: Array,
            required: true,
            default: () => []
        },
        isInProfile: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    data() {
        return {
            currentContract: {},
            isEditDialogVisible: false,
            isDeleteDialogVisible: false
        };
    },

    methods: {
        ...mapActions({ deleteContract: 'contracts/deleteContract' }),

        async onDelete() {
            try {
                await this.deleteContract({
                    id: this.currentContract.id,
                    userId: this.currentContract.userId
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

            this.currentContract = {};
            this.isDeleteDialogVisible = false;
        },
        openDeleteContractDialog(contract) {
            this.currentContract = contract;
            this.isDeleteDialogVisible = true;
        },
        closeDeleteContractDialog() {
            this.currentContract = {};
            this.isDeleteDialogVisible = false;
        },
        openEditContractDialog(contract) {
            this.currentContract = contract;
            this.isEditDialogVisible = true;
        },
        closeEditContractDialog() {
            this.currentContract = {};
            this.isEditDialogVisible = false;
        }
    }
};
</script>
