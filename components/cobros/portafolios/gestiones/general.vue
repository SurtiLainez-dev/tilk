<template>
  <v-card flat class="ma-5">
    <v-toolbar flat color="grey lighten-4"><v-card-title>Datos Generales</v-card-title></v-toolbar>
    <v-alert v-if="alert" dense color="warning" dark dismissible>El saldo de la gestión no coincide con el saldo de la venta.</v-alert>
    <v-row no-gutters class="mt-2" v-if="alert">
      <v-col></v-col>
      <v-col></v-col>
      <v-col></v-col>
      <v-col>
        <v-btn block tile dark small color="indigo" @click="rebaja.modal = true">Rebajar Gestión</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-2">
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo de la Gestión</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.saldo_actual)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOAD_VENTA">
          <h6 class="grey--text text-center">Saldo de la Venta</h6>
          <h6 class="grey--text text-center" v-if="VENTA.contrato_cliente">L {{int.format((VENTA.saldo_actual - VENTA.contrato_cliente.saldo_mora))}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Intereses</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.intereses)}}</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo Atrasado</h6>
          <h6 class="grey--text text-center">L {{int.format(this.GESTION.pagando)}}</h6>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-2">
      <v-col>
        <v-card class="pa-5 ma-2" height="100%" :loading="LOADGESTION">
          <h6 class="grey--text text-center">Saldo Abonado</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.saldo_abonado)}}</h6>
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
          <h6 class="grey--text text-center">Saldo a Abonar</h6>
          <h6 class="grey--text text-center">L {{int.format(GESTION.saldo_dia)}}</h6>
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
      </v-data-table>
    </v-card>

    <v-dialog v-model="rebaja.modal" width="30%">
      <v-card>
        <v-toolbar dense color="grey lighten-4">Rebajando Monto de la Gestión</v-toolbar>
        <v-form class="pa-5">
          <v-card-text>Monto disponible para rebajar L {{montoDisponibleRebajar}}</v-card-text>
          <v-text-field class="ma-2" label="Monto a rebajar" suffix="lps" v-model="rebaja.monto" dense></v-text-field>
          <v-textarea class="ma-2" label="Comentario" dense v-model="rebaja.comentario"></v-textarea>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" dark small tile @click="rebaja.modal = false">Cerrar</v-btn>
            <v-btn color="success" class="text--white" :disabled="LOAD_VENTA" small tile @click="validoarFormRebaja">Registrar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
        {text:'Mora', value:'mora'},
        {text:'Total Abonado', value:'total_abonado'},
        {text:'Fecha de Pago', value:'fecha_pago'},
      ],
      rebaja:{
        modal: false,
        monto: 0,
        comentario: ''
      }
    }
  },
  computed:{
    alert(){
      if (this.VENTA.contrato_cliente){
        return this.GESTION.saldo_actual !== (this.VENTA.saldo_actual - this.VENTA.contrato_cliente.saldo_mora);
      }else
        return false;
    },
    montoDisponibleRebajar(){
      if (this.VENTA.contrato_cliente)
        return Math.abs(this.GESTION.saldo_actual - (this.VENTA.saldo_actual - this.VENTA.contrato_cliente.saldo_mora));
      else
        return 0
    },
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
    }
  },
  methods:{
    rebajarGestion(){
      let saldo = this.GESTION.saldo_actual - this.rebaja.monto;
      if (saldo < this.VENTA.saldo_actual - this.VENTA.contrato_cliente.saldo_mora){
        this.$store.commit('notificacion',{texto:'El saldo de la gestión no puede ser menor al saldo de la Venta', color:'warning'});
      }else{
        this.$store.commit('activarOverlay', true);
        this.rebaja.modal = false;
        this.$axios.post('cobros/gestion/deduccion_manual',{
          venta:this.VENTA.id,
          monto: this.rebaja.monto,
          comentario: this.rebaja.comentario
        }).then((res)=>{
          this.$store.commit('cobros/portafolios/cargar_GESTION');
          this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Se realizó la gestión exitosamente', color:'success'});
          this.$store.commit('cobros/portafolios/cargar_GESTIONES', this.$store.state.cobros.portafolios.PORTAFOLIO.id);
        }).catch((error)=>{
          this.rebaja.modal = true;
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      }
    },
    validoarFormRebaja(){
      if (this.rebaja.monto > 0 && this.rebaja.comentario)
        this.rebajarGestion();
      else
        this.$store.commit('notificacion',{texto:'Datos incompletos', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
