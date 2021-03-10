<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Traslados en los que ha Estado el Mibiliario</h6>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-simple-table dense class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>#</th>
          <th>Código</th>
          <th>Sucursal de Origen</th>
          <th>Sucursal de Destino</th>
          <th>Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in MOBILIARIO.mob_cuerpo_traslados">
          <td>{{i + 1}}</td>
          <td>{{item.mob_traslado.cod}}</td>
          <td>{{item.mob_traslado.sucursal.nombre}}</td>
          <td>{{item.mob_traslado.destino.nombre}}</td>
          <td>
            <v-chip x-small dark color="orange" v-if="item.mob_traslado.estado === 1">Sin Entregar</v-chip>
            <v-chip x-small dark color="red" v-else-if="item.mob_traslado.estado === 2">Cancelada</v-chip>
            <v-chip x-small dark color="success" v-else-if="item.mob_traslado.estado === 3">Cancretada</v-chip>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "traslados",
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
