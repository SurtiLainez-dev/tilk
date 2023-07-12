<template>
    <v-row>
        <v-col cols="10" class="grey lighten-5">
            <v-card flat height="665px" style="overflow-y: auto">
                <inicio v-if="vista === 1"/>
                <cliente v-else-if="vista === 2"/>
                <articulo v-else-if="vista === 3"/>
                <precio v-else-if="vista === 4"/>
                <referencias v-else-if="vista === 5"/>
                <avales v-else-if="vista === 6"/>
                <comentarios v-else-if="vista === 7"/>
                <tareas v-else-if="vista === 8"/>
                <documento v-else-if="vista === 9"/>
                <registro :tipo="this.tipo" v-else-if="vista === 10"/>
                <declinar v-else-if="vista === 11"/>
                <venta v-else-if="vista === 12"/>
            </v-card>
        </v-col>
        <v-col cols="2" class="grey lighten-5">
            <v-row no-gutters>
                <v-col class="d-flex justify-center">
                    <small><strong>Solicitud de Crédito</strong></small>
                </v-col>
            </v-row >
            <v-divider></v-divider>
            <v-row no-gutters>
                <v-col class="d-flex justify-center">
                    <v-chip small color="orange" v-if="Soli.estado === 1">Pendiente</v-chip>
                    <v-chip small color="indigo" v-else-if="Soli.estado === 2">Falta Documentos</v-chip>
                    <v-chip small color="red" v-else-if="Soli.estado === 3">Rechazada</v-chip>
                    <v-chip small color="success" v-else-if="Soli.estado === 4">Aceptado</v-chip>
                    <v-chip small color="duccess" v-else-if="Soli.estado === 5">Aceptado / Venta</v-chip>
                </v-col>
            </v-row >
          <v-divider></v-divider>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed @click="vista = 1">
                        <v-icon left small>fa fa-tachometer-alt</v-icon>
                        Inicio
                    </v-btn>
                </v-col>
            </v-row >
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 2">
                        <v-icon small left>fa fa-user</v-icon>
                        Cliente
                    </v-btn>
                </v-col>
            </v-row >
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed @click="vista = 3">
                        <v-icon small left>fa fa-dolly-flatbed</v-icon>
                        Artículo
                    </v-btn>
                </v-col>
            </v-row >
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 4">
                        <v-icon small left>fa fa-tag</v-icon>
                        Precio
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 5">
                        <v-icon small left>fa fa-users</v-icon>
                        Referencias
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 6">
                        <v-icon small left>fa fa-user-friends</v-icon>
                        Avales
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 7">
                        <v-icon small left>fa fa-comments</v-icon>
                        Comentarios
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 8">
                        <v-icon small left>fa fa-tasks</v-icon>
                        Tareas
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" color="grey lighten-2"
                           block small depressed  @click="vista = 9">
                        <v-icon small left>fa fa-file-pdf</v-icon>
                        Documento
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" :disabled="EstadoVista"
                           color="grey lighten-2" block small depressed  @click="vista = 10">
                        <v-icon small color="success" left>fa fa-edit</v-icon>
                        Registrar
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" :disabled="EstadoVista"
                           color="grey lighten-2" block small depressed  @click="vista = 11">
                        <v-icon color="pink" small left>fa fa-times</v-icon>
                        Declinar
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col>
                    <v-btn class="ma-2" :disabled="!Venta"
                           color="grey lighten-2" block small depressed  @click="vista = 12">
                        <v-icon color="cyan accent-4" small left>fa fa-shopping-cart</v-icon>
                        Crear Venta
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters v-if="tipo === 1">
                <v-col>
                    <v-btn class="ma-2"
                           color="grey lighten-2" block small depressed
                           @click="$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', false)">
                        <v-icon color="deep-orange" small left>fa fa-sign-out-alt</v-icon>
                        Cerrar
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
    import {ipcRenderer} from "electron";
    import inicio from "./vendedor/inicio";
    import articulo from "./vendedor/articulo";
    import avales from "./vendedor/avales";
    import cliente from "./vendedor/cliente";
    import comentarios from "./vendedor/comentarios";
    import precio from "./vendedor/precio";
    import referencias from "./vendedor/referencias";
    import registro from "./vendedor/registro";
    import tareas from "./vendedor/tareas";
    import venta from "./vendedor/venta";
    import documento from "./vendedor/documento";
    import declinar from "./vendedor/declinar";
    export default {
        name: "vista_vendedor",
        components:{
            articulo,
            avales,
            cliente,
            comentarios,
            declinar,
            documento,
            inicio,
            precio,
            referencias,
            registro,
            tareas,
            venta,
        },
        computed:{
            vista:{
                get:function () {
                    return this.$store.state.solicitud_credito.vista;
                },
                set:function (vista) {
                    this.$store.commit('solicitud_credito/cambiarValorVistaVendedor', vista)
                }
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
            EstadoVista:{
                get: function () {
                    return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarEstadovistaSolicitud', val)
                }
            },
            Avales:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud.aval_solicituds;
                }
            },
        },
        props:{
            tipo:Number
        },
        data(){
            return{
                Venta: false,
                String_Estado: ''
            }
        },
        created(){

            this.Venta = this.Soli.estado === 4;
            this.$store.commit('solicitud_credito/agregadDetallesPrecios', JSON.parse(this.Soli.detalles_precio))

            let dataAval = null;
            this.$store.commit('solicitud_credito/agregarAvalesEstaticos', {tipo: 2});
            this.Avales.forEach( (i, cont) => {
                dataAval={
                    "nombres": i.cliente.nombres,
                    "apellidos": i.cliente.apellidos,
                    "sexo":      i.cliente.sexo,
                    "id":        i.cliente.id,
                    "archivos":  JSON.parse(i.cliente.archivos),
                    "key":       cont,
                    "identidad": i.cliente.identidad,
                    "tipo":      1,
                    "consultado": true,
                    "existe":     true,
                    "aval":       true
                };
                this.$store.commit('solicitud_credito/agregarAvalesEstaticos', dataAval,);
                dataAval= {}
            });
            this.vista = 1;
            if (this.Soli.estado === 3 || this.Soli.estado === 4 || this.Soli.estado === 1 || this.Soli.estado === 5)
                this.EstadoVista = true;
            else
                this.EstadoVista = false;
        },
    }
</script>

<style scoped>

</style>
