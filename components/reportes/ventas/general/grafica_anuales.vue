<template>
  <v-card flat tile>
    <v-toolbar-title class="ml-5 mt-3">Ventas Anuales</v-toolbar-title>
<!--    <v-divider></v-divider>-->
    <v-card flat tile class="d-flex justify-center">
      <v-card disabled flat :height="400" width="70%">
        <canvas style="width: 100%; height: 90%" id="GraficaSucursalesAnuales"></canvas>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "grafica_anuales",
  props:{
    datos:  Array
  },
  mounted() {
    this.grafica();
  },
  computed:{
    labels(){
      let data = [];
      this.datos.forEach(item=>{
        data.push(item.anio);
      });
      return data;
    },
    totalMax(){
      let data = this.datos.reduce((item, currentValue) =>{
        return currentValue.total[0].total > item.total[0].total ? currentValue : item
      });
      return data.total[0].total.toFixed(2);
    },
    datosGrafico(){
      let data = [];
      this.$store.commit('reportes/cobros/sucursales/carlular_RGBA');
      let color = this.$store.state.reportes.cobros.sucursales.RGBA;
      this.datos.forEach(item=>{
        data.push({
          label: 'Año '+item.anio,
          data: [item.total[0].total],
          maxBarThickness: 100,
          backgroundColor: color,
          // borderColor: color2,
          // borderWidth: 2,
          borderRadius: 40,
          borderSkipped: false,
        });
        this.$store.commit('reportes/cobros/sucursales/carlular_RGBA');
        color = this.$store.state.reportes.cobros.sucursales.RGBA
      });

      return data;
    }
  },
  methods:{
    grafica(){
      setTimeout(()=>{
        let datos = document.querySelector('#GraficaSucursalesAnuales');
        new Chart(datos, {
          type: 'bar',
          data: {
            labels: [],
            datasets: this.datosGrafico,
          },
          options: {
            responsive: true,
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
                    ctx.fillText(Intl.NumberFormat().format(dataset.data[0])+' lps', bar._model.x, bar._model.y - 5);
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
              text: 'Ventas Anuales de Contado de Surtidora Lainez'
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
