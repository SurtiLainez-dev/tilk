<template>
<v-card flat tile>
  <v-card v-if="VISTA === 1" flat>
    <v-card  flat height="100" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Inventario de Reingreso</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn small text color="indigo" fab><v-icon small @click="$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: 3, consulta: 1})">fa fa-sync</v-icon></v-btn>
      </v-toolbar>

      <v-row no-gutters >
        <v-col cols="8"></v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-text-field v-model="serach" label="Buscar articulo ..."
                        append-outer-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table dense :loading="LOAD_REINGRESOS" :headers="header" :items="REINGRESOS" @click:row="goRemision"
                  loading-text="Cargando datos ..." :search="serach"></v-data-table>

  </v-card>

  <v-card flat tile v-else-if="VISTA === 2">
    <v-toolbar flat tile>
      <v-btn color="orange" dark fab small @click="VISTA = 1" icon><v-icon>fa fa-arrow-left</v-icon></v-btn>
    </v-toolbar>
    <venta_articulo_reingreso/>
  </v-card>
</v-card>
</template>

<script>
import {search} from "electron-db";
import venta_articulo_reingreso from "@/components/Ventas/venta_articulo_reingreso.vue";
export default {
  name: "articulos_reingreso",
  components:{venta_articulo_reingreso},
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
  created() {
    this.$store.commit('guardarTitulo','Inventario > Inventario de Reingreso');
    this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: 3, consulta: 1});
    this.VISTA = 1;
  },
  methods:{
    goRemision(val) {
      this.$store.commit('inventario/reingreso/cargar_REINGRESOS',{tipo: val.id, consulta: 2});
    }
  },
  data(){
    return{
      serach: '',
      header:[
        {text:'Estado', value:'estado'},
        {text:'Serie Sistema', value:'serie_sistema'},
        {text:'Serie Fabricante', value:'fab'},
        {text:'Sucursal', value:'suc'},
        {text:'Detalle', value:'articulo'},
        {text:'Marca', value:'marca'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
