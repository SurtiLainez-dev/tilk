<template>
    <v-card :disabled="EstadoVista" class="pr-5 pl-5 pb-2 pt-2" flat>
        <h5>Registro de solicitud</h5>
        <hr>
        <div style="height: 510px; overflow-y: auto" class="pr-5 pl-5">
            <v-row >
                <v-col cols="1" class="pt-10">
                    <v-icon color="success" size="50">fa fa-check-circle</v-icon>
                </v-col>
                <v-col cols="11">
                    <v-card-text>Si ya se cumplió las tareas pendientes asignadas por facturación puedes
                        registrar la solicitud de crédito nuevamente. Recuerda que sino cumples con las
                        tareas de facturación tu solictud puede ser que se rechace. Recuerda revisar los datos
                        nuevamente para verificar que la información que envias es la correcta. </v-card-text>
                    <v-card-text >Tienes que seleccionar el usuario que va a revisar la solicitud.</v-card-text>
                </v-col>
            </v-row>
            <v-autocomplete dense v-model="usuario"
                            :items="Colaboradores" :loading="isPeticion"
                            :item-text="'nombre'" :item-value="'id'"
                            label="Seleccionar usuario"></v-autocomplete>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="registrarSolicitud" small dark>Registrar Solicitud</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";

    export default {
        name: "registro",
        props:{tipo: Number},
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
        data(){
            return{
                isPeticion: false,
                Colaboradores: [],
                usuario:''
            }
        },
        created() {
            this.cargarColaboradores();
        },
        methods:{
            cargarColaboradores(){
                this.isPeticion = true;
                this.$axios.get('/colaboradores_2').then((res)=>{
                    this.isPeticion = false;
                    if (res.status === 200){
                        this.Colaboradores= [];
                        res.data.colaboradores.forEach( (i) => {
                            if (i.usuarios){
                                this.Colaboradores.push({
                                    "nombre": i.nombres+' '+i.apellidos,
                                    "id":  i.usuarios.id
                                });
                            }
                        });
                    }
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
            registrarSolicitud(){
                if (this.usuario){
                    this.dialogo = false;
                    this.$store.commit('activarOverlay', true);
                    this.$axios.put('solicitud_credito/registrar/'+this.Soli.id,{
                        usuario: this.usuario
                    }).then((res)=>{
                        this.$store.commit('activarOverlay', false);
                        this.notificacion('La solicitud se registro exitosamente.','success')
                    }).catch((error)=>{
                        this.dialogo = true;
                        this.$store.commit('activarOverlay', false);
                        this.notificacion('Hubo un error al registrar la solicitud.','error')
                    });
                    if (this.tipo === 2)
                        this.$store.commit('tareas/cargarTareas');
                }else{
                    this.notificacion('Tienes que seleccionar un usuario.','error')
                }
            }
        }
    }
</script>

<style scoped>

</style>
