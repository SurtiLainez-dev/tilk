<template>
<v-card>
  <v-progress-linear v-if="$store.state.cuentas.LOADCUENTA" indeterminate></v-progress-linear>
  <v-tabs  height="35" v-model="tab" align-with-title hide-slider>
    <v-tab :key="0">Vista de Colaboradores Permitidos</v-tab>
    <v-tab :key="1">Datos de la Cuenta</v-tab>
  </v-tabs>

  <v-tabs-items v-if="!$store.state.cuentas.LOADCUENTA" v-model="tab" >
    <v-tab-item :key="0" >
      <v-container>
        <v-toolbar tile flat color="grey lighten-3">
          <v-toolbar-title>Colaboradores que pueden ver esta cuenta</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field label="Buscar ..." dense v-model="search"></v-text-field>
        </v-toolbar>

        <v-data-table dense :headers="headers" :items="colViews" :search="search" :items-per-page="15">
          <template v-slot:item.value="{item}">
            {{item}}
          </template>
        </v-data-table>
      </v-container>
    </v-tab-item>
    <v-tab-item :key="1"><cuenta/></v-tab-item>
  </v-tabs-items>
</v-card>
</template>

<script>
import cuenta from "@/components/Ventas/cuenta";
export default {
  components:{cuenta},
  name: "vista_asignacion",
  props: {
    cuenta: Object,
    colaboradores: Array,
  },
  data(){
    return{
      tab: 0,
      search: '',
      colViews: [],
      colaborador_id: 0,
      headers:[
        {text:'Nombre del Colaborador', value:'text'},
      ]
    }
  },
  created() {
    let data = []
    let usuarios = []
    if (this.cuenta.usuarios){
      usuarios = JSON.parse(this.cuenta.usuarios)
      usuarios.forEach(item => {
        console.log(item)
        data = this.colaboradores.filter(i => i.value == item)
        if (data.length > 0){
          data.forEach(i => {
            this.colViews.push(i)
          })
          data = [];
        }
      })
    }
  }
}
</script>

<style scoped>

</style>