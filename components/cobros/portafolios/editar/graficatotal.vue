<template>
  <v-card flat :loading="LOAD">
    <v-card flat v-if="!LOAD">
      <bar-chart :data="chartData" thousands="," :discrete="true" xtitle="SEGMENTOS DEL PORTAFOLIO"></bar-chart>
    </v-card>
    <v-card-text v-else>Cargando datos</v-card-text>
  </v-card>
</template>

<script>
import { GChart} from 'vue-google-charts';

export default {
  name: "graficatotal",
  components:{GChart},
  created() {
    this.$store.commit('graficas/cobros/gestiones/cargar_TOTALES_SEGMENTOS', this.$store.state.cobros.portafolios.PORTAFOLIO.id);
  },
  computed:{
    chartData(){
      return this.$store.state.graficas.cobros.gestiones.G_TOTALESSEGMENTOS;
    },
    LOAD(){
      return this.$store.state.graficas.cobros.gestiones.G_LOADTOTALESSEGMENTOS;
    }
  },
}
</script>

<style scoped>

</style>
