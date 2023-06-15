<template>
<v-card :loading="loadG" flat>

  <v-row class="ma-2">
    <v-col>
      <v-card :loading="loadG" height="110" class="ma-2 ">
        <br>
        <v-card flat tile class="d-flex justify-center"><h6>Gastos de la Sucursal</h6></v-card>
        <v-card flat tile class="d-flex justify-center"><h6>{{sucursal.nombre}}</h6></v-card>
      </v-card>
    </v-col>
    <v-col>
      <v-card :loading="loadG" height="110" class="ma-2 ">
        <br>
        <v-card flat tile class="d-flex justify-center"><h6>Total Gastado</h6></v-card>
        <v-card flat tile class="d-flex justify-center"><h6>L. {{int.format(totalGastoSucursal)}}</h6></v-card>
      </v-card>
    </v-col>
    <v-col>
      <v-card :loading="loadG" height="110" class="ma-2 ">
        <br>
        <v-card flat tile class="d-flex justify-center"><h6>Periodo de Consulta</h6></v-card>
        <v-card flat tile class="d-flex justify-center"><h6>de {{fecha_i}} - {{fecha_f}}</h6></v-card>
        <v-card flat tile class="d-flex justify-center">
          <v-btn color="indigo" dark x-small @click="dialogoFecha = true" text tile>Cambiar Fechas</v-btn>
        </v-card>
      </v-card>
    </v-col>
  </v-row>

  <v-card flat tile v-if="vista === 1">
    <v-row class="ma-2">
      <v-col>
        <v-toolbar flat tile color="grey lighten-3">
          <v-card-title>Gastos Detallados</v-card-title>
          <v-spacer></v-spacer>
          <v-text-field label="Buscar gasto" v-model="search"></v-text-field>
        </v-toolbar>
        <v-data-table :items-per-page="10" :loading="loadG" :items="Gastos" @click:row="goGasto"
                      loading="Cargando gastos ..." :headers="headers" :search="search">
          <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
        </v-data-table>
      </v-col>
      <v-divider vertical></v-divider>

      <v-col>
        <v-toolbar flat tile color="grey lighten-3">
          <v-card-title>Totales de Gastos</v-card-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table :items-per-page="100" :loading="loadG" :items="totales"
                      loading="Cargando gastos ..." :headers="headersT">
          <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>

  <v-card flat tile v-else-if="vista === 2">
    <v-toolbar color="grey lighten-4" tile flat>
      <v-card-title>{{dataG.gasto}}</v-card-title>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on, attts}">
          <v-btn v-on="on" v-bind="attts" dark fab color="warning" icon text small @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        </template>
        <span>Volver</span>
      </v-tooltip>
    </v-toolbar>

    <table>
      <thead>
      <tr>
        <th colspan="4"> - Información del Gasto</th>
      </tr>
      <tr>
        <th colspan="2">Tipo de Gasto</th>
        <th colspan="2">Detalle del Gasto</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{Gasto.tipo_gasto.nombre}}</td>
        <td colspan="2">{{Gasto.detalle}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th>Usuario Creador</th>
        <th>Sucursal</th>
        <th>Total</th>
        <th>Documento</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{Gasto.user.usuario}}</td>
        <td>{{Gasto.caja_chica.sucursal.nombre}}</td>
        <td>L. {{int.format(Gasto.total)}}</td>
        <td><b-link @click="verDocumento(Gasto.file)">Ver Factura Cargada</b-link></td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="4"> - Información Contable</th>
      </tr>
      <tr>
        <th colspan="2">Nombre de la CC</th>
        <th>Codigo de la CC</th>
        <th>Codigo Dependiente de la CC</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{Gasto.tipo_gasto.cc.nombre}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod_dep}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="2">Nombre de la CC Padre</th>
        <th>Codigo de la CC Padre</th>
        <th>Codigo Dependiente de la CC Padre</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{Gasto.tipo_gasto.cc.cod_d.nombre}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod_d.cod}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod_d.cod_dep}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="2">Nombre de la CC Padre - Padre</th>
        <th>Codigo de la CC Padre - Padre</th>
        <th>Codigo Dependiente de la CC Padre - Padre</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td colspan="2">{{Gasto.tipo_gasto.cc.cod_d.cod_d.nombre}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod_d.cod_d.cod}}</td>
        <td>{{Gasto.tipo_gasto.cc.cod_d.cod_d.cod_dep}}</td>
      </tr>
      </tbody>
      <thead>
      <tr>
        <th colspan="4"> - Información del Historial de Caja Chica</th>
      </tr>
      <tr>
        <th>Fecha de la Transacción</th>
        <th>Hora de la Transacción</th>
        <th>Referencia de la Partida</th>
        <th>Documento de la Partida Contable</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{Gasto.historial_caja_chica.fecha.split('-')[2]}}/{{Gasto.historial_caja_chica.fecha.split('-')[1]}}/{{Gasto.historial_caja_chica.fecha.split('-')[0]}}</td>
        <td>{{Gasto.historial_caja_chica.hora}}</td>
        <td>{{Gasto.historial_caja_chica.ct_libro_diario.referencia}}</td>
        <td @click="solicitarClave(1)"><b-link>Ver partida</b-link></td>
      </tr>
      </tbody>
    </table>
  </v-card>

  <v-dialog v-model="dialogoFecha" width="30%">
    <v-card>
      <v-card-title>Fechas de la consulta</v-card-title>
      <v-divider></v-divider>
      <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fecha_inicial"
                persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                        v-model="fecha_inicial"></v-text-field>
        </template>
        <v-date-picker v-model="fecha_inicial" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fecha_inicial)">OK</v-btn>
        </v-date-picker>
      </v-dialog>

      <v-dialog ref="dialogFechaFinal" v-model="dialogoFechaFinal" :return-value.sync="fecha_fifnal"
                persistent width="290px">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field dense class="ma-2" label="Fecha final" v-bind="attrs" v-on="on"
                        v-model="fecha_fifnal"></v-text-field>
        </template>
        <v-date-picker v-model="fecha_fifnal" scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialogoFechaFinal = false">Cancelar</v-btn>
          <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_fifnal)">OK</v-btn>
        </v-date-picker>
      </v-dialog>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" small tile dark text @click="dialogoFecha = false">Cerrar</v-btn>
        <v-btn color="indigo" small tile dark text @click="consultarGastos">Consultar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "gastos_pantalla",
  props:{
    sucursal: Object
  },
  created() {
    let fecha = new Date();
    this.fecha_inicial = fecha.getFullYear()+'-01-01';
    this.fecha_fifnal  = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();
    this.consultarGastos();
  },
  data(){
    return{
      vista: 1,
      dialogoFechaInicio: false,
      dialogoFechaFinal: false,
      fecha_i: '',
      fecha_f: '',
      fecha_inicial: '',
      fecha_final:   '',
      search: '',
      Gastos: [],
      loadG: true,
      headers:[
        {text:'Tipo de Gastos', value:'gasto'},
        {text:'Total', value:'total'},
      ],
      headersT:[
        {text:'Nombre del Gasto', value:'nombre'},
        {text:'Total', value:'total'},
      ],
      int: Intl.NumberFormat(),
      totales: [],
      totalGastoSucursal: 0,
      dialogoFecha: false,
      Gasto: {},
      dataG: {},
    }
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  methods:{
    abrirNavegador(clave, tipo){
      let url = '';
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/partida/usuario='+this.USUARIO+'/partida='+this.Gasto.historial_caja_chica.ct_libro_diario.referencia+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    consultarGastos(){
      this.dialogoFecha = false;
      this.fecha_i   = this.fecha_inicial.split('-')[2]+'/'+this.fecha_inicial.split('-')[1]+'/'+this.fecha_inicial.split('-')[0]
      this.fecha_f   = this.fecha_fifnal.split('-')[2]+'/'+this.fecha_fifnal.split('-')[1]+'/'+this.fecha_fifnal.split('-')[0]
      this.loadG = true;
      this.$axios.get('contabilidad/gastos_x_sucursal='+this.sucursal.id+'/fi='+this.fecha_inicial+'/ff='+this.fecha_fifnal).then((res)=>{
        this.Gastos  = res.data.gastos;
        this.totales = res.data.totales;
        this.totalGastoSucursal = res.data.total;
        this.loadG    = false;
      })
    },
    goGasto(data){
      this.loadG = true;
      this.dataG = data
      this.$axios.get('contabulidad/gasto/'+data.id).then((res)=>{
        this.Gasto = res.data.gasto;
        this.loadG = false;
        this.vista = 2;
      })
    },
    solicitarClave(tipo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave, tipo);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Ocurrio un error', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        ipcRenderer.send('pint_navegador', res.data.url);
        this.$store.commit('activarOverlay', false);
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
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>