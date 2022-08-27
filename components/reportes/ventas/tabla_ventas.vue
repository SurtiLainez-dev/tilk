<template>
  <v-card :loading="LOAD_DATATABLE" flat>
    <v-row no-gutters>
      <v-col>
        <span id="tituloTabla">{{titulo}}</span>
      </v-col>
      <v-col class="d-flex justify-end align-end">
        <v-tooltip top>
          <template v-slot:activator="{on, atrr}">
            <v-btn v-on="on" v-bind="atrr" width="17" height="17" color="indigo"
                   v-if="img" @click="imprimirTabla"
                   fab x-small dark text><v-icon size="12">fa fa-image</v-icon></v-btn>
          </template>
          <span>Convertir a imagen</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{on, atrr}">
            <v-btn v-on="on" v-bind="atrr" width="17" height="17" color="green"
                   v-if="excel" @click="solicitarClave(2)"
                   fab x-small dark text><v-icon size="12">fa fa-file-excel</v-icon></v-btn>
          </template>
          <span>Exportar a excel</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{on, atrr}">
            <v-btn v-on="on" v-bind="atrr" width="17" height="17" color="red"
                   v-if="pdf" @click="solicitarClave(1)"
                   fab x-small dark text><v-icon size="12">fa fa-file-pdf</v-icon></v-btn>
          </template>
          <span>Exportar a pdf</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{on, atrr}">
            <v-btn v-on="on" v-bind="atrr" width="17" height="17" color="orange"
                   v-if="email"
                   fab x-small dark text><v-icon size="12">fa fa-share</v-icon></v-btn>
          </template>
          <span>Reenviar reporte por correo</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <table id="TablaDatosReporte">
      <thead>
      <tr>
        <td v-for="item in headers">{{item}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in DATATABLE">
        <td>{{i+1}}</td>
        <td v-if="item.venta.tipo_venta === 1">Contado</td>
        <td v-else-if="item.venta.tipo_venta === 2">Crédito</td>
        <td>{{item.fecha}}</td>
        <td>{{item.venta.cod}}</td>
        <td>{{item.venta.cliente.nombres}} {{item.venta.cliente.apellidos}}</td>
        <td>L. {{int.format(item.sub_total)}}</td>
        <td>L. {{int.format(item.total)}}</td>
        <td>L. {{int.format(item.venta.total)}}</td>
        <td>{{item.venta.colaborador.nombres}} {{item.venta.colaborador.apellidos}}</td>
        <td>{{item.venta.facturas_contados[0].articulo.marca.nombre}} / {{item.venta.facturas_contados[0].articulo.modelo}}</td>
        <td>{{item.venta.facturas_contados[0].articulo.nombre_articulo}}</td>
        <td style="text-align: center">
          <v-badge v-if="item.venta.tipo_venta === 1" dot color="success"></v-badge>
          <v-badge v-else-if="item.venta.revision_documentos === 1" dot color="success"></v-badge>
          <v-badge v-else-if="item.venta.revision_documentos === 0" dot color="red"></v-badge>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALSINIMPUESTO)}}</td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALCONTADO)}}</td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALFINAL)}}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
import html2canvas from 'html2canvas';
import {ipcRenderer} from "electron";
export default {
  name: "tabla_ventas",
  props:{
    titulo: {
      type: String,
      default: 'Datos del Reporte'
    },
    img: {
      type: Boolean,
      default: false
    },
    excel:{
      type: Boolean,
      default: false
    },
    pdf:{
      type:Boolean,
      default: false
    },
    email:{
      type: Boolean,
      default: false
    },
    url1File: String,
    url2File: String,
  },
  data(){
    return{
      output: '',
      int: Intl.NumberFormat(),
      headers:[
        '#',
        'Tipo',
        'Fecha',
        'Cuenta',
        'Nombre Completo',
        'Precio S/I',
        'Precio Contado',
        'Precio Final',
        'Vendedor',
        'Marca/Modelo',
        'Artículo',
        'Estado'
      ]
    }
  },
  computed:{
    DATATABLE(){
      return this.$store.state.reportes.ventas.global.DATATABLE;
    },
    LOAD_DATATABLE(){
      return this.$store.state.reportes.ventas.global.LOAD_DATATABLE;
    },
    TOTALSINIMPUESTO(){
      if (this.DATATABLE.length > 0)
        return  this.DATATABLE.reduce((num1, num2)=> num1 + parseFloat(num2.sub_total),0)
      else return 0;
    },
    TOTALCONTADO(){
      if (this.DATATABLE.length > 0)
        return this.DATATABLE.reduce((num1, num2)=> num1 +  parseFloat(num2.total),0)
      else return 0;
    },
    TOTALFINAL(){
      if (this.DATATABLE.length > 0)
        return this.DATATABLE.reduce((num1, num2)=> num1 + parseFloat(num2.venta.total),0)
      else return 0;
    },
  },
  methods:{
    async imprimirTabla(){
      let canvas = (await html2canvas(document.querySelector('#TablaDatosReporte')))
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      let ran    = Math.floor(Math.random() * (100 - 200)) + 200;
      let nombre = 'Reporte de ventas -'+ran+'.png'
      a.setAttribute("download", nombre);
      a.setAttribute("href", image);
      a.click();
    },
    guardarExcel(url){
      if (this.$store.state.DIR){
        let dir = this.$axios.defaults.baseURL+url
        let fecha = new Date();
        let f = fecha.getDate()+'-'+fecha.getMonth()+'-'+fecha.getFullYear();
        let nombre = this.$store.state.DIR+'/Reporte de venta '+f+' - '+Math.floor(Math.random() * 10000)+'.xlsx';
        ipcRenderer.send('save_file',{path_remoto: dir, path_local: nombre});
      }else{
        this.$store.commit('notificacion',{texto:'No puedes crear reportes en excel sin haber seleccionado una ruta para almacenar', color:'error'});
      }
    },
    solicitarClave(tipo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        let url = ''
        if (tipo === 1) {
          url = this.url1File + res.data.clave + '&file=PDF' + this.url2File;
          ipcRenderer.send('pint_navegador', this.$axios.defaults.baseURL+url);
        }else if (tipo === 2){
          url = this.url1File + res.data.clave + '&file=EXCEL' + this.url2File;
          this.guardarExcel(url)
        }
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
  },
}
</script>

<style scoped>
table{
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 2px;
}
table thead{
  background: #e8e5e5;
}
table thead tr th{
  font-size: 11px;
}
table tbody tr td{
  font-size: 10px;
}
table tbody tr td:nth-child(even){
  background-color: #f2f2f2;
}
table tbody tr:hover{
  background: #f2f2f2;
  border: 1px solid;
  cursor: pointer;
}
table caption{
  font-size: 13px;
  caption-side: top;
}
table thead tr td{
  font-size: 12px;
}
#tituloTabla{
  font-size: 14px;
  color: #7F828B;
}
</style>
