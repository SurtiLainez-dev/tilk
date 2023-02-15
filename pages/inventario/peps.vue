<template>
<v-card>
  <v-toolbar flat dense class="grey lighten-3"><h6>Entrada y Salida de Artículos</h6></v-toolbar>
  <v-toolbar flat dense class="d-flex justify-end">
    <v-text-field label="Buscar ..." v-model="search"></v-text-field>
  </v-toolbar>

  <v-data-table dense :headers="header" :items-per-page="25" :search="search"
                :items="INVENTARIO" class="cursor" :loading="LOAD_INVENTARIO"
                loading-text="Cargando inventario ..." @click:row="capturarArticulo"></v-data-table>

  <v-dialog width="100%" v-model="DIALOGO">
    <v-card height="90vh">
      <v-toolbar>
        <div class="d-flex justify-center">
          <v-card-title>Información {{ARTICULO.nombre_articulo}}</v-card-title>
        </div>
        <v-spacer></v-spacer>
        <div class="d-flex justify-end">
          <v-btn fab color="red" x-small dark @click="cerrarDialogo"><v-icon>fa fa-times</v-icon></v-btn>
        </div>

        <template v-slot:extension>
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab :key="0">Información General</v-tab>
            <v-tab  :key="1">Inventario Disponible</v-tab>
            <v-tab  :key="2">Entradas-Salidas</v-tab>
            <v-tab  :key="3">Ordenes de Entrada</v-tab>
            <v-tab  :key="4">Fotos</v-tab>
            <v-tab  :key="5">Ventas</v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <v-tabs-items v-model="tab" >
        <v-tab-item :key="0" >1</v-tab-item>
        <v-tab-item :key="1" ><stock/></v-tab-item>
        <v-tab-item :key="2" ><entradas_salidas/></v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import info from "@/components/Inventario/info";
import entradas_salidas from "@/components/Inventario/info/entradas_salidas";
import stock from "@/components/Inventario/info/stock";
export default {
  components:{info, entradas_salidas, stock},
  name: "peps",
  data(){
    return{
      tab: 0,
      search: '',
      header:[
        {text:'Artículo', value:'nombre_articulo'},
        {text:'Cod. Sistema', value:'codigo_sistema'},
        {text:'Cod. Proveedor', value:'codigo_proveedor'},
        {text:'Módelo', value:'modelo'},
        {text:'Marca', value:'marca.nombre'},
        {text:'Proveedor', value:'marca.proveedor.nombre'},
        {text:'Referencia 1', value:'codigo_barras'},
        {text:'Referencia 2', value:'referencia_fabricante'},
      ]
    }
  },
  computed:{
    LOAD_INVENTARIO(){
      return this.$store.state.inventario.inventario.LOAD_INVENTARIO;
    },
    INVENTARIO(){
      return this.$store.state.inventario.inventario.INVENTARIO;
    },
    DIALOGO:{
      get: function (){
        return this.$store.state.inventario.inventario.DIALOGOINFO;
      },
      set: function (val){
        this.$store.commit('inventario/inventario/estado_DIALOGOINFO', val);
      }
    },
    ARTICULO(){
      return this.$store.state.inventario.inventario.ARTICULO;
    }
  },
  created() {
    this.$store.commit('inventario/inventario/cargartodo_INVENTARIO');
  },
  methods:{
    capturarArticulo(data){
      this.$store.commit('inventario/inventario/asignar_ARTICULO', data);
      this.DIALOGO = true;
      this.$store.commit('inventario/inventario/cargar_PEPS');
      this.$store.commit('inventario/inventario/cargar_STOCK');
    },
    cerrarDialogo() {
      this.DIALOGO = false;
      this.tab     = 0;
      this.$store.state.inventario.inventario.PEPS = [];
    }
  }
}
</script>

<style scoped>
.cursor{
  cursor: pointer;
}
</style>
