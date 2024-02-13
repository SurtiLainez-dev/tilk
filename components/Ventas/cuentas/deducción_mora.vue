<template>
  <v-card flat>

    <v-data-table dense :items-per-page="10" :loading="loadPagos"
                  :headers="header" :items="pagos" @click:row="abrirDialogo"
                  loading-text="Cargando pagos ...">
      <template v-slot:item.pago_inicial="{item}">L. {{int.format(item.pago_inicial)}}</template>
      <template v-slot:item.total_pago="{item}">L. {{int.format(item.total_pago)}}</template>
      <template v-slot:item.total_abonado="{item}">L. {{int.format(item.total_abonado)}}</template>
      <template v-slot:item.saldo_actual="{item}">L. {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.mora="{item}">L. {{int.format(item.mora)}}</template>
    </v-data-table>

    <v-dialog v-model="dialogo" width="45%">
      <v-card>
        <v-toolbar color="grey lighten-3" dense flat>
          <v-card-title>Edición del pago {{pago.detalle}}</v-card-title>
        </v-toolbar>
        <v-container>
          <v-form ref="FormEditarMora">
            <v-row no-gutters>
              <v-col>
                <v-text-field label="Pago Inicial" disabled suffix="lps" class="ma-2" dense v-model="pago.pago_inicial"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Total Abonado" disabled dense suffix="lps" class="ma-2"  v-model="pago.total_abonado"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Saldo Actual" disabled dense suffix="lps" class="ma-2"  v-model="pago.saldo_actual"></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field class="ma-2"  label="Total del Pago" suffix="lps" disabled dense v-model="pago.total_pago"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field class="ma-2"  label="Saldo en Mora" disabled
                              dense v-model="pago.mora" min="0" suffix="lps"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field class="ma-2" label="Saldo a Restar"  @change="restar_total_pago" :hint="'La mora es de '+SaldoAnteriorMora+' lps.'"
                              type="number" @keyup="restar_total_pago" min="0" dense v-model="credito"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn small tile color="success" dark @click="validarCredito">Registrar Cambio</v-btn>
            <v-btn small tile color="orange" @click="dialogo = false" dark >Cerrar</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "deducción_mora",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  },
  data(){
    return{
      dialogo: false,
      pago: {},
      loadSave: false,
      loadPagos: true,
      pagos: [],
      currentPage: 1,
      totalRows: 1,
      credito: 0,
      SaldoAnteriorMora: 0,
      header:[
        {text:'Detalle', value: 'detalle'},
        {text:'Pago Inicial', value: 'pago_inicial'},
        {text:'Total del Pago', value: 'total_pago'},
        {text:'Total Abonado', value: 'total_abonado'},
        {text:'Saldo Actual', value: 'saldo_actual'},
        {text:'Saldo en Mora', value: 'mora'},
        {text:'Inicio de Mora', value: 'inicio_mora'},
        {text:'Fecha de Pago', value: 'fecha_pago'},
      ],
      int: new Intl.NumberFormat(),
    }
  },
  mounted() {
    this.cargar_pagos();
  },
  methods:{
    abrirDialogo(item){
      this.pago = item;
      this.dialogo = true;
      this.SaldoAnteriorMora = this.pago.mora;
    },
    cargar_pagos(){
      this.$axios.get('venta/pagos_mora/'+this.CUENTA.id).then((res)=>{
        if (res.data.pagos.length > 0){
          this.loadPagos = false;
          this.pagos = res.data.pagos;
          this.totalRows = this.pagos.length;
          this.$store.commit('notificacion',{texto:'Pagos cargados', color:'success'});
        }else{
          this.$store.commit('notificacion',{texto:'No hay pagos en mora', color:'success'});
          this.loadPagos = false;
        }
      })
    },
    restar_total_pago(){
      if (isNaN(this.pago.mora))
        this.pago.mora = this.SaldoAnteriorMora;

      if (this.pago.mora >= 0 && this.credito >= 0){
        this.pago.mora          = (parseFloat(this.SaldoAnteriorMora) - parseFloat(this.credito)).toFixed(2)
        this.pago.total_pago = (parseFloat(this.pago.pago_inicial) + parseFloat(this.pago.mora)).toFixed(2)
        this.pago.saldo_actual   = ((parseFloat(this.pago.pago_inicial) + parseFloat(this.pago.mora)) - parseFloat(this.pago.total_abonado)).toFixed(2)
      }
    },
    registrarDeduccion(){
      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios.post('venta/deduccion_mora',{
        id: this.pago.id,
        total_pago: this.pago.total_pago,
        saldo_actual: this.pago.saldo_actual,
        mora:         this.pago.mora,
        venta_id:     this.CUENTA.id,
        credito:      this.credito
      }).then((res)=>{
        this.$axios.get('cuentas/ventas/pendientes').then((res)=>{
          this.CUENTAS = res.data.ventas;
        });
        this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
          this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
          this.$store.commit('activarOverlay', false);
        })
        this.cargar_pagos();
        this.$store.commit('notificacion',{texto:'Se ha registrado un cambio', color:'success'})
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un problema al registrar su cambio', color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    },
    validarCredito(){
      if (this.credito <= this.SaldoAnteriorMora && this.credito > 0 && this.pago.mora >= 0)
        this.registrarDeduccion();
      else
        this.$store.commit('notificacion',{texto:'La deducción es 0 o la deducción el mayor a la mora de la cuenta'})
    }
  }
}
</script>

<style scoped>

</style>
