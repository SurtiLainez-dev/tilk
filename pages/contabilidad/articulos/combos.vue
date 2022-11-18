<template>
  <v-card flat>
    <v-toolbar color="grey lighten-3">
      <v-btn fab x-small color="orange" dark text @click="go('Combos',1)" v-if="VISTA > 1">
        <v-icon>fa fa-arrow-left</v-icon>
      </v-btn>
      <v-card-title>{{TITULO}}</v-card-title>
      <v-btn v-if="VISTA === 1" color="indigo" small tile dark @click="go('Combo Nuevo', 2)">Crear Combo</v-btn>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-text-field v-if="VISTA === 1" label="Buscar... " class="ma-2" dense v-model="search"></v-text-field>
    </v-toolbar>

    <v-card flat v-if="VISTA === 1">
      <v-data-table dense :headers="headers" :search="search" @click:row="goCombo"
                    :loading="LOADCOMBOS" :items="COMBOS">
        <template v-slot:item.precio_contado="{item}">L. {{int.format(item.precio_contado)}}</template>
        <template v-slot:item.fecha_final="{item}">
          {{item.fecha_final.split('-')[2]}}/{{item.fecha_final.split('-')[1]}}/{{item.fecha_final.split('-')[0]}}
        </template>
      </v-data-table>
    </v-card>

    <combo_nuevo v-else-if="VISTA === 2"/>
    <combo_index v-else-if="VISTA === 3"/>
  </v-card>
</template>

<script>
import combo_nuevo from "@/components/Inventario/combo_nuevo";
import combo_index from "@/components/Inventario/combos/combo_index";
export default {
  name: "combos",
  components:{
    combo_nuevo,
    combo_index
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      search: '',
      headers:[
        {text: 'Nombre del Combo', value:'nombre'},
        {text: 'Código', value:'codigo'},
        {text: 'Precio', value:'precio_contado'},
        {text: 'Fecha Final', value:'fecha_final'},
      ]
    }
  },
  created() {
    this.$store.commit('inventario/combos/cargar_COMBOS');
    this.$store.commit('guardarTitulo','Contabilidad > Combos');
    this.$store.commit('inventario/combos/cambiar_VISTA', 1);
  },
  computed:{
    TITULO:{
      get: function (){
        return this.$store.state.inventario.combos.TITULO;
      },
      set: function (titulo){
        this.$store.commit('inventario/combos/cambiar_TITULO', titulo);
      }
    },
    VISTA:{
      get: function (){
        return this.$store.state.inventario.combos.VISTA;
      },
      set: function (vista){
        this.$store.commit('inventario/combos/cambiar_VISTA', vista)
      }
    },
    LOADCOMBOS(){
      return this.$store.state.inventario.combos.LOAD_COMBOS
    },
    COMBOS(){
      return this.$store.state.inventario.combos.COMBOS;
    }
  },
  methods:{
    go(titulo, vista){
      this.VISTA  = vista;
      this.TITULO = titulo;
    },
    goCombo(val){
      this.$store.commit('inventario/combos/cargar_COMBO', val.id);
      this.TITULO = `Combo: ${val.nombre}`
      this.VISTA = 3;
    }
  }
}
</script>

<style scoped>

</style>
