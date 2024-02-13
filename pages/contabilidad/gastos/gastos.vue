<template>
  <v-card style="height: 95vh" flat tile>
    <v-progress-linear indeterminate v-if="LOAD_GASTOS"></v-progress-linear>

      <v-card flat tile height="95%" style="overflow-y: auto">
        <table>
          <thead class="grey">
          <tr>
            <th colspan="4">
              <span style="font-size: 15px">Facturas de Gastos Cargadas</span>
            </th>
            <th colspan="8">
              <v-row no-gutters>
                <v-col class="d-flex justify-end">
                  <div><input type="text" placeholder="Buscar ..."
                              :style="search.length  === 0 ? 'background-color: white;': 'background-color: transparent'"
                              v-model="search" class="pa-0 ma-2"></div>
                </v-col>
              </v-row>
            </th>
          </tr>
          <tr>
            <th style="min-width: 10px">#</th>
            <th>Sucursal</th>
            <th>Gasto</th>
            <th>Correlativo</th>
            <th>Caja Chica</th>
            <th class="text-center">Estado</th>
            <th>Total</th>
            <th>Proveedor</th>
            <th class="text-center">Reembolso</th>
            <th>Acreedor</th>
            <th>Documento</th>
            <th>Mas Info...</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in filterGASTOS">
            <td>{{index + 1}}</td>
            <td v-html="resaltarRows(item.sucursal)"></td>
            <td v-html="resaltarRows(item.gasto)"></td>
            <td v-if="item.correlativo" v-html="resaltarRows(item.correlativo)"></td>
            <td v-else>-----</td>
            <td><span v-if="item.caja">{{item.caja}}</span><span v-else>-----</span></td>
            <td class="text-center">
              <v-icon x-small v-if="item.estado === 1" color="green">fa fa-check</v-icon>
              <v-icon x-small v-else color="red">fa fa-times</v-icon>
            </td>
            <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
            <td v-if="item.proveedor" v-html="resaltarRows(item.proveedor)"></td>
            <td v-else>-----</td>
            <td class="text-center">
              <v-icon x-small v-if="item.reembolso === 1" color="green">fa fa-check</v-icon>
              <v-icon x-small v-else color="red">fa fa-times</v-icon>
            </td>
            <td><span v-if="item.acreedor">{{item.acreedor}}</span><span v-else>-----</span></td>
            <td><b-link @click="verDocumento(item.file)">Ver doc.</b-link></td>
            <td><b-link>Mas info...</b-link></td>
          </tr>
          </tbody>
        </table>
      </v-card>


      <v-card-actions class="grey" style=" width: 100%; height: 5%">
        <v-row no-gutters>
          <v-col cols="2"><span class="text-white" style="font-size: 10px">Resultados: <strong>{{resultados}}</strong> gastos</span></v-col>
          <v-col cols="2">
            <v-row no-gutters>
              <v-col><span class="text-white" style="font-size: 10px">Filas a mostrar</span></v-col>
              <v-col>
                <select v-model="filas">
                  <option :value="100">100</option>
                  <option :value="250">250</option>
                  <option :value="500">500</option>
                  <option :value="1000">1000</option>
                  <option :value="1500">1500</option>
                  <option :value="2000">2000</option>
                  <option :value="5000">5000</option>
                  <option :value="10000">10000</option>
                  <option :value="20000">20000</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-pagination
                v-model="page"
                :length="paginas"
                :total-visible="6"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
</template>

<script>
// class Resize {
//   constructor() {
//     this.columnResizing = null;
//     this.columnResizingOffset = 0;
//     this.AddResizingEvent();
//   }
//
//   AddResizingEvent(){
//     document.querySelectorAll("thead th").forEach(th =>{
//       let grip = document.createElement("div");
//       grip.style.height = document.querySelector("table").offsetHeight+"px";
//       grip.classList.add("grip");
//
//       th.appendChild(grip)
//
//       grip.addEventListener("mousedown", (e)=>{
//         this.columnResizing = th;
//         this.columnResizingOffset = th.offsetWidth - e.pageX;
//
//         this.columnResizing.classList.add("resizing");
//       })
//     })
//   }
// }
//
// new Resize();

import "tabulator-tables/dist/css/tabulator.min.css"
import {ipcRenderer} from "electron";
export default {
  name: "gastos",
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Gastos > Facturas Cargadas');
    let date = new Date();
    this.fecha_inicio = date.getFullYear()+'-01-01';
    this.fecha_final  = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();
    this.$store.commit('gastos/cargarGastos', {fecha_inicio: this.fecha_inicio, fecha_final: this.fecha_final, caja_chica_id: null});
  },
  data(){
    return{
      Search: '',
      Gasto: {},
      fecha_inicio: '',
      fecha_final: '',
      caja_chica_id: 0,
      filas: 100,
      paginas: 1,
      page: 1,
      resultados: 0,
      search: ''
    }
  },
  computed:{
    GASTOS(){
      return this.$store.state.gastos.GASTOS;
    },
    LOAD_GASTOS(){
      return this.$store.state.gastos.LOAD_GASTOS
    },
    filterGASTOS(){
      let filtro = [];
      filtro = this.GASTOS.filter(fila =>{
        let sucursal = fila.sucursal.toString().toLowerCase();
        let gasto = fila.gasto.toString().toLowerCase();
        let correlatico = '';
        if (fila.correlativo)
          correlatico = fila.correlativo.toString().toLowerCase();
        let proveedor = ''
        if (fila.proveedor)
          proveedor = fila.proveedor.toString().toLowerCase();
        let acreedor = '';
        if (fila.acreedor)
          acreedor= fila.acreedor.toString().toLowerCase();
        let total = fila.total.toString().toLowerCase();
        // let estado   = fila.remision_articulo.estado_articulo.nombre.toString().toLowerCase();
        let search   = this.search.toLowerCase()

        return sucursal.includes(search) || gasto.includes(search) || correlatico.includes(search) ||
            proveedor.includes(search) || acreedor.includes(search) || total.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
  },
  methods:{
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

table{
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  position: relative;
}
table thead tr{
  cursor: pointer;
}
table thead tr th{
  border-top: solid 1px #7F828B;
  font-size: 10px;
  color: white;
  box-sizing: border-box;
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4);
  background-color: #7F828B;

}
table tbody tr td{
  font-size: 9px;
  margin-left: 5px;
  padding: 5px;
}
input{
  border: none;
  font-size: 10px;
  height: 20px;
  padding: 5px;
  width: 200px;
  color: white;
  border-bottom: solid 1px #FFFFFF;
}
.cajaInput {
  border:1px solid #d9d9d9;
  height:20px;
  overflow: hidden;
  width: 200px;
  position:relative;
}
select {
  background: transparent;
  border: none;
  font-size: 10px;
  height: 22px;
  padding: 5px;
  width: 50px;
  border-bottom: solid 1px #FFFFFF;
}
table tbody tr:nth-of-type(even) { background-color: #f3f3f3; }
</style>
