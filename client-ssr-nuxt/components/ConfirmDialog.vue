<template>
    <v-row>
        <v-dialog v-model="isVisible" persistent max-width="480">
            <v-card>
                <v-card-title class="headline">{{ title }}</v-card-title>
                <v-card-text>{{ message }}</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error darken-1" text @click="closeDialog"
                        >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="confirmDialog"
                        >Yes</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    name: 'ConfirmDialog',

    props: {
        title: {
            type: String,
            required: true,
            default: ''
        },
        message: {
            type: String,
            required: true,
            default: ''
        },
        isVisible: {
            type: Boolean,
            required: false,
            default: false
        }
    },

    methods: {
        confirmDialog() {
            this.$emit('confirmDialog');
        },
        closeDialog() {
            this.$emit('closeDialog');
        }
    }
};
</script>
