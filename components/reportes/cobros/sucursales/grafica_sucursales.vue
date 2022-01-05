<template>
  <v-card flat>
    <v-card-title>Reporte de Normalidad Alcanzada de {{sucursal}}</v-card-title>
    <v-card-text>Este reporte muestra la normalidad con la que cerraron los portafolios mensualmente en el
    piso de venta {{sucursal}}.</v-card-text>
    <v-divider></v-divider>
    <v-card disabled flat :height="350"><canvas style="width: 100%; height: 90%" id="normalidad"></canvas></v-card>
  </v-card>
</template>


<script>
export default {
  props: {
    labels: Array,
    meses: Array,
    datos: Array,
    sucursal: String
  },
  data(){
    return{
      normalidad: [],
    }
  },
  name: "grafica_sucursales",
  mounted() {
    this.cargar_datos_normalidad()
  },
  methods:{
    cargar_datos_normalidad(){
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
            borderColor: color1
          })
          for (let i = 0; i < this.meses.length; i++) {
            data[index].data.push(0)
          }
        });
        datos.forEach((item, index) => {
          item.mes.forEach((i, y) => {
            if (this.meses.includes(i.mes))
              data[index].data[this.meses.indexOf(i.mes)] = i.prom_normalidad
          })
        });

        this.graficaNormalidad();
        this.normalidad = data;
      }
    },
    graficaNormalidad(){
      setTimeout(()=>{
        let graNormalidad = document.querySelector('#normalidad');
        new Chart(graNormalidad, {
          type: 'bar',
          data: {
            labels: this.labels,
            datasets: this.normalidad,
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
                      ctx.fillText(data.toFixed(2)+'%', bar._model.x, bar._model.y - 5);
                    });
                  });
              },
            },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 110
                }
              }]
            }
          }
        });
      },500)
    }
  }

}
</script>

<style scoped>

</style>
