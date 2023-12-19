<template>
    <v-col class="col-12" md="6">
        <v-card color="grey lighten-5" flat tile>
            <v-toolbar dense>
                <v-toolbar-title>
                    {{ employee.fullName }}
                </v-toolbar-title>
                <v-spacer />
                <v-btn :to="`/employees/${employee.id}`" icon>
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="py-0 leave-days">
                Total number of leave days:
                <b>{{ employee.numberOfLeaveDays }}</b>
            </v-card-text>
        </v-card>
    </v-col>
</template>

<script>
export default {
    name: 'EmployeeListItem',

    props: {
        employee: {
            type: Object,
            required: true,
            default: () => ({})
        }
    }
};
</script>
