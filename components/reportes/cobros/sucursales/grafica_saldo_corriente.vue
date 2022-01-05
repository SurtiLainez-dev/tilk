<template>
  <v-card flat>
    <v-card-title>Saldo Corrientes de los Portafolios de {{sucursal}}</v-card-title>
    <v-card-text>Este reporte reflreja el saldo corrientes en el úlimo cierre mensual de {{sucursal}}.</v-card-text>
    <v-divider></v-divider>
    <v-card disabled flat :height="350"><canvas style="width: 100%; height: 90%" id="GraSaldoCorriente"></canvas></v-card>
  </v-card>
</template>

<script>
export default {
  name: "grafica_saldo_corriente",
  props: {
    labels: Array,
    meses: Array,
    datos: Array,
    sucursal: String
  },
  data(){
    return{
      data: []
    }
  },
  mounted() {
    this.cargar_datos_grafica();
  },
  methods:{
    cargar_datos_grafica(){
      var datos = this.datos;
      if (datos.length > 0) {
        var data = [];
        let color1 = '';

        data.push()
        datos.forEach((item, index) => {
          this.$store.commit('reportes/cobros/sucursales/carlular_RGBA');
          color1 = this.$store.state.reportes.cobros.sucursales.RGBA
          data.push({
            label: item.portafolio,
            data: [],
            maxBarThickness: 100,
            backgroundColor: color1,
          })
          for (let i = 0; i < this.meses.length; i++) {
            data[index].data.push(0)
          }
        });
        datos.forEach((item, index) => {
          item.ultima.forEach((i, y) => {
            if (this.meses.includes(i.mes))
              data[index].data[this.meses.indexOf(i.mes)] = i.saldo_corriente
          })
        });

        this.grafica();
        this.data = data;
      }
    },
    grafica(){
      setTimeout(()=>{
        let graNormalidad = document.querySelector('#GraSaldoCorriente');
        new Chart(graNormalidad, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.data,
          },
          options: {
            animation:{
              onComplete: function() {
                var chartInstance = this.chart,
                    ctx = chartInstance.ctx;

                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function (bar, index) {
                    var data = dataset.data[index];
                    ctx.fillText(Intl.NumberFormat().format(data)+' lps', bar._model.x, bar._model.y - 5);
                  });
                });
              },
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                }
              }]
            }
          }
        });
      },1000)
    }
  }
}
</script>

<style scoped>

</style>
