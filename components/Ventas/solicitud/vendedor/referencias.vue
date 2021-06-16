<template>
    <v-card :disabled="EstadoVista" class="pr-5 pl-5 pb-2 pt-2" flat>
        <v-row no-gutters>
            <v-col cols="11"><h5>Referencias</h5></v-col>
            <v-col cols="1" class="d-flex justify-end">
                <v-btn @click="addReferencia" fab color="success" x-small dark>
                    <v-icon small>fa fa-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <hr>
        <v-alert type="warning" dismissible dense>
            Para borrar una referencia, presiona dos veces el cuadro al que pertenece.</v-alert>
        <v-row no-gutters>
            <v-col v-for="item in Referencias_d" cols="4" sm="3">
                <v-card height="145px" width="150px" @dblclick="removeReferencia(item)"
                        flat class="grey lighten-4 ma-1 rowsTable" @click="Ref = item">
                    <v-row no-gutters><v-col class="d-flex justify-center ma-2"><h6 class="text-center"><strong>{{item.nombre}}</strong></h6></v-col></v-row>
                    <v-row no-gutters><v-col class="d-flex justify-center ma-2"><h6 class="text-center"><small>{{item.parentesco}}</small></h6></v-col></v-row>
                    <v-row no-gutters><v-col class="d-flex justify-center ma-2">
                        <v-chip v-if="item.estado" color="success" x-small dark>Aceptada</v-chip>
                        <v-chip v-else color="red" x-small dark>Rechazado</v-chip>
                    </v-col></v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <div v-if="Ref">
            <small>Datos de la Referencia</small>
            <v-card flat color="grey lighten-4">
                <table class="rowsTable ma-2">
                    <tbody>
                    <tr>
                        <th>Nombre:</th>
                        <td>
                            <input v-model="Ref.nombre" type="text" @keyup.enter="$refs.campoParentescoReferencias.focus()">
                        </td>
                    </tr>
                    <tr>
                        <th>Parentesco:</th>
                        <td>
                            <input ref="campoParentescoReferencias"  @keyup.enter="$refs.campoTelefonoReferencias.focus()"
                                   v-model="Ref.parentesco" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Telefono:</th>
                        <td>
                            <input v-model="Ref.telefono"  @keyup.enter="$refs.campoDireccionReferencias.focus()"
                                   type="text" ref="campoTelefonoReferencias">
                        </td>
                    </tr>
                    <tr>
                        <th>Dirección:</th>
                        <td>
                            <input v-model="Ref.direccion" ref="campoDireccionReferencias" type="text">
                        </td>
                    </tr>
                    <tr>
                        <th>Comentario:</th>
                        <td>
                            <input v-model="Ref.comentario" disabled type="text">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </v-card>
        </div>
        <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark class="ma-2" @click="registrarReferencias" small>Actualizar cambios</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Vue from "vue";

    export default {
        name: "referencias",
        computed:{
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            Referencias:{
                get:function () {
                    return JSON.parse(this.$store.state.solicitud_credito.Solicitud.referencias);
                }
            },
            Soli:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud;
                }
            },
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
          View_Tarea: {
            get: function () {
              return this.$store.state.tareas.Tareas_view;
            },
            set: function (val) {
              this.$store.commit('tareas/cambiarValorVista', val)
            }
          },
        },
        data(){
            return{
                Referencias_d: [],
                Ref:[],
                longReferencias: 0
            }
        },
        created() {
            this.Referencias_d = this.Referencias;
            this.longReferencias = this.Referencias.length - 1;
        },
        methods:{
            addReferencia(){
                this.Referencias_d.push({
                    "comentario": '',
                    "direccion": '',
                    "estado": false,
                    "key": this.Referencias.length,
                    "nombre": 'Sin nombre',
                    "parentesco": 'nada',
                    "telefono": ''
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
            removeReferencia(item){
                let cont = 0;
                if (item.key > this.longReferencias) {
                    this.Referencias.splice(item.key, 1);
                    this.Referencias.forEach((i) => {
                        i.key = cont;
                        cont++;
                    })
                }
            },
            registrarReferencias(){
                this.dialogo = false;
                this.View_Tarea = false;
                this.$store.commit('activarOverlay', true);
                this.$axios.put('solicitud_credito/referencias/'+this.Soli.id,{
                    referencias: JSON.stringify(this.Referencias_d)
                }).then((res)=>{
                    this.$store.commit('solicitud_credito/asignarDetallesSolicitus', JSON.stringify(this.Referencias_d));
                    this.Referencias_d = this.Referencias;
                    this.dialogo = true;
                    this.$store.commit('activarOverlay', false);
                    this.View_Tarea = true;
                    this.notificacion('Actualización de referencias exitosa','success')
                }).catch((error)=>{
                    this.dialogo = true;
                    this.View_Tarea = true;
                    this.$store.commit('activarOverlay', error);
                    this.notificacion('Error en la actualización de referencias exitosa','error')
                })
            }
        }
    }
</script>

<style scoped>
.rowsTable{
    cursor: pointer;
}
table{
    width: 98%;
}
table tbody{
    font-size: 12px;
}
table tbody tr td input[type=text], select{
    width: 100%;
    box-sizing: border-box;
    padding: 2px 10px;
    margin: 1px;
    border: 1px solid #ccc;
    border-radius: 1px;
    cursor: pointer;
}
table tbody tr td input:hover{
    background-color: #FFF !important;
}
table tbody tr:hover{
    background-color: #F4F4F4;
}
table thead{
    border-bottom: solid 1px #47494e;
}
</style>
