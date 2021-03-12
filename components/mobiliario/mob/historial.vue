<template>
  <v-card>
    <v-toolbar flat color="grey lighten-5">
      <h6>Historial del Mobiliario</h6>
      <v-spacer></v-spacer>
      <v-text-field placeholder="Buscar" dense v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table dense
                  :items-per-page="15"
                  class="rowsTable"
                  :search="search"
                  :headers="header"
                  :items="JSON.parse(MOBILIARIO.historial)">
      <template v-slot:item.fecha="{item}">
        {{item.fecha.split('-')[2]}}/{{item.fecha.split('-')[1]}}/{{item.fecha.split('-')[0]}}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "historial",
  data(){
    return{
      search: '',
      header:[
        {text:'Usuario', value:'user'},
        {text:'Fecha', value:'fecha'},
        {text:'Detalle', value:'detale'},
        {text:'Referencia', value:'referencia'},
      ]
    }
  },
  computed:{
    MOBILIARIO(){
      return this.$store.state.mob.familias.MOBILIARIO;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
