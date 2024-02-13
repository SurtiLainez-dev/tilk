<template>
    <v-card flat>
        <div v-if="vista === 1">
            <v-toolbar flat color="grey lighten-3" >
              <v-card-title>Solicitudes de Crédito</v-card-title>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-text-field dense label="Buscar... " @keyup.enter="buscarDatos" v-model="search"></v-text-field>
            </v-toolbar>
            <v-data-table :headers="header"
                          :search="search"
                          :items="Solicitudes"
                          dense
                          @click:row="SeleccionarSolicitud"
                          loading-text="Cargando nuevos datos"
                          :loading="loadSolicitudes"
                          class="rowsTable">
                <template v-slot:item.clN="{item}">
                    {{item.clN}} {{item.cliA}}
                </template>
                <template v-slot:item.colN="{item}">
                    {{item.colN}} {{item.colA}}
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
              search: '',
              header:[
                    {text:'Referencia', value: 'codigo'},
                    {text:'Nombre del cliente', value: 'clN'},
                    {text:'Artículo', value: 'articulo'},
                    {text:'Creado por', value: 'colN'},
                    {text:'Fecha creado', value: 'fecha_creado'},
                    {text:'Estado', value: 'estado'},
              ],
              vista: 1,
              fecha: '',
              FechaParseada: '',
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
          let date           = new Date();
          this.fecha         = date.getFullYear()+'-'+(date.getMonth() + 1)+'-01';
          this.FechaParseada = date.getFullYear()+'/'+(date.getMonth() + 1)+'/01';
          this.$store.commit('solicitud_credito/cargarSolicitudes', {tipo: 1, search: null, fecha: this.fecha});
        },
        methods:{
            buscarDatos(){
                this.$store.commit('solicitud_credito/cargarSolicitudes',{tipo: 2, search: this.search, fecha: this.fecha});
            },
            SeleccionarSolicitud(item){
                this.$store.commit('activarOverlay', true);
                this.$axios.get('solicitud_credito/'+item.id).then((res)=>{
                  this.$store.commit('solicitud_credito/datoSolicitud', res.data.solicitud);
                  this.vista     = 2;
                  this.$store.commit('activarOverlay', false);
                  this.$store.commit('notificacion',{texto:'Datos cargados exitosamente', color:'success'});
                }).catch((error)=>{
                  this.$store.commit('activarOverlay', false);
                  this.$store.commit('notificacion',{texto:'No se pudo cargar los datos', color:'warning'});
                })

            }
        }
    }
</script>

<style scoped>
    .rowsTable{
        cursor: pointer;
    }
</style>
