<template>
    <v-card :disabled="EstadoVista" class="pr-5 pl-5 pb-2 pt-2" flat>
        <h5>Declinación de la solicitud</h5>
        <hr>
        <v-row>
            <v-col cols="1" class="pt-10">
                <v-icon color="warning" size="50">fa fa-exclamation-triangle</v-icon>
            </v-col>
            <v-col cols="11">
                <v-card-text>Cuando declines la solicitud ya no se podrán hacer gestiones nunca más en esta solicitud, ya
                    que quedará como una solicitúd rechazada por facturación. Las siguientes razones son por las que puedes
                    declinar una solicitud:</v-card-text>
                <v-card-text><strong>1. </strong> No se logró un acuerdo con el precio con el cliente.</v-card-text>
                <v-card-text><strong>2. </strong> El cliente no se interesó en cumplir requísitos necesarios para el crédito.</v-card-text>
                <v-card-text><strong>3. </strong> No se seguió en comunicación con el cliente.</v-card-text>
                <v-card-text><strong>4. </strong> Cuando crees que realmente la venta no va ser exitosa.</v-card-text>
                <v-card-text><strong>5. </strong> Facturaión puede declinar la solicitud si no cumples con las tareas.</v-card-text>
                <v-card-text><strong>6. </strong> Sí tiene demasiado tiempo la solicitud y no se obtiene resultado.</v-card-text>
            </v-col>
        </v-row>
        <hr>
        <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="declinar" small dark>Declinar solicitud</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";

    export default {
        name: "declinar",
        computed:{
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Soli(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
        },
        methods:{
            declinar(){
                this.dialogo = false;
                this.$store.commit('tareas/cambiarValorVista', false);
                this.$store.commit('activarOverlay', true);
                this.$axios.put('solicitud_credito/declinar/'+this.Soli.id).then((res)=>{
                    this.$store.commit('tareas/cambiarValorVista', true);
                    this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: null});
                    this.notificacion('Se estan cargando nuevamente las solicitudes. Espera el cambio','warning');
                    this.notificacion('Se ha declinado la solicitud exitosamente','success');
                    this.$store.commit('activarOverlay', false);
                }).catch((error)=>{
                    this.dialogo = true;
                    this.$store.commit('activarOverlay', false);
                    this.notificacion('Error al declinar.','error');
                    this.$store.commit('tareas/cambiarValorVista', true);
                })
            },
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
        }
    }
</script>

<style scoped>

</style>
