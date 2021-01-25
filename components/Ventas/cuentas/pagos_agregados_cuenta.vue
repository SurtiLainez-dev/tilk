<template>
<v-card flat>
  <v-data-table class="rowsTable"
                :loading="LOAD"
                :items="PAGOS_AGREGADOS"
                loading-text="Cargando Pagos"
                :headers="header">
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark color="red" v-if="item.estado === 1">Pendiente</v-chip>
      <v-chip x-small dark color="success" v-else-if="item.estado === 2">Cancelado</v-chip>
      <v-chip x-small dark color="orange" v-else-if="item.estado === 3">Condonado</v-chip>
    </template>
    <template v-slot:item.fecha_pago="{item}">
      {{item.fecha_pago.split('-')[2]}}/{{item.fecha_pago.split('-')[1]}}/{{item.fecha_pago.split('-')[0]}}
    </template>
    <template v-slot:item.total="{item}">
      <strong>L </strong>{{item.total}}
    </template>
    <template v-slot:item.observacion="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.observacion.substr(0, 20)}}</span>
        </template>
        <span>{{item.observacion}}</span>
      </v-tooltip>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "pagos_agregados_cuenta",
  data(){
    return{
      header:[
        {text: 'Cuenta', value: 'venta.cod'},
        {text: 'Descripción', value: 'descripcion'},
        {text: 'Total', value: 'total'},
        {text: 'Fecha de Pago', value:'fecha_pago'},
        {text: 'Estado', value:'estado'},
        {text: 'Observación', value:'observacion'}
      ]
    }
  },
  computed:{
    LOAD(){
      return this.$store.state.cuentas.LOAD;
    },
    PAGOS_AGREGADOS(){
      return this.$store.state.cuentas.PAGOS_AGREGADOS;
    },
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    }
  },
  created() {
    this.$store.commit('cuentas/cargar_PAGOS_AGREGADOS', this.CUENTA.id);
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
