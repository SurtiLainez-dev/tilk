<template>
<v-card flat tile>
  <v-card flat tile v-if="VISTA === 1">
    <v-toolbar tile flat>
      <v-card-title>Contratos de Proveedores de Servicios</v-card-title>
      <v-btn icon fab text dark color="indigo" small @click="cargarContratos"><v-icon>mdi-reload</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar ..." dense v-model="search" class="ma-2 pa-2"></v-text-field>
    </v-toolbar>

    <v-data-table :headers="header" dense :loading="loadContratos" :search="search"
                  loading-text="Cargando contratos ..." :items="Contratos" @click:row="cargarContrato">
      <template v-slot:item.estado="{item}">
        <v-chip x-small dark color="success" v-if="item.estado === 1">Vigente</v-chip>
        <v-chip x-small dark color="red" v-else-if="item.estado === 2">Vencido</v-chip>
        <v-chip x-small dark color="orange" v-else-if="item.estado === 3">Cancelado</v-chip>
      </template>
    </v-data-table>
  </v-card>

  <v-card flat tile v-else-if="VISTA === 2">
    <formato_pagos :contrato="Contrato" :tipo="2"/>
  </v-card>
</v-card>
</template>

<script>
import formato_pagos from "@/components/contabilidad/formato_pagos.vue";
export default {
  name: "index",
  components:{formato_pagos},
  computed:{
    URL(){
      return this.$store.state.formato_pago_proveedores.tipo_contrato.URLFORMATOPAGO
    },
    VISTA(){
      return this.$store.state.formato_pago_proveedores.contrato_servicios.VISTA
    }
  },
  data(){
    return{
      search: '',
      Contratos: [],
      loadContratos: false,
      Contrato: {},
      header:[
        {text:'Proveedor', value:'proveedor'},
        {text:'Tipo de Gasto', value:'tipo_gasto'},
        {text:'Sucursal', value:'sucursal'},
        {text:'Numero de Contrato', value:'num_contrato'},
        {text:'Estado', value:'estado'},
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Contratos de Servicios');
    this.cargarContratos();
    this.$store.commit('formato_pago_proveedores/contrato_servicios/setVISTA',1);
    this.$store.commit('contabilidad/divisas/cargarMonedas');
  },
  methods:{
    cargarContratos(){
      this.loadContratos = true;
      this.$axios.get(this.URL+'contratos').then((res)=>{
        this.Contratos     = res.data.contratos;
        this.loadContratos = false;
      })
    },
    cargarContrato(data){
      this.$store.commit('activarOverlay', true);
      this.$axios.get(this.URL+'contrato/'+data.id).then((res)=>{
        this.Contrato = res.data.contrato;
        this.$store.commit('formato_pago_proveedores/contrato_servicios/setVISTA',2);
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

</style>
