<template>
    <v-col class="mb-1 pt-0" :lg="6" :md="12">
        <v-card class="pt-0">
            <v-toolbar
                class="leave py-0"
                :color="
                    isConfirmed ? 'light-green lighten-3' : 'grey lighten-2'
                "
            >
                <v-toolbar-title>
                    From
                    <b>{{ leave.startDate }}</b> to
                    <b>{{ leave.endDate }}</b>
                    -> {{ daysOfLeave }} day(s)
                </v-toolbar-title>
                <v-spacer />
                <v-btn
                    v-if="!isConfirmed && isLoggedUserAdmin && !isInProfile"
                    icon
                    @click="onConfirm"
                >
                    <v-icon>mdi-account-check-outline</v-icon>
                </v-btn>
                <create-or-update-leave
                    v-if="
                        (isConfirmed && isLoggedUserAdmin && !isInProfile) ||
                            (!isConfirmed && isInProfile)
                    "
                    :is-request="!isLoggedUserAdmin"
                    :leave="leave"
                />
                <v-btn
                    v-if="!isConfirmed || (isLoggedUserAdmin && !isInProfile)"
                    icon
                    @click="onDelete"
                >
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-toolbar>
        </v-card>
    </v-col>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import CreateOrUpdateLeave from '@/components/CreateOrUpdateLeave';

export default {
    components: {
        CreateOrUpdateLeave
    },
    name: 'leaveListItem',
    props: {
        leave: {
            type: Object,
            required: true,
            default: null
        },
        isConfirmed: {
            type: Boolean,
            required: false,
            default: false
        },
        isInProfile: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed: {
        ...mapGetters(['isLoggedUserAdmin', 'isLoggedUserUser']),

        daysOfLeave() {
            const { startDate, endDate } = this.leave;

            return moment(endDate).diff(moment(startDate), 'days') + 1;
        }
    },
    methods: {
        ...mapActions(['deleteLeave', 'confirmLeave']),

        async onConfirm() {
            try {
                await this.confirmLeave({
                    leaveId: this.leave.id,
                    userId: this.leave.userId
                });
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
        async onDelete() {
            try {
                await this.deleteLeave({
                    id: this.leave.id,
                    userId: this.leave.userId
                });

                this.$notify({
                    group: 'app',
                    type: 'success',
                    title: `Deleted leave ${
                        !this.isConfirmed ? 'request' : ''
                    } successfully`
                });
            } catch (err) {
                this.$notify({
                    group: 'app',
                    type: 'error',
                    title: `An error occured deleting this leave ${
                        !this.isConfirmed ? 'request' : ''
                    } `
                });

                console.error(err);
            }
        }
    }
};
</script>
