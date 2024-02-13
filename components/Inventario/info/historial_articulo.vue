<template>
<v-card flat>
  <h6 class="text-center">Historial Completo</h6>
  <v-divider></v-divider>
  <v-data-table dense :headers="headers" :loading="LOAD_HISTORIAL" :items-per-page="50" :items="HISTORIAL">
    <template v-slot:item.created_at="{item}">
      {{item.created_at.split('T')[0].split('-')[2]}}/{{item.created_at.split('T')[0].split('-')[1]}}/{{item.created_at.split('T')[0].split('-')[0]}}
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "historial_articulo",
  computed:{
    LOAD_HISTORIAL(){
      return this.$store.state.inventario.inventario.LOAD_HISTORIAL;
    },
    HISTORIAL(){
      return this.$store.state.inventario.inventario.HISTORIAL;
    }
  },
  data(){
    return{
      headers:[
        {text:'Detalle', value:'operacion'},
        {text:'Referencia', value:'referencia'},
        {text:'Usuario', value:'user.usuario'},
        {text:'Fecha', value:'created_at'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
