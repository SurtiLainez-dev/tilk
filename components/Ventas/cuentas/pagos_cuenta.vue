<template>
<v-card flat>
  <b-table responsive small
           class="rowsTable"
           :current-page="currentPage"
           :per-page="perPage"
           :fields="header"
           :items="PAGOS"
           hover>
    <template v-slot:head(venta_id)><div class="text-nowrap">Venta</div></template>
    <template v-slot:head(pago_inicial)><div class="text-nowrap">Pago Inicial</div></template>
    <template v-slot:head(total_pago)><div class="text-nowrap">Total a Pagar</div></template>
    <template v-slot:head(total_abonado)><div class="text-nowrap">Total Abonado</div></template>
    <template v-slot:head(saldo_actual)><div class="text-nowrap">Saldo Actual</div></template>
    <template v-slot:head(detalle)><div class="text-nowrap">Detalle del Pago</div></template>
    <template v-slot:head(is_mora)><div class="text-nowrap">Mora</div></template>
    <template v-slot:head(mora)><div class="text-nowrap">Total de Mora</div></template>
    <template v-slot:head(inicio_mora)><div class="text-nowrap">Inicio de Mora</div></template>
    <template v-slot:head(fecha_pago)><div class="text-nowrap">Fecha de Pago</div></template>
    <template v-slot:head(estado)><div class="text-nowrap">Estado del Pago</div></template>
    <template v-slot:head(saldo_antes)><div class="text-nowrap">Saldo Antes (Capital)</div></template>
    <template v-slot:head(saldo_despues)><div class="text-nowrap">Saldo Despues (Capital)</div></template>

    <template v-slot:cell(venta_id)="scope">{{CUENTA.cod}}</template>
    <template v-slot:cell(pago_inicial)="scope"><strong>L </strong>{{scope.item.pago_inicial}}</template>
    <template v-slot:cell(total_pago)="scope"><strong>L </strong>{{scope.item.total_pago}}</template>
    <template v-slot:cell(total_abonado)="scope"><strong>L </strong>{{scope.item.total_abonado}}</template>
    <template v-slot:cell(saldo_actual)="scope"><strong>L </strong>{{scope.item.saldo_actual}}</template>
    <template v-slot:cell(detalle)="scope">
      <div class="text-nowrap">{{scope.item.detalle}}</div>
    </template>
    <template v-slot:cell(is_mora)="scope">
      <v-chip v-if="scope.item.is_mora === 1" color="red" x-small dark>Sí</v-chip>
      <v-chip v-else-if="scope.item.is_mora === 0" color="success" x-small dark>No</v-chip>
    </template>
    <template v-slot:cell(mora)="scope"><strong>L </strong>{{scope.item.mora}}</template>
    <template v-slot:cell(inicio_mora)="scope">
      <span v-if="scope.item.inicio_mora">{{scope.item.inicio_mora.split('-')[2]}}/{{scope.item.inicio_mora.split('-')[1]}}/{{scope.item.inicio_mora.split('-')[0]}}</span>
      <span v-else>No hay</span>
    </template>
    <template v-slot:cell(fecha_pago)="scope">
      {{scope.item.fecha_pago.split('-')[2]}}/{{scope.item.fecha_pago.split('-')[1]}}/{{scope.item.fecha_pago.split('-')[0]}}
    </template>
    <template v-slot:cell(estado)="scope">
      <v-chip color="orange" x-small dark v-if="scope.item.estado === 1">Al día</v-chip>
      <v-chip color="success" x-small dark v-else-if="scope.item.estado === 2">Cancelado</v-chip>
      <v-chip color="red" x-small dark v-else-if="scope.item.estado === 3">En Mora</v-chip>
    </template>
    <template v-slot:cell(saldo_antes)="scope"><strong>L </strong>{{scope.item.saldo_antes}}</template>
    <template v-slot:cell(saldo_despues)="scope"><strong>L </strong>{{scope.item.saldo_despues}}</template>
  </b-table>
  <v-row>
    <v-col class="d-flex justify-center">
      <b-pagination v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
      ></b-pagination>
    </v-col>
  </v-row>
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
        'saldo_despues'
      ]
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
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
