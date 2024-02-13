<template>
  <v-card flat tile>
    <v-progress-linear indeterminate v-if="load"></v-progress-linear>
    <v-card>
      <v-card tile class="pa-2" >
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos"> - Nombre del Lote</span></div>
            <div><span class="subtitleDatos">{{Lote.nombre}}</span></div>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos"> - Total del Lote</span></div>
            <div><span class="subtitleDatos">L. {{Intl.NumberFormat().format(Lote.total)}}</span></div>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos"> - Estado</span></div>
            <div>
              <v-chip x-small dark v-if="Lote.estado === 1" color="success">Abierto</v-chip>
              <v-chip x-small dark v-else-if="Lote.estado === 2" color="success">Listo para pago</v-chip>
              <v-chip x-small dark v-else-if="Lote.estado === 3" color="red">Cerrado sin exito</v-chip>
              <v-chip x-small dark v-else-if="Lote.estado === 4" color="indigo">Cerrado</v-chip>
            </div>
          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Cant. Planillas</span></div>
            <div><span class="subtitleDatos">{{datosLote.cantPlanillas}} planillas</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Cant. Colaboradores</span></div>
            <div><span class="subtitleDatos">{{datosLote.cantCol}} colaboradores</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Planillas Aprobadas</span></div>
            <div><span class="subtitleDatos">{{datosLote.planillasAprobadas}} planillas</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Total Inicial</span></div>
            <div><span class="subtitleDatos">L. {{Intl.NumberFormat().format(datosLote.totalInicial)}}</span></div>
          </div>
          <div class="col">
            <div><span class="titleDatos">Total Final</span></div>
            <div><span class="subtitleDatos">L. {{Intl.NumberFormat().format(datosLote.total)}}</span></div>
          </div>
          <div class="col">

          </div>
        </div>
        <div class="row no-gutters">
          <div class="col">
            <div><span class="titleDatos">Acciones</span></div>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" fab x-small
                         @click="dialogoCierre = true" v-if="Lote.estado === 1"
                         color="purple" dark icon><v-icon >fa fa-lock</v-icon></v-btn>
                </template>
                <span>Cerrar lote para cargar pagos</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" fab x-small
                         v-if="Lote.estado === 2" @click="liquidarPago"
                         color="orange" dark icon><v-icon >fa fa-plus</v-icon></v-btn>
                </template>
                <span>Agregar Pagos</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" fab x-small
                         v-if="Lote.estado > 1" @click="solicitarClave"
                         color="red" dark icon><v-icon >fa fa-print</v-icon></v-btn>
                </template>
                <span>Imprimir Ficha Tecnica</span>
              </v-tooltip>
            </div>
          </div>
        </div>
      </v-card>
    </v-card>
    <v-row no-gutters>
      <v-col class="pa-5">
        <div class="titleTable">Planillas en este lote</div>
        <table>
          <thead>
          <tr>
            <th>Codigo</th>
            <th>Total</th>
            <th>Periodo</th>
            <th>Sucursal</th>
            <th>Fimado</th>
            <th>Pagado</th>
            <th>Estado Lote</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in Planillas" :key="i" @click="goColaborador(item, 2)">
            <td>{{item.codigo}}</td>
            <td>L. {{Intl.NumberFormat().format(item.total_planilla)}}</td>
            <td>{{item.periodo}} de {{item.mes_asignado}} de {{item.ano}}</td>
            <td>{{item.sucursal}}</td>
            <td class="text-center">
              <v-icon size="15px" v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
            </td>
            <td class="text-center">
              <v-icon size="15px" v-if="item.is_pagado === 1" color="success">fa fa-check-circle</v-icon>
              <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
            </td>
            <td class="text-center">
              <v-icon size="15px" v-if="item.estado_lote ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
            </td>
          </tr>
          </tbody>
        </table>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="4" class="pa-5">
        <div class="titleTable">Colaboradores en este lote</div>
        <table>
          <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Codigo de Planilla</th>
            <th>Total</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in Clientes" @click="goColaborador(item, 1)">
            <td><v-icon size="15px" v-if="item.estado_lote ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon size="15px" v-else color="red">fa fa-times</v-icon> {{item.nombres}} {{item.apellidos}}</td>
            <td>{{item.codigo}}</td>
            <td>L. {{Intl.NumberFormat().format(item.total_planilla)}}</td>
          </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-divider></v-divider>

    <v-dialog v-model="dialogoColaborador" width="65%">
      <v-card>
        <v-toolbar tile flat>
          <v-toolbar-title>{{titulo}}</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          Aca puedes ver la información de la planilla y puedes decidir si quieres rechazar el pago a esta planilla. Ten
          en cuenta que cuando le des de baja a esta planilla del lote, yo no estará disponible para poder pagarla.
        </v-card-text>
        <div class="pa-5">
          <div class="titleTable">Datos de la planilla que pertenece al colaborador que seleccionaste</div>
          <table>
            <thead>
            <tr>
              <th>Codigo</th>
              <th>Total</th>
              <th>Periodo</th>
              <th>Sucursal</th>
              <th>Estado</th>
              <th>Estado Lote</th>
              <th>Documento</th>
            </tr>
            </thead>
            <tbody>
            <tr :key="0">
              <td>{{Colaborador.codigo}}</td>
              <td>L. {{Intl.NumberFormat().format(Colaborador.total_planilla)}}</td>
              <td>{{Colaborador.periodo}} de {{Colaborador.mes_asignado}} de {{Colaborador.ano}}</td>
              <td>{{Colaborador.sucursal}}</td>
              <td class="text-center">
                <v-icon size="15px" v-if="Colaborador.estado ===1" color="success">fa fa-check-circle</v-icon>
                <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
              </td>
              <td class="text-center">
                <v-icon size="15px" v-if="Colaborador.estado_lote ===1" color="success">fa fa-check-circle</v-icon>
                <v-icon size="15px" v-else color="red">fa fa-times</v-icon>
              </td>
              <td><b-link @click="verPlanilla">Ver Planilla</b-link></td>
            </tr>
            </tbody>
          </table>
          <div class="titleTable">Colaboradores en esta planilla</div>
          <table>
            <thead>
            <tr>
              <th>Nombre Completo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in Clientes" v-if="item.id === planilla_id">
              <td>{{item.nombres}} {{item.apellidos}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="red" dark tile small class="ma-2" @click="rechazarPlanilla">Dar de baja de este lote</v-btn>
          <v-btn color="orange" dark tile small class="ma-2" @click="dialogoColaborador = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoCierre" width="30%">
      <v-card>
        <v-toolbar flat tile>
          <v-toolbar-title>Realizando Cierre Para el Pago</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text>
          Cuando hagas el cierre de este lote de planillas, ya no podras quitar planillas, ni transferir a otro lote
          desde este punto.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" small tile text @click="dialogoCierre = false">Cerrar</v-btn>
          <v-btn color="success" small tile @click="cambiarEstadoLote(2)">Cerrar Para Pago</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-navigation-drawer v-model="dialogoPago" right absolute fixed width="450px" id="side"
                         style="min-height: 95vh  !important; height: 100% !important; margin-top: -48px;">
      <v-card class="pl-2 pr-2" color="transparent" flat tile>
        <v-row style="background-color: rgb(235,243,251)">
          <v-col cols="10" class="mt-2">
            <small><strong>Liquidando Lote de Planillas</strong></small>
          </v-col>
          <v-col class="d-flex justify-end" cols="2">
            <v-btn color="red" text class="ma-2"  x-small dark @click="dialogoPago = false" icon><v-icon>fa fa-times</v-icon></v-btn>
          </v-col>
        </v-row>
        <v-card class="ma-2" tile flat>
          <small>Forma de Pago:</small>
          <br>
          <br>
          <v-select color="transparent" dense
                    label="Seleccionar Forma de Pago" :items="TipoPagos" v-model="tipoPago"></v-select>

          <div v-if="tipoPago === 1">
            <small>*Datos de la liquidación:</small>
            <br>
            <br>
            <v-autocomplete :loading="Cajas.length === 0" :items="Cajas" :item-value="'suc'" :item-text="'nombre'"
                            dense label="Seleccionar Caja" @change="seleccionarCaja" v-model="caja_id"></v-autocomplete>
            <small>*Datos de la caja:</small>
            <br>
            <small v-if="tipoPago === 1 && caja_id > 0"> - # de Caja: {{Caja.num_caja}}</small>
            <br>
            <small v-if="tipoPago === 1 && caja_id > 0"> - Codigo de la Caja: {{Caja.codigo}}</small>
            <br>
            <small v-if="tipoPago === 1 && caja_id > 0"> - Nombre de la Caja: {{Caja.nombre}}</small>
            <br>
            <small v-if="tipoPago === 1 && caja_id > 0"> - Total de la Caja: L. {{Intl.NumberFormat().format(Caja.total)}}</small>
            <br>
            <br>
            <small>*Datos del lote:</small>
            <br>
            <small> - Total a cancelar del lote: L. {{Intl.NumberFormat().format(Lote.total)}}</small>
            <br>
            <br>
            <small>*Datos para liquidar:</small>
            <br>
            <br>
            <v-file-input dense v-model="file" accepte="application/pdf" label="Documento escaneado" class="mb-2"></v-file-input>
            <v-textarea dense label="Observacion" class="mb-2"></v-textarea>
            <v-divider></v-divider>
          </div>


          <v-card-actions v-if="tipoPago > 0" class="d-flex justify-end">
            <v-btn color="success" small tile dark>REGISTRAR LIQUIDACIÓN</v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "planillas_lotes",
  props:{lote: Object},
  data(){
    return{
      dialogoCierre: false,
      dialogoPago: false,
      tipoPago: 0,
      TipoPagos:[
        {text:'Caja', value: 1},
        {text:'Transferencia Bancaria', value: 2},
        {text:'Cheques', value: 3}
      ],
      file: null,
      caja_id: 0,
      cuenta_id: 0,
      Cajas: [],
      Cuentas: [],
      Caja: {},
      load: false,
      Clientes: [],
      Planillas: [],
      Colaborador: {},
      dialogoColaborador: false,
      planilla_id: 0,
      titulo: '',
      Lote: {}
    }
  },
  created() {
    this.cargarPlanillas();
    this.Lote = this.lote;
  },
  computed:{
    datosLote(){
      let datos                = {cantPlanillas:0, cantCol: 0, planillasAprobadas: 0, total: 0, totalInicial: 0}
      datos.cantPlanillas      = this.Planillas.length;
      datos.cantCol            = this.Clientes.length;
      let planillasAceptada    = this.Planillas.filter(item=>item.estado_lote === 1);
      datos.planillasAprobadas = planillasAceptada.length;
      datos.total              = planillasAceptada.reduce((num1, num2)=> num1 + parseFloat(num2.total_planilla),0);
      datos.totalInicial       = this.Planillas.reduce((num1, num2)=> num1 + parseFloat(num2.total_planilla),0);
      return datos;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  methods:{
    cambiarEstadoLote(estado){
      this.dialogoCierre = false;
      this.$store.commit('activarOverlay',true);
      this.$axios.post('lote/cambiar_estado',{
        id: this.Lote.id,
        estado,
        total: this.datosLote.total
      }).then((res)=>{
        this.Lote = res.data.lote;
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
      }).catch(()=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'red'});
        this.$store.commit('activarOverlay', false);
      })
    },
    cargarCajas(){
      this.$axios.get('cajas').then(res=>{
        this.Cajas = res.data.cajas;
      })
    },
    cargarPlanillas(){
      this.load = true;
      this.$axios.get('planillas_lotes/lote/'+this.lote.id).then((res)=>{
        this.Clientes  = res.data.clientes;
        this.Planillas = res.data.planillas;
        this.load      = false;
      })
    },
    goColaborador(data, tipo){
      if (tipo === 1)
        this.titulo = 'Datos de la planilla del colaborador '+data.nombres+' '+data.apellidos;
      else
        this.titulo = 'Datos de la planilla '+data.codigo;

      this.dialogoColaborador = true;
      this.Colaborador        = data;
      this.planilla_id        = data.id;
    },
    liquidarPago(){
      this.dialogoPago = true;
      if (this.Cajas.length === 0){
        this.cargarCajas();
      }
    },
    rechazarPlanilla(){
      this.$store.commit('activarOverlay', true);
      this.dialogoColaborador = false;
      this.$axios.post('planilla/rechazar_lote',{
        planilla_id: this.planilla_id,
        lote_id:     this.Lote.id
      }).then((res)=>{
        this.Clientes  = res.data.clientes;
        this.Planillas = res.data.planillas;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
      }).catch(()=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    seleccionarCaja(){
      this.Caja = this.Cajas.filter(item=> item.suc === this.caja_id)[0];
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        let url = this.$axios.defaults.baseURL+'documentos/lote_planillas/usuario='+this.USUARIO+'&lote='+this.Lote.id+'&'+res.data.clave;
        ipcRenderer.send('pint_navegador', url);
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
    verPlanilla(){
      this.$store.commit('activarOverlay', true);
      this.dialogoColaborador = false;
      this.$axios.get('planillas_pdf/'+this.planilla_id,{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.dialogoColaborador = true;
        ipcRenderer.send('open-nav', res.data.url)
      })
    }
  }
}
</script>

<style scoped>
.titleTable{
  font-family: 'Rubik', sans-serif;
  font-size: 15px;
  font-weight: bold;
}
.titleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #272727;
}
.titleAcciones{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #aaaaaa;
}
.titleBuscar{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
input{
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
.header div span{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
}
.body div span{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
table{
  width: 100%;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
  text-align: start;
}
table tbody tr td{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
  height: 22px;
  border-bottom: solid 1px #DADADA;
}
table tbody tr:hover{
  cursor: pointer;
  background-color: #f6f6f6;
}
.subtitleDatos{
  font-family: 'Rubik', sans-serif;
  font-size: 11px;
  color: #3a3a3a;
}
</style>
