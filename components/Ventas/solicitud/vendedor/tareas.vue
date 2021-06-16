<template>
    <v-card :disabled="EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Tareas</h5>
        <hr>
        <div style="height: 500px; overflow-y: auto">
            <v-row class="ma-1" no-gutters v-for="item in data_Tareas">
                <v-col>
                    <v-card>
                        <v-row no-gutters>
                            <v-col cols="11" class="d-flex align-center"><v-card-title>{{item.detalle}}</v-card-title></v-col>
                            <v-col cols="1" class="d-flex align-center">
                                <b-checkbox v-model="item.estado"></b-checkbox>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="enviarTareas" small dark>Guardar estado de tareas</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";

    export default {
        name: "tareas",
        data(){
            return{
                data_Tareas: []
            }
        },
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
            Tareas:{
                get: function () {
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.tareas);
                },
                set: function (data) {
                    this.$store.commit('solicitud_credito/agregarTareas', data)
                }
            }
        },
        created() {
            this.data_Tareas = this.Tareas;
        },
        methods:{
            enviarTareas(){
                let bandera = 0;
                this.data_Tareas.forEach( (i)=>{
                    if (i.estado) {
                        i.ingresado = true;
                        bandera++;
                    }
                });
                if (bandera > 0){
                    this.dialogo = false;
                    this.$store.commit('activarOverlay', true);
                    this.$store.commit('tareas/cambiarValorVista', false);
                    this.$axios.put('solicitud_credito/tareas/'+this.Soli.id,{
                        tareas: JSON.stringify(this.data_Tareas)
                    }).then((res)=>{
                        this.$store.commit('tareas/cambiarValorVista', true);
                        this.notificacion('Se han actualizados las tareas.','success');
                        console.log(this.Soli.tareas);
                        this.Tareas  = JSON.stringify(this.data_Tareas);
                        this.dialogo = true;
                        console.log(this.Soli.tareas);
                        this.$store.commit('activarOverlay', false);
                    }).catch((error)=>{
                        this.notificacion('Error al actualizar tareas.','error');
                        this.dialogo = true;
                        this.$store.commit('activarOverlay', false);
                        this.$store.commit('tareas/cambiarValorVista', true);
                    })
                }else{
                    this.notificacion('No hay tareas disponibles para enviar.','error');
                }
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
