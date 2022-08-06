<template>
<v-card flat>

  <v-container>
    <table>
      <thead>
      <tr>
        <th>Detalle del pago</th>
        <th>Pago inicial</th>
        <th>Total a pagar</th>
        <th>Total abonado</th>
        <th>Saldo actual</th>
        <th>Mora</th>
        <th>Total de mora</th>
        <th>Inicio de mora</th>
        <th>Fecha de pago</th>
        <th>Estado</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in PAGOS" class="rowsTable">
        <td>{{item.detalle}}</td>
        <td>L {{int.format(item.pago_inicial,2)}}</td>
        <td>L {{int.format(item.total_pago,2)}}</td>
        <td>L {{int.format(item.total_abonado,2)}}</td>
        <td>L {{int.format(item.saldo_actual,2)}}</td>
        <td style="text-align: center">
          <v-badge v-if="item.is_mora === 1" dot color="red"></v-badge>
          <v-badge v-else dot color="green"></v-badge>
        </td>
        <td>L {{int.format(item.mora,2)}}</td>
        <td v-if="item.inicio_mora">
          {{item.inicio_mora.split('-')[2]}}/{{item.inicio_mora.split('-')[1]}}/{{item.inicio_mora.split('-')[0]}}
        </td>
        <td v-else>No hay</td>
        <td>
          {{item.fecha_pago.split('-')[2]}}/{{item.fecha_pago.split('-')[1]}}/{{item.fecha_pago.split('-')[0]}}
        </td>
        <td style="text-align: center">
          <v-badge v-if="item.estado === 1" dot color="orange"></v-badge>
          <v-badge v-else-if="item.estado === 2" dot color="red"></v-badge>
          <v-badge v-else-if="item.estado === 3" dot color="green"></v-badge>
        </td>
      </tr>
      <tr>
        <td></td>
        <td style="border-top: 1px solid">L. {{int.format(total_inicial,2)}}</td>
        <td style="border-top: 1px solid">L. {{int.format(total_pago,2)}}</td>
        <td style="border-top: 1px solid">L. {{int.format(total_abonado,2)}}</td>
        <td style="border-top: 1px solid">L. {{int.format(total_saldo_actual,2)}}</td>
        <td></td>
        <td style="border-top: 1px solid">L. {{int.format(total_mora,2)}}</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="10" class="text-center">----- Fín -----</td>
      </tr>
      <tr><td colspan="10">*Los pagos agregados no aparecen esta tabla</td></tr>
      </tbody>
    </table>
  </v-container>

</v-card>
</template>

<script>
export default {
  name: "pagos_cuenta",
  data(){
    return{
      currentPage: 1,
      totalRows: 1,
      perPage:10,
      header:[
        'venta_id',
        {key: 'detalle',stickyColumn: true, isRowHeader: true, variant: 'light'},
        'pago_inicial',
        'total_pago',
        'total_abonado',
        'saldo_actual',
        'is_mora',
        'mora',
        'inicio_mora',
        'fecha_pago',
        'estado',
        'saldo_antes',
        'saldo_despues',
      ],
      int: Intl.NumberFormat()
    }
  },
  created() {
    this.totalRows = this.PAGOS.length;
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    PAGOS(){
      return this.$store.state.cuentas.CUENTA.pagos_contratos;
    },
    total_saldo_actual(){
      if (this.PAGOS)
        return this.PAGOS.reduce((num1, num2)=> num1 + parseFloat(num2.saldo_actual), 0);
      else return 0;
    },
    total_mora(){
      if (this.PAGOS)
        return this.PAGOS.reduce((num1, num2)=> num1 + parseFloat(num2.mora), 0);
      else return 0;
    },
    total_inicial(){
      if (this.PAGOS)
        return this.PAGOS.reduce((num1, num2)=> num1 + parseFloat(num2.pago_inicial), 0);
      else return 0;
    },
    total_pago(){
      if (this.PAGOS)
        return this.PAGOS.reduce((num1, num2)=> num1 + parseFloat(num2.total_pago), 0);
      else return 0;
    },
    total_abonado(){
      if (this.PAGOS)
        return this.PAGOS.reduce((num1, num2)=> num1 + parseFloat(num2.total_abonado), 0);
      else return 0;
    }
  }
}
</script>

<style scoped>
table{
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 2px;
}
table thead{
  background: #e8e5e5;
}
table thead tr th{
  font-size: 12px;
}
table tbody tr td{
  font-size: 11px;
}
table tbody tr td:nth-child(even){
  background-color: #f2f2f2;
}
table tbody tr:hover{
  background: #f2f2f2;
  border: 1px solid;
  cursor: pointer;
}
</style>
