<template>
<v-card flat :loading="show">
  <div v-if="!vistaInfoPago">
    <v-row no-gutters>
      <v-col cols="4">
        <v-card class="ma-2">
          <v-simple-table class="rowsTable" dense>
            <template v-slot:default>
              <tbody>
              <tr>
                <th>Facturada:</th>
                <td>
                  <v-icon x-small color="success" dark v-if="CUENTA.facturada === 1">fa fa-check</v-icon>
                  <v-icon x-small color="red" dark v-else-if="CUENTA.facturada === 0">fa fa-times</v-icon>
                </td>
              </tr>
              <tr v-if="CUENTA.facturada === 0">
                <th>Facturar:</th>
                <td>
                  <v-btn x-small dark color="indigo" @click="crearFactura">Facturar</v-btn>
                </td>
              </tr>
              <tr>
                <th>Documento a Realizar:</th>
                <td v-if="CUENTA.tipo_venta === 1">Factura de Contado</td>
                <td v-else-if="CUENTA.tipo_venta === 2">Recibo</td>
              </tr>
              <tr>
                <th>Saldo Inicial:</th>
                <td><strong>L </strong>{{CUENTA.total}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Saldo Mora:</th>
                <td><strong>L </strong> {{CUENTA.contrato_cliente.saldo_mora}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Saldo Abonado:</th>
                <td><strong>L </strong> {{CUENTA.contrato_cliente.saldo_abonado}}</td>
              </tr>
              <tr>
                <th>Saldo Actual</th>
                <td><strong>L </strong> {{CUENTA.saldo_actual}}</td>
              </tr>
              <tr>
                <th>Cuota</th>
                <td v-if="CUENTA.tipo_venta === 2"><strong>L </strong>{{CUENTA.contrato_cliente.cuota}}</td>
                <td v-else><strong>L </strong> {{CUENTA.total}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Forma de Pago</th>
                <td>
                  <v-chip x-small color="indigo" dark v-if="CUENTA.contrato_cliente.forma_pago === 1">Semanal</v-chip>
                  <v-chip x-small color="indigo" dark v-else-if="CUENTA.contrato_cliente.forma_pago === 2">Quincenal</v-chip>
                  <v-chip x-small color="indigo" dark v-if="CUENTA.contrato_cliente.forma_pago === 3">Mensual</v-chip>
                </td>
              </tr>
              <tr>
                <th>Estado:</th>
                <td>
                  <v-chip color="orange" x-small v-if="CUENTA.estado === 1" dark>Al día</v-chip>
                  <v-chip color="red" x-small v-else-if="CUENTA.estado === 2" dark>Mora</v-chip>
                  <v-chip color="success" x-small v-else-if="CUENTA.estado === 3" dark>Cancelada</v-chip>
                  <v-chip color="indigo" x-small v-else-if="CUENTA.estado === 4" dark>Pendiente por aceptar</v-chip>
                </td>
              </tr>
              <tr>
                <th>Cliente</th>
              </tr>
              <tr>
                <th>Identidad:</th>
                <td>{{CUENTA.cliente.identidad}}</td>
              </tr>
              <tr>
                <th>Artículo</th>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 1 && CUENTA.facturas_contados" v-for="item in CUENTA.facturas_contados">
                <td colspan="2">{{item.articulo.nombre_articulo}} - {{item.articulo.marca.nombre}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Artículo:</th>
                <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.nombre_articulo}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Módelo:</th>
                <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.modelo}}</td>
              </tr>
              <tr v-if="CUENTA.tipo_venta === 2">
                <th>Marca:</th>
                <td>{{CUENTA.contrato_cliente.remision_articulo.articulo.marca.nombre}}</td>
              </tr>
              <tr>
                <th colspan="2">Documentos por Cobrar Pendientes</th>
              </tr>
              <tr v-if="CUENTA.pagos_extras_ventas && item.estado === 1" v-for="item in CUENTA.pagos_extras_ventas">
                <td colspan="2">{{item.descripcion}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card class="ma-2 pa-4">
          <v-row no-gutters>
            <v-col cols="4">
              <v-text-field class="ma-2" outlined dense label="# Cuenta" disabled v-model="CUENTA.cod"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field class="ma-2" outlined dense placeholder="0"
                            label="Abono" prefix="L" v-model="Abono.total"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-btn color="indigo" class="ma-2" @click="distribuirPago" outlined tile dark>Distribuir Pago</v-btn>
            </v-col>
          </v-row>
          <v-toolbar flat color="grey lighten-5">
            <h6>Distribución de Pagos</h6>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{on, attr}">
                <v-btn color="orange" v-bind="attr" @click="dialogoPagos = true"  v-on="on" fab tile x-small dark>
                  <v-icon>fa fa-expand-arrows-alt</v-icon>
                </v-btn>
              </template>
              <span>Ver Tabla de Pagos Completa</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, attr}">
                <v-btn color="indigo" class="ma-1" v-bind="attr"
                       v-on="on" fab tile x-small dark @click="dialogoCalculadora = true">
                  <v-icon>fa fa-calculator</v-icon>
                </v-btn>
              </template>
              <span>Calculadora de Pagos</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{on, attr}">
                <v-btn color="success" class="ma-1" @click="dialogoDXC = true"
                       v-bind="attr" v-on="on" fab tile x-small dark>
                  <v-icon>fa fa-expand-arrows-alt</v-icon>
                </v-btn>
              </template>
              <span>Documentos por Cobrar</span>
            </v-tooltip>
          </v-toolbar>
          <v-simple-table dense height="250" class="rowsTable" >
            <template v-slot:default>
              <thead>
              <tr>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Pendiente</th>
                <th>Pagará</th>
                <th>Saldo</th>
                <th>Aún Hay</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in PagosDistrubuidos">
                <td>{{item.tipo}}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <span v-on="on" v-bind="attrs">{{item.detalle.substr(0,8)}} ...</span>
                    </template>
                    <span>{{item.detalle}}</span>
                  </v-tooltip>
                </td>
                <td><strong>L. </strong>{{item.pendiente}}</td>
                <td><strong>L. </strong>{{item.pagara}}</td>
                <td><strong>L. </strong>{{item.saldo}}</td>
                <td><strong>L. </strong>{{item.hay}}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="indigo" tile class="white--text" @click="abrirDialogoRegistrar"
                   small :disabled="!btnRegistrar">Registrar Pago</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else>
    <info_pago/>
  </div>

  <v-dialog v-model="dialogoRegistrar" width="30%">
    <v-card >
      <v-toolbar flat color="grey lighten-5">
        <h6>Realizar Documento</h6>
      </v-toolbar>
      <v-form class="pl-5 pr-5 pb-5" ref="FormRegistrarVenta">
        <v-select dense :items="FormasPago" label="Forma de Pago"
                  v-model="Abono.forma_pago" :rules="[rules.referencia.req]"
                  :item-value="'id'" :item-text="'nombre'">
        </v-select>
        <v-text-field dense v-model="Abono.referencia" label="Referencia Pago"></v-text-field>
        <v-text-field dense v-model="Abono.efectivo" label="Efectivo" type="number"
                      :rules="[rules.referencia.req, rules.efectivo.min]" @keyup="calucularCambio"
                      prefix="L" @click="calucularCambio" @keyup.enter="calucularCambio">
        </v-text-field>
        <v-text-field dense v-model="Abono.cambio" label="Cambio" disabled prefix="L"></v-text-field>
        <v-text-field dense v-model="obsRecibo" label="Observación para el Recibo"
                      counter v-if="CUENTA.tipo_venta === 2">
        </v-text-field>
      </v-form>
      <v-card-actions class="d-flex justify-end">
        <v-btn small tile color="orange" dark @click="dialogoRegistrar = false">Cerrar</v-btn>
        <v-btn small tile color="success" dark @click="validarForm">Registrar Posteo</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
              <v-btn width="25" height="25" fab v-on="on"
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
        total: '',
        efectivo: 0,
        forma_pago: '',
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
        },
        efectivo:{
          min: v => v >= this.Abono.total || 'No puede ser menor que el total que se distribuyó',
        },
      },
    }
  },
  computed:{
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
  },
  created() {
    this.$store.commit('activarOverlay', false);
    this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
      this.CUENTA = res.data.venta;
      this.show = false;
    });
    if (this.CUENTA.pagos_extras_ventas.length > 0)
      this.notificacion('Esta cuenta tiene documentos por cobrar pendientes','warning');

    this.cargarFormaPago();
  },
  methods:{
    abrirDialogoRegistrar(){
      this.dialogoRegistrar = true;
      this.Abono.efectivo = this.Abono.total;
    },
    aceptarPagoCalculadora(){
      this.Abono.total = this.totalCalculadora;
      this.dialogoCalculadora = false;
      this.totalCalculadora   = 0;
      this.calculadora        = [];
      this.btnCalculadora     = false;
      this.distribuirPago();
    },
    calucularCambio(){
      this.Abono.cambio = (parseFloat(this.Abono.efectivo) - parseFloat(this.Abono.total)).toFixed(2);
      if (this.Abono.cambio < 0)
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
    cargarFormaPago(){
      this.$axios.get('forma_pagos').then((res)=>{
        this.FormasPago = res.data.formas
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
        sucursal_id:   this.SUCURSAL_ID,
        total:         this.Abono.total,
        venta_id:      this.CUENTA.id,
        caja_id:       this.CAJA.id,
        cuerpo:        this.PagosDistrubuidos,
        cambio:        this.Abono.cambio,
        efectivo:      this.Abono.efectivo,
        forma_pago_id: this.Abono.forma_pago
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
        this.verDocumento(res.data.file)
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
          referencia:   this.Abono.referencia
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.vistaInfoPago = true;
          this.notificacion(res.data.msj,'success');
          this.notificacion('Se cargará el documnto para su impresión','success');
          if (res.data.isCancelada === true)
            this.notificacion('El estado de la cuenta pasó a cancelada','success');
          else{
            this.notificacion('Esta cuenta aún tiene pagos pendientes','warning');
          }
          this.verDocumento(res.data.file)
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
      this.$store.commit('activarOverlay', true);
      this.$axios.post('venta/credito/generar_factura',{
        sucursal_id: this.SUCURSAL_ID,
        total:       this.CUENTA.total,
        venta_id:    this.CUENTA.id,
        caja_id:     this.CAJA.id,
        cuerpo:      [{
          articulo: this.CUENTA.contrato_cliente.remision_articulo.articulo.nombre_articulo,
          serie:    this.CUENTA.contrato_cliente.remision_articulo.serie_fabricante,
          serieS:   this.CUENTA.contrato_cliente.remision_articulo.serie_sistema,
        }],
      }).then((res)=>{
        this.show = true;
        this.$axios.get('cuentas/ventas/'+this.CUENTA.id).then((res)=>{
          this.CUENTA = res.data.venta;
          this.show = false;
        });
        this.notificacion('Se creó la factura','success');
        this.notificacion('Se está cargando la factura','success');
        this.$store.commit('activarOverlay', false);
        this.verDocumento(res.data.file);
      }).catch((error)=>{
        if (error.response.data.status === 422)
          this.notificacion(error.response.data.error,'warning');
        else
          this.notificacion('Hubo un error al crear la factura','error');

        this.$store.commit('activarOverlay', false);
      })
    },
    distribuirPago(){
      if (this.Abono.total > 0){
        if (this.Abono.total <= this.CUENTA.saldo_actual){
          let saldo = this.Abono.total, estado = true;
          let pagos = this.CUENTA.pagos_contratos.filter((i)=> i.estado < 3);
          let pago = 0, saldo_p = 0;
          this.PagosDistrubuidos = [];
          pagos.forEach((item)=>{
            console.log(item)
            if (saldo > 0){
              if (item.is_mora === 1) {
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
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    registrarPago(){
      this.$store.commit('activarOverlay', true);
      this.dialogoRegistrar = false;
      if (this.CUENTA.tipo_venta === 1)
        this.contado();
      else
        this.credito();
    },
    validarForm(){
      if (this.$refs.FormRegistrarVenta.validate())
        this.registrarPago();
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
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
