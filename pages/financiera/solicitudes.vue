<template>
<v-card flat tile>
  <v-toolbar tile flat>
    <v-btn fab color="orange" text small v-if="VISTA === 2" @click="VISTA = 1" icon><v-icon>fa fa-arrow-left</v-icon></v-btn>
    <v-spacer v-if="VISTA === 2"></v-spacer>
    <v-card-title>{{titulo}}</v-card-title>
    <v-spacer v-if="VISTA === 1"></v-spacer>
    <v-spacer v-if="VISTA === 1"></v-spacer>
    <v-text-field v-if="VISTA === 1" dense label="Buscar ..." v-model="search"></v-text-field>
  </v-toolbar>

  <v-data-table :headers="header"
                dense
                :search="search"
                loading-text="Cargando nuevos datos"
                :items="SOLICITUDES"
                @click:row="SeleccionarSolicitud"
                :loading="LOADSOLICITUDES"
                class="rowsTable">
    <template v-slot:item.clN="{item}">
      {{item.clN}} {{item.clA}}
    </template>
    <template v-slot:item.colN="{item}">
      {{item.colN}} {{item.colA}}
    </template>

    <template v-slot:item.estado="{item}">
      <v-chip v-if="item.estado === 1" x-small dark color="warning">Pendiente</v-chip>
      <v-chip v-else-if="item.estado === 2" x-small dark color="indigo">Falta documentación</v-chip>
      <v-chip v-else-if="item.estado === 3" x-small dark color="red">Rechazado</v-chip>
      <v-chip v-else-if="item.estado === 4" x-small dark color="success">Aprobado</v-chip>
      <v-chip v-else-if="item.estado === 5" x-small dark color="green">Aprobado y Revisado</v-chip>
    </template>
  </v-data-table>

  <v-dialog v-model="dialogo" width="98%" v-if="dialogo">
    <v-card class="gray lighten-5">
      <v-card flat class="pl-5 pr-5 pb-3">
        <vista_vendedor :tipo="1"/>
      </v-card>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import vista_vendedor from "@/components/Ventas/solicitud/vista_vendedor.vue";
export default {
  name: "solicitudes",
  components:{vista_vendedor},
  created() {
    this.dialogo = false;
    this.VISTA   = 1;
    this.$store.commit('guardarTitulo','Solicitudes de Crédito');
    this.$store.commit('surticredito/surticredito/cargarSOLICITUDES', this.SUCURSAL);
  },
  computed:{
    SUCURSAL(){
      return this.$store.state.sucursal;
    },
    VISTA:{
      get(){
        return this.$store.state.surticredito.surticredito.VISTA;
      },
      set(val){
        this.$store.commit('surticredito/surticredito/cambiar_VISTA', val)
      }
    },
    SOLICITUDES(){
      return this.$store.state.surticredito.surticredito.SOLICITUDES;
    },
    LOADSOLICITUDES(){
      return this.$store.state.surticredito.surticredito.LOADSOLICITUDES;
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
    SeleccionarSolicitud(item){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('solicitud_credito/'+item.id).then((res)=>{
        this.$store.commit('solicitud_credito/datoSolicitud', res.data.solicitud);
        this.dialogo = true;
        this.$store.commit('activarOverlay', false);
      })
    }
  },
  data(){
    return{
      titulo: 'Solicitudes de Crédito',
      search: '',
      header:[
        {text:'Referencia', value: 'codigo'},
        {text:'Nombre del cliente', value: 'clN'},
        {text:'Creado por', value: 'colN'},
        {text:'Estado', value: 'estado'},
      ],
    }
  }
}
</script>

<style scoped>

</style>
