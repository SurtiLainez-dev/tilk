<template>
  <v-card flat>
    <v-toolbar flat >
      <h6>Realizar Egreso por Depósito</h6>
    </v-toolbar>
    <v-card-text>Este egreso solo se hace cuando se mandó a depósitar efectivo que hay en la caja.</v-card-text>
    <v-divider></v-divider>

    <v-form ref="FormNuevoEgreso">
      <v-row no-gutters>
        <v-col>
          <v-text-field dense label="Total de Efectivo en Caja" class="ma-2"
                        suffix="lps" :value="TOTAL_CAJA" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete :items="ccCuentasB" :item-value="'id'" :item-text="'nombre'" class="ma-2"
                          :loading="loadccBancos" label="Seleccionar al Banco en que se va a Depósitar"
                          dense :rules="[rules.req.req]" v-model="egreso.ccBanco"></v-autocomplete>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <v-text-field dense label="Total a Depósitar" class="ma-2" :rules="[rules.req.req, rules.efectivo.min]"
                        suffix="lps" v-model="egreso.total"></v-text-field>
        </v-col>
        <v-col>
          <v-file-input :rules="[rules.req.req]" accept="image/*, .pdf" class="ma-2"
                        dense label="Comprobante" v-model="egreso.file"></v-file-input>
        </v-col>
      </v-row>

      <v-text-field dense :rules="[rules.req.req]" label="Referencia del Depósito" class="ma-2"
                    v-model="egreso.referencia" persistent-hint
                    hint="Puedes agregar una observación despues de la referencia"></v-text-field>

      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-end">
        <v-btn dark color="success" class="ma-2" small @click="validarForm" tile>Registrar Egreso</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data(){
    return{
      loadccBancos: false,
      ccCuentasB: [],
      egreso:{
        total: 0,
        ccBanco: '',
        referencia: '',
        file: null
      },
      rules: {
        req: {
          req: v => !!v || 'Campo requerido',
        },
        efectivo:{
          min: v => v <= this.TOTAL_CAJA || 'No puede ser mayor al total que hay en efectivo',
        },
      },
    }
  },
  computed:{
    TOTAL_CAJA(){
      return this.$store.state.caja.CAJA_EFECTIVO;
    },
    CAJA(){
      return this.$store.state.caja.CAJA_ID;
    },
  },
  name: "egreso",
  created() {
    this.cargarCcCuentasBancos();
  },
  methods:{
    cargarCcCuentasBancos(){
      this.loadccBancos = true;
      this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=> {
        this.ccCuentasB = res.data.cuentas;
        this.loadccBancos = false
      });
    },
    registrarEgreso(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('caja_id',    this.CAJA);
      data.append('total',      this.egreso.total);
      data.append('referencia', this.egreso.referencia);
      data.append('cc_id',      this.egreso.ccBanco);
      data.append('file',       this.egreso.file)
      this.$axios({
        method: 'post',
        url:    'caja/egreso',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('caja/cambiar_VISTA', 1);
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'success'});

        this.$store.commit('activarOverlay', false);
      });
    },
    validarForm(){
      if (this.$refs.FormNuevoEgreso.validate())
        this.registrarEgreso();
    }
  }
}
</script>

<style scoped>

</style>
