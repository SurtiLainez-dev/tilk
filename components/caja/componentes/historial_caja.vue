<template>
<v-card flat>
  <v-card-subtitle>Cierre del {{dia}}/{{mes}}/{{anio}}</v-card-subtitle>
  <v-card flat v-if="vista === 1">
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
        <v-btn class="ma-2" color="success" small tile @click="cargarCierres">Consultar Cierres del  {{dia}}/{{mes}}/{{anio}}</v-btn>
      </v-col>
    </v-row>

    <v-data-table dense :headers="header" :loading="load" :items="cierres" @click:row="goHistorial"
                  loading-text="Cargando cierres"class="rowsTable">
      <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
      <template v-slot:item.ingreso="{item}">L. {{int.format(item.ingreso)}}</template>
      <template v-slot:item.egreso="{item}">L. {{int.format(item.egreso)}}</template>
      <template v-slot:item.efectivo="{item}">L. {{int.format(item.efectivo)}}</template>
      <template v-slot:item.efectivo_declarado="{item}">L. {{int.format(item.efectivo_declarado)}}</template>
    </v-data-table>
  </v-card>


  <v-card flat v-else-if="vista === 2">
    <v-toolbar dense color="grey lighten-3" flat>
      <v-btn color="orange" fab x-small dark @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      {{titulo}}
    </v-toolbar>

    <historial_suc :tipo="2" :anio="anio" :mes="mes" :dia="dia"/>
  </v-card>
</v-card>
</template>

<script>
import historial from "@/components/caja/historial";
export default {
  name: "historial_caja",
  components:{historial_suc: historial},
  data(){
    return{
      anio: 0,
      mes: 0,
      dia: 0,
      meses: [1,2,3,4,5,6,7,8,9,10,11,12],
      dias: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
      load:  false,
      cierres: [],
      int: new Intl.NumberFormat(),
      vista: 1,
      header:[
        {text:'Sucursal', value:'cajas.sucursal.nombre'},
        {text:'Caja', value:'cajas.codigo'},
        {text:'Total', value:'total'},
        {text:'Ingresos', value:'ingreso'},
        {text:'Egresos', value:'egreso'},
        {text:'Efectivo Ingresado', value:'efectivo'},
        {text:'Efectivo Declarado', value:'efectivo_declarado'}
      ],
      titulo: ''
    }
  },
  created() {
    let fecha = new Date();
    this.anio = fecha.getFullYear();
    this.mes  = fecha.getMonth() + 1;
    this.dia  = fecha.getDate();
    this.cargarCierres();
  },
  methods:{
    cargarCierres(){
      this.load = true;
      this.$axios.get(`cajas/historial_cierre/${this.anio}-${this.mes}-${this.dia}/caja/${this.$store.state.caja.CAJA.id}`).then((res)=>{
        this.load = false;
        this.cierres = res.data.historial
      })
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

</style>