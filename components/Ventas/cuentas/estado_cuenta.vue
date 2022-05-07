<template>
  <v-card>
    <v-data-table :headers="header" dense :items-per-page="20"
                  :items="JSON.parse(CUENTA.estado_cuenta)">
      <template v-slot:item.debito="{item}">{{int.format(item.debito)}}</template>
      <template v-slot:item.credito="{item}">{{int.format(item.credito)}}</template>
      <template v-slot:item.saldo="{item}">{{int.format(item.saldo)}}</template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "estado_cuenta",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  },
  data(){
    return{
      header:[
        {text: 'Fecha', value:'fecha'},
        {text: 'Descripción', value:'descripcion'},
        {text: 'Referencia', value:'referencia'},
        {text: 'Debito', value:'debito'},
        {text: 'Crédito', value:'credito'},
        {text: 'Saldo', value:'saldo'},
      ],
      int: Intl.NumberFormat()
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
