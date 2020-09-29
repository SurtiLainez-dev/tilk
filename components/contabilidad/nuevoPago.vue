<template>
    <div>
      <v-container class="d-flex justify-center">
        <v-card width="60%">
          <v-row no-gutters >
            <v-col cols="10"><v-card-title>Formulario</v-card-title></v-col>
            <v-col cols="2" class="d-flex justify-end align-center">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn class="ma-2" fab @click="FormaPagos.dialogo = true"
                         color="warning" v-on="on" v-bind="attrs" x-small>
                    <v-icon>fa fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Crear un Método de Pago</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <hr>
          <v-form class="pl-3 pr-3" ref="FormRegistrarPagoProveedores">
            <v-autocomplete label="Proveedor" :items="Proveedores" :loading="loading.proveedores"
                            :rules="[rules.proveedor.req]"
                            v-model="Pago.proveedor_id" class="ma-2" dense @change="cargarPagos"
                            :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
            <v-row no-gutters>
              <v-col>
                <v-autocomplete label="Forma de Pago" :items="FormaPagos.data" :loading="loading.formas_pagos"
                                v-model="Pago.forma_pago_id" class="ma-2" dense
                                :rules="[rules.proveedor.req]"
                                :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete label="Cuenta de Banco" :items="Cuentas" :loading="loading.cuentas"
                                v-model="Pago.cuenta_id" class="ma-2" dense
                                :rules="[rules.proveedor.req]"
                                :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
              </v-col>
            </v-row>
            <v-text-field label="Pago" class="ma-2" dense :rules="[rules.proveedor.req]" v-model="Pago.concepto"
                          @keyup.enter="side = true" @dblclick="side = true">
            </v-text-field>
            <v-text-field class="ma-2" label="Factura" :rules="[rules.proveedor.req]"
                          v-model="Facturas.num_facutra" dense disabled>
            </v-text-field>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col>
                <v-text-field class="ma-2" suffix="lps" dense
                              @keyup="sumarTotal"
                              :rules="[rules.proveedor.req, rules.mayor, rules.menor]"
                              label="Pago de Cuota" v-model="Pago.pago"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field class="ma-2" suffix="lps" dense :rules="[rules.mayorM]"
                              @keyup="sumarTotal" label="Pago de Mora" v-model="Pago.total_mora"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field class="ma-2" suffix="lps" dense
                              label="Total del Pago" disabled v-model="Pago.total_pago"></v-text-field>
              </v-col>
            </v-row>
            <v-text-field class="ma-2" label="Referencia" dense
                          :rules="[rules.proveedor.req,rules.minRef,rules.maxRef]"
                          v-model="Pago.referencia" counter></v-text-field>
            <v-textarea rows="2" class="ma-2" label="Observación" :rules="[rules.maxObser]"
                        dense v-model="Pago.observacion" counter></v-textarea>
            <v-file-input accept="image/*,application/pdf" v-model="Pago.Files"
                          :rules="[rules.proveedor.req]" multiple
                          label="Archivos Escaneados" show-size counter></v-file-input>
            <v-row no-gutters v-if="loading.cargar_pagos">
              <v-col cols="1" class="d-flex justify-start">
                <v-progress-circular :width="3" size="20" color="success" indeterminate></v-progress-circular>
              </v-col>
              <v-col cols="11"><small>Cargando pagos</small></v-col>
            </v-row>
            <v-row no-gutters v-if="Devoluciones.loading">
              <v-col cols="1" class="d-flex justify-start">
                <v-progress-circular :width="3" size="20" color="success" indeterminate></v-progress-circular>
              </v-col>
              <v-col cols="11"><small>Buscando nota de crédito pendintes</small></v-col>
            </v-row>
            <v-row v-if="Devoluciones.estado === 1">
              <v-col cols="1" class="d-flex justify-start align-center"><v-icon color="success">fa fa-check</v-icon></v-col>
              <v-col cols="11" class="d-flex justify-start align-center"><small>No hay notas de crédito pendientes.</small></v-col>
            </v-row>
            <v-row v-else-if="Devoluciones.estado === 2">
              <v-col cols="1" class="d-flex justify-start align-center"><v-icon color="warning">fa fa-exclamation-triangle</v-icon></v-col>
              <v-col cols="9" class="d-flex justify-start align-center"><small>Hay notas de crédito pendientes, revisar antes de efectuar pago.</small></v-col>
              <v-col cols="2" class="d-flex justify-start align-center">
                <v-btn x-small color="warning" dark @click="Devoluciones.dialogo = true">Revisar</v-btn>
              </v-col>
            </v-row>
          </v-form>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="validarForm" small dark>Registrar Pago</v-btn>
          </v-card-actions>
          <v-navigation-drawer v-model="side" clipped right
                               absolute width="100%" class="side" >
            <v-container>
              <v-row no-gutters>
                <v-col cols="1" class="d-flex align-center">
                  <v-btn class="ma-2" dark fab x-small text color="red" @click="side = false">
                    <v-icon>fa fa-times</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="11" class="d-flex justify-center align-center"><h4>Pagos de Facturas a {{Facturas.nombreProveedor}}</h4></v-col>
              </v-row>
              <hr>
              <v-row no-gutters class="pb-4">
                <v-col cols="9"></v-col>
                <v-col cols="3">
                  <b-form-input size="sm" v-model="searh" placeholder="Buscar..."></b-form-input>
                </v-col>
              </v-row>
              <b-table small
                       class="fontTable"
                       :fields="fields"
                       bordered
                       selectable
                       :filter="searh"
                       hover
                       @row-selected="capturarPago"
                       select-mode="single"
                       striped
                       :busy="loading.cargar_pagos"
                       caption-top
                       responsive
                       :items="Facturas.Pagos">
                <template v-slot:table-caption>Pagos Atrasados o Pendientes</template>
                <template v-slot:head(proveedor)><div class="text-nowrap">Proveedor</div></template>
                <template v-slot:head(saldo_pendiente)><div class="text-nowrap">Saldo Pendiente</div></template>
                <template v-slot:head(estado)><div class="text-nowrap">Estado de Factura</div></template>
                <template v-slot:head(total)><div class="text-nowrap">Total de la Factura</div></template>
                <template v-slot:head(num_factura)><div class="text-nowrap"># Factura</div></template>
                <template v-slot:head(fecha_limite_pago)><div class="text-nowrap">Fecha de Cancelación</div></template>
                <template v-slot:head(descripcion)><div class="text-nowrap">Descripción</div></template>
                <template v-slot:head(num_pago)><div class="text-nowrap"># Pago</div></template>
                <template v-slot:head(total_a_pagar)><div class="text-nowrap">Valor de la Cuota</div></template>
                <template v-slot:head(total_pagado)><div class="text-nowrap">Valor Pagado</div></template>
                <template v-slot:head(fecha_pago)><div class="text-nowrap">Fecha de Pago</div></template>
                <template v-slot:head(estado_pago)><div class="text-nowrap">Estado del Pago</div></template>

                <template v-slot:cell(estado)="scope">
                  <v-chip v-if="scope.item.estado === 0" x-small color="orange" dark small>Al día</v-chip>
                  <v-chip v-else-if="scope.item.estado === 1" x-small color="success" dark small>Cancelada</v-chip>
                  <v-chip v-else-if="scope.item.estado === 2" x-small color="red" dark small>Retrasado</v-chip>
                </template>
                <template v-slot:cell(total)="scope">
                  L {{scope.item.total}}
                </template>
                <template v-slot:cell(total_pagado)="scope">
                  L {{scope.item.total_pagado}}
                </template>
                <template v-slot:cell(saldo_pendiente)="scope">
                  <div class="text-nowrap">{{scope.item.saldo_pendiente}}</div>
                </template>
                <template v-slot:cell(total_a_pagar)="scope">
                  L {{scope.item.total_a_pagar}}
                </template>
                <template v-slot:cell(descripcion)="scope"><div class="text-nowrap">{{scope.item.descripcion}}</div></template>
                <template v-slot:cell(num_factura)="scope"><div class="text-nowrap">{{scope.item.num_factura}}</div></template>
                <template v-slot:cell(proveedor)="scope"><div class="text-nowrap">{{scope.item.proveedor}}</div></template>
                <template v-slot:cell(estado_pago)="scope">
                  <v-chip v-if="scope.item.estado_pago === 1" color="orange" dark x-small>Al día</v-chip>
                  <v-chip v-else-if="scope.item.estado_pago === 2" color="success" dark x-small>Cancelado</v-chip>
                  <v-chip v-else-if="scope.item.estado_pago === 3" color="red" dark x-small>Retrasado</v-chip>
                </template>
                <template v-slot:table-busy>
                  <div class="text-center text-primary my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>Cargando Pagos...</strong>
                  </div>
                </template>
              </b-table>
            </v-container>
          </v-navigation-drawer>
          <v-navigation-drawer v-model="Devoluciones.dialogo" clipped right absolute width="100%" class="side">
            <v-row no-gutters>
              <v-col cols="1" class="d-flex align-center">
                <v-btn class="ma-2" dark fab x-small text color="red" @click="Devoluciones.dialogo = false">
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="11" class="d-flex justify-center align-center"><h4>Notas de Crédito Pendientes de {{Facturas.nombreProveedor}}</h4></v-col>
            </v-row>
            <hr>
            <v-row no-gutters class="pb-4 pl-2 pr-2">
              <v-col cols="9"></v-col>
              <v-col cols="3">
                <b-form-input size="sm" v-model="Devoluciones.searh" placeholder="Buscar..."></b-form-input>
              </v-col>
            </v-row>
            <b-table small :fields="fieldDevoluciones"
                     responsive
                     class="fontTable"
                     :items="Devoluciones.data"
                     bordered striped hover>
              <template v-slot:head(proveedor)><div class="text-nowrap">Proveedor</div></template>
              <template v-slot:head(codigo)><div class="text-nowrap">Cód. de Devolución</div></template>
              <template v-slot:head(orden_entrada)><div class="text-nowrap">Cód. Orden de Entrada</div></template>
              <template v-slot:head(fecha)><div class="text-nowrap">Fecha Realizado</div></template>
              <template v-slot:head(razon)><div class="text-nowrap">Razón de la Devolución</div></template>
              <template v-slot:head(estado)><div class="text-nowrap">Estado de Devolución</div></template>
              <template v-slot:head(documentos)><div class="text-nowrap">Documentos Devolución/Entrada</div></template>
              <template v-slot:cell(estado)="scope">
                <v-chip v-if="scope.item.estado === 0" x-small color="orange" dark small> Pendiente Nota de Crédito</v-chip>
                <v-chip v-else-if="scope.item.estado === 1" x-small color="success" dark small>Subida</v-chip>
              </template>
              <template v-slot:cell(razon)="scope">
                <v-tooltip top >
                  <template v-slot:activator="{on, attrs}">
                    <span v-on="on" v-bind="attrs">{{scope.item.razon.substring(0, 15)}} ...</span>
                  </template>
                  <span>{{scope.item.razon}}</span>
                </v-tooltip>
              </template>
              <template v-slot:cell(documentos)="scope">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn color="red" v-bind="attrs" v-on="on" @click="verDocumento(scope.item.documentos)"
                           x-small fab dark><v-icon>fa fa-file-pdf</v-icon></v-btn>
                  </template>
                  <span>Devolución Generada</span>
                </v-tooltip>
                <v-tooltip top v-if="scope.item.subido_dev">
                  <template v-slot:activator="{on, attrs}">
                    <v-btn color="indigo" v-bind="attrs"  @click="verDocumento(scope.item.subido_dev)"
                           v-on="on" x-small fab dark><v-icon>fa fa-file-pdf</v-icon></v-btn>
                  </template>
                  <span>Devolución Súbida</span>
                </v-tooltip>
                <v-tooltip top >
                  <template v-slot:activator="{on, attrs}">
                    <v-btn color="orange" v-bind="attrs"  @click="verDocumento(scope.item.orden_file)"
                           v-on="on" x-small fab dark><v-icon>fa fa-file-pdf</v-icon></v-btn>
                  </template>
                  <span>Orden de Entrada</span>
                </v-tooltip>
              </template>
            </b-table>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-switch v-model="Devoluciones.permiso" class="ma-2" label="Conseder Permiso Para Realizar Pago"></v-switch>
              </v-col>
            </v-row>
          </v-navigation-drawer>
        </v-card>
      </v-container>
      <v-dialog v-model="FormaPagos.dialogo" width="35%">
        <v-card>
          <v-card-title>Registrar Forma de Pago</v-card-title>
          <v-form ref="FormRegistrarFormaPagos" class="pl-5 pr-5">
            <v-text-field counter label="Nombre de Forma de Pago" :rules="FormaPagos.rules"
                          v-model="FormaPagos.nombre"></v-text-field>
          </v-form>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="warning" small dark @click="FormaPagos.dialogo = false">Cerrar</v-btn>
            <v-btn color="success" small dark @click="registrarFormasPagos">Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
  import {ipcRenderer} from "electron";
  import VueToast from 'vue-toast-notification'
  import Vue from 'vue'
  import Swal from "sweetalert2";
  export default {
    created() {
      this.cargarProveedores();
      this.cargarFormasPagos();
      this.cargarCuentas();

    },
    name: "nuevoPago",
    data(){
      return{
        searh: '',
        FormaPagos:{
          data: [],
          dialogo: false,
          nombre: '',
          rules: [
            v => !!v || 'El nombre es requerido',
            v => (v && v.length <= 30) || 'Solo se puede ingresar un máximo de 30 carácteres',
            v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres',
          ],
        },
        Cuentas: [],
        Pago:{
          concepto: '',
          forma_pago_id: 0,
          cuenta_id: 0,
          proveedor_id: '',
          total_pago: 0,
          total_mora: 0,
          pago: 0,
          referencia: '',
          observacion: '',
          Files:null,
          pago_id: '',
          cuota: 0
        },
        Proveedores: [],
        loading:{
          proveedores:  true,
          cuentas:      true,
          formas_pagos: true,
          cargar_pagos: false,
        },
        side: false,
        Facturas:{
          Pagos: [],
          nombreProveedor: '',
          num_facutra: '',
          cod_pago: ''
        },
        fields:[
          'proveedor',
          'total',
          'saldo_pendiente',
          {key:'num_pago', sortable:true},
          {key:'estado', sortable: true},
          { key: 'num_factura', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'total_a_pagar',
          {key:'fecha_pago', sortable: true},
          {key:'fecha_limite_pago', sortable: true},
          'descripcion',
          'total_pagado',
          {key:'estado_pago', sortable: true},
        ],
        Devoluciones: {
          data: [],
          search: '',
          loading: false,
          estado: 0,
          permiso: false,
          dialogo: false
        },
        rules:{
          proveedor:{
            req: v => !!v || 'Campo requerido',
          },
          maxObser: v => v.length < 200 || 'No puede ser mayor a 200 carácteres',
          maxRef: v => v.length < 19 || 'No puede ser mayor a 19 carácteres',
          minRef: v => v.length > 5  || 'Tiene que ser mayor a 5 carácteres',
          mayor: v => v > 0  || 'Tiene que ser mayor a 0',
          mayorM: v => (v >= 0)  || 'Tiene que ser mayor o igual a 0',
          menor: v => v <= this.Pago.cuota || 'No puede ser mayor a la cuota de '+this.Pago.cuota
        },
        fieldDevoluciones:[
          'proveedor',
          { key: 'codigo', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'orden_entrada',
          'fecha',
          'razon',
          'estado',
          'documentos'
        ]
      }
    },
    methods:{
      verDocumento(dir){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: dir
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url);
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      },
      registrarFormasPagos(){
        if (this.$refs.FormRegistrarFormaPagos.validate()){
          this.FormaPagos.dialogo = false;
          this.$store.commit('activarOverlay', true);
          this.$axios.post('forma_pagos',{
            nombre: this.FormaPagos.nombre
          },{
            headers:{
              'Authorization': 'Bearer '+ this.$store.state.token
            }
          }).then((res)=>{
            this.cargarFormasPagos();
            this.$store.commit('activarOverlay', false);
            Swal.fire(
              'Registro Exitoso',
              `Se registro exitosamente la forma de pago ${this.FormaPagos.nombre}.`,
              'success'
            );
            this.FormaPagos.nombre = '';
          })
        }
      },
      cargarFormasPagos(){
        this.loading.formas_pagos = true;
        this.$axios.get('forma_pagos',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.FormaPagos.data = res.data.formas;
          this.loading.formas_pagos = false;
        })
      },
      buscarDevoluciones(){
        this.Devoluciones.loading = true
        this.$axios.get('devoluciones_proveedor/pedientes/'+this.Pago.proveedor_id,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.tomarDevoluciones(res.data.devoluciones)
        })
      },
      tomarDevoluciones(data){
        this.Devoluciones.data = [];
        data.forEach( (i) => {
          if (i.devolucion_proveedor){
            this.Devoluciones.data.push({
              'proveedor':     i.proveedor.nombre,
              'codigo':        i.devolucion_proveedor.codigo,
              'orden_entrada': i.codigo,
              'fecha':         i.devolucion_proveedor.fecha,
              'razon':         i.devolucion_proveedor.razon,
              'estado':        i.devolucion_proveedor.estado,
              'documentos':    i.devolucion_proveedor.file_generado,
              'orden_file':    i.file,
              'subido_dev':    i.devolucion_proveedor.file_subido
            })
          }
        });
        if (this.Devoluciones.data.length > 0){
          this.Devoluciones.estado = 2;
          this.Devoluciones.permiso = false;
        }else{
          this.Devoluciones.permiso = true;
          this.Devoluciones.estado  = 1;
        }
        this.Devoluciones.loading = false;
      },
      cargarCuentas(){
        this.Cuentas = [];
        this.$axios.get('cuentas',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          res.data.cuentas.forEach((i)=>{
            this.Cuentas.push({
              "id": i.id,
              "nombre": i.num+' - '+i.tipo.nombre+' - '+i.banco.nombre
            })
          });
          this.loading.cuentas = false;
        })
      },
      cargarProveedores(){
        this.$axios.get('proveedores',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.Proveedores = res.data.proveedores;
          this.loading.proveedores = false;
        })
      },
      cargarPagos(){
        this.Devoluciones.estado = 0;
        this.loading.cargar_pagos = true;
        this.Facturas.Pagos = [];
        this.Facturas.nombreProveedor = '';
        this.$axios.get('facturas_proveedor/pendientes/'+this.Pago.proveedor_id,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          if (res.data.facturas){
            res.data.facturas.forEach( (i) => {
              i.pagos_facturas.forEach( (item) => {
                this.Facturas.Pagos.push({
                  "proveedor":         i.proveedor.nombre,
                  "fecha_limite_pago": i.fecha_limite_pago,
                  "total":             i.total,
                  "estado":            i.estado,
                  "num_factura":       i.num_factura,
                  "factura_id":        i.id,
                  "pago_id":           item.id,
                  "descripcion":       item.descripcion,
                  "num_pago":          item.num_pago,
                  "total_a_pagar":     item.total_a_pagar,
                  "total_pagado":      item.total_pagado,
                  "fecha_pago":        item.fecha_pago,
                  "estado_pago":       item.estado,
                  "saldo_pendiente":   `L ${item.saldo_pendiente}`
                })
              });
              this.Facturas.nombreProveedor = i.proveedor.nombre;
            });
          }
          this.loading.cargar_pagos = false;
          this.buscarDevoluciones();
        })
      },
      validarForm(){
        if (this.$refs.FormRegistrarPagoProveedores.validate() && this.Devoluciones.permiso){
          this.registrarPago();
        }else if (this.Devoluciones.permiso === false && this.Devoluciones.estado !== 0){
          Vue.$toast.open({
            message: 'Hay notas de crédito pendientes',
            type: 'warning',
            position: 'bottom-left',
            duration: 6000
            // all of other options may go here
          });
        }
      },
      registrarPago(){
        let files = this.Pago.Files;
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append("forma_pago_id",    this.Pago.forma_pago_id);
        data.append("cuenta_banco_id",  this.Pago.cuenta_id);
        data.append("referencia",       this.Pago.referencia);
        data.append("total_pago",       this.Pago.total_pago);
        data.append("total_mora",       this.Pago.total_mora);
        data.append("pago",             this.Pago.pago);
        data.append("observacion",      this.Pago.observacion);
        data.append("pagos_factura_id", this.Pago.pago_id);
        for (let i in files){
          data.append(`files_pagos[${i}]`, files[i]);
        }
        this.$axios({
          method: 'post',
          url: 'pago_factura_proveedor',
          data: data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$router.replace({path:'/contabilidad/facturas/proveedor/pagos'});
          Swal.fire(
            'Registro Exitoso',
            `Se registro exitosamente el pago ${this.Pago.referencia} a ${this.Facturas.nombreProveedor}.`,
            'success'
          );
        })
      },
      capturarPago(item){
        if (item.length > 0){
          this.Facturas.num_facutra = item[0].num_factura;
          this.Pago.pago            = item[0].total_a_pagar;
          this.Pago.cuota           = item[0].total_a_pagar;
          this.Pago.pago_id         = item[0].pago_id;
          this.Pago.concepto        = item[0].descripcion;
          this.side                 = false;
          this.Pago.total_mora      = 0;
          this.sumarTotal();
        }
      },
      sumarTotal(){
        this.Pago.total_pago = parseFloat(this.Pago.pago) + parseFloat(this.Pago.total_mora);
      },

    }
  }
</script>

<style scoped>
  .side{
    opacity: 0.95;
  }
  .fontG{
    font-family: 'Courier Prime';
  }
  .fontTable{
    font-size: 12px;
  }
</style>
