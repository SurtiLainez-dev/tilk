<template>
  <v-card flat>
    <v-toolbar dense color="grey lighten-4" flat>
      <v-card-title>Ordenes de Entrega Enlazadas a mi Usuario</v-card-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar ..." v-model="search"></v-text-field>

    </v-toolbar>
    <v-data-table :search="search" :loading="LOAD_ORDENES" loading-text="Cargando datos..."></v-data-table>

  </v-card>
</template>

<script>
export default {
  name: "ordenes",
  data(){
    return{
      search: ''
    }
  },
  created() {
    this.$store.commit('orden_genericas/cargar_MISORDENES')
  },
  computed:{
    ORDENES(){
      return this.$store.state.orden_genericas.MIS_ORDENES;
    },
    LOAD_ORDENES(){
      return this.$store.state.orden_genericas.LOAD_ORDENES;
    }
  }
}
</script>

<style scoped>

</style>
