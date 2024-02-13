<template>
  <v-card v-if="VISTA === 1">
    <v-toolbar flat color="grey lighten-3">
      <h6>Inventario de Reingreso</h6>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar" v-model="search" dense></v-text-field>
    </v-toolbar>
    <v-data-table dense :loading="LOAD_REINGRESOS" :headers="header" :items="REINGRESOS"
                  loading-text="Cargando datos ..." :search="search" @click:row="go"></v-data-table>
  </v-card>

  <v-card v-else-if="VISTA === 2">
    <v-toolbar dense color="grey lighten-3" flat>
      <v-btn fab x-small color="orange" @click="VISTA = 1" dark><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h6>{{REINGRESO.articulo.descripcion_corta}} - {{REINGRESO.articulo.modelo}} - {{REINGRESO.serie_sistema}}</h6>
    </v-toolbar>
    <precio_reingreso/>
  </v-card>
</template>

<script>
import precio_reingreso from "@/components/contabilidad/precio_reingreso";
export default {
  name: "reingreso",
  components:{
    precio_reingreso
  },
  data(){
    return{
      search: '',
      header:[
        {text:'Estado', value:'estado'},
        {text:'Serie Sistema', value:'serie_sistema'},
        {text:'Serie Fabricante', value:'fab'},
        {text:'Sucursal', value:'suc'},
        {text:'Detalle', value:'articulo'},
        {text:'Marca', value:'marca'},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Precio > Inventario de Reingreso');
    this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: 3, consulta: 1});
    this.VISTA = 1;
  },
  computed:{
    REINGRESO(){
      return this.$store.state.inventario.reingreso.REINGRESO;
    },
    REINGRESOS(){
      return this.$store.state.inventario.reingreso.REINGRESOS;
    },
    LOAD_REINGRESOS(){
      return this.$store.state.inventario.reingreso.LOAD_REINGRESOS;
    },
    VISTA:{
      get: function () {
        return this.$store.state.inventario.reingreso.VISTA;
      },
      set: function (val){
        this.$store.commit('inventario/reingreso/cambiar_VISTA', val);
      }
    }
  },
  methods:{
    go(data){
      this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: data.id, consulta: 2});
    }
  }

}
</script>

<style scoped>

</style>
