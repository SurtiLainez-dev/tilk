<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Rebaja Manual de Inventario</v-card-title>
    </v-toolbar>
    <v-row no-gutters>
      <v-col class="d-flex justify-end">
        <v-btn color="indigo" tile small dark @click="dialogoBuscar = true" class="ma-2">Buscar Artículo</v-btn>
      </v-col>
    </v-row>
    <v-card-text>Este modulo del sistema solo se utilizará en el periodo de prueba del sistema</v-card-text>
    <v-divider></v-divider>

    <v-card flat v-if="load">

    </v-card>

    <v-dialog v-model="dialogoBuscar" width="100%">
      <v-card class="pa-5">
        <v-toolbar flat>
          <v-card-title>Inventario</v-card-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field label="Buscar ..." dense v-model="search"></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table :loading="isPeticon" @click:row="seleccionarArticulo"
                      loading-text="Cargando artículos... por favor espere un momento"
                      :headers="header" :items="Inventario" :search="search" class="rowsTable">
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "salida_manual",
  data(){
    return{
      load: false,
      dialogoBuscar: false,
      search: '',
      header:[
        {text:'Marcá',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      articulo: []
    }
  },
  computed:{
    isPeticon(){
      return this.$store.state.LOAD_ARTICULOS_EDIT;
    },
    Inventario(){
      return this.$store.state.ARTICULOS_EDIT;
    },
  },
  created() {
    this.$store.commit('cargar_ARTICULOS_EDIT');
    this.$store.commit('guardarTitulo', 'Inventario > Artículo > Salida Manual');
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    seleccionarArticulo(item) {
      this.articulo = [];
      this.articulo.push(item)
      this.dialogoBuscar = false;
    }
  }
}
</script>

<style scoped>

</style>
