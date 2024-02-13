<template>
    <div class="pt-1 pa-2">

      <v-card>

        <v-tabs  vertical>
          <v-tab >Información</v-tab>
          <v-tab><v-icon left>fa fa-tag</v-icon>Precio</v-tab>
          <v-tab><v-icon left>fa fa-images</v-icon>Ver Imagenes</v-tab>
          <v-tab><v-icon left>fa fa-boxes</v-icon>Disponibilidad</v-tab>
          <v-tab><v-icon left>fa fa-tools</v-icon>Utilidades</v-tab>
          <v-tab><v-icon left>fa fa-exchange-alt</v-icon>Transferencia</v-tab>

          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Datos Generales del Articulo</span></div>
                </div>
              </div>
              <v-divider></v-divider>
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos">Nombre del Articulo</span></div>
                  <div><span class="subtitleDatos">{{data.nombre_articulo}}</span></div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos">Descripción del Articulo</span></div>
                  <div><span class="subtitleDatos">{{data.descripcion_corta}}</span></div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos">Marca</span></div>
                  <div><span class="subtitleDatos">{{data.marca}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Modelo</span></div>
                  <div><span class="subtitleDatos">{{data.modelo}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Codigo del Sistema</span></div>
                  <div><span class="subtitleDatos">{{data.codigo_sistema}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Referencia</span></div>
                  <div><span class="subtitleDatos">{{data.referencia_fabricante?data.referencia_fabricante:''}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Cod. Barras</span></div>
                  <div><span class="subtitleDatos">{{data.codigo_barras?data.codigo_barras:''}}</span></div>
                </div>
              </div>
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos">Sub-Familia</span></div>
                  <div><span class="subtitleDatos">{{data.fam}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Familia</span></div>
                  <div><span class="subtitleDatos">{{data.familia}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos">Codigo del Proveedor</span></div>
                  <div><span class="subtitleDatos">{{data.codigo_proveedor}}</span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos"></span></div>
                </div>
                <div class="col">
                  <div><span class="titleDatos"></span></div>
                </div>
              </div>
              <v-divider></v-divider>
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos">Detalles Técnicos</span></div>
                </div>
              </div>
              <table>
                <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Detalle</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Detalles">
                  <td>{{item.titulo}}</td>
                  <td>{{item.detalle}}</td>
                </tr>
                </tbody>
              </table>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Cotizador para Solicitúd de Credito</span></div>
                </div>
              </div>
              <v-divider></v-divider>
              <v-card flat tile>
                <v-row no-gutters>
                  <v-col>
                    <v-card class="ma-2 pa-2" >
                      <v-row no-gutters>
                        <v-col cols="8">
                          <v-alert v-if="Precios.S_contado" dense border="left" type="warning" text>
                            Este artículo solo se puede vender al contado.
                          </v-alert>
                        </v-col>
                        <v-col cols="4" class="d-flex justify-end align-center">
                          <v-tooltip v-if="Precios.meses > 0" top>
                            <template v-slot:activator="{on , attrs}">
                              <v-btn class="ma-2" v-bind="attrs" v-on="on" x-small fab dark @click="registrarCotizacion">
                                <v-icon>fa fa-print</v-icon>
                              </v-btn>
                            </template>
                            <span>Imprimir Cotización</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{on , attrs}">
                              <v-btn class="ma-2" v-bind="attrs" v-on="on" color="green" x-small fab dark>
                                <v-icon>fa fa-cart-arrow-down</v-icon>
                              </v-btn>
                            </template>
                            <span>Realizar Venta de Contado</span>
                          </v-tooltip>
                          <v-tooltip top>
                            <template v-slot:activator="{on, attrs}">
                              <v-btn fab x-small color="pink" v-bind="attrs" :disabled="!calcularP"
                                     v-on="on" class="ma-2" @click="sideSolicitud = true">
                                <v-icon color="white">fa fa-clipboard-list</v-icon></v-btn>
                            </template>
                            <span>Crear Solicitúd de Crédito</span>
                          </v-tooltip>
                          <v-tooltip top v-if="Precios.meses > 0">
                            <template v-slot:activator="{on, attrs}">
                              <v-btn fab x-small color="indigo" v-bind="attrs"
                                     v-on="on" dark class="ma-2" @click="sideSeguimiento = true">
                                <v-icon>fa fa-tasks</v-icon></v-btn>
                            </template>
                            <span>Crear Seguimiento</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.contado"
                                        label="Precio de Contado"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.min_prima"
                                        label="Mínimo de Prima"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col >
                          <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.saldo"
                                        label="Saldo"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field class="ma-2" suffix="lps" v-model="Precios.prima" :disabled="Precios.S_contado"
                                        :rules="[rules.precios.prima]" @keyup="calcularSaldoNuevo"
                                        label="*Prima propuesta por el cliente" dense></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field class="ma-2" suffix="lps" disabled dense
                                        label="Saldo a financiar" v-model="Precios.saldo_nuevo"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select dense label="*Forma de pagos" v-model="Precios.forma_pago"
                                    class="ma-2" :items="formaPagos" :disabled="Precios.S_contado"></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field dense label="*Cantidad de meses" class="ma-2"
                                        @keyup.enter="calcularPagos"
                                        :disabled="Precios.S_contado"
                                        v-model="Precios.meses" suffix="meses"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field dense
                                        class="ma-2"
                                        disabled
                                        suffix="meses"
                                        v-model="Precios.maximo_financiamiento"
                                        label="Maximo de meses a financiar"></v-text-field>
                        </v-col>

                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field dense
                                        class="ma-2"
                                        disabled
                                        suffix="lps"
                                        v-model="Precios.cuota"
                                        label="Cuota por pago"></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field dense
                                        class="ma-2"
                                        disabled
                                        suffix="lps"
                                        v-model="Precios.total_credito"
                                        label="Total del Crédito"></v-text-field>
                        </v-col>
                      </v-row>
                      <v-divider></v-divider>
                      <v-card-subtitle>Forma de calcular los pagos</v-card-subtitle>
                      <v-card-actions class="d-flex justify-end">
                        <v-btn class="ma-2" @click="calcularPagosContadoPagos" small tile dark :disabled="Precios.S_contado"
                               color="blue" v-if="Precios.prom_cant_cuotas > 0">Contado para {{Precios.prom_cant_cuotas}} pagos</v-btn>
                        <v-btn class="ma-2" @click="calcularPagosSinPrima" small tile dark :disabled="Precios.S_contado"
                               color="green" v-if="Precios.venta_sin_prima">Sin Prima</v-btn>
                        <v-btn class="ma-2" @click="calcularPagos" small tile dark :disabled="Precios.S_contado"
                               color="indigo">Financiado</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="ma-2 pa-2" flat>
                      <b-table :current-page="currentPage"
                               :per-page="perPage"
                               bordered
                               hover
                               striped
                               class="rowsTable"
                               :fields="fieldsPagos"
                               :items="Precios.pagos"
                               caption-top
                               small>
                        <template v-slot:table-caption>Pagos del crédito</template>
                        <template v-slot:head(num)>#</template>
                        <template v-slot:head(fecha)>Fecha de Pago</template>
                        <template v-slot:head(saldo)>Saldo</template>
                        <template v-slot:head(cuota)>Cuota</template>
                        <template v-slot:head(saldo_a)>Saldo Restante</template>
                        <template v-slot:cell(saldo)="scope">
                          L {{scope.item.saldo}}
                        </template>
                        <template v-slot:cell(cuota)="scope">
                          L {{scope.item.cuota}}
                        </template>
                        <template v-slot:cell(saldo_a)="scope">
                          L {{scope.item.saldo_a}}
                        </template>
                      </b-table>
                      <v-row>
                        <v-col class="d-flex justify-center">
                          <b-pagination :disabled="Precios.S_contado"
                                        v-model="currentPage"
                                        :total-rows="totalRows"
                                        :per-page="perPage"
                                        align="fill"
                                        size="sm"
                                        class="my-0"
                          ></b-pagination>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>

              </v-card>

              <v-navigation-drawer v-model="sideSolicitud" clipped right absolute width="100%" class="side">
                <v-card flat tile class="pa-4">
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex align-center">
                      <v-btn class="ma-2" dark fab x-small text color="red" @click="sideSolicitud = false">
                        <v-icon>fa fa-times</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="11" class="d-flex justify-center align-center"><h4>Solicitud de Crédito</h4></v-col>
                  </v-row>
                  <hr>
                  <solicitud v-if="sideSolicitud" :precio="Precios" :combo="false" :articulo="data" :forma_pago="forma_de_pago"/>
                </v-card>
              </v-navigation-drawer>
              <v-navigation-drawer v-model="sideSeguimiento" clipped right absolute width="100%" class="side">
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex align-center">
                      <v-btn class="ma-2" dark fab x-small text color="red" @click="sideSeguimiento = false">
                        <v-icon>fa fa-times</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="11" class="d-flex justify-center align-center"><h4>Creando Seguimiento de Prospecto de {{data.nombre_articulo}}</h4></v-col>
                  </v-row>
                  <hr>
                  <seguimiento v-if="sideSeguimiento" :articulo="data" :forma_pago="forma_de_pago"
                               :cuota="parseInt(Math.round(Precios.cuota))"
                               :prima="parseInt(Math.round(Precios.prima))"
                               :contado="parseInt(Math.round(Precios.contado))"
                               :precio="precio_enviar" :pagos="parseInt(Precios.meses)"/>
                </v-container>
              </v-navigation-drawer>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Datos Generales del Articulo</span></div>
                </div>
              </div>
              <v-divider></v-divider>

              <v-row>
                <v-col
                    @click="abrirDialogoFoto(item.url)"
                    v-for="(item, index) in fotos"
                    :key="index"
                    class="d-flex child-flex"
                    cols="2"
                >
                  <v-img
                      :src="item.url"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      :lazy-src="item.url"
                  >

                  </v-img>
                </v-col>
              </v-row>

              <v-navigation-drawer v-model="dialogoFoto" clipped right absolute width="100%" class="side">
                <v-card flat tile class="pa-4">
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex align-center">
                      <v-btn class="ma-2" dark fab x-small text color="red" @click="dialogoFoto = false">
                        <v-icon>fa fa-times</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="11" class="d-flex justify-center align-center"><h4>Foto del Artículo</h4></v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <div class="pa-5">
                    <v-img :src="urlFoto"></v-img>
                  </div>
                </v-card>
              </v-navigation-drawer>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Disponibilidad Actual</span></div>
                </div>
              </div>
              <v-divider></v-divider>
              <v-row>
                <v-col>
                  <div class="row no-gutters">
                    <div class="col">
                      <div><span class="titleDatos">Inventario en Sucursales</span></div>
                    </div>
                  </div>
                  <table>
                    <thead>
                    <tr>
                      <th>Sucursal</th>
                      <th class="text-center">Reingreso</th>
                      <th class="text-center">Nuevo</th>
                      <th class="text-center">Consignado</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in Stock">
                      <td>{{item.sucursal.abreviatura}} - {{item.sucursal.nombre}}</td>
                      <td class="text-center">{{item.stock_reingreso}}</td>
                      <td class="text-center">{{item.stock_actual}}</td>
                      <td class="text-center">{{item.stock_consignado}}</td>
                    </tr>
                    </tbody>
                  </table>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col>
                  <div class="row no-gutters">
                    <div class="col">
                      <div><span class="titleDatos">Inventario Compuesto</span></div>
                    </div>
                  </div>
                  <table>
                    <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Sucursal</th>
                      <th class="text-center">Nuevo</th>
                      <th class="text-center">Reingreso</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in Compuestos">
                      <td>{{item.nombre}}</td>
                      <td>{{item.sucursal}}</td>
                      <td class="text-center">{{item.stock}}</td>
                      <td class="text-center">{{item.reingreso}}</td>
                    </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Utilidades</span></div>
                </div>
              </div>
              <v-divider></v-divider>

              <v-row>
                <v-col>
                  <v-card height="80" class="rowsTable" @click="imprimirEtiqueta">
                    <v-row>
                      <v-col cols="1" class="mt-2">
                        <div class="white d-flex justify-center ml-3" style="border-radius: 100px; height: 40px; width: 60px">
                          <v-icon color="cyan" size="25">fa fa-tag</v-icon>
                        </div>
                      </v-col>
                      <v-col class="mt-2" style="margin-left: 40px">
                        <v-card-text class="pt-0">
                          <div class="text-h6 font-weight-light mb-2">
                            Imprimir Etiqueta
                          </div>
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
                <v-col></v-col>
                <v-col></v-col>
                <v-col></v-col>
              </v-row>

            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card tile class="pa-2" style="height: 89vh">
              <div class="row no-gutters">
                <div class="col">
                  <div><span class="titleDatos" style="font-size: 20px !important;">Solicitúd de Transferencia</span></div>
                </div>
              </div>
              <v-divider></v-divider>
              <v-card flat tile class="d-flex justify-center">
                <v-card tile width="50%" class="pa-5">
                  <v-form ref="FormSolicitudTransferencia">
                    <v-row>
                      <v-col cols="5">
                        <v-text-field v-model="Solicitar.cantidad"
                                      label="Cantidad a Solicitar"
                                      :rules="[rules.envio.req, rules.envio.mayor]"
                                      type="number">
                        </v-text-field>
                      </v-col>
                      <v-col cols="7">
                        <v-select v-model="Solicitar.estado"
                                  :items="Solicitar.itemEstado"
                                  :rules="[rules.envio.req]"
                                  label="Estado del Artículo"
                                  @change="validarStock"
                                  type="number">
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-select v-model="Solicitar.stock"
                              :rules="[rules.envio.req]"
                              @change="validarStock"
                              :items="Solicitar.Sucursales"
                              label="Sucursal de Origen"
                              type="number">
                    </v-select>
                    <v-text-field v-model="suc"
                                  label="Sucursal Solicitante"
                                  disabled>
                    </v-text-field>
                    <v-text-field v-model="user"
                                  label="Usuario Solicitante"
                                  disabled>
                    </v-text-field>
                    <v-select :items="Motivos"
                              :item-text="'motivo'"
                              :rules="[rules.envio.req]"
                              v-model="Solicitar.motivo"
                              label="Motivo de Solicitud"
                              :item-value="'id'"></v-select>
                    <v-textarea v-model="Solicitar.observacion"
                                rows="3"
                                :rules="[rules.envio.req, rules.envio.min, rules.envio.max]"
                                label="Observación"
                                :counter="244">
                    </v-textarea>
                  </v-form>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="success" tile small dark @click="validarSolicitudEnvio">Solicitar Artículo</v-btn>
                  </v-card-actions>
                </v-card>
              </v-card>
            </v-card>
          </v-tab-item>
        </v-tabs>

      </v-card>
    </div>
</template>

<script>
  import solicitud_credito from "../Ventas/solicitud_credito";
  import seguimiento from "./seguimiento";
  import Swal from "sweetalert2";
  import {ipcRenderer} from "electron";
  export default {
    components:{seguimiento, solicitud: solicitud_credito},
    name: "info",
    computed:{
      forma_de_pago(){
        if (this.Precios.forma_pago === 1)
          return 'Semanal';
        else if (this.Precios.forma_pago === 2)
          return 'Quincenal';
        else if (this.Precios.forma_pago === 3)
          return 'Mensual';
      },
      Sucursal(){
        return this.$store.state.sucursal;
      },
      suc(){
        return this.$store.state.sucursal_id;
      },
      user(){
        return this.$store.state.usuario;
      },
      precio_enviar(){
        let suma = parseFloat(this.Precios.total_credito) + parseFloat(this.Precios.prima);
        suma = Math.round(suma);
        return parseInt(suma);
      },
      sideSeguimiento: {
        get:function(){
          return this.$store.state.dialogo
        },
        set: function (val) {
          this.$store.commit('valorDialogo', val)
        }
      },
      sideSolicitud:{
        get:function () {
          return this.$store.state.solicitud_credito.SolicitudCredito_view;
        },
        set: function (val) {
          this.$store.commit('solicitud_credito/cambiarValorVista', val);
        }
      }
    },
    props:{data: Object},
    data(){
      return{
        urlFoto: '',
        dialogoFoto: false,
        dialogoEtiqueta: false,
        fotos: [],
        observacion: '',
        currentPage: 1,
        totalRows: 1,
        perPage:10,
        formaPagos:[
          {text:'Semanal', value:1},
          {text:'Quincenal', value:2},
          {text:'Mensual', value:3},
        ],
        fieldsPagos:[
          'num','fecha','saldo','cuota','saldo_a'
        ],
        Precios:{
          observacion: '',
          S_contado: false,
          contado:0,
          min_prima: 0,
          saldo: 0,
          pagosT: 0,
          prima: 0,
          saldo_nuevo: 0,
          financiamiento: 0,
          meses: 0,
          pagos: [],
          cuota: 0,
          forma_pago: 3,
          total_financiamiento: 0,
          total_credito: 0,
          maximo_financiamiento: 0,
          venta_sin_prima: false,
          prom_precio_contado: false,
          prom_cant_cuotas: 0
        },
        sideMotos: false,
        sidePrecio: false,
        rules:{
          envio:{
            req: v => !!v || 'Campo requerido',
            min:v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
            max:v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
            mayor: v => v > 0 || 'Tiene que ser mayor a 0',
          },
          precios:{
            prima: v => v >= this.Precios.min_prima || `No puede ser menor a ${this.Precios.min_prima}`
          }
        },
        Solicitar:{
          Sucursales: [],
          dialogo:false,
          cantidad: 1,
          origen: '',
          estado: '',
          stock: '',
          suc: '',
          motivo: '',
          observacion: '',
          itemEstado:[
            {text:'Nuevo', value:1},
            {text:'Reingreso', value:2},
          ]
        },
        PrecioArticulo: [],
        Detalles: [],
        Stock: [],
        Remision: [],
        Compuestos: [],
        Motivos: [],
        calcularP: false
      }
    },
    created() {
      this.$store.commit('valorDialogo', false)
    },
    mounted() {
      this.cargarPrecio();
      this.cargarDetalles();
      this.cargarRemision();
      this.cargarMotivosTraslados()
    },
    methods:{
      abrirDialogoFoto(url){
        this.urlFoto     = url;
        this.dialogoFoto = true;
      },
      calcularPagos(){
        this.observacion = 'VENTA FINANCIADA'
        this.calcularP = true;
        //Meses son los meses que el usuario ingreso
        let MESES = this.Precios.meses, FIN = this.Precios.financiamiento;
        let SALDO_F = this.Precios.saldo_nuevo;
        this.calcularSaldoNuevo();
        if (MESES <= this.Precios.maximo_financiamiento){
          if (MESES){
            this.Precios.cuota = 0
            this.Precios.pagos = [];
            let TASA_M = (FIN / 12).toFixed(4);
            console.log('tasa interes mensual: '+TASA_M)
            let TASA = Math.pow(parseInt(1) + parseFloat(TASA_M), -MESES);
            console.log(TASA)
            TASA = TASA - 1;
            console.log(TASA)
            TASA = TASA / TASA_M;
            console.log(TASA)
            let pagos = 0;
            if (this.Precios.forma_pago === 1) {
              pagos = this.Precios.meses * 4;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
              this.Precios.cuota = (this.Precios.cuota / 4).toFixed(2)
            }else if (this.Precios.forma_pago === 2) {
              pagos = this.Precios.meses * 2;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
              this.Precios.cuota = (this.Precios.cuota / 2).toFixed(2)
            }else if (this.Precios.forma_pago === 3) {
              pagos = this.Precios.meses;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
            }
            this.Precios.total_credito = 0;
            this.Precios.total_credito = (this.Precios.cuota * pagos).toFixed(2);
            console.log("saldo a financiar "+SALDO_F);
            console.log("Tasa "+TASA_M);
            //financiamiento
            this.crearPagos(pagos, this.Precios.forma_pago, 1)
          }
        }else
          this.$store.commit('notificacion',{texto:'No es valida la cantidad de meses', color:'warning'})
      },
      calcularPagosSinPrima(){
        this.observacion = 'VENTA SIN PRIMA'
        this.calcularP = true;
        let MESES = this.Precios.meses, FIN = this.Precios.financiamiento;
        this.Precios.saldo_nuevo =this.Precios.contado;
        this.Precios.prima = 0;
        let SALDO_F = this.Precios.saldo_nuevo;
        if (MESES <= this.Precios.maximo_financiamiento){
          if (MESES){
            this.Precios.cuota = 0
            this.Precios.pagos = [];
            let TASA_M = (FIN / 12).toFixed(4);
            let TASA = Math.pow(parseInt(1) + parseFloat(TASA_M), -MESES);
            TASA = TASA - 1;
            TASA = TASA / TASA_M;
            let pagos = 0;
            if (this.Precios.forma_pago === 1) {
              pagos = this.Precios.meses * 4;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
              this.Precios.cuota = (this.Precios.cuota / 4).toFixed(2)
            }else if (this.Precios.forma_pago === 2) {
              pagos = this.Precios.meses * 2;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
              this.Precios.cuota = (this.Precios.cuota / 2).toFixed(2)
            }else if (this.Precios.forma_pago === 3) {
              pagos = this.Precios.meses;
              this.Precios.cuota = (-SALDO_F / TASA).toFixed(2);
            }
            this.Precios.total_credito = 0;
            this.Precios.total_credito = (this.Precios.cuota * pagos).toFixed(2);
            //sin prima
            this.crearPagos(pagos, this.Precios.forma_pago, 2)
          }
        }else
          this.$store.commit('notificacion',{texto:'No es valida la cantidad de meses', color:'warning'})
      },
      calcularPagosContadoPagos(){
        this.observacion = 'VENTA AL PRECIO DE CONTADO PARA '+this.Precios.prom_cant_cuotas+' PAGOS'
        this.calcularP = true;
        this.Precios.meses = this.Precios.prom_cant_cuotas;
        this.Precios.saldo_nuevo =this.Precios.contado;
        this.Precios.total_credito = this.Precios.contado;
        this.Precios.cuota = 0
        this.Precios.pagos = [];
        this.Precios.cuota = (this.Precios.contado / this.Precios.prom_cant_cuotas).toFixed(3);
        this.Precios.prima = 0
        this.crearPagos(this.Precios.prom_cant_cuotas - 1,this.Precios.forma_pago, 3);

      },
      // tipo 1 -> financiado, 2->sin prima, 3 -> contado para pagos
      crearPagos(pagos, tipoPago, tipo){
        this.totalRows = 1;
        let dias= 0, saldo = this.Precios.total_credito;
        let ANTES = new Date(), cuota = this.Precios.cuota;

        if(this.Precios.prima > 0 || (tipo === 1 || tipo === 3)){
          let pago = 0;
          let saldoA = 0;
          if (tipo === 1) {
            pago = this.Precios.prima;
            saldoA = (parseFloat(saldo) + parseFloat(this.Precios.prima)).toFixed(2);
          }else if (tipo === 3) {
            pago = this.Precios.cuota;
            saldoA = saldo
            saldo  = (saldo - pago).toFixed(2)
          }
          this.Precios.pagos.push({
            "num": 'prima',
            "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
            "saldo": saldoA,
            "cuota": pago,
            "saldo_a": saldo
          });
        }
        this.totalRows++;
        if (tipoPago === 1 || tipoPago === 2){
          if (tipoPago === 1){
            dias = 7
          }else if (tipoPago === 2){
            dias = 15
          }
          for (let i = 0;  i < pagos; i++){
            ANTES.setDate(ANTES.getDate() + dias);
            this.Precios.pagos.push({
              "num": i+1,
              "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
              "saldo": saldo,
              "cuota": cuota,
              "saldo_a": (saldo - cuota).toFixed(2)
            });
            saldo = (saldo - cuota).toFixed(2);
            this.totalRows++;
          }
        }else{
          for (let i = 0;  i < pagos; i++){
            ANTES.setMonth(ANTES.getMonth() + 1);
            this.Precios.pagos.push({
              "num": i+1,
              "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
              "saldo": saldo,
              "cuota": cuota,
              "saldo_a": (saldo - cuota).toFixed(2)
            });
            saldo = (saldo - cuota).toFixed(2);
            this.totalRows++;
          }
        }
      },
      calcularSaldoNuevo(){
        if (this.Precios.prima && this.Precios.prima >= this.Precios.min_prima){
          this.Precios.saldo_nuevo = 0;
          this.Precios.saldo_nuevo = (parseFloat(this.Precios.contado) - parseFloat(this.Precios.prima)).toFixed(2)
        }
      },
      cargarMotivosTraslados(){
        this.$axios.get('motivos_traslados',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Motivos = res.data.motivos
        })
      },
      cargarDetalles(){
        this.$axios.get('detalles_sucursales/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Detalles   = res.data.detalles;
          this.Stock      = res.data.stock;
          this.fotos      = res.data.fotos;
          res.data.compuestos.forEach( (i) => {
            i.inventario_compuestos.forEach( (a) => {
              this.Compuestos.push({
                "nombre": i.detalle,
                "sucursal": a.sucursal.abreviatura,
                "stock": a.stock_nuevo,
                "reingreso": a.stock_reingreso
              });
            });
          });
          this.Stock.forEach( (i)=>{
            this.Solicitar.Sucursales.push({
              "value": i.sucursal.id+'-'+i.stock_actual+'-'+i.stock_reingreso,
              "text": i.sucursal.nombre
            });
          })
        })
      },
      cargarPrecio(){
        this.$axios.get('precio_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            let precio = res.data.precio.filter(item=>item.estado === 1)
            this.PrecioArticulo = precio[0];
            this.Precios.contado = this.PrecioArticulo.precio_contado;
            this.Precios.min_prima = this.PrecioArticulo.minimo_prima;
            this.Precios.saldo = (parseFloat(this.Precios.contado) - parseFloat(this.Precios.min_prima)).toFixed(2)
            this.Precios.prima = this.Precios.min_prima;
            this.Precios.financiamiento = this.PrecioArticulo.financiamiento_anual / 100
            this.Precios.maximo_financiamiento = this.PrecioArticulo.maximo_financiacion;
            this.Precios.prom_precio_contado = this.PrecioArticulo.cant_pagos_contado > 0;
            this.Precios.prom_cant_cuotas = this.PrecioArticulo.cant_pagos_contado;
            this.Precios.venta_sin_prima  = this.PrecioArticulo.venta_sin_prima > 0;
            this.perPage = parseInt(this.Precios.maximo_financiamiento) + parseInt(2);
            this.calcularSaldoNuevo();
            this.Precios.S_contado = this.Precios.min_prima === 0 && this.Precios.financiamiento === 0;
          }
        })
      },
      cargarRemision(){
        this.$axios.get('remision_articulos/'+this.data.articulo,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Remision = res.data.articulos
        })
      },
      imprimirCotizacion(clave, cot){
        let url = this.$axios.defaults.baseURL+'documentos/ventas/cotizacion/usuario='+this.user+'/cot='+cot+'/'+clave.token;
        ipcRenderer.send('pint_navegador', url);
        this.$store.commit('activarOverlay', false);
      },
      imprimirEtiqueta(){
        let url = this.$axios.defaults.baseURL+'etiqueta_articulo/'+this.data.codigo_sistema+'/sucursal/'+this.Sucursal;
        ipcRenderer.send('pint_navegador', url);
        this.dialogoEtiqueta = false;
      },
      registrarCotizacion(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('venta/cotizacion_finanaciacion',{
          articulo_id:     this.data.articulo,
          sucursal_id: this.$store.state.sucursal,
          precio_contado: this.Precios.contado,
          minimo_prima:   this.Precios.min_prima,
          saldo:          this.Precios.saldo,
          prima_propuesta: this.Precios.prima,
          saldo_financiar: this.Precios.saldo_nuevo,
          forma_pago:      this.Precios.forma_pago,
          cantidad_meses:  this.Precios.meses,
          cuota:           this.Precios.cuota,
          total_credito:   this.Precios.total_credito,
          pagos:           JSON.stringify(this.Precios.pagos),
          venta_sin_prima: this.Precios.venta_sin_prima,
          observacion:     this.observacion
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:'Se ha guardado exitosamente la cotización', color:'success'});
          this.$store.commit('notificacion',{texto:'Creando cotización', color:'success'});
          this.imprimirCotizacion(res.data.clave, res.data.cot);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      },
      registrarSolicitud(){
        this.Solicitar.dialogo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('peticion_traslado',{
          origen:      this.Solicitar.origen,
          motivo:      this.Solicitar.motivo,
          destino:     this.Sucursal,
          observacion: this.Solicitar.observacion,
          estado:      this.Solicitar.estado,
          cantidad:    this.Solicitar.cantidad,
          articulo:    this.data.articulo
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.Solicitar.observacion = '';
          this.Solicitar.cantidad    = 1;
          this.Solicitar.motivo      = '';
          this.Solicitar.estado      = '';
          this.Solicitar.stock       = '';
          Swal.fire(
              'Solicitud Exitosa',
              `Se ha realizado exitosamente la solicitus de transferencia.`,
              'success'
          );
        })
      },
      validarSolicitudEnvio(){
        if (this.Solicitar.origen != this.Sucursal){
          if (this.$refs.FormSolicitudTransferencia.validate())
            this.registrarSolicitud()
        }else{
          Swal.fire(
            'Error',
            `La sucursal que seleccionaste no es valida.`,
            'error'
          );
        }
      },
      validarStock(){
        this.Solicitar.origen = this.Solicitar.stock.split('-')[0];
        let stock_nuevo       = this.Solicitar.stock.split('-')[1];
        let stock_reingreso   = this.Solicitar.stock.split('-')[2];
        stock_nuevo = parseInt(stock_nuevo)
        console.log(this.Solicitar.cantidad)
        if (this.Solicitar.estado == 1){
          if (this.Solicitar.cantidad > stock_nuevo){
            Swal.fire(
              'Cantidad Excesiva',
              `Haz excedido el stock nuevo con el que cuenta la sucursal que seleccionaste. La sucursal
               cuenta con ${stock_nuevo} y tu estas solicitando ${this.Solicitar.cantidad}.`,
              'error'
            );
            this.Solicitar.cantidad = 0
          }
        }else if (this.Solicitar.estado == 2){
          if (this.Solicitar.cantidad > stock_reingreso){
            Swal.fire(
              'Cantidad Excesiva',
              `Haz excedido el stock de reingreso con el que cuenta la sucursal que seleccionaste.`,
              'error'
            );
            this.Solicitar.cantidad = 0
          }
        }
      }
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
  .side{
    opacity: 0.99;
  }
  .titleDatos{
    font-family: 'Rubik', sans-serif;
    font-size: 14px;
    font-weight: bold;
    color: #272727;
  }
  .subtitleDatos{
    font-family: 'Rubik', sans-serif;
    font-size: 11px;
    color: #3a3a3a;
  }
  .titleInput{
    font-size: 12px;
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
    font-size: 11px;
    font-family: 'Rubik', sans-serif;
    color: #7F828B;
    height: 22px;
    border-bottom: solid 1px #DADADA;
  }
  table tbody tr:hover{
    cursor: pointer;
    background-color: #f6f6f6;
  }
  .containerInput{
    border: solid 1px #DADADA;
    padding: 2px;
    height: 30px;
  }
  select{
    font-size: 14px;
  }
  .bodyTrTitle{
    padding: 8px;
    font-family: 'Rubik', sans-serif;
  }
  .bodyTrSubTitle{
    color: #47494e;
    font-family: 'Rubik', sans-serif;
  }
  .bodyTr{
    border: solid 1px #b2b0b0;
  }
</style>
