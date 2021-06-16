<template>
  <v-card flat>
    <v-toolbar flat>
    <h6>Todos los Cheques</h6>
    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-text-field dense label="Buscar" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table :headers="header" :search="search" class="cursor" :items="CHEQUES">
      <template v-slot:item.estado="{item}">
        <v-chip dark x-small color="success" v-if="item.estado === 1">DISPONIBLE</v-chip>
        <v-chip dark x-small color="indigo" v-else-if="item.estado === 2">CREADO</v-chip>
        <v-chip dark x-small color="grey" v-else-if="item.estado === 3">ENTREGADO</v-chip>
        <v-chip dark x-small color="orange" v-else-if="item.estado === 4">ANULADO</v-chip>
      </template>
      <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
      <template v-slot:item.fecha_uso="{item}">
        <span v-if="item.fecha_uso">
          {{item.fecha_uso.split('-')[2]+'/'+item.fecha_uso.split('-')[1]+'/'+item.fecha_uso.split('-')[0]}}
        </span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "todos",
  data(){
    return{
      search: '',
      int: new Intl.NumberFormat(),
      header:[
        {text:'Correlativo', value:'numeracion'},
        {text:'Estado', value:'estado'},
        {text:'Detalle', value:'detalle'},
        {text:'Total', value:'total'},
        {text:'Partida', value:'partida.referencia'},
        {text:'Fecha de Uso', value:'fecha_uso'},
      ],
    }
  },
  computed:{
    CHEQUES(){
      return this.$store.state.contabilidad.cheques.CHEQUES;
    }
  },
}
</script>

<style scoped>

</style>
