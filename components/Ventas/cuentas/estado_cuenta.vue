<template>
  <v-card>
    <v-simple-table height="500" fixed-header dense class="rowsTable pa-5">
      <template v-slot:default>
        <thead style="font-size: 13px !important;">
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Descripción</th>
          <th>Referencia</th>
          <th>Debito</th>
          <th>Crédito</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody style="font-size: 12px !important;" v-if="CUENTA.estado_cuenta">
        <tr v-for="(item, i) in JSON.parse(CUENTA.estado_cuenta)">
          <th>{{i+1}}</th>
          <td>{{item.fecha}}</td>
          <td>{{item.descripcion}}</td>
          <td>{{item.referencia}}</td>
          <td>L {{parseFloat(item.debito).toFixed(2)}}</td>
          <td>L {{parseFloat(item.credito).toFixed(2)}}</td>
          <td>L {{parseFloat(item.saldo).toFixed(2)}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "estado_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  },
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
