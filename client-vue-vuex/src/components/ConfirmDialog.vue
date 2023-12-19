<template>
    <v-row>
        <v-dialog v-model="isConfirmDialogVisible" persistent max-width="480">
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    color="white--text red darken-4"
                    >{{ buttonText }}</v-btn
                >
            </template>
            <v-card>
                <v-card-title class="headline">{{ title }}</v-card-title>
                <v-card-text>{{ message }}</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn
                        color="error darken-1"
                        text
                        @click="isConfirmDialogVisible = false"
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
    name: 'confirmDialog',
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
        buttonText: {
            type: String,
            required: true,
            default: ''
        }
    },
    data() {
        return {
            isConfirmDialogVisible: false
        };
    },
    methods: {
        confirmDialog() {
            this.isConfirmDialogVisible = false;
            this.$emit('confirmDialog');
        }
    }
};
</script>
