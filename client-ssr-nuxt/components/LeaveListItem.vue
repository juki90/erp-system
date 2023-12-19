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
                    v-if="!isConfirmed && isAdmin && !isInProfile"
                    icon
                    @click="onConfirm"
                >
                    <v-icon>mdi-account-check-outline</v-icon>
                </v-btn>
                <v-btn
                    v-if="
                        (isConfirmed && isAdmin && !isInProfile) ||
                        (!isConfirmed && isInProfile)
                    "
                    icon
                    @click="openEditDialog"
                >
                    <v-icon>mdi-account-edit-outline</v-icon>
                </v-btn>
                <v-btn
                    v-if="!isConfirmed || (isAdmin && !isInProfile)"
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
import { mapGetters } from 'vuex';

export default {
    name: 'LeaveListItem',

    props: {
        leave: {
            type: Object,
            required: true,
            default: () => ({})
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
        ...mapGetters(['isAdmin']),

        daysOfLeave() {
            const { startDate, endDate } = this.leave;

            return moment(endDate).diff(moment(startDate), 'days') + 1;
        }
    },

    methods: {
        onConfirm() {
            this.$emit('confirm', this.leave);
        },
        onDelete() {
            this.$emit('delete', this.leave);
        },
        openEditDialog() {
            this.$emit('edit', this.leave);
        }
    }
};
</script>
