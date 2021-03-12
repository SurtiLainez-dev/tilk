<template>
<v-card flat>
  <v-toolbar flat color="grey lighten-5">
    <h5>Mantenimientos del Mobiliario</h5>

  </v-toolbar>

  <v-simple-table dense class="rowsTable">
    <template v-slot:default>
      <thead>
      <tr>
        <th>#</th>
        <th>Código</th>
        <th>Responsable del Matenimiento</th>
        <th>Fecha Programada</th>
        <th>Estado</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in MOBILIARIO.mob_mantenimientos">
          <td>{{i+1}}</td>
          <td>{{item.cod}}</td>
          <td>{{item.colaborador.nombres+' '+item.colaborador.apellidos}}</td>
          <td>{{item.fecha_programada.split('-')[2]}}/{{item.fecha_programada.split('-')[1]}}/{{item.fecha_programada.split('-')[0]}}</td>
          <td>
            <v-chip x-small dark color="orange" v-if="item.estado === 1">Pendiente</v-chip>
            <v-chip x-small dark color="success" v-else-if="item.estado === 2">Realizado</v-chip>
            <v-chip x-small dark color="error" v-else-if="item.estado === 3">Vencida</v-chip>
            <v-chip x-small dark color="indigo" v-else-if="item.estado === 4">Cancelada</v-chip>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>
export default {
  name: "mantenimientos",
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
