<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-2">
      <h5>Libro Díario SURTIDORA LAÍNEZ</h5>
    </v-toolbar>
    <v-progress-linear color="success" indeterminate v-if="LOADFECHAS"></v-progress-linear>
    <v-row no-gutters>
      <v-col class="ma-2">
        <b-select v-model="query.anio" size="sm">
          <template #first>
            <b-form-select-option :value="null" disabled>-- Seleccione un año --</b-form-select-option>
          </template>
          <option v-for="item in ANIOS" :value="item.anio">{{item.anio}}</option>
        </b-select>
      </v-col>
      <v-col class="ma-2">
        <b-select v-model="query.mes" size="sm">
          <template #first>
            <b-form-select-option :value="null" disabled>-- Seleccione un mes --</b-form-select-option>
          </template>
          <option v-if="item.anio === query.anio"  v-for="item in MESES" :value="item.mes">{{item.mes}}</option>
        </b-select>
      </v-col>
      <v-col class="ma-2">
        <b-select v-model="query.dia" size="sm">
          <template #first>
            <b-form-select-option :value="null" disabled>-- Seleccione un día --</b-form-select-option>
          </template>
          <option v-if="item.anio === query.anio && item.mes === query.mes"
                  v-for="item in DIAS" :value="item.dia">{{item.dia.split('-')[2]}}</option>
        </b-select>
      </v-col>
      <v-col class="ma-2 d-flex justify-end">
        <v-btn color="success" tile small dark @click="cargarPartidad">Consultar Libro {{query.dia}}</v-btn>
      </v-col>
    </v-row>

    <v-toolbar flat >
      <h6>Registro Díario</h6>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn v-bind="attrs" v-on="on" color="grey" class="ma-2"
                 fab x-small tile dark @click="vista = 1">
            <v-icon>fa fa-table</v-icon></v-btn>
        </template>
        <span>Vista Tabla</span>
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn v-bind="attrs" v-on="on" color="grey" class="ma-2"
                 fab x-small tile dark @click="vista = 2">
            <v-icon>fa fa-receipt</v-icon></v-btn>
        </template>
        <span>Vista Limpia</span>
      </v-tooltip>
    </v-toolbar>
    <v-progress-linear color="success" indeterminate v-if="loadPartidas"></v-progress-linear>

    <v-card class="ma-5 pb-5" flat v-if="vista === 1">
      <b-table small bordered hover :fields="field" :items="Partidas">
        <template v-slot:cell(credito)="scope">L {{int.format(scope.item.credito)}}</template>
        <template v-slot:cell(id)="scope">
          <b-link @click="abrirDialogo(scope.item)">Ver Datos</b-link>
        </template>
      </b-table>
    </v-card>

    <v-card flat class="ma-5 pb-5" v-else-if="vista === 2">
      <table>
        <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Referencia</th>
          <th>Nombre de la Cuenta</th>
          <th>Cod.</th>
          <th>#P</th>
          <th>Débito</th>
          <th>Crédito</th>
        </tr>
        </thead>
        <tbody v-for="(item, cont) in Partidas">
          <tr>
            <td style="padding: 3px">{{cont + 1}}</td>
            <td>{{item.fecha.split('-')[2]}}/{{item.fecha.split('-')[1]}}/{{item.fecha.split('-')[0]}}</td>
            <td>{{item.referencia}}</td>
            <td colspan="5"></td>
          </tr>
          <tr class="trhover" v-for="i in item.ct_partidas">
            <td colspan="3"></td>
            <td v-if="item.tipo === 0">{{i.cc.cod_d.cod}} {{i.cc.cod_d.nombre}} > {{i.cc.nombre}}</td>
            <td >{{i.cc.cod_d.cod}} {{i.cc.cod_d.nombre}} > {{i.cc.nombre}}</td>
            <td>{{i.cc.cod}}</td>
            <td>{{i.transaccion}}</td>
            <td ><span v-if="i.tipo === 1">L {{int.format(i.total)}}</span><span v-else> </span></td>
            <td ><span v-if="i.tipo === 0">L {{int.format(i.total)}}</span><span v-else> </span></td>
          </tr>
          <tr class="trhover">
            <td colspan="6" class="text-center">
              ***** {{item.detalle}}
            </td>
            <td style="border-top: solid 0.5px #7FD5D5">L {{int.format(item.debitp)}}</td>
            <td style="border-top: solid 0.5px #7FD5D5">L {{int.format(item.credito)}}</td>
            <td></td>
          </tr>
          <tr>
          <td colspan="8"><p></p></td>
        </tr>
        </tbody>
        <tbody>
        <tr>
          <td style="border-top: solid 0.5px #7FD5D5; padding: 5px" class="text-center" colspan="6">
            <strong>TOTALES</strong>
          </td>
          <td style="border-top: solid 0.5px #7FD5D5"><strong>L {{int.format(totalCredito)}}</strong></td>
          <td style="border-top: solid 0.5px #7FD5D5"><strong>L {{int.format(totalCredito)}}</strong></td>
        </tr>
        </tbody>
      </table>
    </v-card>

    <v-dialog v-model="dialogoPartida" width="95%">
      <v-card>
        <v-toolbar color="grey lighten-5">
          <h6>Datos de la Partida <strong>{{partida.referencia}}</strong></h6>
          <v-spacer></v-spacer>
          <v-btn x-small color="red" dark fab tile @click="dialogoPartida = false"><v-icon>fa fa-times</v-icon></v-btn>
        </v-toolbar>

        <v-row no-gutters>
          <v-col cols="3">
            <v-card class="ma-5">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                  <tr>
                    <th>Detalle:</th>
                    <td>{{partida.detalle}}</td>
                  </tr>
                  <tr>
                    <th>Crédito:</th>
                    <td>L {{int.format(partida.credito)}}</td>
                  </tr>
                  <tr>
                    <th>Débito:</th>
                    <td>L {{int.format(partida.debitp)}}</td>
                  <tr>
                    <th>Documento:</th>
                    <td>
                      <b-link @click="printPartida">Ver Documento</b-link>
                    </td>
                  </tr>
                  <tr>
                    <th>Editar Partida:</th>
                    <td>
                      <v-btn x-small tile dark color="success">Editar Partida</v-btn>
                    </td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
          <v-col>
            <v-card class="ma-5">
              <table>
                <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Referencia</th>
                  <th>Nombre de la Cuenta</th>
                  <th>Cod.</th>
                  <th>#</th>
                  <th>Débito</th>
                  <th>Crédito</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, cont) in partida.ct_partidas">
                  <td v-if="cont === 0">{{partida.fecha.split('-')[2]}}/{{partida.fecha.split('-')[1]}}/{{partida.fecha.split('-')[0]}}</td>
                  <td v-else></td>
                  <td v-if="cont === 0">{{partida.referencia}}</td>
                  <td v-else></td>
                  <td v-if="item.tipo === 0">{{item.cc.nombre}}</td>
                  <td v-else style="padding-left: 20px">{{item.cc.nombre}}</td>
                  <td>{{item.cc.cod}}</td>
                  <td>{{item.transaccion}}</td>
                  <td v-if="item.tipo === 1">L {{int.format(item.total)}}</td>
                  <td v-else>L 0.00</td>

                  <td v-if="item.tipo === 0">L {{int.format(item.total)}}</td>
                  <td v-else>L 0.00</td>

                </tr>
                <tr>
                  <td colspan="5" class="text-center">
                    ** {{partida.detalle}}
                  </td>
                  <td style="border-top: solid 0.5px #7FD5D5">L {{int.format(partida.debitp)}}</td>
                  <td style="border-top: solid 0.5px #7FD5D5">L {{int.format(partida.credito)}}</td>
                  <td></td>
                </tr>
                </tbody>
              </table>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "libro_diario",
  data(){
    return{
      int: new Intl.NumberFormat(),
      query:{
        anio:  null,
        mes:   null,
        dia:   null,
      },
      field:[
        {key:'referencia', label:'Referencia'},
        {key:'fecha', label:'Fecha'},
        {key:'hora', label:'Hora'},
        {key:'detalle', label:'Detalle de la Partida'},
        {key:'credito', label:'Total'},
        {key:'id', label:'Detalles'},
      ],
      loadPartidas: false,
      Partidas:     [],
      vista: 1,
      partida: {},
      dialogoPartida: false,
      totalDebito: 0,
      totalCredito: 0
    }
  },
  created() {
    let fecha =new Date();
    this.$store.commit('guardarTitulo', 'Contabilidad > Libro Díario');
    this.$store.commit('contabilidad/libro_diario/cargar_FECHAS');
    this.query.anio = fecha.getFullYear();
    this.query.mes  = (fecha.getMonth()+1);
    this.query.dia  = fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate();
    this.cargarPartidad();
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
    LOADFECHAS(){
      return this.$store.state.contabilidad.libro_diario.LOADFECHAS;
    },
    ANIOS(){
      return this.$store.state.contabilidad.libro_diario.ANIOS;
    },
    MESES(){
      return this.$store.state.contabilidad.libro_diario.MESES;
    },
    DIAS(){
      return this.$store.state.contabilidad.libro_diario.DIAS;
    }
  },
  methods:{
    abrirDialogo(data){
      this.partida        = data;
      this.dialogoPartida = true;
    },
    abrirNavegador(clave){
      let url = this.$axios.defaults.baseURL+'documentos/partida/usuario='+this.USUARIO+'/partida='+this.partida.referencia+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
      this.dialogoPartida = true;
    },
    cargarPartidad(){
      if (this.query.dia){
        this.loadPartidas = true;
        this.$axios.get('contabilidad/2.0/libro_diario/'+this.query.dia).then((res)=>{
          this.Partidas     = res.data.partidas;
          this.loadPartidas = false;
          this.totales();
        });
      }
    },
    totales(){
      this.totalCredito = 0;
      this.totalDebito  = 0;
      this.Partidas.forEach((i)=>{
        this.totalCredito = parseFloat(this.totalCredito) + parseFloat(i.credito)
        this.totalDebito  = parseFloat(this.totalCredito) + parseFloat(i.debitp)
      })
    },
    printPartida(){
      this.$store.commit('activarOverlay', true);
      this.dialogoPartida = false;
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.abrirNavegador(res.data.clave);
      }).catch((error)=>{
        this.dialogoPartida = true;
        this.$store.commit('activarOverlay', false);
      });
    },
    verDocumento(URL){
      this.dialogoPartida = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
        this.dialogoPartida = true;
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
        this.dialogoPartida = true;

      })
    }
  }
}
</script>

<style scoped>
table caption{
  font-size: 14px;
  font-weight: bold;
}
table{
  width: 100%;
  border: solid 0.5px #7FD5D5;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 14px;
  border-right: solid 0.5px #7FD5D5;
  border-bottom: solid 0.5px #7FD5D5;
}
table tbody tr td{
  cursor: pointer;
  font-size: 12px;
}
table tbody:hover{
  background-color: #F2F3F4 ;
}
.trhover:hover{
  background-color: #F8F9F9  ;
}
</style>
