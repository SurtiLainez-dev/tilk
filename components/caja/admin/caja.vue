<template>
<v-card>
  <v-data-table class="grey lighten-5" dense :headers="header"
                :loading="LOAD_DOCUMENTOS"
                loading-text="Cargando Documentos ..."
                :items="DOCUMENTOS_HOY">
    <template v-slot:item.tipo_documento="{item}">
      <v-chip dark x-small color="success" v-if="item.tipo_documento === 1">Factura</v-chip>
      <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 2">Recibo</v-chip>
      <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 3">DXC</v-chip>
      <v-chip dark x-small color="indigo" v-if="item.tipo_documento === 5">Anticipos</v-chip>
    </template>
    <template v-slot:item.total="{item}">
      L {{int.format(item.total)}}
    </template>
    <template v-slot:item.id="{item}">
      <b-link v-if="item.tipo_documento === 1 && item.factura" @click="solicitarClave(1, 0, item)">{{item.factura.contador}}</b-link>
      <b-link v-else-if="item.tipo_documento === 2 && item.recibo" @click="solicitarClave(2,2,item.recibo)">{{item.recibo.codigo}}</b-link>
      <b-link v-else-if="item.tipo_documento === 3 && item.recibo" @click="solicitarClave(2,3,item.recibo)">{{item.recibo.codigo}}</b-link>
      <b-link v-else-if="item.tipo_documento === 5 && item.recibo" @click="solicitarClave(2,5,item.recibo)">{{item.recibo.codigo}}</b-link>
    </template>
  </v-data-table>
  <v-data-table dense :items="TRANSACCIONES"
                :loading="LOAD_TRANSACCIONES" :headers="headers">
    <template v-slot:item.tipo_doc="{item}">
      <v-chip dark x-small v-if="item.tipo_doc === 1" color="success">Factura</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_doc === 2" color="indigo">Recibo</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_doc === 3" color="pink">DXC</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_doc === 4" color="orange">Egreso</v-chip>
      <v-chip dark x-small v-else-if="item.tipo_doc === 5" >Anticipo</v-chip>
    </template>
    <template v-slot:item.tipo="{item}">
      <span v-if="item.tipo === 0">+</span>
      <span v-else-if="item.tipo === 1">-</span>
    </template>
    <template v-slot:item.saldoA="{item}">L {{int.format(item.saldoA)}}</template>
    <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
    <template v-slot:item.saldoNuevo="{item}">L {{int.format(item.saldoNuevo)}}</template>
    <template v-slot:item.detalle="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <span v-on="on" v-bind="attrs">{{item.detalle.substr(0,15)}} ...</span>
        </template>
        <span>{{item.detalle}}</span>
      </v-tooltip>
    </template>
  </v-data-table>
  <v-data-table :items="FORMA_PAGOS" :loading="LOAD_FORMA_PAGOS"
                loading-text="Cargando Datos"
                :headers="headerFP" dense>
    <template v-slot:item.total="{item}">
      L {{int.format(item.total)}}
    </template>
  </v-data-table>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "caja",
  props:{caja: Number},
  data(){
    return{
      int: Intl.NumberFormat(),
      header:[
        {text:'Tipo',value:'tipo_documento'},
        {text:'Código',value:'id'},
        {text:'Total',value:'total'},
      ],
      headerFP:[
        {text:'Nombre',value:'nombre'},
        {text:'Total',value:'total'},
      ],
      headers:[
        {text:'Tipo Doc.', value:'tipo_doc'},
        {text:'Tipo', value:'tipo'},
        {text:'Hora', value:'hora'},
        {text:'Forma Pago', value:'forma_pago'},
        {text:'Detalle', value:'detalle'},
        {text:'Saldo Ant.', value:'saldoA'},
        {text:'Total', value:'total'},
        {text:'Saldo Nuevo', value:'saldoNuevo'},
      ],
    }
  },
  created() {
    this.$store.commit('caja/agregar_CAJA_ID', this.caja)
    let     f = new Date();
    let fecha = f.getFullYear()+'-'+(f.getMonth() + 1)+'-'+f.getDate();
    this.$store.commit('caja/cargar_DOCUMENTOS',{fecha: fecha, caja: this.caja, tipo: 3});
    this.$store.commit('caja/cargar_TRANSACCIONES', fecha);
    this.$store.commit('caja/cargar_HISTORIAL', fecha);
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
    LOAD_DOCUMENTOS() {
      return this.$store.state.caja.LOADDOCUMENTOS_HOY;
    },
    DOCUMENTOS_HOY(){
      return this.$store.state.caja.DOCUMENTOS_HOY;
    },
    LOAD_TRANSACCIONES(){
      return this.$store.state.caja.LOAD_TRANSACCIONES;
    },
    TRANSACCIONES(){
      let transacciones = this.$store.state.caja.TRANSACCIONES;
      let datos         = [];
      let saldo         = 0, detalle = '', saldoA = 0, fecha= new Date();
      transacciones.forEach((item)=>{
        if (item.tipo_documento === 1)
          detalle = `Pago de Factura de ${item.factura.venta.cliente.nombres} ${item.factura.venta.cliente.apellidos}, de venta # ${item.factura.venta.cod}`;
        else if(item.tipo_documento === 2)
          detalle = `Pago de Recibo de ${item.recibo.venta.cliente.nombres} ${item.recibo.venta.cliente.apellidos}, de venta # ${item.recibo.venta.cod}`;
        else if (item.tipo_documento === 3)
          detalle = `Pago de documento por cobrar de ${item.recibo.venta.cliente.nombres} ${item.recibo.venta.cliente.apellidos}, de venta # ${item.recibo.venta.cod}`;
        else if (item.tipo_documento === 4)
          detalle = `Egreso a depósito`;
        else if (item.tipo_documento === 5)
          detalle = 'Anticipo de cliente'

        if (item.tipo === 0)
          saldo = parseFloat(saldo) + parseFloat(item.total);
        else
          saldo = parseFloat(saldo) - parseFloat(item.total);

        fecha = new Date(item.created_at)
        datos.push({
          detalle:    detalle,
          tipo_doc:   item.tipo_documento,
          tipo:       item.tipo,
          saldoA:     saldoA.toFixed(2),
          total:      item.total,
          saldoNuevo: saldo.toFixed(2),
          hora:       fecha.getHours()+':'+fecha.getMinutes()+':'+fecha.getSeconds(),
          forma_pago: item.forma_pago.nombre
        });

        saldoA = saldo;
      })
      return datos;
    },
    FORMA_PAGOS(){
      return this.$store.state.caja.HISTORIAL;
    },
    LOAD_FORMA_PAGOS(){
      return this.$store.state.caja.LOAD_HISTORIAL;
    },
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

</style>