<template>
  <v-card flat>
    <v-row>
      <v-col cols="7">
        <v-card-subtitle>Resumen de gastos</v-card-subtitle>
        <v-divider></v-divider>
        <historial_cuentas :historial="historial"/>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-card-subtitle>Cierre de la caja</v-card-subtitle>
        <v-divider></v-divider>
        <v-form ref="FormRegistrarCierreCajaChica">
          <v-text-field class="ma-2" :rules="[rule.pago.req, rule.pago.max]" counter
                        dense label="Comentario del cierre" v-model="observacion"></v-text-field>
          <v-select class="ma-2" dense :items="sucursales" label="Seleccionar una Caja" :loading="loading_caja"
                    :item-text="'nombre'" :item-value="'id'" :rules="[rule.pago.req]" v-model="cc_caja"></v-select>
          <v-text-field class="ma-2" dense v-model="data.total_inicial" label="Saldo inicial" suffix="lps" disabled></v-text-field>
          <v-text-field class="ma-2" dense v-model="gastado" label="Total gastado" suffix="lps" disabled></v-text-field>
          <v-text-field class="ma-2" dense v-model="data.total_actual" label="Saldo sctual" suffix="lps" disabled></v-text-field>
          <v-text-field class="ma-2" dense v-model="saldo_transaccion" label="Saldo a transferir a caja"
                        :rules="[rule.pago.min, rule.pago.mayor]"
                        suffix="lps" persistent-hint hint="Este es el saldo que se devolvera a caja general"></v-text-field>

          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2" color="success" dark small tile @click="validarForm">Registrar Cierre</v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>

    <v-divider></v-divider>
  </v-card>
</template>

<script>
import historial_cuentas from "@/components/caja/caja_chica/historial_cuentas";
import {ipcRenderer} from "electron";
export default {
  components: {historial_cuentas},
  props: {
    sucursales: Array,
    historial: Array,
    loading_caja:
    Boolean, data: Object,
    gastado:Number,
    cc_caja_chica: Number | null
  },
  name: "cierre_caja_chica",
  data(){
    return{
      rule:{
        pago:{
          req: v => !!v || 'Campo requerido',
          max: v => v.length <= 200 || 'Ingresar máximo 200 carácteres',
          min: v => v >= 0 || 'Ingresar datos mayor o igual a 0',
          mayor: v => v <= this.data.total_actual || 'El saldo tiene que ser menor o igual a '+this.data.total_actual+' lps'
        },
      },
      cc_caja: 0,
      observacion: '',
      saldo_transaccion: 0,
      validarCero: false
    }
  },
  methods:{
    registrarCierre(){
      this.$store.commit('activarOverlay', true)
      this.$axios.post('contabilidad/caja_chica/cierre',{
        id: this.data.id,
        saldo: this.saldo_transaccion,
        saldo_a: this.data.total_actual,
        detalle: this.observacion,
        total_actual: this.data.total_actual,
        cc_caja: this.cc_caja,
        cc_caja_chica: this.cc_caja_chica,
        f_i: this.data.fecha_asignacion,
        f_f: this.data.fecha_finalizacion
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        let url2 = this.$axios.defaults.baseURL+res.data.url2;
        let url = this.$axios.defaults.baseURL+res.data.url+`/total_inicial=${this.data.total_inicial}&total_gastado=${this.gastado}&total_final=${this.data.total_actual}&saldo_trans=${this.saldo_transaccion}`;
        ipcRenderer.send('pint_navegador', url);
        ipcRenderer.send('pint_navegador', url2);
        this.$router.replace({path:'/contabilidad/caja_chicas'})
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormRegistrarCierreCajaChica.validate())
        this.registrarCierre();
    }
  }
}
</script>

<style scoped>

</style>
