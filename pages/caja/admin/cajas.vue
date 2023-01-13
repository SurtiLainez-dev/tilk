<template>
<v-card flat>
  <v-card flat v-if="vista === 1">
    <v-card height="100" flat :loading="loadTotales">
      <v-toolbar flat dense color="grey-lighten-5">
        <v-toolbar-title>Cajas Hoy</v-toolbar-title>
      </v-toolbar>
      <table>
        <thead>
        <tr>
          <th>Total de Ingresos</th>
          <th>Total de Ingreso en Efectivo</th>
          <th>Total de Ingreso con Tarjeta</th>
          <th>Total de Egresos</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>L. {{int.format(totalIngreso)}}</td>
          <td>L. {{int.format(TotalEfectivo)}}</td>
          <td>L. {{int.format(totalTarjeta)}}</td>
          <td>L. {{int.format(totalEgresos)}}</td>
        </tr>
        </tbody>
      </table>
    </v-card>
    <br>
    <v-data-table dense :headers="headers" :items="CAJAS" :loading="loadCajas"
                  loading-text="Cargando cajas ..." @click:row="goCaja">
      <template v-slot:item.estado_cierre="{item}">
        <v-chip x-small dark v-if="item.estado_cierre === 1" color="success">Abierta</v-chip>
        <v-chip x-small dark v-else-if="item.estado_cierre === 0" color="orange">Cerrada</v-chip>
      </template>
      <template v-slot:item.activa="{item}">
        <v-chip x-small dark v-if="item.activa === 1" color="success">Disponible</v-chip>
        <v-chip x-small dark v-else-if="item.activa === 0" color="orange">No Disponible</v-chip>
      </template>
      <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
    </v-data-table>
  </v-card>

  <v-card v-else-if="vista === 2">
    <v-card height="100" flat>
      <v-toolbar flat dense color="grey-lighten-5">
        <v-btn small fab color="warning" text @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>Caja {{caja.codigo}} - {{caja.sucursal.nombre}} {{fecha.getDate()}}/{{fecha.getMonth()+1}}/{{fecha.getFullYear()}}</v-toolbar-title>
      </v-toolbar>
    </v-card>

    <caja :caja="caja.id"/>
  </v-card>
</v-card>
</template>

<script>
import caja from "@/components/caja/admin/caja.vue";
export default {
  name: "cajas",
  components:{caja},
  created() {
    this.cargarCajas();
    this.cargarTotales();
  },
  data(){
    return{
      fecha: new Date(),
      loadTotales: true,
      totalTarjeta: 0,
      totalEgresos: 0,
      totalIngreso: 0,
      caja: {},
      vista: 1,
      int: Intl.NumberFormat(),
      loadCajas: true,
      headers:[
        {text: 'Sucursal', value:'sucursal.nombre'},
        {text: '#', value:'num_caja'},
        {text: 'Código', value:'codigo'},
        {text: 'Total', value:'total'},
        {text: 'Responsable', value:'user.usuario'},
        {text: 'Estado', value:'estado_cierre'},
        {text: 'Estado Configuración', value:'activa'},
      ],
    }
  },
  computed:{
    CAJAS(){
      return this.$store.state.caja.CAJAS;
    },
    TotalEfectivo(){
      let total = 0;
      if (this.CAJAS.length > 0){
        this.CAJAS.forEach((item)=>{
          total = total + item.total
        })
      }
      return total.toFixed(2);
    }
  },
  methods:{
    cargarCajas(){
      this.$axios.get('cajas/cajas').then((res)=>{
        this.$store.commit('caja/agregar_CAJAS', res.data.cajas)
        this.loadCajas = false;
      })
    },
    cargarTotales(){
      let     f = new Date();
      let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
      this.$axios.get('cajas/total_ingresos/'+fecha).then((res)=>{
        this.totalTarjeta = res.data.totalT;
        this.totalIngreso = res.data.totalI;
        this.totalEgresos = res.data.totalE;
        this.loadTotales  = false;
      })
    },
    goCaja(data){
      this.caja = data;
      this.vista = 2;
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
  border-top: solid #b2b0b0 1px;
}
table thead tr th{
  padding: 5px;
  font-size: 14px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>
