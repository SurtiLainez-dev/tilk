<template>
  <v-card flat>
    <v-toolbar  flat color="grey lighten-4">
      <v-icon>fa fa-chart-bar</v-icon>
      <v-card-title>Saldos por Segmentos</v-card-title>
    </v-toolbar>
    <v-card-subtitle>Seleccionar datos para el reporte</v-card-subtitle>
    <v-toolbar flat>
      <div class="d-flex align-center">
        <v-select class="ma-2" dense label="Seleccionar Año"></v-select>
        <v-autocomplete class="ma-2" dense label="Seleccionar Sucursal"></v-autocomplete>
      </div>
    </v-toolbar>
    <v-divider></v-divider>
  </v-card>
</template>

<script>
export default {
  name: "segmentos",
  created() {
    this.$store.commit('guardarTitulo','Reportes > Cobros > Saldos por Segementos')
  }
}
</script>

<style scoped>

</style>
