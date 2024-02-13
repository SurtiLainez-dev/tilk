<template>
<v-card flat>
  <v-form ref="FormPagosExtraCuenta">
    <v-select :items="gastos" label="Tipo de Pago" v-model="tipoGasto"></v-select>
    <v-text-field label="Total del gasto" prefix="L" :rules="[rule.descripcon.req]"
                  v-model="Gasto.total"></v-text-field>
    <v-text-field label="Descripción" :rules="[rule.descripcon.req,rule.descripcon.min, rule.descripcon.max]"
                  v-model="Gasto.descripcion" counter></v-text-field>
    <v-textarea label="Observación del gasto" :rules="[rule.descripcon.req, rule.observacion.min,rule.descripcon.max]"
                v-model="Gasto.observacion" counter></v-textarea>

    <v-dialog ref="dialogo" :return-value.sync="Gasto.fecha_pago" persistent
              width="290px" v-model="menuFecha">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field v-model="Gasto.fecha_pago" label="Fecha de Pago"
            :rules="[rule.descripcon.req]" prepend-icon="mdi-calendar"
            readonly v-bind="attrs" v-on="on"></v-text-field>
      </template>
      <v-date-picker v-model="Gasto.fecha_pago" scrollable>
        <v-spacer></v-spacer>
        <v-btn tile small dark color="orange" @click="menuFecha = false">Cerrar</v-btn>
        <v-btn tile small color="indigo" class="text-white"
               @click="save" :disabled="!Gasto.fecha_pago">Seleccionar</v-btn>
      </v-date-picker>
    </v-dialog>
  </v-form>
  <v-divider></v-divider>
  <v-card-actions class="d-flex justify-end">
    <v-btn color="orange" @click="DIALOGO = false" small tile dark v-if="accion === 2">Cerrar</v-btn>
    <v-btn color="success" @click="validarForm" small tile dark>Agregar Pago</v-btn>
  </v-card-actions>
</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "formulario_pago_nuevo",
  props:{accion: Number},
  data(){
    return{
      rule: {
        descripcon: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 150) || 'Tiene que ser menor o igual a 150 carácteres.',
        },
        observacion:{
          min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
          max: v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
        }
      },
      menuFecha: false,
      tipoGasto: '',
      descripcionGasto: '',
      Gasto:{
        total: 0,
        observacion: '',
        descripcion: '',
        fecha_pago: null
      },
      gastos:['Flete', 'Gastos Administrativos', 'Pago de Matrícula', 'Pago de Traspaso', 'Placa' ,'Otros']
    }
  },
  watch:{
    tipoGasto: function (val){
      let des = this.descripcionGasto;
      this.Gasto.descripcion = val;
      this.Gasto.observacion = `(${val}) - ${des}.`
    },
  },
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    VISTA:{
      get: function (){
        return this.$store.state.cuentas.VISTA;
      },
      set: function (val){
        this.$store.commit('cuentas/cambiar_VISTA', val);
      }
    },
    DIALOGO:{
      get: function (){
        return this.$store.state.dialogo;
      },
      set: function (val){
        this.$store.commit('valorDialogo', val);
      }
    }
  },
  methods:{
    enviarDatos(){
      if (this.accion === 2)
        this.DIALOGO = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cuenta/agregar_pagos_extras',{
        venta_id:    this.CUENTA.id,
        total:       this.Gasto.total,
        descripcion: this.Gasto.descripcion,
        observacion: this.Gasto.observacion,
        fecha_pago:  this.Gasto.fecha_pago
      }).then((res)=>{
        this.Gasto.total = 0;
        this.Gasto.fecha_pago = null;
        this.Gasto.observacion = '';
        this.Gasto.descripcion = '';
        this.notificacion(res.data.msj,'success');
        if (this.accion === 1) {
          this.$store.commit('cuentas/cargar_PAGOS_AGREGADOS', this.CUENTA.venta_id)
          this.VISTA = 5;
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          }, 4000);
        }else{
          this.DIALOGO = false;
          this.$store.commit('activarOverlay', false);
        }

      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Hubo un error al ingresar le pago','error');
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    save () {
      this.$refs.dialogo.save(this.Gasto.fecha_pago);
      this.menuFecha = false;
    },
    validarForm(){
      if (this.$refs.FormPagosExtraCuenta.validate())
        this.enviarDatos();
      else
        this.notificacion('Hay datos incompletos en el formulario','error');
    }
  }
}
</script>

<style scoped>

</style>
