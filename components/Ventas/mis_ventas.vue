<template>
  <v-card flat>
    <b-overlay :show="LOAD_VENTA" rounded="sm">

      <v-card flat>
        <v-card-title>Información de la venta</v-card-title>
        <v-row no-gutters v-if="DATA_VENTA">
          <v-col cols="3">
            <v-row no-gutters v-for="item in DATOS_CARD" class="pa-1 tarjeta">
              <v-col>
                <v-hover v-slot="{ hover }" open-delay="50">
                  <v-card color="blue darken-1"
                          dark
                          class="pl-1 pr-1 pt-1 pb-1 rowsTable"
                          :elevation="hover ? 16 : 2"
                          :class="{ 'on-hover': hover }">
                    <v-row no-gutters><v-col><small><strong>{{item.titulo}}:</strong> {{item.texto}}</small></v-col></v-row>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="9">
            <v-card flat :disabled="!IS_ACEPTADA">
<!---->
              <v-stepper v-model="vista">
                <v-stepper-header>
                  <v-stepper-step :complete="vista > 1" step="1">DOCUMENTOS</v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step :complete="vista > 2" step="2">SALIDA DE INVENTARIO</v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step :complete="vista > 3" step="3">SALIDA DE REGALÍAS</v-stepper-step>
                  <v-divider></v-divider>
                  <v-stepper-step step="4">FINALIZACIÓN DE VENTA</v-stepper-step>
                </v-stepper-header>
<!---->
<!---->
                <v-stepper-items>
<!---->
                  <v-stepper-content step="1">
                    <v-card class="mb-12" flat>
                      <v-card-title>Subida de documentos</v-card-title>
                      <v-divider></v-divider>
                      <v-row>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn class="text-white" v-on="on" x-small
                                     @click="mostrarPdf($axios.defaults.baseURL+'print_contrato_venta/'+DATA_VENTA.id)"
                                     v-bind="attrs" tile color="success">
                                <v-icon left>
                                  fa fa-file-pdf
                                </v-icon>
                                Contrato
                              </v-btn>
                            </template>
                            <span>Descargar contrato, Esto puede tardar 60 segundos en generarse.</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn x-small class="text-white" v-on="on"
                                     @click="mostrarPdf($axios.defaults.baseURL+'print_pagare_venta/'+DATA_VENTA.id)"
                                     v-bind="attrs" tile color="success">
                                <v-icon left>
                                  fa fa-file-pdf
                                </v-icon>
                                Pagaré
                              </v-btn>
                            </template>
                            <span>Descargar pagaré, Esto puede tardar 40 segundos en generarse.</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn x-small class="text-white" v-on="on"
                                     @click="mostrarPdf($axios.defaults.baseURL+'print_hoja_conocimientos_venta/'+DATA_VENTA.id)"
                                     v-bind="attrs" tile color="success">
                                <v-icon left>
                                  fa fa-file-pdf
                                </v-icon>
                                Hoja de Conocimiento
                              </v-btn>
                            </template>
                            <span>Descargar Hoja de Conocimiento de Trámites, Esto puede tardar 40 segundos en generarse.</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn x-small class="text-white" v-on="on"
                                     @click="mostrarPdf($axios.defaults.baseURL+'print_traspaso_venta/'+DATA_VENTA.id)"
                                     v-bind="attrs" tile color="success">
                                <v-icon left>
                                  fa fa-file-pdf
                                </v-icon>
                                Traspaso
                              </v-btn>
                            </template>
                            <span>Descargar Traspaso Vehícular, Esto puede tardar 40 segundos en generarse.</span>
                          </v-tooltip>
                        </v-col>
                        <v-col>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn x-small class="text-white" v-on="on"
                                     @click="mostrarPdf($axios.defaults.baseURL+'print_carta_poder_venta/'+DATA_VENTA.id)"
                                     v-bind="attrs" tile color="success">
                                <v-icon left>
                                  fa fa-file-pdf
                                </v-icon>
                                Carta Poder
                              </v-btn>
                            </template>
                            <span>Descargar Carta Poder, Esto puede tardar 40 segundos en generarse.</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <div v-if="DATA_VENTA.documento_ventas">
                        <small>Documentos cargados</small>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.contrato)"
                                v-if="DATA_VENTA.documento_ventas.contrato">Contrato de la venta</b-link>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.garantia_prendaria)"
                                v-if="DATA_VENTA.documento_ventas.garantia_prendaria">Pagaré</b-link>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.conocimiento_tramite)"
                                v-if="DATA_VENTA.documento_ventas.conocimiento_tramite">
                          Hoja de conocimiento de trámites</b-link>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.traspaso)"
                                v-if="DATA_VENTA.documento_ventas.traspaso">Traspaso Vehícular</b-link>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.carta_poder)"
                                v-if="DATA_VENTA.documento_ventas.carta_poder">Carta poder</b-link>
                        <br>
                        <b-link @click="verDocumento(DATA_VENTA.documento_ventas.garantia_articulo)"
                                v-if="DATA_VENTA.documento_ventas.garantia_articulo">Garantía</b-link>
                      </div>
                      <div v-else>
                        <v-row>
                          <v-col>
                            <vs-upload text="Cargar Contrato"
                                       id="DocContrato"
                                       @change="cargarDocumentos"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>
                          <v-col>
                            <vs-upload text="Cargar Pagaré"
                                       id="DocPagare"
                                       @change="cargarDocumentos"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>
                          <v-col>
                            <vs-upload text="Cargar Hoja de Conocimiento de Trámites"
                                       @change="cargarDocumentos"
                                       id="DocHojaConocimiento"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>

                          <v-col>
                            <vs-upload text="Cargar Traspaso Vehícular"
                                       @change="cargarDocumentos"
                                       id="DocTraspaso"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>
                          <v-col>
                            <vs-upload text="Cargar Carta Poder"
                                       @change="cargarDocumentos"
                                       id="DocCarta"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>
                          <v-col>
                            <vs-upload text="Cargar Hoja de Garantía"
                                       @change="cargarDocumentos"
                                       id="DocGarantia"
                                       :automatic="false" limit="1"
                                       :show-upload-button="false"
                                       accept="application/pdf">
                            </vs-upload>
                          </v-col>
                        </v-row>
                      </div>


                      <v-card-actions class="d-flex justify-end">
                        <v-btn tile color="warning" @click="cargarFiles" small>Cargar archivos</v-btn>
                        <v-btn tile v-if="DATA_VENTA.is_aceptado !== 3"
                               color="success" @click="vista = 2" small>Siguiente</v-btn>
                      </v-card-actions>

                    </v-card>
                  </v-stepper-content>

                  <v-stepper-content step="2">
                    <v-card class="mb-12" flat>
                      <v-card-title>Verificación de la salida del artículo</v-card-title>

                      <div style="border: solid 1px #000" class="pl-3">
                        <small>Artículo al que se le hará salida</small>
                        <v-simple-table dense class="rowsTable">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Artículo</th>
                              <th>Código del proveedor</th>
                              <th>Marca</th>
                              <th>Módelo</th>
                              <th>Color</th>
                              <th>Código del sistema</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-if="DATA_VENTA.tipo_venta === 1" v-for="item in DATA_VENTA.facturas_contados">
                              <td>{{item.remision_articulo.articulo.nombre_articulo}}</td>
                              <td>{{item.remision_articulo.articulo.codigo_proveedor}}</td>
                              <td>{{item.remision_articulo.articulo.marca.nombre}}</td>
                              <td>{{item.remision_articulo.articulo.modelo}}</td>
                              <td>{{item.remision_articulo.color}}</td>
                              <td>{{item.remision_articulo.serie_sistema}}</td>
                            </tr>
                            <tr v-else-if="DATA_VENTA.tipo_venta === 2">
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.articulo.nombre_articulo}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.articulo.codigo_proveedor}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.articulo.marca.nombre}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.articulo.modelo}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.color}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.serie_sistema}}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
<!---->
                      <div v-if="DATA_VENTA.contrato_cliente.remision_articulo.articulo.is_motocicleta && DATA_VENTA.tipo_venta === 1"
                           style="border: solid 1px #000" class="pl-3">
                        <small>Motocicleta</small>
                        <v-simple-table dense class="rowsTable">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Chasis</th>
                              <th>Motor</th>
                              <th>CC</th>
                              <th>Placa</th>
                              <th>Color</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.motocicleta.chasis}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.motocicleta.motor}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.motocicleta.cilindraje}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.motocicleta.placa}}</td>
                              <td>{{DATA_VENTA.contrato_cliente.remision_articulo.motocicleta.color}}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
<!---->
                      <div style="border: solid 1px #000" class="pl-3">
                        <small>Componentes del artículo de la sucursal {{DATA_VENTA.colaborador.sucursal.nombre}}</small>
                        <v-simple-table dense class="rowsTable" height="400px" fixed-header>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Artículo</th>
                              <th>Código</th>
                              <th>Salida</th>
                              <th>Stock Nuevo</th>
                              <th>Stock Reingreso</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in Componentes">
                              <td>{{item.detalle}}</td>
                              <td>{{item.codigo}}</td>
                              <td><v-checkbox dense v-model="item.salida"></v-checkbox></td>
                              <td>{{item.stock_nuevo}}</td>
                              <td>{{item.stock_reingreso}}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </div>
<!---->
                      <v-card-actions class="d-flex justify-end">
                        <v-btn tile color="orange" dark small @click="vista = 1">Volver</v-btn>
                        <v-btn tile color="success" small dark @click="vista = 3">Siguiente</v-btn>
                      </v-card-actions>
<!---->
                    </v-card>
                  </v-stepper-content>
<!---->
                  <v-stepper-content step="3">
                    <v-card class="mb-12" flat>
                      <v-card-title>Revisión de Regalías</v-card-title>
                      <v-divider></v-divider>
                      <v-simple-table dense class="rowsTable">
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th>Artículo</th>
                            <th>Código</th>
                            <th>Estado</th>
                            <th>Salida</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr v-for="item in Regalias">
                            <td>{{item.articulo}}</td>
                            <td>{{item.codigo}}</td>
                            <td >
                              <v-chip color="success" x-small dark v-if="item.estado === 1">Aceptada</v-chip>
                              <v-chip color="red" x-small dark v-else-if="item.estado === 2">Recgazado</v-chip>
                              <v-chip color="orange" x-small dark v-else-if="item.estado === 3">Sin aprobar</v-chip>
                            </td>
                            <td v-if="item.estado === 1">
                              <v-checkbox v-model="item.salida" dense></v-checkbox>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
<!---->
                      <v-card-actions class="d-flex justify-end">
                        <v-btn color="orange" dark @click="vista = 2" small tile>Volver</v-btn>
                        <v-btn color="success" @click="vista = 4" dark small tile>Siguiente</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
<!---->
                  <v-stepper-content step="4">
                    <v-card flat class="mb-12">
                      <v-card-title>Finalizar venta</v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        La venta ha llegado a final, todos los datos han llegado han sido revisados por facturación
                        y por tí. Al presionar el botón de finalizar ventas aceptas los siguiente términos.
                      </v-card-text>
                      <ol style="font-size: 12px">
                        <li>
                          He cargado al sistema todos los documentos solicitados para realizar la venta y son
                          totalmente legítimos por mi parte y yo me aseguré que lo fueran de parte del cliente.
                        </li>
                        <li>
                          Acepto la responsablidad de darle seguimiento a este crédito los primeros días de mora en el
                          caso de qué acumule mora en alguna cuota.
                        </li>
                        <li>
                          Todas las regalías de la ventas fueron revisadas por mi persona.
                        </li>
                        <li>
                          Todos los componentes del artículo que se le harán salida los revisé para verificar que
                          cumple con stock que se mostró anteriormente.
                        </li>
                        <li>
                          He colocado el sticker de código del sistema al artículo para llevar el control de la
                          garantía.
                        </li>
                        <li>
                          Al aceptar la salida la venta estoy conciente que el inventario de ese artículo se alterará
                          en mi piso de venta de, igual forma los componentes del artículo.
                        </li>
                        <li>
                          Si rechazo la venta, no cumpliré ninguno de los términos antes mencionados, pero tendré
                          que dar una explicación por correo a facturación explicando las razones de tal acción.
                        </li>
                      </ol>
                      <br>
                      <v-select v-model="Colaborador"
                                :item-value="'correo'"
                                :item-text="'nombre'"
                                label="Colaborador a enviar venta"
                                :items="Colaboradores"></v-select>
                      <v-divider></v-divider>
                      <v-simple-table dense class="rowsTable">
                        <template v-slot:default>
                          <caption>Seleccionar dirección de envio</caption>
                          <thead>
                          <tr>
                            <th>Dirección completa</th>
                            <th></th>
                          </tr>
                          </thead>
                          <tbody v-if="DATA_VENTA.cliente.direcciones" v-for="item in JSON.parse(DATA_VENTA.cliente.direcciones)">
                            <tr>
                              <td>{{item.detalle}}</td>
                              <td>
                                <v-btn fab x-small tile @click="capturarDireccion(item.detalle)"
                                       dark><v-icon>fa fa-arrow-right</v-icon></v-btn>
                              </td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <br>
                      <small>Dirección seleccionada</small>
                      <br>
                      <span v-if="Direccion">{{Direccion}}</span>
                      <span v-else>No hay dirección seleccionada</span>
                      <v-divider></v-divider>
                      <v-card-actions class="d-flex justify-end" v-if="!Enviado">
                        <v-btn color="orange" small tile dark @click="vista = 3">Volver</v-btn>
                        <v-btn :disabled="DATA_VENTA.estado !== 4" color="red" small tile class="text-white" @click="ValidarDatos(2)">Rechazar venta</v-btn>
                        <v-btn :disabled="DATA_VENTA.estado !== 4" color="success" small tile class="text-white" @click="ValidarDatos(1)">Aceptar venta</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-stepper-content>
                </v-stepper-items>

              </v-stepper>

            </v-card>
          </v-col>
        </v-row>
      </v-card>

    </b-overlay>


  <v-dialog v-model="Enviado" width="40%">
    <v-card flat>
      <v-card-title>La venta ha concluido exitosamente</v-card-title>
      <v-divider></v-divider>
      <v-card-text>Se ha cerrado la venta, tienes que tomar en cuenta los siguientes puntos:</v-card-text>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Tienes que imprimir la Orden de Entrega.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            El stock del artículo acaba de bajar.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            El stock de los componentes del artículo acaban de bajar.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            El stock de las regalías acaban de bajar.
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions class="d-flex justify-end">
        <v-btn tile color="warning" small dark >Cerrar</v-btn>
        <v-btn tile
               color="success"
               small
               dark
               @click="$router.replace({path:'/ventas/ordenes_entrega/'+OrdenEntrada_id})">
          Impimir Orden de Entrega
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Vue from 'vue';
import {vsUpload} from 'vuesax';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';

export default {
  name: "mis_ventas",
  data(){
    return{
      vista: 1,
      doc:{
        carta_poder:       null,
        contrato:          null,
        hoja_conocimiento: null,
        pagare:            null,
        garantia:          null,
        traspaso:          null
      },
      is_moto: false,
      Componentes: [],
      Regalias:    [],
      Enviado:     false,
      Colaboradores: [],
      Colaborador:   '',
      Direccion: '',
      OrdenEntrada_id: 0
    }
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.ventas.LOAD_MIS_VENTAS;
    },
    DATA_VENTA(){
      return this.$store.state.ventas.DATA_VENTA;
    },
    DATOS_CARD(){
      return this.$store.state.ventas.DATOS_CARD;
    },
    IS_MOTO(){
      return this.$store.state.ventas.IS_MOTO;
    },
    DATA_COMPONENTES(){
      return this.$store.state.ventas.DATA_COMPONENTES;
    },
    DATA_REGALIAS(){
      return this.$store.state.ventas.DATA_REGALIAS;
    },
    IS_ACEPTADA(){
      return this.$store.state.ventas.IS_ACEPTADA;
    }
  },
  created() {
    this.$store.commit('ventas/cargar_DATA_VENTA');
    this.$store.commit('guardarTitulo', 'Mis Ventas');
    Vue.use(vsUpload)
    this.Componentes = this.DATA_COMPONENTES;
    this.Regalias    = this.DATA_REGALIAS;
    this.cargarColaboradores();
  },
  methods:{
    capturarDireccion(dir){
      this.Direccion = dir
    },
    cargarColaboradores(){
      this.$axios.get('colaborador_envio').then((res=>{
        res.data.colaboradores.forEach((i)=>{
          if (i.colaborador){
            this.Colaboradores.push({
              correo: i.email,
              nombre: i.colaborador.nombres+' '+i.colaborador.apellidos
            })
          }
        })
      }))
    },
    cargarDocumentos(){
      if (!this.doc.contrato)
        this.doc.contrato           = document.getElementById("DocContrato").files[0];
      if (!this.doc.pagare)
        this.doc.pagare             = document.getElementById("DocPagare").files[0];
      if (!this.doc.hoja_conocimiento)
        this.doc.hoja_conocimiento  = document.getElementById("DocHojaConocimiento").files[0];
      if (!this.doc.traspaso)
        this.doc.traspaso           = document.getElementById("DocTraspaso").files[0];
      if (!this.doc.carta_poder)
        this.doc.carta_poder        = document.getElementById("DocCarta").files[0];
      if (!this.doc.garantia)
        this.doc.garantia           = document.getElementById("DocGarantia").files[0];
      console.log(this.doc)
    },
    cargarFiles(){
      if (this.validarFiles()){
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('contrato',     this.doc.contrato);
        data.append('pagare',       this.doc.pagare);
        data.append('carta_poder',  this.doc.carta_poder);
        data.append('garantia',     this.doc.garantia);
        data.append('traspaso',     this.doc.traspaso);
        data.append('conocimiento', this.doc.hoja_conocimiento);
        data.append('id',           this.DATA_VENTA.id);

        this.$axios({
          method: 'post',
          url:    'cargar_documentos_venta',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.notificacion(res.data.msg, 'success');
          this.notificacion('Tienes que esperar a que facturación revise los documentos para avanzar', 'success')
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      }
    },
    mostrarPdf(url){
      ipcRenderer.send('pint_navegador', url);
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    registrarVenta(decision){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('registrar_venta',{
        decision:    decision,
        regalias:    this.Regalias,
        componentes: this.Componentes,
        remision_id: this.DATA_VENTA.contrato_cliente.remision_articulo_id,
        venta_id:    this.DATA_VENTA.id,
        sucursal_id: this.DATA_VENTA.colaborador.sucursal_id,
        correo:      this.Colaborador,
        direccion:   this.Direccion
      }).then((res)=>{
        this.$store.commit('ventas/cargar_MIS_VENTAS');

        this.notificacion('Se ha actualizado la información de la venta', 'success');
        if (decision === 1) {
          this.notificacion('Se han realizado todos los procedicimientos para la venta', 'success');
          this.notificacion('Se le va enviar esta venta al correo: '+this.Colaborador, 'success');
          this.OrdenEntrada_id = res.data.orden;
        }
        else
          this.notificacion('Se ha cancelado la venta exitosamente','success');

        this.Enviado = true;

        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 5000)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Ha ocurrido un error, comunicate con el soporte técnico.','error');
      })
    },
    ValidarDatos(decision){
      if (this.DATA_VENTA.is_aceptado === 1 && this.DATA_VENTA.estado === 4)
        if (this.Colaborador)
          if (this.Direccion)
            this.registrarVenta(decision);
          else
            this.notificacion('Tienes que seleccionar una dirección de envio.','error');
        else
          this.notificacion('Tienes que seleccionar al colaborador que va a recibir la venta','error');
      else
        this.notificacion('Esta venta no se puede registrar de ninguna manera','error');
    },
    validarFiles(){
      if (this.doc.contrato && this.doc.pagare)
        return true;
      else
        this.notificacion('Tienes que cargar archivos','error')
    },
    verDocumento(url){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: url}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}

</style>
