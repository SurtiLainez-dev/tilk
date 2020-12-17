<template>
    <v-card :disabled="EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Comentarios de facturación</h5>
        <hr>
        <v-row class="ma-1" no-gutters v-for="item in Comentarios">
            <v-col>
                <v-card>
                    <v-card-title>{{item.titulo}}</v-card-title>
                    <v-card-text>{{item.detalle}}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    export default {
        name: "comentarios",
        computed: {
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Soli: {
                get: function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
            dialogo: {
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
            Comentarios(){
                return JSON.parse(this.$store.state.solicitud_credito.Solicitud.comentarios);
            }
        }
    }
</script>

<style scoped>

</style>
