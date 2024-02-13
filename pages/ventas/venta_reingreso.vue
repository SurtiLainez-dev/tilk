<template>
<v-card flat>
  <v-card flat tile v-if="VISTA === 1">
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Artículos en Reingreso (Segunda Mano)</v-card-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar..." class="ma-3" v-model="search"></v-text-field>
    </v-toolbar>

    <v-data-table :search="search"
                  :loading="LOAD_REINGRESOS" loading-text="Cargando inventaio de segunda mano ..."
                  :headers="header" :items="REINGRESOS">
      <template v-slot:item.id="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn fab x-small text color="indigo" dark v-on="on" v-bind="attrs"><v-icon>fa fa-info</v-icon></v-btn>
          </template>
          <span>Ver información del precio</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn fab x-small text color="success" @click="goPrecio(item)" dark v-on="on" v-bind="attrs"><v-icon>fa fa-money-check</v-icon></v-btn>
          </template>
          <span>Proceder a solicitúd</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>

  <v-card flat tile v-else>
    <v-toolbar flat dense>
      <v-btn fab color="orange" small icon @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
<!--      <v-toolbar-title>{{REINGRESO.articulo.nombre_articulo}} - {{REINGRESO.serie_fabricante}}</v-toolbar-title>-->
    </v-toolbar>

    <solicitud_reingreso/>
  </v-card>
</v-card>
</template>

<script>
import solicitud_reingreso from "@/components/Ventas/solicitud_reingreso.vue";
export default {
  name: "venta_reingreso",
  components:{solicitud_reingreso},
  data(){
    return{
      int: Intl.NumberFormat(),
      search:'',
      inventario: [],
      load_inventario: false,
      articulo: {},
      header:[
        {text:'Sucursal',value:'suc'},
        {text:'Nombre',value:'articulo'},
        {text:'Marca',value:'marca'},
        {text:'Modelo',value:'modelo'},
        {text:'Serie Fabricante',value:'fab'},
        {text:'Acciones',value:'id'},
      ]
    }
  },
  created() {
    this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: 3, consulta: 1});
    this.VISTA = 1;
  },
  computed:{
    REINGRESOS:{
      get: function (){
        return this.$store.state.inventario.reingreso.REINGRESOS
      },
      set: function (data){
        this.$store.commit('inventario/reingreso/asignar_REINGRESO', data)
      }
    },
    LOAD_REINGRESOS(){
      return this.$store.state.inventario.reingreso.LOAD_REINGRESOS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.inventario.reingreso.VISTA;
      },
      set: function (vista){
        this.$store.commit('inventario/reingreso/cambiar_VISTA', vista);
      }
    }
  },
  methods:{
    goPrecio(data){
      this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: data.id, consulta: 2});
    }
  }
}
</script>

<style scoped>

</style>
