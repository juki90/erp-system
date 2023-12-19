<template>
    <v-card-text>
        <h3 class="mb-4">Below are all requested leaves:</h3>
        <v-btn
            v-if="isInProfile"
            class="mb-4"
            color="primary"
            small
            @click="isCreateDialogVisible = true"
            >Request leave</v-btn
        >
        <v-container class="pa-0">
            <v-row>
                <leave-list-item
                    v-for="leave in requestedLeaves"
                    :key="leave.id"
                    :leave="leave"
                    :is-in-profile="isInProfile"
                    @edit="openEditLeaveDialog"
                    @confirm="onConfirm"
                    @delete="onDelete"
                />
                <v-col v-if="!requestedLeaves.length">
                    <p>No leave requests at the moment</p>
                </v-col>
            </v-row>
        </v-container>
        <h3 class="mb-4">Below are confirmed leaves:</h3>
        <v-btn
            v-if="!isInProfile"
            class="mb-4"
            color="primary"
            small
            @click="isCreateDialogVisible = true"
            >Add leave</v-btn
        >
        <v-container class="pa-0">
            <v-row>
                <leave-list-item
                    v-for="leave in confirmedLeaves"
                    :key="leave.id"
                    :leave="leave"
                    is-confirmed
                    :is-in-profile="isInProfile"
                    @edit="openEditLeaveDialog"
                    @delete="onDelete"
                />
                <v-col v-if="!confirmedLeaves.length" class="xs-12">
                    <p>No leaves at the moment</p>
                </v-col>
            </v-row>
        </v-container>
        <create-or-update-leave
            :leave="currentLeave"
            :is-visible="isEditDialogVisible"
            :is-request="isInProfile"
            @close="closeEditLeaveDialog"
        />
        <create-or-update-leave
            :is-visible="isCreateDialogVisible"
            :is-request="isInProfile"
            @close="isCreateDialogVisible = false"
        />
    </v-card-text>
</template>

<script>
import { mapActions } from 'vuex';
import LeaveListItem from '~/components/LeaveListItem';

export default {
    name: 'LeaveList',

    components: {
        LeaveListItem
    },

    props: {
        leaves: {
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
            isCreateDialogVisible: false,
            isEditDialogVisible: false,
            currentLeave: {}
        };
    },

    computed: {
        requestedLeaves() {
            return this.leaves.filter(leave => !leave.isConfirmed);
        },
        confirmedLeaves() {
            return this.leaves.filter(leave => leave.isConfirmed);
        }
    },

    methods: {
        ...mapActions({
            deleteLeave: 'leaves/deleteLeave',
            confirmLeave: 'leaves/confirmLeave'
        }),

        async onConfirm(leave) {
            try {
                await this.confirmLeave(leave.id);

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Accepted this leave request successfully`
                });
            } catch (err) {
                this.$notify({
                    group: 'app',
                    type: 'error',
                    title: `An error occured during accepting this leave request`
                });

                console.error(err);
            }
        },
        async onDelete(leave) {
            try {
                await this.deleteLeave({
                    id: leave.id,
                    userId: leave.userId,
                    isInProfile: this.$route.name === 'profile'
                });

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Deleted leave ${
                        !leave.isConfirmed ? 'request' : ''
                    } successfully`
                });
            } catch (err) {
                this.$notify({
                    group: 'app',
                    type: 'error',
                    title: `An error occured deleting this leave ${
                        !leave.isConfirmed ? 'request' : ''
                    }`
                });

                console.error(err);
            }
        },
        openEditLeaveDialog(leave) {
            this.currentLeave = leave;
            this.isEditDialogVisible = true;
        },
        closeEditLeaveDialog() {
            this.currentLeave = {};
            this.isEditDialogVisible = false;
        }
    }
};
</script>
