<template>
<v-card>
<v-toolbar color="grey lighten-3" dense flat>
  <v-card-title>Motocicletas Pendiente Facturar</v-card-title>
  <v-spacer></v-spacer>
  <v-spacer></v-spacer>
  <v-spacer></v-spacer>
  <v-text-field dense label="Buscar ..." v-model="search"></v-text-field>
</v-toolbar>

  <v-data-table :headers="headers" dense :search="search" @click:row="solicitarClave"
                :loading="LOADMOTOS" :items="MOTOS"></v-data-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "motocicletas",
  created() {
    this.$store.commit('guardarTitulo','Notificar Motocicletas');
    this.$store.commit('inventario/moto/cargar_MOTOS');
  },
  data(){
    return{
      search: '',
      headers:[
        {text: 'Chasis', value:'chasis'},
        {text: 'Motor', value:'motor'},
        {text: 'Proveedor', value:'remision_articulo.articulo.marca.proveedor.nombre'},
        {text: 'Marca', value:'remision_articulo.articulo.marca.nombre'},
        {text: 'Modelo', value:'remision_articulo.articulo.modelo'},
        {text: 'Venta', value:'remision_articulo.factura_contado.venta.cod'},
      ]
    }
  },
  computed:{
    LOADMOTOS(){
      return this.$store.state.inventario.moto.LOAD_MOTOS;
    },
    MOTOS(){
      return this.$store.state.inventario.moto.MOTOS
    },
    user(){
      return this.$store.state.usuario;
    }
  },
  methods:{
    abrirNavegador(clave, item){
      let venta = item.remision_articulo.factura_contado.venta.cod;
      let url = this.$axios.defaults.baseURL+'documentos/notificacion_moto/usuario='+this.user+'&venta='+venta+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    solicitarClave(item){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
        this.abrirNavegador(res.data.clave, item);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
  }
}
</script>

<style scoped>

</style>
