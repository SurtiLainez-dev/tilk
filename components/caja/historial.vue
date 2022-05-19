<template>
  <v-card flat>
    <v-card-subtitle>Resumen de la Caja</v-card-subtitle>
    <v-row>
      <v-col>
        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Total de Ingresos</th>
              <td>L. {{int.format(HISTORIAL.total)}}</td>
            </tr>
            <tr>
              <th>Total de Ingreso de Efectivo</th>
              <td>L. {{int.format(HISTORIAL.ingreso)}}</td>
            </tr>
            <tr>
              <th>Total de Egresos</th>
              <td>L. {{int.format(HISTORIAL.egreso)}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table class="rowsTable" dense>
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Efectivo al Final del Día</th>
              <td>L. {{int.format(HISTORIAL.efectivo)}}</td>
            </tr>
            <tr>
              <th>Efectivo Declarado</th>
              <td>L. {{int.format(HISTORIAL.efectivo_declarado)}}</td>
            </tr>
            <tr>
              <th>Descuadre</th>
              <td>L. {{int.format(HISTORIAL.descuadre)}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense class="rowsTable">
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Sucursal</th>
              <td>{{HISTORIAL.cajas.sucursal.nombre}}</td>
            </tr>
            <tr>
              <th>Caja</th>
              <td>{{HISTORIAL.cajas.codigo}}</td>
            </tr>
            <tr>
              <th>Documento</th>
              <td><b-link @click="verDocumento(HISTORIAL.file)">Ver Cierre</b-link></td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-simple-table dense class="rowsTable">
          <template v-slot:default>
            <tbody>
            <tr>
              <th>Fecha de Cierre</th>
              <td>{{HISTORIAL.fecha}}</td>
            </tr>
            <tr>
              <th>Observación</th>
              <td>{{HISTORIAL.observacion}}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-card-subtitle>Resumen de Formas de Pago</v-card-subtitle>
    <v-simple-table dense height="150px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Total</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="HISTORIAL.resumen_fp" v-for="item in JSON.parse(HISTORIAL.resumen_fp)">
          <td>{{item.nombre}}</td>
          <td>L. {{int.format(item.total)}}</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-divider></v-divider>

    <v-card-subtitle>Resumen de Caja</v-card-subtitle>
    <v-simple-table dense height="250px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Hora</th>
          <th>Detalle</th>
          <th>Saldo Anterior</th>
          <th>Pago</th>
          <th>Saldo Actual</th>
          <th>Forma de Pago</th>
          <th>Tipo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="HISTORIAL.resumen_fp" v-for="item in JSON.parse(HISTORIAL.resumen)">
          <td>{{item.hora}}</td>
          <td>{{item.detalle}}</td>
          <td>L. {{int.format(item.saldoA)}}</td>
          <td>L. {{int.format(item.total)}}</td>
          <td>L. {{int.format(item.saldoNuevo)}}</td>
          <td>{{item.forma_pago}}</td>
          <td v-if="item.tipo === 0">+</td>
          <td v-else>-</td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-subtitle>Historial Completo de Caja</v-card-subtitle>
    <v-progress-linear indeterminate v-if="loadHistorial"></v-progress-linear>
    <v-simple-table dense height="500px" fixed-header class="rowsTable">
      <template v-slot:default>
        <thead>
        <tr>
          <th>Tipo de Documento</th>
          <th>Referencia</th>
          <th>Forma de Pago</th>
          <th>Tipo</th>
          <th>Archivo</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in historial">
          <td>
            <v-chip x-small dark color="indigo" v-if="item.tipo_documento === 1">FACTURA</v-chip>
            <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 2">RECIBO</v-chip>
            <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 3">PAGO AGREGADO</v-chip>
            <v-chip x-small dark color="red" v-else-if="item.tipo_documento === 4">EGRESO</v-chip>
            <v-chip x-small dark color="indigo" v-else-if="item.tipo_documento === 5">ANTICIPO DE CLIENTE</v-chip>
          </td>
          <td v-if="(item.tipo_documento === 2 || item.tipo_documento === 3 || item.tipo_documento || 5) && item.recibo">{{item.recibo.codigo}}</td>
          <td v-else-if="item.tipo_documento === 4">{{item.referencia}}</td>
          <td>{{item.forma_pago.nombre}}</td>
          <td v-if="item.tipo === 0">+</td>
          <td v-else>-</td>
          <td>
            <b-link v-if="item.tipo_documento === 1 && item.factura" @click="solicitarClave(1, 0, item)">Ver</b-link>
            <b-link v-else-if="item.tipo_documento === 2 && item.recibo" @click="solicitarClave(2,2,item.recibo)">Ver</b-link>
            <b-link v-else-if="item.tipo_documento === 3 && item.recibo" @click="solicitarClave(2,3,item.recibo)">Ver</b-link>
            <b-link v-else-if="item.tipo_documento === 4" @click="verDocumento(item.historial)">Ver Egreso</b-link>
            <b-link v-else-if="item.tipo_documento === 5 && item.recibo" @click="solicitarClave(2,5,item.recibo)">Ver</b-link>
          </td>
        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <br>
    <br>
    <br>

  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "historial",
  props:{
    anio: Number,
    mes: Number,
    dia: Number
  },
  data(){
    return{
      int:new Intl.NumberFormat(),
      historial: [],
      loadHistorial: false
    }
  },
  computed:{
    HISTORIAL(){
      return this.$store.state.cajas.historial.SUCURSAL;
    },
    USUARIO(){
      return this.$store.state.usuario;
    }
  },
  created() {
    this.cargarHistorial();
  },
  methods:{
    abrirNavegador(clave, tipo, recibo){
      let url = '';
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+this.fac.factura.contador+'/'+clave;
      else if(tipo === 2 && recibo === 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if(tipo === 2 && recibo === 3)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + this.fac.codigo + '/' + clave;
      else if (tipo === 2 && recibo === 5)
        url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_anticipo/usuario='+this.USUARIO+'/recibo='+this.fac.codigo+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    cargarHistorial(){
      this.loadHistorial = true;
      this.$axios.get('caja/'+this.HISTORIAL.cajas.id+'/historial/'+this.anio+'-'+this.mes+'-'+this.dia).then((res)=>{
        this.loadHistorial = false;
        this.historial = res.data.historial;
      })
    },
    solicitarClave(tipo, recibo, data){
      this.$store.commit('activarOverlay', true);
      this.fac = data;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, tipo, recibo);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
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
.rowsTable{
  cursor: pointer;
}
</style>
