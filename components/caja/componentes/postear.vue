<template>
<v-card flat>
  <v-toolbar flat>
    <v-btn fab tile color="orange" dark v-if="vista === 2" @click="goBack" x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
    <v-spacer v-if="vista === 2"></v-spacer>
    <div class="d-flex align-center">
      <v-btn fab tile @click="$store.commit('caja/cargar_CUENTAS')"
             color="indigo" text x-small><v-icon>fa fa-sync</v-icon></v-btn>
    </div>
    <h6>{{titulo}}</h6>
    <v-spacer v-if="vista === 1"></v-spacer>
    <v-text-field v-if="vista === 1" dense v-model="search" label="Buscar"></v-text-field>
  </v-toolbar>
  <v-divider v-if="vista === 2"></v-divider>
  <v-card flat v-if="vista === 1">
    <v-data-table class="rowsTable"
                  :search="search"
                  :loading="LOAD"
                  dense
                  @click:row="addCuenta"
                  :headers="header"
                  :items="CUENTAS">
    </v-data-table>
  </v-card>

  <v-card flat v-else-if="vista === 2">
    <cuenta/>
  </v-card>
</v-card>

</template>

<script>
import cuenta from "./cuentas/cuenta";
export default {
  components:{cuenta},
  name: "postear",
  data(){
    return{
      vista: 1,
      search: '',
      titulo: 'Cuentas Pendientes',
      header:[
        {text:'Cuenta', value:'cod'},
        {text:'Nombres', value:'nombres'},
        {text:'Apellidos', value:'apellidos'},
        {text:'Identidad', value:'identidad'},
      ]
    }
  },
  computed:{
    CUENTAS(){
      return this.$store.state.caja.CUENTAS;
    },
    LOAD(){
      return this.$store.state.caja.LOAD_CUENTAS;
    },
  },
  created() {
    this.$store.commit('caja/cargar_CUENTAS')
  },
  methods:{
    addCuenta(data){
      console.log(data)
      this.titulo = 'Cuenta > #'+data.cod+' - '+data.nombres+ ' '+data.apellidos;
      this.$store.commit('caja/agregar_CUENTA', data);
      this.vista = 2;
    },
    goBack(){
      this.titulo = 'Cuentas Pendientes';
      this.vista  = 1;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
