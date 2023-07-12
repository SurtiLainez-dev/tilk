<template>
  <v-card flat tile>
    <v-card flat tile v-if="VISTA === 1">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Documentos por Cobrar</v-toolbar-title>
          <v-spacer></v-spacer>

        </v-toolbar>

        <v-row no-gutters >
          <v-col cols="8">

          </v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-text-field v-model="search" label="Buscar ..."
                          append-outer-icon="mdi-magnify"></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-progress-linear indeterminate v-if="LOADDXCS"></v-progress-linear>
      <table>
        <thead>
        <tr>
          <th style="border: 0px" colspan="8">Filtros</th>
        </tr>
        <tr>
          <th style="border: 0px" colspan="2" class="text-center">
            DXC Pendientes
          </th>
          <th style="border: 0px" colspan="6"></th>
        </tr>
        <tr>
          <th class="text-center" colspan="2" style="border: 0px; border-bottom: solid #e3e3e3">
            <vs-checkbox size="small" v-model="seleccPendientes"></vs-checkbox>
          </th>
          <td colspan="6" style="border: 0px; border-bottom: solid #e3e3e3"></td>
        </tr>
        <tr>
          <th style="border: 0px; border-bottom: solid #e3e3e3" colspan="2">Resultados: {{resultados}}</th>
          <th style="border: 0px; border-bottom: solid #e3e3e3" colspan="2">Resultados Pendiente: {{resultadosPendientes}}</th>
          <th style="border: 0px; border-bottom: solid #e3e3e3" colspan="2">Total Pendiente: L. {{Intl.NumberFormat().format(total)}}</th>
          <th style="border: 0px; border-bottom: solid #e3e3e3" colspan="2"></th>
        </tr>
        </thead>
        <thead>
        <tr>
          <th style="width: 2%">#</th>
          <th>Descripción</th>
          <th>Fecha de Pago</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Venta</th>
          <th>Sucursal</th>
          <th>Cliente</th>
        </tr>
        </thead>
        <tbody>
        <tr @click="goDxc(item)" v-for="(item, index) in filterDXC">
          <td>{{index + 1}}</td>
          <td v-text="item.descripcion"></td>
          <td>{{item.fecha_pago.split('-')[2]}}/{{item.fecha_pago.split('-')[1]}}/{{item.fecha_pago.split('-')[0]}}</td>
          <td>
            <v-chip x-small color="success" dark v-if="item.estado === 2">Cancelado</v-chip>
            <v-chip x-small color="error" dark v-else-if="item.estado === 1">Pendiente</v-chip>
            <v-chip x-small color="orange" dark v-else-if="item.estado === 3">De baja por usuario</v-chip>
          </td>
          <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
          <td>{{item.cod}}</td>
          <td>{{item.sucursal}}</td>
          <td>{{item.nombres}} {{item.apellidos}}</td>
        </tr>
        </tbody>
      </table>
    </v-card>

    <v-card flat tile v-else-if="VISTA === 2">
      <v-toolbar tile flat color="grey lighten-4">
        <v-btn color="orange" fab dark text small icon @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>{{DXC.descripcion}} - {{DXC.venta.cliente.nombres}} {{DXC.venta.cliente.apellidos}} - Venta #{{DXC.venta.cod}}</v-toolbar-title>
      </v-toolbar>

      <vista_dxc/>
    </v-card>
  </v-card>
</template>

<script>
import vista_dxc from "@/components/contabilidad/vista_dxc.vue";
import {vsCheckbox, vsIcon} from 'vuesax';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import Vue from "vue";
export default {
  name: "dxc",
  components:{vista_dxc},
  data(){
    return{
      search: '',
      loadDxc: true,
      dxcs: [],
      resultados: 0,
      resultadosPendientes: 0,
      total: 0,
      seleccPendientes: false
    }
  },
  created() {
    Vue.use(vsCheckbox);
    Vue.use(vsIcon);
    this.$store.commit('contabilidad/dxc/cargar_DXCS');
  },
  computed:{
    filterDXC(){
      let filtro = [];
      filtro = this.DXCS.filter(fila =>{
        let nombres     = fila.nombres.toString().toLowerCase();
        let apellidos   = fila.apellidos.toString().toLowerCase();
        let sucursal    = fila.sucursal.toString().toLowerCase();
        let descripcion = fila.descripcion.toString().toLowerCase();
        let observacion = fila.observacion.toString().toLowerCase();
        let search      = this.search.toLowerCase()

        return nombres.includes(search) || apellidos.includes(search) || sucursal.includes(search) ||
            descripcion.includes(search) || observacion.includes(search)
      });
      if (this.seleccPendientes)
        filtro = filtro.filter(item=> item.estado === 1)


      this.resultados = filtro.length;
      if (filtro.length > 0) {
        let filtroPendientes = filtro.filter(item=> item.estado === 1);
        this.resultadosPendientes = filtroPendientes.length;
        this.total = filtroPendientes.reduce((a, b) => a + parseFloat(b.total), 0);
      }

      return filtro
    },
    LOADDXCS(){
      return this.$store.state.contabilidad.dxc.LOADDXCS;
    },
    DXC(){
      return this.$store.state.contabilidad.dxc.DXC;
    },
    DXCS(){
      return this.$store.state.contabilidad.dxc.DXCS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.contabilidad.dxc.VISTA;
      },
      set: function (vista){
        this.$store.commit('contabilidad/dxc/cambiar_VISTA', vista)
      }
    }
  },
  methods:{
    goDxc(data){
      this.$store.commit('contabilidad/dxc/cargar_DXC', data.id);
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}
</style>