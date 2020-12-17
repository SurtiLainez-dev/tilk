<template>
<v-card>
    <v-card-title>Seguimientos Abiertos</v-card-title>
    <v-divider></v-divider>
    <div class="d-flex justify-center pb-10">
        <tabla :tipo="1"/>
    </div>

    <v-navigation-drawer v-model="$store.state.dialogo" clipped right absolute width="100%" class="side">
        <v-row no-gutters>
            <v-col cols="1" class="d-flex align-center">
                <v-btn class="ma-2" dark fab x-small text color="red" @click="$store.commit('valorDialogo', false)">
                    <v-icon>fa fa-times</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="11" class="d-flex justify-center align-center"><h4>Seguimiento de Prospecto</h4></v-col>
        </v-row>
        <v-divider></v-divider>
        <seguimiento :tipo="1" v-if="$store.state.dialogo"/>
    </v-navigation-drawer>
</v-card>
</template>

<script>
    import seguimiento from "../../../components/Ventas/seguimiento";
    import tabla from "../../../components/Ventas/seguimientos/tabla";
    export default {
        components:{tabla, seguimiento},
        name: "abiertos",
        created() {
            this.$store.commit('guardarTitulo', 'Seguimeintos > Abiertos');
            this.$store.commit('valorDialogo', false);
        },
    }
</script>

<style scoped>

</style>
