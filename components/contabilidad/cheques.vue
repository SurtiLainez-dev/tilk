<template>
  <v-card cla flat >
    <v-progress-linear v-if="LOADCHEQUES" indeterminate></v-progress-linear>
    <v-tabs v-if="VISTACHEQUES === 1" v-model="vista">
      <v-tab :key="0">Cheques Activos</v-tab>
      <v-tab :key="1">Cheques Usados</v-tab>
      <v-tab :key="2">Todos los Cheques</v-tab>
    </v-tabs>

    <v-tabs-items v-model="vista">
      <v-tab-item :key="0"><activos/></v-tab-item>
      <v-tab-item :key="1"><usados/></v-tab-item>
      <v-tab-item :key="2"><todos/></v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import activos from "./cheques/activos";
import usados from "./cheques/usados";
import todos from "./cheques/todos";
export default {
  name: "cheques",
  components:{
    activos,
    usados,
    todos
  },
  data(){
    return{
      vista: 0,
    }
  },
  computed:{
    VISTACHEQUES(){
      return this.$store.state.contabilidad.cheques.VISTACHEQUE;
    },
    LOADCHEQUES(){
      return this.$store.state.contabilidad.cheques.LOADCHEQUES;
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
  }
}
</script>

<style scoped>

</style>
