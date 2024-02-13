<template>
<v-card flat :loading="show || LOADCUENTA">
  <div v-if="!vistaInfoPago">

    <v-card flat tile>
      <v-row class="ma-1">
        <v-col cols="3" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <table>
            <thead>
            <tr><th colspan="2" class="text-center">Información de la cuenta</th></tr>
            <tr v-if="CUENTA.cliente"><th>Nombre completo:</th><td>{{CUENTA.cliente.nombres}} {{CUENTA.cliente.apellidos}}</td></tr>
            <tr v-if="CUENTA.cliente"><th>Identidad:</th><td>{{CUENTA.cliente.identidad}}</td></tr>
            <tr><th>Vendedor:</th><td>{{CUENTA.colaborador.nombres}} {{CUENTA.colaborador.apellidos}}</td></tr>
            <tr><th>Sucursal de venta:</th><td>{{CUENTA.colaborador.sucursal.nombre}}</td></tr>
            <tr><th># de venta:</th><td>{{CUENTA.cod}}</td></tr>
            <tr v-if="CUENTA.facturada === 0"><th>Ejecutar Facturación:</th><td><v-btn :disabled="CUENTA.tipo_venta === 1" x-small class="text-white" color="indigo" @click="crearFactura">Facturar</v-btn></td></tr>
            <tr>
              <th>Facturada:</th>
              <td>
                <v-icon x-small color="success" dark v-if="CUENTA.facturada === 1">fa fa-check</v-icon>
                <v-icon x-small color="red" dark v-else-if="CUENTA.facturada === 0">fa fa-times</v-icon>
              </td>
            </tr>
            <tr>
              <th>Documento:</th>
              <td v-if="CUENTA.tipo_venta === 1">Factura de Contado</td>
              <td v-else-if="CUENTA.tipo_venta === 2">Recibo</td>
            </tr>
            <tr><th>Saldo inicial:</th><td>L. {{int.format(CUENTA.total)}}</td></tr>
            <tr><th>Saldo mora:</th>
              <td>
                <span v-if="CUENTA.tipo_venta === 2">L. {{int.format(CUENTA.mora)}}</span>
                <span v-else>Venta de contado</span>
              </td>
            </tr>
            <tr><th>Total abonado:</th><td>L. {{int.format(CUENTA.total_abonado)}}</td></tr>
            <tr><th>Saldo actual:</th><td>L. {{int.format(CUENTA.saldo_actual)}}</td></tr>
            <tr><th>Cuota:</th><td>L. {{int.format(CUENTA.cuota)}}</td></tr>
            <tr><th>Estado:</th>
              <td>
                <v-chip color="orange" x-small v-if="CUENTA.estado === 1" dark>Al día</v-chip>
                <v-chip color="red" x-small v-else-if="CUENTA.estado === 2" dark>Mora</v-chip>
                <v-chip color="success" x-small v-else-if="CUENTA.estado === 3" dark>Cancelada</v-chip>
                <v-chip color="indigo" x-small v-else-if="CUENTA.estado === 4" dark>Pendiente por aceptar</v-chip>
              </td>
            </tr>
            </thead>
          </table>
        </v-col>
        <v-col cols="3" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <table>
            <thead>
            <tr><th colspan="2" class="text-center">Información del articulo</th></tr>
            <tr>
              <th style="font-size: 11px">Modelo</th>
              <th style="font-size: 11px">Articulo</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in CUENTA.facturas_contados">
              <td>{{item.articulo.modelo}}</td>
              <td>{{item.articulo.nombre_articulo}}</td>
            </tr>
            </tbody>
          </table>
        </v-col>
        <v-col cols="3" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <table>
            <thead>
            <tr>
              <th colspan="3" class="text-center">Documentos por cobrar</th>
            </tr>
            <tr>
              <th>Detalle</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in CUENTA.pagos_extras_ventas">
              <td>
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <span v-on="on" v-bind="attrs">{{item.observacion.substr(0,20)}} ...</span>
                  </template>
                  <span>{{item.observacion}}</span>
                </v-tooltip>
              </td>
              <td>L {{item.total}}</td>
              <td>
                <v-chip color="warning" x-small dark v-if="item.estado === 1">Pendiente</v-chip>
                <v-chip color="success" x-small dark v-else>Cancelado</v-chip>
              </td>
            </tr>
            </tbody>
          </table>
        </v-col>
        <v-col cols="3" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <div style="overflow-y: auto; height: 300px">
            <table>
              <thead>
              <tr>
                <th colspan="2" class="text-center">Recibos anteriores</th>
              </tr>
              <tr>
                <th style="font-size: 11px">Recibo</th>
                <th style="font-size: 11px">Total</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in CUENTA.recibos">
                <td><b-link>{{item.codigo}}</b-link></td>
                <td>L {{int.format(item.total)}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="ma-1">
        <v-col cols="4" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <v-card flat tile :disabled="registrar.enviado">
            <div style="overflow-y: auto; height: 300px">
              <table>
                <thead>
                <tr>
                  <th colspan="2" class="">
                    <v-tooltip top>
                      <template v-slot:activator="{on, attr}">
                        <v-btn color="orange" class="ma-1" v-bind="attr" @click="dialogoPagos = true"  v-on="on" fab tile width="20" height="20" dark>
                          <v-icon size="10">fa fa-expand-arrows-alt</v-icon>
                        </v-btn>
                      </template>
                      <span>Ver Tabla de Pagos Completa</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{on, attr}">
                        <v-btn color="indigo" class="ma-1" v-bind="attr"
                               v-on="on" fab tile width="20" height="20" dark @click="dialogoCalculadora = true">
                          <v-icon size="10">fa fa-calculator</v-icon>
                        </v-btn>
                      </template>
                      <span>Calculadora de Pagos</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{on, attr}">
                        <v-btn color="success" class="ma-1" @click="dialogoDXC = true" wi
                               v-bind="attr" v-on="on" fab tile width="20" height="20" dark>
                          <v-icon size="10">fa fa-expand-arrows-alt</v-icon>
                        </v-btn>
                      </template>
                      <span>Documentos por Cobrar</span>
                    </v-tooltip>
                  </th>
                  <th colspan="3" class="text-center">Pagos de la cuenta</th>
                </tr>
                <tr>
                  <th></th>
                  <th style="font-size: 11px">Pago</th>
                  <th style="font-size: 11px">Total Inicial</th>
                  <th style="font-size: 11px">Mora</th>
                  <th style="font-size: 11px">Saldo Actual</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in CUENTA.pagos_contratos">
                  <td>
                    <v-badge v-if="item.estado === 1" dot color="orange"></v-badge>
                    <v-badge v-else-if="item.estado === 2" dot color="red"></v-badge>
                    <v-badge v-else-if="item.estado === 3" dot color="green"></v-badge>
                  </td>
                  <td>
                    {{item.detalle}}
                  </td>
                  <td>L. {{int.format(item.pago_inicial)}}</td>
                  <td>L. {{int.format(item.mora)}}</td>
                  <td>L. {{int.format(item.saldo_actual)}}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </v-card>
        </v-col>
        <v-col cols="5" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <table>
            <thead >
            <tr>
              <th class="text-center" colspan="6">Pagos distribuidos</th>
            </tr>
            <tr>
              <th style="border: none !important;">Tipo</th>
              <th style="border: none !important;">Descripción</th>
              <th style="border: none !important;">Pendiente</th>
              <th style="border: none !important;">Pagará</th>
              <th style="border: none !important;">Saldo</th>
              <th style="border: none !important;">Aún Hay</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in PagosDistrubuidos" :key="index" v-bind:class="index % 2 === 0 ? 'grey-lighten-4':'grey lighten-5'">
              <td style="padding: 3px; font-size: 10px; border: none; margin: 0px" >{{item.tipo}}</td>
              <td style="padding: 3px; font-size: 10px; border: none; margin: 0px">{{item.detalle}}</td>
              <td  style="padding: 3px; font-size: 10px; border: none; margin: 0px"><strong>L. </strong>{{int.format(item.pendiente)}}</td>
              <td  style="padding: 3px; font-size: 10px; border: none; margin: 0px"><strong>L. </strong>{{int.format(item.pagara)}}</td>
              <td  style="padding: 3px; font-size: 10px; border: none; margin: 0px"><strong>L. </strong>{{int.format(item.saldo)}}</td>
              <td  style="padding: 3px; font-size: 10px; border: none; margin: 0px"><strong>L. </strong>{{int.format(item.hay)}}</td>
            </tr>
            </tbody>
          </table>
        </v-col>
        <v-col cols="3" style="border-left: solid 1px rgba(236,236,236,0.98)">
          <v-card flat tile :disabled="registrar.enviado">
            <table>
              <thead>
              <tr>
                <th colspan="2" class="text-center">Registrando Abono en Caja</th>
              </tr>
              <tr>
                <th>Total a abonar:</th>
                <td>
                  <v-row no-gutters>
                    <v-col><input v-model="Abono.total" style="padding: 2px; background-color: #f3f0e4" type="number"/></v-col>
                    <v-col class="d-flex justify-end"><v-btn @click="distribuirPago" x-small color="success" dark tile>Distribuir</v-btn></v-col>
                  </v-row>
                </td>
              </tr>
              <tr>
                <th >Forma de pago:</th>
                <td>
                  <select style="padding: 2px; background-color: #f3f0e4; width: 100%" v-model="Abono.forma_pago" >
                    <option value="0">Seleccionar</option>
                    <option v-for="item in FormasPago" :value="item.id">{{item.nombre}}</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>Referencia del abono:</th>
                <td>
                  <input v-model="Abono.referencia" style="padding: 2px; background-color: #f3f0e4; width: 100%" />
                </td>
              </tr>
              <tr>
                <th>Efectivo:</th>
                <td>
                  <input v-model="Abono.efectivo" @keyup="calucularCambio" @keyup.enter="calucularCambio" @click="calucularCambio"
                         style="padding: 2px; background-color: #f3f0e4; width: 100%" />
                </td>
              </tr>
              <tr >
                <th>Cambio:</th>
                <td>{{int.format(Abono.cambio)}} lps</td>
              </tr>
              <tr >
                <th >Observación</th>
                <td ><input v-model="obsRecibo" style="padding: 2px; background-color: #f3f0e4; width: 100%; box-sizing: border-box;" /></td>
              </tr>
              <tr>
                <th>Siguiente recordatorio</th>
                <td><input type="date" v-model="fecha_recordatorio" style="padding: 2px; background-color: #f3f0e4; width: 100%; box-sizing: border-box;"></td>
              </tr>
              <tr v-if="btnRegistrar">
                <th></th>
                <td class="d-flex justify-end"><v-btn x-small color="success" dark tile @click="validarForm">Registrar Pago</v-btn></td>
              </tr>
              </thead>
            </table>
            <table v-if="registrar.enviado">
              <thead>
              <tr><th>Acciones al registrar</th></tr>
              <tr>
                <th>Crear Recibo</th>
                <td>
                  <v-progress-circular size="20" v-if="!registrar.recibo" indeterminate color="primary"></v-progress-circular>
                  <v-icon v-else x-small color="success">fa fa-check</v-icon>
                </td>
              </tr>
              <tr>
                <th>Actualizar Venta</th>
                <td>
                  <v-progress-circular size="20" v-if="!registrar.venta" indeterminate color="primary"></v-progress-circular>
                  <v-icon v-else x-small color="success">fa fa-check</v-icon>
                </td>
              </tr>
              <tr>
                <th>Actualizar Caja</th>
                <td>
                  <v-progress-circular size="20" v-if="!registrar.caja" indeterminate color="primary"></v-progress-circular>
                  <v-icon v-else x-small color="success">fa fa-check</v-icon>
                </td>
              </tr>
              <tr>
                <th>Portafolio Actualizado</th>
                <td>
                  <v-progress-circular size="20" v-if="!registrar.portafolio" indeterminate color="primary"></v-progress-circular>
                  <v-icon v-else x-small color="success">fa fa-check</v-icon>
                </td>
              </tr>
              <tr>
                <th>Documento para Imprimir</th>
                <td>
                  <v-progress-circular size="20" v-if="!registrar.imprimir" indeterminate color="primary"></v-progress-circular>
                  <v-icon v-else x-small color="success">fa fa-check</v-icon>
                </td>
              </tr>
              </thead>
            </table>
          </v-card>
        </v-col>
      </v-row>
      <v-divider></v-divider>
    </v-card>
  </div>
  <div v-else>
    <info_pago/>
  </div>

  <v-dialog v-model="dialogoDXC" width="80%">
    <v-card>
      <v-toolbar color="grey lighten-5">
        <h6>Documentos por Cobrar</h6>
      </v-toolbar>
      <v-data-table dense
                    class="rowsTable"
                    :headers="headersDXC"
                    :items="CUENTA.pagos_extras_ventas">
        <template v-slot:item.estado="{item}">
          <v-chip color="warning" x-small dark v-if="item.estado === 1">Pendiente</v-chip>
          <v-chip color="success" x-small dark v-else>Cancelado</v-chip>
        </template>
        <template v-slot:item.fecha_pago="{item}">
          {{item.fecha_pago.split('-')[2]}}/{{item.fecha_pago.split('-')[1]}}/{{item.fecha_pago.split('-')[0]}}
        </template>
        <template v-slot:item.observacion="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-on="on" v-bind="attrs">{{item.observacion.substr(0,20)}} ...</span>
            </template>
            <span>{{item.observacion}}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.total="{item}">
          L {{item.total}}
        </template>
        <template v-slot:item.id="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn width="25" height="25" fab v-on="on" @click="distribuirPagoDXC(item)"
                     tile color="success" dark v-bind="attrs">
                <v-icon>fa fa-arrow-right</v-icon>
              </v-btn>
            </template>
            <span>Hacer Recibo del Documento</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" dark small tile @click="dialogoDXC = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoPagos" width="80%">
    <v-card>
      <v-toolbar color="grey lighten-5">
        <h6>Tabla de Pagos</h6>
      </v-toolbar>
      <v-data-table dense
                    :items="CUENTA.pagos_contratos"
                    class="rowsTable"
                    :headers="headers">
        <template v-slot:item.estado="{item}">
          <v-chip color="orange" x-small dark v-if="item.estado === 1">Al día</v-chip>
          <v-chip color="success" x-small dark v-else-if="item.estado === 3">Cancelado</v-chip>
          <v-chip color="red" x-small dark v-else-if="item.estado === 2">En Mora</v-chip>
        </template>
        <template v-slot:item.mora="{item}">L {{item.mora}}</template>
        <template v-slot:item.pago_inicial="{item}">L {{item.pago_inicial}}</template>
        <template v-slot:item.total_pago="{item}">L {{item.total_pago}}</template>
        <template v-slot:item.total_abonado="{item}">L {{item.total_abonado}}</template>
        <template v-slot:item.saldo_actual="{item}">L {{item.saldo_actual}}</template>
      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn small color="orange" dark @click="dialogoPagos = false" tile>Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoCalculadora" width="80%">
    <v-card>
      <v-toolbar color="grey lighten-5">
        <h6>Tabla Para Calcular Pago</h6>
        <v-spacer></v-spacer>
        <h5>Total del Pago: <strong>L {{totalCalculadora}}</strong></h5>
      </v-toolbar>
      <v-data-table dense
                    :items="CUENTA.pagos_contratos"
                    class="rowsTable"
                    v-model="calculadora"
                    show-select
                    :headers="headers">
        <template v-slot:item.estado="{item}">
          <v-chip color="orange" x-small dark v-if="item.estado === 1">Al día</v-chip>
          <v-chip color="success" x-small dark v-else-if="item.estado === 3">Cancelado</v-chip>
          <v-chip color="red" x-small dark v-else-if="item.estado === 2">En Mora</v-chip>
        </template>
        <template v-slot:item.mora="{item}">L {{item.mora}}</template>
        <template v-slot:item.pago_inicial="{item}">L {{item.pago_inicial}}</template>
        <template v-slot:item.total_pago="{item}">L {{item.total_pago}}</template>
        <template v-slot:item.total_abonado="{item}">L {{item.total_abonado}}</template>
        <template v-slot:item.saldo_actual="{item}">L {{item.saldo_actual}}</template>

      </v-data-table>
      <v-card-actions class="d-flex justify-end">
        <v-btn small color="indigo" dark @click="calcularPago" tile>Calcular Pago</v-btn>
        <v-btn small color="success" class="text-white" :disabled="!btnCalculadora"
               @click="aceptarPagoCalculadora" tile>Tomar Resultado</v-btn>
        <v-btn small color="orange" dark @click="cerrarCalculadora" tile>Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";
import info_pago from "./info_pago";
import {ipcRenderer} from "electron";

export default {
  name: "cuenta",
  components:{info_pago},
  data(){
    return{
      registrar:{
        enviado:    false,
        recibo:     false,
        caja:       false,
        venta:      false,
        portafolio: false,
        imprimir:   false
      },
      int: Intl.NumberFormat(),
      dxc: 0,
      btnCalculadora: false,
      calculadora: [],
      totalCalculadora: 0,
      dialogoCalculadora: false,
      obsRecibo: '',
      FormasPago: [],
      dialogoRegistrar: false,
      vistaInfoPago: false,
      headers:[
        {text: 'Detalle', value:'detalle'},
        {text: 'Estado', value:'estado'},
        {text: 'Mora', value:'mora'},
        {text: 'Pago Inical', value:'pago_inicial'},
        {text: 'Pago total', value:'total_pago'},
        {text: 'Abonado', value:'total_abonado'},
        {text: 'Saldo Actual', value:'saldo_actual'},
      ],
      headersC:[
        {text: 'Detalle', value:'detalle'},
        {text: 'Estado', value:'estado'},
        {text: 'Mora', value:'mora'},
        {text: 'Pago Inical', value:'pago_inicial'},
        {text: 'Pago total', value:'total_pago'},
        {text: 'Abonado', value:'total_abonado'},
        {text: 'Saldo Actual', value:'saldo_actual'},
        {text: 'Seleccionar', value:'id'},
      ],
      headersDXC:[
        {text: 'Detalle del Pago', value:'descripcion'},
        {text: 'Estado', value:'estado'},
        {text: 'Fecha de Pago', value:'fecha_pago'},
        {text: 'Observación', value:'observacion'},
        {text: 'Total', value:'total'},
        {text: 'Pagar', value:'id'},
      ],
      dialogoPagos: false,
      show: true,
      Abono:{
        total: 0,
        efectivo: 0,
        forma_pago: 0,
        cambio:   0,
        referencia: '',
        distribucion: []
      },
      PagosDistrubuidos: [],
      btnRegistrar: false,
      dialogoDXC: false,
      rules: {
        referencia: {
          req: v => !!v || 'Campo requerido',
          prohibido:  v => v == 3 || v == 5 || 'Tienes prohibido a seleccionar este opción'
        },
        efectivo:{
          min: v => v >= this.Abono.total || 'No puede ser menor que el total que se distribuyó',
        },
      },
      ccCuentasB: [],
      loadccBancos: false,
      ccBanco:      0,
      fecha_recordatorio: null,
      dialofo_fecha_recordatorio: false
    }
  },
  computed:{
    USUARIO(){
      return this.$store.state.usuario;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
    CUENTA:{
      get: function (){
        return this.$store.state.caja.CUENTA;
      },
      set: function (data){
        this.$store.commit('caja/agregar_CUENTA', data);
      }
    },
    SUCURSAL_ID(){
      return this.$store.state.sucursal;
    },
    LOADCUENTA(){
      return this.$store.state.cuentas.LOADCUENTAS;
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
    this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
      this.CUENTA = res.data.venta;
      this.show = false;
    });
    if (this.CUENTA.pagos_extras_ventas) {
      if (this.CUENTA.pagos_extras_ventas.length > 0)
        this.notificacion('Esta cuenta tiene documentos por cobrar pendientes', 'warning');
    }
  },
  mounted() {
    this.cargarFormaPago();
  },
  methods:{
    abrirNavegador(clave, tipo, recibo, cod){
      let url = '';
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+cod+'/'+clave;
      else if(tipo === 2 && recibo === 2)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibos/usuario=' + this.USUARIO + '/recibo=' + cod + '/' + clave;
      else if(tipo === 2 && recibo === 3)
        url = this.$axios.defaults.baseURL + 'documentos/cajas/recibo_dxc/usuario=' + this.USUARIO + '/recibo=' + cod + '/' + clave;
      else if (tipo === 2 && recibo === 5)
        url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_anticipo/usuario='+this.USUARIO+'/recibo='+cod+'/'+clave;

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    abrirDialogoRegistrar(){
      if (this.CUENTA.facturada === 1 || this.CUENTA.tipo_venta === 1){
        this.dialogoRegistrar = true;
        this.Abono.efectivo = this.Abono.total;
      }else
        this.$store.commit('notificacion',{texto:'Primero tienes que facturar', color:'warning'})
    },
    aceptarPagoCalculadora(){
      this.Abono.total = this.totalCalculadora;
      this.dialogoCalculadora = false;
      this.totalCalculadora   = 0;
      this.calculadora        = [];
      this.btnCalculadora     = false;
      this.distribuirPago();
    },
    actualizarCaja(reciboId, recibo, clave){
      this.$axios.post('caja/postear/cuenta/actualizar_caja',{
        caja_id:      this.CAJA.id,
        forma_pago:   this.Abono.forma_pago,
        referencia:   this.Abono.referencia,
        recibo:       reciboId,
        total:        this.Abono.total,
      }).then((res)=>{
        this.registrar.caja = true;
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.actualizarPortafolio(reciboId, recibo, clave);
        this.registrar.imprimir = true;
      }).catch((error)=>{
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'error');
        else
          this.notificacion('Hubo un error al registrar el pago','error');
      })
    },
    actualizarVenta(reciboId, clave, codido){
      this.$store.$axios.post('caja/postear/cuenta/actualizar_venta',{
        recibo:     reciboId,
        pagos:      this.PagosDistrubuidos,
        venta_id:   this.CUENTA.id,
        total:      this.Abono.total,
        forma_pago: this.Abono.forma_pago,
        ccBanco:    this.ccBanco,
        caja_id:    this.CAJA.id,
      }).then((res)=>{
        this.registrar.venta = true;
        this.actualizarCaja(reciboId, codido, clave);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'error');
        else
          this.notificacion('Hubo un error al registrar el pago','error');
      })
    },
    actualizarPortafolio(reciboId, recibo, clave){
      this.$axios.post('caja/postear/cuenta/actualizar_portafolio',{
        reciboId: reciboId,
        venta_id:   this.CUENTA.id,
        total:      this.Abono.total,
        recordatorio: this.fecha_recordatorio
      }).then((res)=>{
        this.registrar.portafolio = true;
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.abrirNavegador(clave, 2,2, recibo);
      }).catch((error)=>{
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'error');
        else
          this.notificacion('Hubo un error al registrar el pago','error');
      })
    },
    calucularCambio(){
      if (this.Abono.efectivo && this.Abono.efectivo > 0){
        this.Abono.cambio = (parseFloat(this.Abono.efectivo) - parseFloat(this.Abono.total)).toFixed(2);
      }else
        this.Abono.cambio = 0;
    },
    calcularPago(){
      this.totalCalculadora = 0;
      this.calculadora.forEach((i)=>{
        this.totalCalculadora = this.totalCalculadora + i.saldo_actual;
        this.btnCalculadora = true;
      });
      this.totalCalculadora.toFixed(2);
    },
    cargarCcCuentasBancos(){
      if (this.ccCuentasB.length === 0){
        if (this.Abono.forma_pago === 2 || this.Abono.forma_pago === 4){
          this.loadccBancos = true;
          this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=>{
            this.ccCuentasB   = res.data.cuentas;
            this.loadccBancos = false
          });
        }
      }
    },
    cargarFormaPago(){
      this.$axios.get('forma_pagos').then((res)=>{
        this.FormasPago = res.data.formas;
      })
    },
    cerrarCalculadora(){
      this.dialogoCalculadora = false;
      this.totalCalculadora   = 0;
      this.calculadora        = [];
      this.btnCalculadora     = false;
    },
    contado(){
      this.$axios.post('cajas/postear/factura',{
        sucursal_id:     this.SUCURSAL_ID,
        total:           this.Abono.total,
        venta_id:        this.CUENTA.id,
        caja_id:         this.CAJA.id,
        cuerpo:          this.PagosDistrubuidos,
        cambio:          this.Abono.cambio,
        efectivo:        this.Abono.efectivo,
        forma_pago_id:   this.Abono.forma_pago,
        cc_cuenta_banco: this.ccBanco,
        referencia:      this.Abono.referencia
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.vistaInfoPago = true;
        this.notificacion(res.data.msj,'success');
        this.notificacion('Se cargará el documnto para su impresión','success');
        if (res.data.is_cancelada == true)
          this.notificacion('El estado de la cuenta pasó a cancelada','success');
        else{
          this.notificacion('Esta cuenta aún tiene pagos pendientes','success');
        }
        let url = this.$axios.defaults.baseURL+'documentos/cajas/factura/usuario='+this.USUARIO+'/factura='+res.data.contador+'/'+res.data.token;
        ipcRenderer.send('pint_navegador', url);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'error');
        else
          this.notificacion('Hubo un error al registrar el pago','error');
      })
    },
    credito(){
      if (this.obsRecibo){
        this.$axios.post('caja/postear/cuenta',{
          sucursal_id:  this.SUCURSAL_ID,
          total:        this.Abono.total,
          venta_id:     this.CUENTA.id,
          observacion:  this.obsRecibo,
          pagos:        this.PagosDistrubuidos,
          caja_id:      this.CAJA.id,
          saldo_actual: this.CUENTA.saldo_actual,
          forma_pago:   this.Abono.forma_pago,
          referencia:   this.Abono.referencia,
          ccBanco:      this.ccBanco,
          recordatorio: this.fecha_recordatorio
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.notificacion(res.data.msj,'success');
          this.notificacion('Se cargará el documnto para su impresión','success');
          this.registrar.recibo = true;
          this.actualizarVenta(res.data.reciboId, res.data.clave, res.data.codigo);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          if (error.response.data.status === 422)
            this.notificacion(error.response.data.error,'error');
          else
            this.notificacion('Hubo un error al registrar el pago','error');
        })
      }else {
        this.notificacion('No hay observación en el recibo','warning');
        this.$store.commit('activarOverlay', false);
        this.dialogoRegistrar = true;
      }
    },
    crearFactura(){
      let cuerpo = [];
      let serie = '', serieS = '';
      this.$store.commit('activarOverlay', true);
      this.CUENTA.facturas_contados.forEach(item=>{
        if (item.is_remision === 1){
          serie  = item.remision_articulo.serie_fabricante;
          serieS = item.remision_articulo.serie_sistema;
        }else{
          serie = '-';
          serieS = '-';
        }
        cuerpo.push({
          articulo: item.articulo.nombre_articulo,
          serie:    serie,
          serieS:   serieS
        })
      })
      this.$axios.post('venta/credito/generar_factura',{
        sucursal_id: this.SUCURSAL_ID,
        total:       this.CUENTA.total,
        venta_id:    this.CUENTA.id,
        caja_id:     this.CAJA.id,
        cuerpo:      cuerpo
      }).then((res)=>{
        this.show = true;
        this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
          this.CUENTA = res.data.venta;
          this.show = false;
        });
        this.notificacion('Se creó la factura','success');
        this.notificacion('Se está cargando la factura','success');
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'warning');
        else
          this.notificacion('Hubo un error al crear la factura','error');

        this.$store.commit('activarOverlay', false);
      })
    },
    distribuirPago(){
      this.dxc = 0;
      if (this.Abono.total > 0){
        if (this.Abono.total <= this.CUENTA.saldo_actual){
          let saldo = this.Abono.total, estado = true;
          let pagos = this.CUENTA.pagos_contratos.filter((i)=> i.estado < 3);
          let pago = 0, saldo_p = 0;
          this.PagosDistrubuidos = [];
          let errores = 0;
          pagos.forEach((item)=>{
            if (item.saldo_cap < 0 || item.saldo_actual < 0 || item.mora < 0)
              errores++;
          });
          if (errores === 0){
            pagos.forEach((item)=>{
              if (saldo > 0){
                if (item.is_mora === 1 && item.mora > 0) {
                  if (saldo > item.mora) {
                    pago = item.mora;
                    saldo_p = 0
                  }else {
                    pago = saldo;
                    saldo_p = (pago - item.mora).toFixed(2)
                    if (saldo_p < 0)
                      saldo_p = (item.mora - pago).toFixed(2)
                  }

                  saldo = (saldo - pago).toFixed(2);
                  if (saldo < 0)
                    saldo = 0;

                  this.PagosDistrubuidos.push({
                    status: 2,
                    pago_id: item.id,
                    tipo: 'Mora',
                    detalle: 'Mora ' + item.detalle,
                    pendiente: item.mora,
                    pagara:    pago,
                    saldo:     saldo_p,
                    hay:       saldo
                  })
                }

                if (saldo > 0 && item.estado === 2 || item.estado === 1){
                  if (saldo > item.saldo_cap){
                    pago = item.saldo_cap;
                    saldo_p = 0;
                  }else{
                    pago = (item.saldo_cap - saldo).toFixed(2);
                    saldo_p = (pago - item.saldo_cap).toFixed(2);
                    if (saldo_p < 0){
                      pago = saldo
                      saldo_p = (item.saldo_cap - pago).toFixed(2)
                    }
                  }

                  saldo = (saldo - pago).toFixed(2);

                  this.PagosDistrubuidos.push({
                    status: 1,
                    pago_id: item.id,
                    tipo: 'Letra',
                    detalle: item.detalle,
                    pendiente: item.saldo_cap,
                    pagara:    pago,
                    saldo:     saldo_p,
                    hay:       saldo
                  })
                }
              }
            });
          }else {
            this.$store.commit('notificacion', {
              texto: 'Esta cuenta tiene errores en uno de sus pagos, por favor notificar a soporte. NO HACER RECIBO!!',
              color: 'warning'
            })
          }
          this.btnRegistrar = true;

          if (this.CUENTA.tipo_venta === 1)
            this.btnRegistrar = parseFloat(this.Abono.total) === parseFloat(this.CUENTA.total);
        }
        else{
          this.btnRegistrar = false;
          this.notificacion('El valor no puede ser mayor al saldo actual','warning')
        }
      }
      else{
        this.btnRegistrar = false;
        this.notificacion('Tienes que ingresar un valor mayor a 0','warning')
      }
      console.log(this.PagosDistrubuidos)
    },
    distribuirPagoDXC(item){
      this.PagosDistrubuidos = [];
      this.PagosDistrubuidos.push({
        status: 3,
        pago_id: item.id,
        tipo: 'DXP',
        detalle: item.descripcion,
        pendiente: item.total,
        pagara:    item.total,
        saldo:     0,
        hay:       0
      });
      this.dxc              = 1;
      this.dialogoDXC       = false;
      this.btnRegistrar     = true;
      this.Abono.total      = item.total;

    },
    dxcPost(){
      this.$axios.post('caja/postear/documento_x_cobrar',{
        sucursal_id:     this.SUCURSAL_ID,
        total:           this.Abono.total,
        venta_id:        this.CUENTA.id,
        caja_id:         this.CAJA.id,
        cuerpo:          this.PagosDistrubuidos,
        cambio:          this.Abono.cambio,
        efectivo:        this.Abono.efectivo,
        forma_pago_id:   this.Abono.forma_pago,
        cc_cuenta_banco: this.ccBanco,
        referencia:      this.Abono.referencia,
        recordatorio:    this.fecha_recordatorio
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.vistaInfoPago = true;
        this.solicitarClave(res.data.recibo)
        this.notificacion(res.data.msj,'success');
        this.notificacion('Se cargará el documento para su impresión en un momnto','success');
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'error');
        else
          this.notificacion('Hubo un error al registrar el pago','error');
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    print_DXC(clave, recibo){
      let url = this.$axios.defaults.baseURL+'documentos/cajas/recibo_dxc/usuario='+this.USUARIO+'/recibo='+recibo+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    registrarPago(){
      if (this.Abono.total > 0 && this.PagosDistrubuidos.length > 0){
        this.dialogoRegistrar = false;
        this.registrar.enviado = true;
        if(this.dxc !== 1){
          this.registrar.enviado = true;
          if (this.CUENTA.tipo_venta === 1)
            this.contado();
          else
            this.credito();
        }else
          this.dxcPost();
      }else
        this.$store.commit('notificacion',{texto:'Hace falta validación', color:'warning'});
    },
    solicitarClave(recibo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.print_DXC(res.data.clave, recibo);
      }).catch((error)=>{
        this.dialogoPartida = true;
        this.$store.commit('activarOverlay', false);
      });
    },
    validarForm(){
      if (this.Abono.forma_pago === 3 || this.Abono.forma_pago === 5) {
        if (this.PagosDistrubuidos.length > 0 && this.obsRecibo.length > 2 && this.Abono.efectivo >= this.Abono.total)
          this.registrarPago();
        else
          this.$store.commit('notificacion',{texto:'Campos incompletos', color:'warning'});
      }else
        this.$store.commit('notificacion',{texto:'Formas de pago solo efectivo y tarjetas', color:'warning'});
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
}

table thead tr th{
  padding: 2px;
  font-size: 11px;
}
table tbody tr td{
  padding: 2px;
  font-size: 10px;
}
table thead tr td{
  padding: 2px;
  font-size: 10px;
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
table thead tr:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
  cursor: pointer;
}
</style>
