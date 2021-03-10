<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Depreciación del Mobiliario</h6>
    </v-toolbar>
    <v-card flat>
      <v-simple-table dense class="rowsTable">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Detalle</th>
            <th>Referencia</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in JSON.parse(MOBILIARIO.referencias)">
            <td>{{i + 1}}</td>
            <td>{{item.detalle}}</td>
            <td>{{item.referecia}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "referencias",
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
