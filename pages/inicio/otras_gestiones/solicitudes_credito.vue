<template>
    <v-card>
        <v-row no-gutters class="grey lighten-3">
            <v-col cols="9">
                <v-card-title>Solicitudes de Crédito</v-card-title>
            </v-col>
            <v-col cols="3" class="d-flex align-center">
                <v-text-field class="ma-1" single-line hide-details
                              label="Buscar solicitud" dense v-model="search"></v-text-field>
            </v-col>
        </v-row>
        <v-data-table :headers="header"
                      :items="Solicitudes"
                      dense
                      :search="search"
                      @click:row="SeleccionarSolicitud"
                      loading-text="Cargando nuevos datos"
                      :loading="loadSolicitudes"
                      class="rowsTable">
            <template v-slot:item.cliente.nombres="{item}">
                {{item.cliente.nombres}} {{item.cliente.apellidos}}
            </template>
            <template v-slot:item.user.colaborador.nombres="{item}">
                {{item.user.colaborador.nombres}} {{item.user.colaborador.apellidos}}
            </template>
            <template v-slot:item.fecha_creado="{item}">
                {{item.fecha_creado.split('-')[2]}}/{{item.fecha_creado.split('-')[1]}}/{{item.fecha_creado.split('-')[0]}}
            </template>
            <template v-slot:item.estado="{item}">
                <v-chip v-if="item.estado === 1" x-small dark color="warning">Pendiente</v-chip>
                <v-chip v-else-if="item.estado === 2" x-small dark color="indigo">Falta documentación</v-chip>
                <v-chip v-else-if="item.estado === 3" x-small dark color="red">Rechazado</v-chip>
                <v-chip v-else-if="item.estado === 4" x-small dark color="success">Aprobado</v-chip>
                <v-chip v-else-if="item.estado === 5" x-small dark color="green">Aprobado y Revisado</v-chip>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogo" width="70%" v-if="dialogo">
            <v-card class="gray lighten-5">
                <v-card flat class="pl-5 pr-5 pb-3">
                    <vista_vendedor :tipo="1"/>
                </v-card>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import vista_vendedor from "../../../components/Ventas/solicitud/vista_vendedor";
    export default {
        components:{vista_vendedor},
        name: "solicitudes_credito",
        created() {
            this.$store.commit('guardarTitulo', 'Inicio > Otras Gestiones > Solicitudes de Crédito');
            this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null});
        },
        data(){
            return{
                search: '',
                header:[
                    {text:'Referencia', value: 'codigo'},
                    {text:'Nombre del cliente', value: 'cliente.nombres'},
                    {text:'Artículo', value: 'articulo.descripcion_corta'},
                    {text:'Creado por', value: 'user.colaborador.nombres'},
                    {text:'Fecha creado', value: 'fecha_creado'},
                    {text:'Estado', value: 'estado'},
                ],
            }
        },
        computed:{
            EstadoVista:{
                get: function () {
                    return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarEstadovistaSolicitud', val)
                }
            },
            vista:{
                get:function () {
                    return this.$store.state.solicitud_credito.vista;
                },
                set:function (vista) {
                    this.$store.commit('solicitud_credito/cambiarValorVistaVendedor', vista)
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
            loadSolicitudes(){
                return this.$store.state.solicitud_credito.loadSolicitudes;
            },
            Solicitudes(){
                return this.$store.state.solicitud_credito.Solicitudes;
            },
            Solicitud(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
            Avales:{
                get:function () {
                    return this.$store.state.solicitud_credito.Solicitud.aval_solicituds;
                }
            },
        },
        methods:{
            SeleccionarSolicitud(item){
                this.$store.commit('solicitud_credito/datoSolicitud', item);
                this.dialogo = true;
                console.log(this.$store.state.solicitud_credito.Solicitud)
            }
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
</style>
