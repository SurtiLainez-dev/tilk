<template>
  <v-card flat class="ma-5">
    <v-toolbar flat color="grey lighten-4"><v-card-title>Datos Generales</v-card-title></v-toolbar>


    <v-card>
      <table>
        <thead>
        <tr>
          <th>Saldo de la Cuenta</th>
          <td>L {{int.format(GESTION.saldo_actual)}}</td>
          <th>Saldo sin Mora</th>
          <td>L {{int.format(GESTION.saldo_actual_cap)}}</td>
          <th>Mora</th>
          <td>L {{int.format(mora)}}</td>
        </tr>
        <tr>
          <th>Saldo Atrasado</th>
          <td>L {{int.format(GESTION.pagando)}}</td>
          <th>Saldo Abonado</th>
          <td>L {{int.format(VENTA.total_abonado)}}</td>
          <th>Saldo Inicial de la Cuenta</th>
          <td>L {{int.format(VENTA.total)}}</td>
        </tr>
        <tr>
          <th>Nombre del segmento</th>
          <td colspan="5">{{GESTION.cob_segmento.nombre}}</td>
        </tr>
        </thead>
      </table>

      <v-card class="mt-4" flat>
        <v-toolbar flat dense><h6 class="grey--text">Pagos Atrasados</h6></v-toolbar>
        <v-data-table dense :headers="header" :items="pagosAtrasados" :loading="LOAD_VENTA">
          <template v-slot:item.pago_inicial="{item}">L {{item.pago_inicial}}</template>
          <template v-slot:item.total_pago="{item}">L {{item.total_pago}}</template>
          <template v-slot:item.mora="{item}">L {{item.mora}}</template>
          <template v-slot:item.total_abonado="{item}">L {{item.total_abonado}}</template>
          <template v-slot:item.saldo_actual="{item}">L {{item.saldo_actual}}</template>
        </v-data-table>
    </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "general",
  data(){
    return{
      int: Intl.NumberFormat(),
      header:[
        {text:'Detalle', value:'detalle'},
        {text:'Pago Inicial', value:'pago_inicial'},
        {text:'Total del Pago', value:'total_pago'},
        {text:'Saldo Actual', value:'saldo_actual'},
        {text:'Mora', value:'mora'},
        {text:'Total Abonado', value:'total_abonado'},
        {text:'Fecha de Pago', value:'fecha_pago'},
      ],
      selectTipo:[
        {text:'Crédito -', value:0},
        {text:'Dédito +', value:1},
      ],
      rebaja:{
        modal: false,
        monto: 0,
        comentario: '',
        tipo: 0
      },
    }
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.cuentas.LOADCUENTA;
    },
    GESTION(){
      return this.$store.state.cobros.portafolios.GESTION;
    },
    VENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    LOADGESTION() {
      return this.$store.state.cobros.portafolios.LOADGESTION;
    },
    pagosAtrasados(){
      if ( this.VENTA.pagos_contratos) {
        let pagos = this.VENTA.pagos_contratos.filter(item => item.estado === 2);
        return pagos;
      }else
        return []
    },
    mora(){
      console.log(this.pagosAtrasados)
      if ( this.pagosAtrasados.length > 0) {
        let mora = this.pagosAtrasados.reduce((total, val)=> total + parseFloat(val.mora), 0)
        return mora;
      }else
        return 0
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
}
table thead tr{
  border-bottom: solid #b2b0b0 1px;
}
table thead tr td{
  border-right: solid #b2b0b0 1px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
</style>
