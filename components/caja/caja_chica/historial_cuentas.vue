<template>
  <v-card flat>
    <v-data-table dense :headers="headers" :items="historial" :items-per-page="25">
      <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "historial_cuentas",
  props:{historial: Array},
  data(){
    return{
      int: Intl.NumberFormat(),
      headers:[
        {text: 'Nombre del Gasto', value:'nombre'},
        {text: 'Total', value:'total'},
      ]
    }
  }
}
</script>

<style scoped>

</style>
