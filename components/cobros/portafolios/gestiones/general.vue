<template>
  <v-card flat class="ma-5">
    <v-toolbar flat color="grey lighten-4"><v-card-title>Datos Generales</v-card-title></v-toolbar>

    <v-row no-gutters class="mt-2">
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.saldo_actual)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo sin Mora</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.saldo_actual_cap)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Mora</h6>
          <h6 class="grey--text text-center">L {{int.format(mora)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo Atrasado</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.pagando)}}</h6>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo Abonado</h6>
          <h6 class="grey--text text-center" v-if="VENTA.contrato_cliente">L {{int.format(VENTA.contrato_cliente.saldo_abonado)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION || LOAD_VENTA">
          <h6 class="grey--text text-center">Saldo de Inicial</h6>
          <h6 class="grey--text text-center">L {{int.format(VENTA.total)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Segmento</h6>
          <h6 class="grey--text text-center">{{GESTION.cob_segmento.nombre}}</h6>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mt-4 ma-2">
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

</style>
