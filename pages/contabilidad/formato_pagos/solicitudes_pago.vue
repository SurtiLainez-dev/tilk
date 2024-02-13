<template>
<v-card flat tile>
  <div style="height: 95vh" v-if="VISTA === 1">
    <v-progress-linear indeterminate v-if="LOADSOLICITUDES"></v-progress-linear>


    <div style="height: 95%; overflow-y: auto; overflow-x: hidden">
      <table>
        <thead class="grey">
        <tr>
          <th colspan="4">
            <span style="font-size: 15px">Solicitudes de Pago</span>
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
          <th>Cod.</th>
          <th>Detalle</th>
          <th>Proveedor</th>
          <th>Acreedor</th>
          <th class="text-center">Estado</th>
        </tr>
        </thead>
        <tbody >
        <tr v-for="(item, index) in filterSOLICITUDES" @click="cargarSOLICITUD(item)">
          <td>{{index + 1}}</td>
          <td v-html="resaltarRows(item.cod)"></td>
          <td v-html="resaltarRows(item.detalle)"></td>
          <td >{{item.proveedor}}</td>
          <td >{{item.acreedor}}</td>
          <td class="text-center">
            <v-chip x-small v-if="item.estado === 0" color="success" dark>Abierto</v-chip>
            <v-chip x-small v-else-if="item.estado === 1" color="red" dark>Cerrado</v-chip>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <v-card-actions class="grey" style=" width: 100%; height: 5%">
      <v-row no-gutters>
        <v-col cols="2"><span class="text-white" style="font-size: 10px">Resultados: <strong>{{resultados}}</strong> solicitudes de pago</span></v-col>
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
  </div>

  <div v-else-if="VISTA === 2">
    <v-toolbar dense flat tile>
      <v-btn color="orange" small fab dark icon text @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-card-title>{{SOLICITUD.detalle_print}} - {{SOLICITUD.cod}}</v-card-title>
    </v-toolbar>
    <v-divider></v-divider>
    <solicitud_pago_proveedor :niveles="niveles"/>
  </div>
</v-card>
</template>

<script>
import solicitud_pago_proveedor from "@/components/contabilidad/formato_pago_proveedores/solicitud_pago_proveedor.vue";
export default {
  name: "solicitudes_pago",
  components:{solicitud_pago_proveedor},
  created() {
    this.VISTA = 1;
    this.$store.commit('guardarTitulo','Contabilidad > Solicitudes de Pago');
    this.$store.commit('contabilidad/solicitudes_pago/cargarSOLICITUDES');
  },
  data(){
    return{
      search: '',
      resultados: 0,
      paginas: 0,
      filas: 100,
      page: 1,
      niveles: []
    }
  },
  computed:{
    filterSOLICITUDES(){
      let filtro = [];
      filtro = this.SOLICITUDES.filter(fila =>{
        let detalle = fila.detalle.toString().toLowerCase();
        let codigo = fila.cod.toString().toLowerCase();
        let proveedor = ''
        let acreedor = '';
        if (fila.proveedor) {
          proveedor = fila.proveedor.toString().toLowerCase();
        }
        if (fila.acreedor)
          acreedor= fila.acreedor.toString().toLowerCase();

        let search   = this.search.toLowerCase()

        return detalle.includes(search) || codigo.includes(search) || proveedor.includes(search)
            || acreedor.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
    LOADSOLICITUDES() {
      return this.$store.state.contabilidad.solicitudes_pago.LOADSOLICITUDES;
    },
    SOLICITUD(){
      return this.$store.state.contabilidad.solicitudes_pago.SOLICITUD;
    },
    SOLICITUDES() {
      return this.$store.state.contabilidad.solicitudes_pago.SOLICITUDES;
    },
    VISTA:{
      get: function (){
        return this.$store.state.contabilidad.solicitudes_pago.VISTA;
      },
      set: function (val){
        this.$store.commit('contabilidad/solicitudes_pago/cambiarVISTA', val);
      }
    }
  },
  methods:{
    cargarSOLICITUD(data){
      this.$store.commit('activarOverlay', true);
      this.$axios.get('contabilidad/formato_pago/solicitud_pago/'+data.id).then((res)=>{
        this.$store.commit('contabilidad/solicitudes_pago/setSOLICITUD', res.data.solicitud)
        this.$store.commit('activarOverlay', false);
        this.niveles = res.data.niveles;
        this.VISTA   = 2;
      })
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
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
table tbody tr{
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
table tbody tr:hover{
  color: blue;
}
</style>
