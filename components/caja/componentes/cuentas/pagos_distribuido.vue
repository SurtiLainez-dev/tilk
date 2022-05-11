<template>
<v-card flat>
  <v-simple-table dense height="250" class="rowsTable" >
    <template v-slot:default>
      <thead>
      <tr>
        <th>Tipo</th>
        <th>Descripción</th>
        <th>Pendiente</th>
        <th>Pagará</th>
        <th>Saldo</th>
        <th>Aún Hay</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in pagos">
        <td>{{item.tipo}}</td>
        <td>
          {{item.detalle}}
        </td>
        <td><strong>L. </strong>{{item.pendiente}}</td>
        <td><strong>L. </strong>{{item.pagara}}</td>
        <td><strong>L. </strong>{{item.saldo}}</td>
        <td><strong>L. </strong>{{item.hay}}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</v-card>
</template>

<script>

export default {
  name: "pagos_distribuido",
  props: {pagos: Array}
}
</script>

<style scoped>

</style>
