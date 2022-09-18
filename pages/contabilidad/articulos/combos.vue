<template>
  <v-card flat>
    <v-toolbar dense color="grey lighten-3">
      <v-btn fab x-small color="orange" dark text @click="go('Combos',1)" v-if="VISTA === 2">
        <v-icon>fa fa-arrow-left</v-icon>
      </v-btn>
      <v-card-title>{{TITULO}}</v-card-title>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-btn v-if="VISTA === 1" color="indigo" small tile dark @click="go('Combo Nuevo', 2)">Crear Combo</v-btn>
    </v-toolbar>

    <combo_nuevo v-if="VISTA === 2"/>
  </v-card>
</template>

<script>
import combo_nuevo from "@/components/Inventario/combo_nuevo";
export default {
  name: "combos",
  components:{
    combo_nuevo
  },
  created() {
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
    }
  },
  methods:{
    go(titulo, vista){
      this.VISTA  = vista;
      this.TITULO = titulo;
    }
  }
}
</script>

<style scoped>

</style>
