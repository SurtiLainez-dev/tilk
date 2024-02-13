<template>
  <v-card flat>
    <v-card v-if="vista === 1">
      <v-toolbar flat color="grey lighten-3">
        <v-card-title>Historial de Cierres de Surtidora Laínez</v-card-title>
      </v-toolbar>
      <v-row>
        <v-col>
          <v-text-field dense class="ma-2" v-model="anio" label="Año"></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete dense class="ma-2" v-model="mes" :items="meses" label="Seleccionar Mes"></v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete dense class="ma-2" :items="dias" v-model="dia" label="Seleccionar Día"></v-autocomplete>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-btn class="ma-2" color="success" small tile @click="cargarHistorial">Consultar Cierres del  {{dia}}/{{mes}}/{{anio}}</v-btn>
        </v-col>
      </v-row>

      <v-data-table dense :headers="header" :loading="LOADH" :items="SUCURSALES"
                    loading-text="Cargando cierres" @click:row="goHistorial" class="rowsTable">
        <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
        <template v-slot:item.ingreso="{item}">L. {{int.format(item.ingreso)}}</template>
        <template v-slot:item.egreso="{item}">L. {{int.format(item.egreso)}}</template>
        <template v-slot:item.efectivo="{item}">L. {{int.format(item.efectivo)}}</template>
        <template v-slot:item.efectivo_declarado="{item}">L. {{int.format(item.efectivo_declarado)}}</template>
      </v-data-table>
    </v-card>

    <v-card v-else-if="vista === 2">
      <v-toolbar dense color="grey lighten-3" flat>
        <v-btn color="orange" fab x-small dark @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        {{titulo}}
      </v-toolbar>

      <historial_suc :tipo="1" :anio="anio" :mes="mes" :dia="dia"/>
    </v-card>
  </v-card>
</template>

<script>
import historial from "@/components/caja/historial";
export default {
  name: "pestana_historial_cierres",
  components:{historial_suc: historial},
  data(){
    return{
      vista: 1,
      anio: 0,
      meses: [1,2,3,4,5,6,7,8,9,10,11,12],
      dias: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      mes: 0,
      dia: 0,
      int: new Intl.NumberFormat(),
      header:[
        {text:'Sucursal', value:'cajas.sucursal.nombre'},
        {text:'Caja', value:'cajas.codigo'},
        {text:'Total', value:'total'},
        {text:'Ingresos', value:'ingreso'},
        {text:'Egresos', value:'egreso'},
        {text:'Efectivo Ingresado', value:'efectivo'},
        {text:'Efectivo Declarado', value:'efectivo_declarado'},
      ],
      titulo: ''
    }
  },
  computed:{
    SUCURSALES(){
      return this.$store.state.cajas.historial.SUCURSALES;
    },
    LOADH(){
      return this.$store.state.cajas.historial.LOADSUCURSALES;
    }
  },
  created() {
    let fecha = new Date();
    this.anio = fecha.getFullYear();
    this.mes  = fecha.getMonth() + 1;
    this.dia  = fecha.getDate();
    this.$store.commit('cajas/historial/cargar_HISTORIAL', this.anio+'-'+this.mes+'-'+this.dia);
  },
  methods:{
    cargarHistorial(){
      this.$store.commit('cajas/historial/cargar_HISTORIAL', this.anio+'-'+this.mes+'-'+this.dia);
    },
    goHistorial(item){
      this.$store.commit('cajas/historial/asignar_HISTORIAL', item);
      this.titulo = 'CAJA '+item.cajas.codigo+' DE '+item.cajas.sucursal.nombre+' DEL DÍA '+this.dia+'/'+this.mes+'/'+this.anio
      this.vista = 2;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
