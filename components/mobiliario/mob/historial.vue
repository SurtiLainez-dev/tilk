<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Historial del Mobiliario</h6>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>#</th>
          <th>Usuario</th>
          <th>Fecha</th>
          <th>Detalle</th>
          <th>Referencia</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in JSON.parse(MOBILIARIO.historial)">
          <td>{{i + 1}}</td>
          <td>{{item.user}}</td>
          <td>{{item.fecha.split('-')[2]}}/{{item.fecha.split('-')[1]}}/{{item.fecha.split('-')[0]}}</td>
          <td>{{item.detale}}</td>
          <td>{{item.referencia}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "historial",
  computed:{
    MOBILIARIO(){
      return this.$store.state.mob.familias.MOBILIARIO;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
