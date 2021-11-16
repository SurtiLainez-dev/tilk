<template>
  <v-card flat>
    <v-toolbar flat><v-card-title>Historial del Portafolio</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-data-table dense :headers="header" :items="historial"></v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "historial",
  data(){
    return{
      header:[
        {text:'Comentario', value:'comentario'},
        {text:'Usuario', value:'user'},
        {text:'Fecha', value:'fecha_guardado'},
      ]
    }
  },
  computed:{
    historial(){
      if (this.$store.state.cobros.portafolios.PORTAFOLIO.historial)
        return JSON.parse(this.$store.state.cobros.portafolios.PORTAFOLIO.historial)
      else
        return [];
    }
  }
}
</script>

<style scoped>

</style>
