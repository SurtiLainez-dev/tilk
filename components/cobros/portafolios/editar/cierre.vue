<template>
  <v-card flat>
    <v-toolbar flat><v-card-title>Cerrando Semana de Cobros</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="3">
        <v-card class="ma-2">
          <v-card-title class="grey--text">Fecha de Cierre</v-card-title>
          <v-card-subtitle class="grey--text" v-if="PORTAFOLIO.fecha_cierre">{{PORTAFOLIO.fecha_cierre}}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card class="ma-2">
          <v-card-title class="grey--text" >Última Revisión</v-card-title>
          <v-card-subtitle class="grey--text" v-if="PORTAFOLIO.ultima_fecha_revision">{{PORTAFOLIO.ultima_fecha_revision}}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="ma-2">
          <v-card-title class="grey--text">Total de Cuotas en Última Revisión</v-card-title>
          <v-card-subtitle class="grey--text" v-if="PORTAFOLIO.valor_cuotas_proyeccion">L {{int.format(PORTAFOLIO.valor_cuotas_proyeccion)}}</v-card-subtitle>
          <v-card-subtitle class="grey--text" v-else>L 0.00</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <v-card height="100%" class="ma-1">
          <v-card-title class="grey--text">Datos de Saldo Recaudado</v-card-title>
          <v-divider></v-divider>
          <column-chart thousands="," :data="dataChart"></column-chart>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="ma-1" height="100%">
          <v-card-title class="grey--text">% Saldo Recaudado</v-card-title>
          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col class="d-flex justify-center">
              <v-progress-circular :size="200" :width="28" color="green" :value="saldo_recaudado">{{saldo_recaudado}}%</v-progress-circular>
            </v-col>
          </v-row>
          <br>
          <h6 class="grey--text text-center">L {{int.format(PORTAFOLIO.saldo_cumplimiento)}}</h6>
          <h6 class="grey--text text-center">Saldo Recaudado en el Periodo de Cobros</h6>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="ma-1" height="100%">
          <v-card-title class="grey--text">Haciendo Cierre</v-card-title>
          <v-divider></v-divider>
          <v-form ref="FormCierreCobro">
            <v-textarea rows="5" counter label="Comentario" class="ma-2" v-model="comentario"
                        :rules="[rule.req, rule.max]"
                        placeholder="Escribir un comentario sobre como estuvo el periodo de cobros"></v-textarea>
            <v-card-text>Al registrar el cierre, los datos de este periodo de cobros se almacenarán para hacer
              reportes.</v-card-text>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" dark tile small @click="validarForm">Registrar Cierre</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>


  </v-card>
</template>

<script>
export default {
  name: "cierre",
  data(){
    return{
      int: Intl.NumberFormat(),
      comentario: '',
      rule: {
        req: v => !!v || 'Campo requerido',
        max: v => v.length < 200 || 'Tiene que ser menos a 200 carácteres'
      },
    }
  },
  computed:{
    dataChart(){
      return [
        ['Proyección', this.PORTAFOLIO.saldo_proyeccion],
        ['Recaudado', this.PORTAFOLIO.saldo_cumplimiento]
      ]
    },
    saldo_recaudado(){
      if (this.PORTAFOLIO.saldo_proyeccion > 0 && this.PORTAFOLIO.saldo_cumplimiento > 0) {
        let saldo = (this.PORTAFOLIO.saldo_cumplimiento / this.PORTAFOLIO.saldo_proyeccion) * 100;
        return saldo.toFixed(2);
      }else
        return 0;
    },
    PORTAFOLIO() {
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
  },
  methods:{
    registrarCierre(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/portafolio/cierre',{
        portafolio: this.PORTAFOLIO.id,
        comentario: this.comentario,
      }).then((res)=>{
        this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('cobros/portafolios/cambiar_VISTAPORTAFOLIO', 1);
      })
    },
    validarForm(){
      if (this.$refs.FormCierreCobro.validate())
        this.registrarCierre();
    }
  }
}
</script>

<style scoped>

</style>
