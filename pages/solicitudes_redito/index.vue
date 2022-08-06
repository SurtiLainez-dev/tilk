<template>
    <v-card flat>
        <div v-if="vista === 1">
            <v-card-title class="grey lighten-3">Solicitudes de Crédito</v-card-title>
            <v-data-table :headers="header"
                          :items="Solicitudes"
                          dense
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
                    <v-chip v-else-if="item.estado === 5" x-small dark color="success">Aprobado y Vendido</v-chip>
                </template>
            </v-data-table>
        </div>
        <div v-if="vista === 2">
            <v-row no-gutters class="grey lighten-5">
                <v-col cols="1" class="d-flex align-center">
                    <v-btn class="ma-2" color="warning" x-small fab dark @click="vista = 1">
                        <v-icon>fa fa-arrow-left</v-icon></v-btn>
                </v-col>
                <v-col cols="11" class="d-flex justify-center">
                    <v-card-title>Solicitud</v-card-title>
                </v-col>
            </v-row>
            <solicitud/>
        </div>
    </v-card>
</template>

<script>
    import solicitud from "../../components/Ventas/solicitud/solicitud";
    export default {
        name: "index",
        components:{solicitud},
        data(){
            return{
                header:[
                    {text:'Referencia', value: 'codigo'},
                    {text:'Nombre del cliente', value: 'cliente.nombres'},
                    {text:'Artículo', value: 'articulo.descripcion_corta'},
                    {text:'Creado por', value: 'user.colaborador.nombres'},
                    {text:'Fecha creado', value: 'fecha_creado'},
                    {text:'Estado', value: 'estado'},
                ],
                vista: 1,
            }
        },
        computed:{
            loadSolicitudes(){
                return this.$store.state.solicitud_credito.loadSolicitudes;
            },
            Solicitudes(){
                return this.$store.state.solicitud_credito.Solicitudes;
            },
            Solicitud(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
        },
        created() {
            this.vista = 1;
            this.$store.commit('guardarTitulo', 'Facturación > Solicitudes de Crédito');
            this.$store.commit('solicitud_credito/cargarSolicitudes');
        },
        methods:{
            SeleccionarSolicitud(item){
                this.$store.commit('solicitud_credito/datoSolicitud', item);
                this.vista     = 2;
            }
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
</style>
