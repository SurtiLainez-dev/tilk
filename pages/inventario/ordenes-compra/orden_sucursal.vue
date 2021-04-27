<template>
<v-card>
  <v-toolbar color="grey lighten-3" flat>
    <h5>Ordenes de Comprar por Sucursal</h5>
    <v-spacer></v-spacer>
    <h6>{{suc}}</h6>
    <v-spacer></v-spacer>
    <v-text-field dense label="Buscar Orden" v-model="search"></v-text-field>
  </v-toolbar>
  <v-data-table :headers="header" :items="Ordenes" dense
                :loading="loadORdenes" loading-text="Cargando Ordenes"
                class="rowsTable" :search="search">
    <template v-slot:item.proveedor.nombre="{item}" >
      <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo"></v-avatar>
      <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
      {{item.proveedor.nombre}}
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip small v-if="item.estado ===1" color="success">Recibida</v-chip>
      <v-chip small v-else color="warning">Sin Acciones</v-chip>
    </template>
    <template v-slot:item.id="{item}">
      <v-btn tile x-small fab dark @click="verDocumento(item.file_sencillo)"
             color="indigo"><v-icon>fa fa-print</v-icon></v-btn>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "orden_sucursal",
  data(){
    return{
      search: '',
      loadORdenes: false,
      Ordenes:     [],
      header:[
        {text:'Código',value:'codigo'},
        {text:'Proveedor',value:'proveedor.nombre'},
        {text:'Usuario Creador',value:'user.usuario'},
        {text:'Sucursal Asignada',value:'sucursal.nombre'},
        {text:'Fecha Creación',value:'fecha_creacion'},
        {text:'Estado',value:'estado'},
        {text:'Documento',value:'id'},
      ]
    }
  },
  computed:{
    sucursal(){
      return this.$store.state.sucursal;
    },
    suc(){
      return this.$store.state.sucursal_id;
    }
  },
  created() {
    this.cargarOrdenes();
  },
  methods:{
    cargarOrdenes(){
      this.loadORdenes = true;
      this.$axios.get('ordenes_compra_x_sucursal/'+this.sucursal).then((res)=>{
        this.Ordenes     = res.data.ordenes;
        this.loadORdenes = false;
      });
    },
    verDocumento(URL){
      this.dialogoPartida = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
        this.dialogoPartida = true;
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
        this.dialogoPartida = true;

      })
    }
  }
}
</script>

<style scoped>

</style>
