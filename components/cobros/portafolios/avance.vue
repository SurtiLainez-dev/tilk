<template>
<v-card flat>
  <v-toolbar flat><v-card-title>Avance de la Semana por Segmento</v-card-title></v-toolbar>
  <v-divider></v-divider>
  <table>
    <thead>
    <tr>
      <th>Nombre del Segmento</th>
      <th>Total</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in AVANCES">
      <td>{{item.cob_segmento.nombre}}</td>
      <td>L. {{int.format(item.total)}}</td>
    </tr>
    </tbody>
  </table>
</v-card>
</template>

<script>
export default {
  name: "avance",
  data(){
    return{
      int: Intl.NumberFormat(),
    }
  },
  computed:{
    AVANCES(){
      return this.$store.state.cobros.portafolios.AVANCES;
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}
table thead tr{
  border-bottom: solid #b2b0b0 1px;
}
table thead tr td{
  border-right: solid #b2b0b0 1px;
}
table thead tr th{
  padding: 5px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
}
</style>