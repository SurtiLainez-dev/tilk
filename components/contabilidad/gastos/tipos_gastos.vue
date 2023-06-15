<template>
<v-card flat>
  <v-row>
    <v-col cols="9"></v-col>
    <v-col class="d-flex justify-end">
      <v-text-field class="ma-2" label="Buscar... " v-model="search"></v-text-field>
    </v-col>
  </v-row>
  <v-data-table :headers="headers" :items="tipos" :loading="loadTipo" :search="search" loading-text="Cargando tipos de gastos ..."></v-data-table>
</v-card>
</template>

<script>
export default {
  name: "tipos_gastos",
  data(){
    return{
      search: '',
      headers:[
        {text:'Nombre del Gasto', value:'nombre'},
        {text:'Sucursal Asignado', value:'sucursal.nombre'},
        {text:'CC', value:'cc.nombre'},
        {text:'Cod CC', value:'cc.cod'},
        {text:'CC Padre', value:'cc.cod_d.nombre'},
        {text:'Cod CC Padre', value:'cc.cod_d.cod'},
      ],
      loadTipo: true,
      tipos: []
    }
  },
  created() {
    this.$axios.get('contabilidad/gasto/todos_tipos').then((res)=>{
      this.tipos    = res.data.gastos;
      this.loadTipo = false;
    })
  }
}
</script>

<style scoped>

</style>