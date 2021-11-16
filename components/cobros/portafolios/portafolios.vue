<template>
  <v-card flat>
    <v-toolbar flat><v-card-title>Portafolios de mi Sucursal</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-data-table dense :headers="header" :items="portafolios" loading-text="Cargando datos ..."
                  :loading="load_portafolios">
      <template v-slot:item.proyeccion_normalidad="{item}">{{item.proyeccion_normalidad}} %</template>
      <template v-slot:item.normalidad="{item}">{{item.normalidad}} %</template>
      <template v-slot:item.saldo_proyeccion="{item}">L {{int.format(item.saldo_proyeccion)}}</template>
      <template v-slot:item.saldo_cumplimiento="{item}">L {{int.format(item.saldo_cumplimiento)}}</template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "portafolios",
  data(){
    return{
      int: Intl.NumberFormat(),
      portafolios: [],
      load_portafolios: true,
      header:[
        {text:'Título', value:'nombre'},
        {text:'Normalidad Proyectada', value:'proyeccion_normalidad'},
        {text:'Normalidad Actual', value:'normalidad'},
        {text:'Proyección Recaudado', value:'saldo_proyeccion'},
        {text:'Recaudado Actualmente', value:'saldo_cumplimiento'},
      ]
    }
  },
  computed:{
    PORTAFOLIO(){
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    }
  },
  created() {
    this.cargar_portafolios();
  },
  methods:{
    cargar_portafolios(){
      this.$axios.get('cobros/gestiones/portafolios/sucursal/'+this.PORTAFOLIO.sucursal_id).then((res)=>{
        this.portafolios      = res.data.portafolios;
        this.load_portafolios = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
