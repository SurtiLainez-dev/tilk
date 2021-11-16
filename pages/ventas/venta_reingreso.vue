<template>
<v-card flat>
  <v-toolbar flat color="grey lighten-3">
    <v-card-title>Artículos en Reingreso (Segunda Mano)</v-card-title>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-text-field dense label="Buscar..." class="ma-3" v-model="search"></v-text-field>
  </v-toolbar>

  <v-data-table :search="search" :loading="load_inventario" loading-text="Cargando inventaio de segunda mano ..."
                :headers="header" :items="inventario">
    <template v-slot:item.id="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn fab x-small text color="indigo" dark v-on="on" v-bind="attrs"><v-icon>fa fa-info</v-icon></v-btn>
        </template>
        <span>Ver información del precio</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn fab x-small text color="success" dark v-on="on" v-bind="attrs"><v-icon>fa fa-money-check</v-icon></v-btn>
        </template>
        <span>Proceder a solicitúd</span>
      </v-tooltip>
    </template>
    <template v-slot:item.sucursal.abreviatura="{item}">
      <v-tooltip left>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.sucursal.abreviatura}}</span>
        </template>
        <span>{{item.sucursal.nombre}}</span>
      </v-tooltip>
    </template>
    <template v-slot:item.precio_actual="{item}">L {{int.format(item.precio_actual)}}</template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "venta_reingreso",
  data(){
    return{
      int: Intl.NumberFormat(),
      search:'',
      inventario: [],
      load_inventario: false,
      articulo: {},
      header:[
        {text:'Sucursal',value:'sucursal.abreviatura'},
        {text:'Nombre',value:'articulo.nombre_articulo'},
        {text:'Marca',value:'articulo.marca.nombre'},
        {text:'Modelo',value:'articulo.modelo'},
        {text:'Serie Fabricante',value:'serie_fabricante'},
        {text:'Serie Sístema',value:'serie_sistema'},
        {text:'Precio de Contado',value:'precio_actual'},
        {text:'Acciones',value:'id'},
      ]
    }
  },
  created() {
    this.cargar_inventario();
  },
  methods:{
    cargar_inventario(){
      this.load_inventario = true;
      this.$axios.get('/2.0/inventario_reingreso/tipo/3').then((res)=>{
        this.inventario = res.data.inventario;
        this.load_inventario = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
