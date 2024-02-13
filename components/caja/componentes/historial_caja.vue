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
      <v-col>
        <v-autocomplete dense class="ma-2" :items="tiposTransaccion" v-model="tipoTransaccion" label="tipo de Consulta"></v-autocomplete>
      </v-col>
      <v-col class="d-flex justify-end">
        <v-btn class="ma-2" color="success" small tile @click="consultar">Consultar  {{dia}}/{{mes}}/{{anio}}</v-btn>
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

    <historial_suc v-if="tipoTransaccion === 1" :tipo="2" :anio="anio" :mes="mes" :dia="dia"/>
    <creando_cierre :fecha="anio+'-'+mes+'-'+dia" v-else-if="tipoTransaccion === 2"/>
  </v-card>
</v-card>
</template>

<script>
import historial from "@/components/caja/historial";
import creando_cierre from "@/components/caja/componentes/creando_cierre.vue";
export default {
  name: "historial_caja",
  components:{historial_suc: historial, creando_cierre},
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
      titulo: '',
      tipoTransaccion: 1,
      tiposTransaccion:[
        {text:'Consultar Cierre', value: 1},
        {text:'Crear Cierre', value: 2},
      ],
      paginaCierre: false,
      Transacciones: []
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
        this.cierres = res.data.historial;

      })
    },
    consultar(){
      if (this.tipoTransaccion === 1)
        this.cargarCierres();
      else if (this.tipoTransaccion === 2)
        this.consultarParaRegistrarCierre();
    },
    consultarParaRegistrarCierre(){
      let fecha = this.anio+'-'+this.mes+'-'+this.dia;
      this.load = true;
      this.$axios.get(`cajas/consultar_cierre/${fecha}/caja/${this.$store.state.caja.CAJA.id}`).then((res)=>{
        if (res.data.estado == 0)
          this.$store.commit('notificacion',{texto:res.data.msj, color:'warning'});
        else if (res.data.estado == 1) {
          this.$store.commit('notificacion', {texto: res.data.msj, color:'success'});
          this.load = false;
          this.titulo = 'Creando del cierre del '+this.dia+'/'+this.mes+'/'+this.anio;
          this.$store.commit('caja/cargar_HISTORIAL', fecha);
          this.$store.commit('caja/cargar_TRANSACCIONES', fecha);
          this.vista  = 2;
        }

        this.load = false;
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
