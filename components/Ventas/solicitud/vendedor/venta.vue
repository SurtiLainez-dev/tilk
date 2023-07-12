<template>
    <v-card :disabled="!EstadoVista || vistaVenta" class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Venta</h5>
        <hr>
        <v-stepper v-model="SECC" >
            <v-stepper-header>
                <v-stepper-step :complete="SECC > 1" step="1">
                    Datos del Artículo
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="2">
                    Venta realizada
                </v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card v-if="Soli.is_combo === 0" color="grey lighten-5">
                        <v-row no-gutters>
                            <v-col class="d-flex justify-end">
                                <v-btn v-if="statusArticulo.stock_nuevo > 0" x-small color="success" text dark>Stock nuevo: {{statusArticulo.stock_nuevo}}</v-btn>
                                <v-btn v-else x-small color="red" text dark>Stock nuevo: {{statusArticulo.stock_nuevo}}</v-btn>
                                <v-btn v-if="statusArticulo.stock_reingreso > 0" x-small color="success" text dark>Stock reingreso: {{statusArticulo.stock_reingreso}}</v-btn>
                                <v-btn v-else x-small color="red" text dark>Stock de reingreso: {{statusArticulo.stock_reingreso}}</v-btn>
                            </v-col>
                        </v-row>
                        <v-row no-gutters>
                            <v-col class="d-flex align-center"> <v-card-title>Datos del artículo</v-card-title></v-col>
                            <v-col class="d-flex justify-end align-center ma-2">
                                <v-btn x-small color="red" class="ma-2" dark @click="declinarVenta">Declinar Venta</v-btn>
                                <v-btn x-small @click="dialogoBusquedaMoto = true"
                                       :disabled="!Is_motocicleta"
                                       color="success" class="text-white ma-2">
                                    Buscar motocicleta</v-btn>
                                <v-btn x-small color="warning" dark @click="dialogoRemisionArticulo = true">Buscar Artículos con seríe</v-btn>
                            </v-col>
                        </v-row>
                        <v-form ref="FormAgregarRemisionArticulo" class="ma-2 pt-5">
                            <v-row no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" v-model="Venta.sucursal"
                                                  :rules="[rule.serie.req]"
                                                  label="Sucursal" disabled></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="ma-2" v-model="Venta.articulo"
                                                  :rules="[rule.serie.req]"
                                                  label="Artículo" disabled></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" v-model="AArticulo.serie" counter
                                                  :rules="[rule.serie.req, rule.serie.min]"
                                                  label="Serie del fabricante"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="ma-2" v-model="AArticulo.color" counter
                                                  :rules="[rule.serie.req, rule.serie.min]"
                                                  label="Color"></v-text-field>
                                </v-col>
                              <v-col>
                                <v-select class="ma-2"
                                          disabled
                                          :rules="[rule.serie.req]"
                                          label="Estado del artículo"
                                          :items="Venta.estados"
                                          :item-text="'text'"
                                          :item-value="'val'"
                                          v-model="Venta.estado_Art">
                                </v-select>
                              </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" v-model="Venta.colaborador"
                                                  :rules="[rule.serie.req]"
                                                  label="Vendedor" disabled></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-select label="Tipo de venta" :item-text="'text'"
                                              :rules="[rule.serie.req]" v-model="Venta.tipo_id"
                                              :items="Venta.tipos" :item-value="'val'"></v-select>
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-form ref="FormAgregarDatosMotocicletaVenta">
                          <v-row v-if="Is_motocicleta" no-gutters>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="Venta.Chasis"
                                            label="Chasis"  disabled></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="Venta.Motor"
                                            label="Motor" disabled></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="Is_motocicleta" no-gutters>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="AArticulo.serie"
                                            disabled label="Serie del fabricante"></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="AArticulo.color"
                                            disabled label="Color"></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="Is_motocicleta" no-gutters>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="Venta.Anio"
                                            disabled label="Cilindraje"></v-text-field>
                            </v-col>
                            <v-col>
                              <v-text-field class="ma-2" :rules="[rule.serie.req]"
                                            v-model="Venta.Cc"
                                            disabled label="Año"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-form>

                        <b-link @click="dialogoBuscarInventario = true" class="pl-5">Agregar regalias</b-link>
                        <v-data-table dense :headers="headerRegalias"
                                    :items="Regalias"
                                    caption="Regalias">
                            <template v-slot:item.precio="{item}">
                              L {{item.precio}}
                            </template>
                            <template v-slot:item.id="{item}">
                                <v-btn x-small fab color="red" dark @click="quitarRegalia(item.key)">
                                  <v-icon>fa fa-times</v-icon>
                                </v-btn>
                            </template>
                        </v-data-table>
                        <v-card-actions class="d-flex justify-end">
                            <v-btn small color="success" class="text-white ma-2" @click="validarFormCrearVenta">Registrar Venta</v-btn>
                            <v-btn small color="indigo" class="text-white ma-2" :disabled="!Envios.articulo">Siguiente</v-btn>
                        </v-card-actions>
                    </v-card>

                    <v-card v-else-if="Soli.is_combo === 1" color="grey lighten-5">
                      <v-card-title>Datos del Combo</v-card-title>
                      <v-divider></v-divider>
                      <table>
                        <thead>
                        <tr>
                          <th colspan="4">Sucursal de Salida</th>
                          <th colspan="4">Colaborador de la Venta</th>
                        </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colspan="4">{{Venta.sucursal}}</td>
                            <td colspan="4">{{Venta.colaborador}}</td>
                          </tr>
                        </tbody>
                        <thead>
                        <tr><th colspan="8">Nombre del Combo</th></tr>
                        </thead>
                        <tbody>
                        <tr><td colspan="8">{{Soli.combo.nombre}}</td></tr>
                        </tbody>
                        <thead>
                        <tr>
                          <th style="width: 25%">Articulo</th>
                          <th style="width: 10%">Marca</th>
                          <th style="width: 10%">Modelo</th>
                          <th style="width: 15%">Sub-Familia</th>
                          <th style="width: 7%">¿Serie?</th>
                          <th style="width: 15%">Serie</th>
                          <th style="width: 10%">Color</th>
                          <th style="width: 8%">Vehículo</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in ArticulosCombo">
                          <td colspan="8" style="margin: 0px !important; padding: 0px !important; width: 100%">
                            <table style="padding: 0px !important; margin: 0px; border: 0px !important;">
                              <tbody>
                              <tr>
                                <td style="width: 25%; border: 0px !important;">{{item.articulo.nombre_articulo}} - {{item.articulo.codigo_sistema}}
                                  <table style="border: 0px !important;" v-if="item.is_moto && item.selec_moto">
                                    <tbody>
                                    <tr ><td style="border: 0px !important;">*Chasis: {{item.moto.chasis}}</td></tr>
                                    <tr ><td style="border: 0px !important;">*Motor: {{item.moto.motor}}</td></tr>
                                    <tr ><td style="border: 0px !important;">*Color: {{item.moto.color}}</td></tr>
                                    <tr ><td style="border: 0px !important;">*Año: {{item.moto.anio}}</td></tr>
                                    <tr ><td style="border: 0px !important;">*Cc: {{item.moto.cilindraje}}</td></tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td style="width: 10%; border: 0px !important;">{{item.articulo.marca.nombre}}</td>
                                <td style="width: 10%; border: 0px !important;">{{item.articulo.modelo}}</td>
                                <td style="width: 15%; border: 0px !important;">{{item.articulo.sub_familia_articulo.nombre}}</td>
                                <td style="width: 7%; border: 0px !important;">
                                  <vs-checkbox size="small" v-model="item.is_serie" :disabled="item.is_moto"></vs-checkbox>
                                </td>
                                <td style="width: 15%; border: 0px !important;">
                                  <vs-input class="inputx" style="width: 160px !important;" size="small" @keyup.enter="fabricarSerie(item)"
                                            :success="(item.is_serie && !item.is_moto)"
                                            :disabled="!item.is_serie || item.is_moto" v-model="item.serie"/>
                                </td>
                                <td style="width: 10%; border: 0px !important;">
                                  <vs-input class="inputx" style="width: 80px !important;" size="small"
                                            :success="(item.is_serie && !item.is_moto)" :disabled="!item.is_serie || item.is_moto" v-model="item.color"/>
                                </td>
                                <td style="width: 8%; border: 0px !important;">
                                  <v-chip x-small color="indigo" dark v-if="item.is_moto">Si</v-chip>
                                  <v-chip x-small color="indigo" dark v-else>No</v-chip>
                                  <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                      <v-btn indigo icon si fab color="pink" width="25" height="25px" text dark v-on="on" @click="abrirDialogoMotoCombo(item)"
                                             v-bind="attrs" small v-if="item.is_moto"><v-icon size="20px" small v-if="item.is_moto">fa fa-search</v-icon></v-btn>
                                    </template>
                                    <span>Abrir Dialogo Motocicletas</span>
                                  </v-tooltip>
                                  <v-progress-linear indeterminate v-if="loadMotocicletas"></v-progress-linear>
                                </td>
                              </tr>
                              </tbody>
                              <tbody>
                              <tr>
                                <td style="width: 25%; border: 0px">Sucursal</td>
                                <td style="width: 10%; border: 0px">Nuevo</td>
                                <td style="width: 10%; border: 0px">Reingreso</td>
                                <td style="width: 10%; border: 0px">Consignado</td>
                              </tr>
                              <tr v-if="stock.sucursal_id === Venta.sucursal_id" v-for="stock in item.articulo.stock_articulos">
                                <td style="width: 15%; border: 0px">{{Venta.sucursal}}</td>
                                <td style="width: 10%; border: 0px">{{stock.stock_actual}}</td>
                                <td style="width: 10%; border: 0px">{{stock.stock_reingreso}}</td>
                                <td style="width: 10%; border: 0px">{{stock.stock_consignado}}</td>
                              </tr>
                              <tr>
                                <td style="width: 25%; border: 0px"></td>
                                <td style="width: 10%; border: 0px"></td>
                                <td style="width: 10%; border: 0px"></td>
                                <td style="width: 10%; border: 0px"></td>
                              </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        </tbody>
                        <thead><tr><th colspan="8">Comentarios</th></tr></thead>
                        <tbody>
                        <tr><td colspan="8">*En las camas tienes que agregar o crear serie.</td></tr>
                        <tr><td colspan="8">*En los muebles de madera y sala tienes que agregar o crear serie.</td></tr>
                        <tr><td colspan="8">*Para crear una serie aleatoria presiona enter en el campo de serie.</td></tr>
                        </tbody>
                      </table>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn color="orange"  class="ma-2" dark small tile @click="declinarVenta">Declinar Venta</v-btn>
                        <v-btn color="success" class="ma-2" dark small tile @click="validarFormVentaCombo">Crear Venta</v-btn>
                      </v-card-actions>
                    </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card-text>La venta se realizó con exito, descarga y sube los documentos de la venta desde el apartado
                  de MIS VENTAS en el menú. Tienes que esperar a que el facturado apruebe la venta. Si estas en la
                  pantalla de tareas ya puedes cerrar la tarea.</v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

        <v-dialog v-model="dialogoBuscarInventario" width="90%">
            <v-card class="pl-5 pr-5 pb-5 pt-2" height="650">
                <v-row no-gutters>
                    <v-col cols="8" class="d-flex align-center">
                        <v-card-title>Buscar regalia</v-card-title>
                    </v-col>
                    <v-col cols="4" class="d-flex justify-end align-center">
                        <v-text-field v-model="search" class="ma-2" label="buscar..." ></v-text-field>
                    </v-col>
                </v-row>
                <hr>
                <v-data-table dense :items="Inventario" :search="search"
                              :headers="header" :loading="isPeticon" @click:row="agregarRegalia">
                    <template v-slot:item.articulo="{item}">
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-btn color="success" v-on="on" v-bind="attrs"
                                       x-small text fab class="text-white">
                                    <v-icon>fa fa-arrow-right</v-icon>
                                </v-btn>
                            </template>
                            <span>Seleccionar {{item.nombre_articulo}}</span>
                        </v-tooltip>
                    </template>
                    <template v-slot:item.precio_contado="{item}">
                        L {{item.precio_contado}}
                    </template>
                </v-data-table>
                <hr>
                <v-card-actions class="d-flex justify-end">
                    <v-btn class="ma-2" color="warning" small dark @click="dialogoBuscarInventario = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoBusquedaMoto" width="90%">
            <v-card class="pl-5 pr-5 pb-5 pt-5">
                <v-row no-gutters class="grey lighten-5">
                    <v-col cols="9" class="d-flex align-center">
                      <v-card-title>Motocicletas en el piso</v-card-title>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center">
                        <v-text-field dense v-model="searhMoto" label="Buscar"></v-text-field>
                    </v-col>
                </v-row>

                <v-data-table :headers="headerMoto"
                              :loading="loadMotocicletas"
                              loading-text="Cargando motocicletas del piso"
                              :items="Motocicletas"
                              class="rowsTable"
                              :search="searhMoto"
                              dense>
                    <template v-slot:item.remision_articulo_id="{item}">
                        <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                                <v-btn fab width="22px" v-on="on" v-bind="attrs"
                                       @click="dataMotocicleta(item)"
                                       height="22px" color="success" dark>
                                  <v-icon size="15">fa fa-arrow-right</v-icon></v-btn>
                            </template>
                            <span>Seleccionar</span>
                        </v-tooltip>
                    </template>
                </v-data-table>

                <v-card-actions class="d-flex justify-end">
                    <v-btn color="orange" small tile dark @click="dialogoBusquedaMoto = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogoRemisionArticulo" width="90%">
          <v-card class="pl-5 pr-5 pb-5 pt-5">
            <v-row no-gutters class="grey lighten-5">
              <v-col cols="9" class="d-flex align-center">
                <v-card-title>Artículos en Remisión</v-card-title>
              </v-col>
              <v-col cols="3" class="d-flex align-center">
                <v-text-field dense v-model="searchArticuloRemision" label="Buscar"></v-text-field>
              </v-col>
            </v-row>

            <v-data-table :headers="headerRemision"
                          :loading="loadRemision"
                          loading-text="Cargando artículos del piso"
                          :items="data_RemisionArticulo"
                          class="rowsTable"
                          :search="searchArticuloRemision"
                          dense>
              <template v-slot:item.articulo_id="{item}">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn fab width="22px" v-on="on" v-bind="attrs"
                           @click="dataRemision(item)"
                           height="22px" color="success" dark>
                      <v-icon size="15">fa fa-arrow-right</v-icon></v-btn>
                  </template>
                  <span>Seleccionar</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <v-card-actions class="d-flex justify-end">
              <v-btn color="orange" small dark @click="dialogoRemisionArticulo = false">Cerrar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import {vsInput, vsCheckbox, vsIcon} from 'vuesax';
import {ipcRenderer} from "electron";
import Vue from "vue";
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
export default {
        name: "venta",
        computed:{
            dialogo:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
            SUCURSAL(){
                return this.$store.state.sucursal;
            },
            Inventario(){
                return this.$store.state.inventario.data;
            },
            isPeticon(){
                return this.$store.state.inventario.load;
            },
            Soli(){
                return this.$store.state.solicitud_credito.Solicitud;
            },
            Articulo(){
              if (this.$store.state.solicitud_credito.Solicitud.is_combo === 0)
                return this.$store.state.solicitud_credito.Solicitud.articulo;
              else if (this.$store.state.solicitud_credito.Solicitud.is_combo === 1)
                return [];
            },
            EstadoVista(){
                return this.$store.state.solicitud_credito.EstadoVistaSolicitud;
            },
            vista:{
                get: function () {
                    return this.$store.state.solicitud_credito.dialogoSolicitud;
                },
                set: function (val) {
                    this.$store.commit('solicitud_credito/cambiarValorDialogoSolicitud', val);
                }
            },
        },
        data(){
            return{
              dataFilaMoto: {},
              searchArticuloRemision: '',
              data_RemisionArticulo: [],
              dialogoRemisionArticulo: false,
              loadRemision: false,
              headerRemision: [
                {text:'Proveedor',value:'articulo.marca.proveedor.nombre'},
                {text:'Marcá',value:'articulo.marca.nombre'},
                {text:'Módelo',value:'articulo.modelo'},
                {text:'Código Sístema',value:'articulo.codigo_sistema'},
                {text:'Nombre del Artículo',value:'articulo.nombre_articulo'},
                {text:'Código Proveedor',value:'articulo.codigo_proveedor'},
                {text:'Estado del artículo',value:'estado_articulo.nombre'},
                {text:'Serie de Remisión',value:'serie_sistema'},
                {text:'Serie de Fabricante',value:'serie_fabricante'},
                {text:'Acciones',value:'articulo_id'},
              ],
                AArticulo:{
                  color: '',
                  serie: '',
                  remision_id: null,
                  remision:    false,
                  verificar_remision: ''
              },
                dialogoBuscarInventario: false,
                dialogoBusquedaMoto: false,
                Documentos:[
                {icon: 'fa fa-file-pdf',tooltip:'Contrato de la venta', val:1, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Traspaso vehícular', val:2, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Carta poder', val:3, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Hoja de conocimiento de trámites', val:4, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Contrato de garantía prendaría', val:5, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Hoja de garantía de la motocicleta', val:6, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Hoja de garantía de Surtidora Laínez', val:7, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Hoja de entrega', val:8, color:'red'},
                {icon: 'fa fa-file-pdf',tooltip:'Tarjeta de abonos', val:9, color:'red'},
              ],
                Envios:{
                  articulo: false
                },
                Regalias:[],
                header:[
                  {text:'Proveedor',value:'proveedor'},
                  {text:'Marcá',value:'marca'},
                  {text:'Módelo',value:'modelo'},
                  {text:'Código Sístema',value:'codigo_sistema'},
                  {text:'Nombre del Artículo',value:'nombre_articulo'},
                  {text:'Código Proveedor',value:'codigo_proveedor'},
                  {text:'Sub-familia',value:'fam'},
                  {text: 'Precio de Contado', value:'precio_contado'},
                  {text:'Acciones',value:'articulo'},
                ],
                headerMoto:[
                  {text:'Chasis',      value:'chasis'},
                  {text:'Motor',       value:'motor'},
                  {text:'Año',         value:'anio'},
                  {text:'CC',          value:'cilindraje'},
                  {text:'Color',       value:'color'},
                  {text:'', value:'remision_articulo_id'},
                ],
                headerRegalias:[
                  {text:'Articulo', value:'nombre'},
                  {text:'Precio',   value:'precio'},
                  {text:'Codigo',   value:'codigo'},
                  {text:'Quitar',   value:'id'}
                ],
                hints: true,
                Is_motocicleta: false,
                load_tooltip: false,
                loadMotocicletas: false,
                Motocicletas: [],
                rule: {
                  serie: {
                    req: v => !!v || 'Campo requerido',
                    min: v => (v && v.length >= 3) || 'Tiene que ser mayor o igual a 3 carácteres.',
                  },
                },
                search:'',
                searhMoto: '',
                SECC: 1,
                statusArticulo:{
                    existe: false,
                    stock_nuevo: 0,
                    stock_reingreso: 0
                },
                tooltip_data: {
                  nombre: '',
                  precio: 0
                },
                tooltip_open: false,
                Venta:{
                    articulo:         '',
                    articulo_id:      '',
                    colaborador:      '',
                    coloboarador_id : '',
                    sucursal:         '',
                    sucursal_id:      '',
                    cliente:          '',
                    cliente_id:       '',
                    tipo_id:          2,
                    tipos:            [
                        {text:'Contado',val:1},
                        {text:'Crédito',val:2},
                    ],
                    Moto_id: null,
                    Remision_id: null,
                    estado_Art: 1,
                    estados:[
                        {text:'Nuevo',      val:1},
                        {text:'Consignado', val:2},
                        {text:'Reingreso',  val:3},
                    ],
                    Chasis: '',
                    Motor:  '',
                    Serie:  '',
                    Cc:     '',
                    Anio:   ''
                },
                vistaVenta: false,
                ArticulosCombo: []
            }
        },
        created() {
            Vue.use(vsInput);
            Vue.use(vsCheckbox);
            Vue.use(vsIcon);
            if (this.Soli.estado === 5)
                this.vistaVenta = true;

            if (this.Soli.is_combo === 0){
              if (!this.vistaVenta){
                console.log(this.Soli)
                this.$store.commit('inventario/cargarInventario');
                this.Is_motocicleta       = this.Articulo.is_motocicleta === 1;
                this.Venta.sucursal       = this.Soli.user.colaborador.sucursal.nombre;
                this.Venta.sucursal_id    = this.Soli.user.colaborador.sucursal.id;
                this.Venta.articulo       = this.Soli.articulo.nombre_articulo;
                this.Venta.articulo_id    = this.Soli.articulo.id;
                console.log(this.Venta.articulo_id)
                this.Venta.colaborador    = this.Soli.user.colaborador.nombres+ ' ' +this.Soli.user.colaborador.apellidos;
                this.Venta.colaborador_id = this.Soli.user.colaborador.id;
                this.Soli.articulo.stock_articulos.forEach( (i) => {
                  if (i.sucursal_id === this.Venta.sucursal_id){
                    this.statusArticulo.stock_nuevo     = i.stock_actual;
                    this.statusArticulo.stock_reingreso = i.stock_reingreso;
                  }
                });
                if (this.Is_motocicleta)
                  this.cargarMotocicletas()

                this.cargarRemision()
              }
            }else if (this.Soli.is_combo === 1){
              this.$store.commit('inventario/cargarInventario');
              this.Venta.sucursal       = this.Soli.user.colaborador.sucursal.nombre;
              this.Venta.sucursal_id    = this.Soli.user.colaborador.sucursal.id;
              this.Venta.colaborador    = this.Soli.user.colaborador.nombres+ ' ' +this.Soli.user.colaborador.apellidos;
              this.Venta.colaborador_id = this.Soli.user.colaborador.id;
              this.dataCombos();
              this.cargarRemision();
            }
        },
        methods:{
            abrirDialogoMotoCombo(item){
              if (item.motos.length === 0){
                this.loadMotocicletas = true;
                this.$axios.get('/motocicletas_x_sucursal/'+this.SUCURSAL+'/'+item.articulo.id)
                    .then((res)=>{
                      item.motos               = res.data.motocicletas;
                      this.loadMotocicletas    = false;
                      this.Motocicletas        = item.motos;
                      this.dialogoBusquedaMoto = true;
                      this.dataFilaMoto        = item;
                    })
              }else{
               this.dialogoBusquedaMoto = true;
              }
            },
            agregarRegalia(data){
                this.Regalias.push({
                  id:     data.articulo,
                  nombre: data.descripcion_corta,
                  precio: data.precio_contado,
                  codigo: data.codigo_sistema,
                  key:    this.Regalias.length
                })
                this.dialogoBuscarInventario = false;
                this.notificacion('Se ha agregado la regalia '+data.descripcion_corta,'success');
            },
            cargarMotocicletas(){
                this.loadMotocicletas = true;
                this.$axios.get('/motocicletas_x_sucursal/'+this.SUCURSAL+'/'+this.Articulo.id)
                .then((res)=>{
                    this.Motocicletas     = res.data.motocicletas;
                    this.loadMotocicletas = false;
                })
            },
            cargarRemision(){
              this.loadRemision = true;
              this.$axios.get('/2.0/inventario/remision/'+this.SUCURSAL)
                  .then((res)=>{
                    this.data_RemisionArticulo     = res.data.inventario;
                    this.loadRemision = false;
                  })
            },
            crearVenta(){
              let articulo = null;
              let serie_articulo = null;
              let color_articulo = null;
              let is_remision    = false;
              if(this.Soli.is_combo === 0) {
                this.AArticulo.remision = this.AArticulo.serie === this.AArticulo.verificar_remision;
                articulo        = this.Soli.articulo.id;
                serie_articulo = this.AArticulo.serie;
                color_articulo = this.AArticulo.color;
                is_remision    = this.AArticulo.remision;
              }
              this.$store.commit('tareas/cambiarValorVista', false);
              this.$store.commit('activarOverlay', true);
              this.dialogo = false;
              let forma_pago = 0;
              let cuotas     = 0;
              if (this.Soli.forma_pago === 'Semanal') {
                forma_pago = 1;
                cuotas     = this.Soli.tiempo * 4;
              }else if (this.Soli.forma_pago === 'Quincenal') {
                forma_pago = 2;
                cuotas     = this.Soli.tiempo * 2;
              }else if (this.Soli.forma_pago === 'Mensual') {
                forma_pago = 3;
                cuotas     = this.Soli.tiempo
              }

            this.$axios.post('venta',
                {
                  tipo:                    1,
                  articulo:                articulo,
                  serie_articulo:          serie_articulo,
                  color_articulo:          color_articulo,
                  is_moto:                 this.Is_motocicleta,
                  precio_contado_articulo: this.Soli.precio_contado,
                  total_credito:           (parseFloat(this.Soli.saldo_financiar) + parseFloat(this.Soli.prima)),
                  sucursal_id:             this.Venta.sucursal_id,

                  tipo_venta:                  this.Venta.tipo_id,
                  cliente:                     this.Soli.cliente.id,
                  colaborador:                 this.Venta.colaborador_id,
                  num_cuotas:                  cuotas,
                  identidad:                   this.Soli.cliente.identidad,

                  meses:                       this.Soli.tiempo,
                  cuota:                       this.Soli.cuota,
                  prima:                       this.Soli.prima,
                  forma_pago:                  forma_pago,
                  financiamiento:              parseFloat(this.Soli.precio_contado) - parseFloat(this.Soli.prima),
                  tasa_anual:                  this.Soli.tasa,

                  regalias:                    this.Regalias,
                  estado_articulo:             this.Venta.estado_Art,
                  avales:                      this.Soli.aval_solicituds,

                  remision_id:                 this.Venta.Remision_id,
                  motocicleta_id:              this.Venta.Moto_id,
                  solicitud_credito:           this.Soli.id,

                  is_remision:                 is_remision,
                  precio_contado:              this.Soli.precio_contado,
                  venta_id:                    this.Venta.id,

                  articulosCombo:              this.ArticulosCombo,
                  combo_id:                    this.Soli.combo_id
                }, {
                  timeout: 15000,
                }).then((res)=>{
              this.$store.commit('tareas/cambiarValorVista', true);
              this.$store.commit('activarOverlay', false);
              this.notificacion(res.data.msg,'success')
              // this.SECC = 2;
              this.dialogo = false;
              this.vistaVenta = false

            }).catch((error)=>{
              this.$store.commit('tareas/cambiarValorVista', true);
              this.$store.commit('activarOverlay', false);
              console.log(error)
              if(error.response.status === 422)
                this.notificacion(error.response.data.msg,'error');

              this.dialogo = true;
            })
          },
            dataMotocicleta(data){
                if (this.Soli.is_combo === 0){
                  let th = this.Venta;
                  th.Chasis                = data.chasis;
                  th.Motor                 = data.motor;
                  this.AArticulo.color     = data.color;
                  th.Anio                  = data.anio;
                  th.Cc                    = data.cilindraje;
                  th.Moto_id               = data.id;
                  th.Remision_id           = data.remision_articulo_id;
                  this.AArticulo.serie     = data.chasis;
                  this.dialogoBusquedaMoto = false;
                  th.estado_Art            = data.estado_articulo_id;
                }else{
                  let bandera = false;
                  this.ArticulosCombo.forEach((item)=>{
                    if (item.id === this.dataFilaMoto.id){
                      item.moto        = data;
                      bandera          = true;
                      item.serie       = data.chasis;
                      item.color       = data.color;
                      item.remision_id = data.remision_articulo_id;
                      item.selec_moto  = true;
                      item.estado_articulo = data.estado_articulo_id;
                    }
                  })
                  if (bandera)
                    this.$store.commit('notificacion',{texto:'Se ha vinculado exitosamente la motocicleta', color:'success'});
                  else
                    this.$store.commit('notificacion',{texto:'Intenta otra vez. No se pudo vincular la motocicleta', color:'error'});

                  this.dialogoBusquedaMoto = false;
                }
            },
            dataCombos(){
              let articulos = [], soli =  this.$store.state.solicitud_credito.Solicitud.combo.detalle_combo;
              let moto      = false;
              soli.forEach((item)=>{
                moto = item.articulo.is_motocicleta === 1;
                articulos.push({
                  articulo_id:     item.articulo_id,
                  articulo:        item.articulo,
                  is_serie:        true,
                  serie:           '',
                  color:           '',
                  is_moto:         moto,
                  selec_moto:      false,
                  moto:            {},
                  motos:           [],
                  estado:          0,
                  dialogo:         false,
                  remision_id:     0,
                  precio_contado:  item.precio_contado,
                  estado_articulo: 1
                })
              })
              this.ArticulosCombo = articulos
            },
            dataRemision(data){
                this.AArticulo.color              = data.color;
                this.AArticulo.serie              = data.serie_fabricante;
                this.Articulo.remision            = true;
                this.dialogoRemisionArticulo      = false;
                this.Venta.estado_Art             = data.estado_articulo_id;
                this.AArticulo.verificar_remision = data.serie_fabricante;
                this.Venta.Remision_id            = data.id;
            },
            declinarVenta(){
            this.$store.commit('activarOverlay', true);
            this.$store.commit('tareas/cambiarValorVista', false);
            this.$axios.post('venta',{
              tipo:              2,
              solicitud_credito: this.Soli.id,
            }).then((res)=>{
              this.$store.commit('tareas/cambiarValorVista', true);
              this.$store.commit('activarOverlay', false);
              this.notificacion('Se ha declinado la solicitúd de crédito','error');
              this.dialogo = true;
              this.vistaVenta = true
            })
          },
            fabricarSerie(item){
              if (!item.is_moto){
                item.is_serie = false;
                this.$axios.get('/2.0/fabricar_serie').then((res)=>{
                  item.serie = res.data.serie;
                  item.is_serie = true;
                  this.$store.commit('notificacion',{texto:'Se fabricó una serie', color:'success'});
                })
              }
            },
            notificacion(text, color){
                Vue.$toast.open({
                    message: text,
                    type: color,
                    position: 'bottom-left',
                    duration: 4000
                });
            },
            printContratoMotocicleta(){
                this.vista = false;
                let url = '';
                if (this.Is_motocicleta)
                    url = ''
                else
                    url = 'print_contrato_articulo'+this.Soli;

                ipcRenderer.send('open-nav', url);
            },
            quitarRegalia(fila){
                console.log(this.Regalias)
                this.Regalias.splice(fila,1);
                this.Regalias.forEach( (i, cont) => {
                  i.key = cont;
                  console.log(cont)
                })
            },
            validarFormCrearVenta(){
                if (this.Is_motocicleta) {
                    if (this.$refs.FormAgregarRemisionArticulo.validate() && this.$refs.FormAgregarDatosMotocicletaVenta.validate())
                        this.crearVenta()
                }else {
                    if (this.$refs.FormAgregarRemisionArticulo.validate())
                        this.crearVenta()
                }
            },
            validarFormVentaCombo(){
              let bandera = 0;
              this.ArticulosCombo.forEach((item)=>{
                if ((item.is_serie && item.serie.length < 5)  || (item.is_serie && item.color.length === 0))
                  bandera++;
                else if ((item.is_moto && item.is_serie && item.serie.length < 5) || (item.is_serie && item.color.length === 0))
                  bandera++

              })
              if (bandera === 0) this.crearVenta();
              else this.$store.commit('notificacion',{texto:'Un artiuclo tiene error', color:'warning'})
            },
            viewTooltip(nombre){
                console.log(this.tooltip_open)
                this.tooltip_open = true;
                this.tooltip_data.nombre = nombre;
                console.log(this.tooltip_open)
            }
        }
    }
</script>

<style scoped>
.rowsTable{
    cursor: pointer;
}
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}
</style>
