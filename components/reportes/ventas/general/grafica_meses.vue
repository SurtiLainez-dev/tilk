<template>
  <v-card flat tile>
    <v-toolbar-title class="ml-5 mt-3">Ventas Mensuales</v-toolbar-title>
    <div class="d-flex justify-start">
      <v-btn small tile color="indigo" @click="cambiarTipoGrafica('bar')" class="ma-2 ml-4" icon><v-icon>fa fa-chart-bar</v-icon></v-btn>
      <v-btn small tile color="indigo" @click="cambiarTipoGrafica('line')" class="ma-2 ml-4" icon><v-icon>fa fa-chart-line</v-icon></v-btn>

    </div>

    <v-card flat tile class="d-flex justify-center">
      <v-card disabled flat :height="400" width="99%">
        <canvas style="width: 100%; height: 90%" aria-label="Hello ARIA World" role="img" id="GraficaMensuales"></canvas>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "grafica_meses",
  props:{
    datos:  Array
  },
  data(){
    return{
      type: 'bar'
    }
  },
  computed:{
    labels(){
      return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    },
    datosGrafico() {
      let data = [];
      this.$store.commit('reportes/cobros/sucursales/carlular_RGBA');
      let color1 = this.$store.state.reportes.cobros.sucursales.RGBA
      this.datos.forEach((item, index)=>{
        data.push({
          label: item.anio,
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          maxBarThickness: 100,
          backgroundColor: color1,
          fill: false,
          stepped: true,
        })
        item.meses.forEach(meses=>{
          data[index].data[meses.mes - 1] = meses.total[0].total.toFixed(2)
        })
        this.$store.commit('reportes/cobros/sucursales/carlular_RGBA');
        color1 = this.$store.state.reportes.cobros.sucursales.RGBA
      });

      return data;
    }
  },
  mounted() {
    this.grafico();
  },
  methods:{
    cambiarTipoGrafica(tipo){
      this.type = tipo;
      this.grafico();
    },
    grafico(){
      setTimeout(()=>{
        let datos = document.querySelector('#GraficaMensuales');
        new Chart(datos, {
          type: this.type,
          data: {
            labels: this.labels,
            datasets: this.datosGrafico,
          },
          options: {
            responsive: true,
            interaction: {
              intersect: false,
              axis: 'x'
            },
            animation:{

              onComplete: function() {
                let chartInstance = this.chart,
                    ctx = chartInstance.ctx;

                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                this.data.datasets.forEach(function (dataset, i) {
                  let meta = chartInstance.controller.getDatasetMeta(i);
                  meta.data.forEach(function (bar, index) {
                    ctx.fillText(Intl.NumberFormat().format(dataset.data[index])+' lps', bar._model.x, bar._model.y - 5);
                  });
                });
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
            },
            title: {
              display: true,
              text: 'Ventas Mensuales de Contado de Surtidora Lainez'
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
