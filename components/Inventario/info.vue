<template>
    <div class="pr-2">
      <v-bottom-navigation color="deep-orange lighten-1" horizontal>
        <v-btn @click="Solicitar.dialogo = true">
          <span>Solicitar</span>
          <v-icon>fa fa-exchange-alt</v-icon>
        </v-btn>
        <v-btn @click="sidePrecio = !sidePrecio">
          <span>Precio</span>
          <v-icon>fa fa-tag</v-icon>
        </v-btn>
        <v-btn>
          <span>Fotos</span>
          <v-icon>fa fa-images</v-icon>
        </v-btn>
        <v-btn @click="sideMotos = !sideMotos" v-if="data.is_motocicleta === 1">
          <span>Motocicletas</span>
          <v-icon>fa fa-motorcycle</v-icon>
        </v-btn>
      </v-bottom-navigation>
      <v-row>
        <v-col cols="5">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Sucursales Disponibles</v-card-title>
              <hr>
              <v-simple-table height="300px" fixed-header class="rowsTable">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Sucursal</th>
                    <th class="text-center">Reingreso</th>
                    <th class="text-center">Stock</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in Stock">
                    <td>{{item.sucursal.nombre}} ({{item.sucursal.abreviatura}})</td>
                    <td class="text-center">{{item.stock_reingreso}}</td>
                    <td class="text-center">{{item.stock_actual}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="7">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Artículo Desintegrado</v-card-title>
              <hr>
              <v-simple-table height="300px" fixed-header class="rowsTable">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Sucursal</th>
                    <th>Cód. Sístema</th>
                    <th>Serie</th>
                    <th>Estado</th>
                    <th>Precio</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in Remision">
                    <td>{{item.sucursal.abreviatura}}</td>
                    <td>{{item.serie_sistema}}</td>
                    <td>{{item.serie_fabricante}}</td>
                    <td>{{item.estado_articulo.nombre}}</td>
                    <td>L. {{item.precio_actual}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <v-navigation-drawer v-if="data.is_motocicleta === 1" v-model="sideMotos" clipped right
                                   absolute width="100%" class="side" >
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="1" class="d-flex align-center">
                      <v-btn class="ma-2" dark fab x-small text color="red" @click="sideMotos = false">
                        <v-icon>fa fa-times</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="11" class="d-flex justify-center align-center"><h4>Motocicletas en Existencia</h4></v-col>
                  </v-row>
                  <hr>
                  <v-simple-table class="rowsTable" dense>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Chasis</th>
                        <th>Motor</th>
                        <th>Color</th>
                        <th>Seríe</th>
                        <th>Precio</th>
                        <th></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in Remision">
                        <td>{{item.motocicleta.chasis}}</td>
                        <td>{{item.motocicleta.motor}}</td>
                        <td>{{item.motocicleta.color}}</td>
                        <td>{{item.serie_sistema}}</td>
                        <td>L {{item.precio_actual}}</td>
                        <td><v-checkbox dense></v-checkbox></td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-container>
              </v-navigation-drawer>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Detalles Técnicos</v-card-title>
              <hr>
              <v-simple-table height="345px" class="rowsTable">
                <template v-slot:default>
                  <tbody>
                  <tr v-for="item in Detalles">
                    <td>{{item.detalle}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="5">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card  :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Inventario Compuesto</v-card-title>
              <hr>
              <v-simple-table class="rowsTable" fixed-header height="344px">
                <template v-slot:default>
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
                </template>
              </v-simple-table>
            </v-card>
          </v-hover>
        </v-col>
        <v-col cols="3">
          <v-hover v-slot:default="{ hover }" open-delay="0">
            <v-card :elevation="hover ? 16 : 2" class="pl-2 pr-2">
              <v-card-title>Detalles del Artículo</v-card-title>
              <hr>
              <v-list>
                <v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código del Sístema'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_sistema"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Módelo'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.modelo"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Familía'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.familia"></v-list-item-subtitle>
                      <v-list-item-subtitle v-text="'Sub-familia: '+data.fam"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código del Proveedor'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_proveedor"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="'Código de Barras'"></v-list-item-title>
                      <v-list-item-subtitle v-text="data.codigo_barras"></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-dialog v-model="Solicitar.dialogo" width="30%">
        <v-card class="pl-5 pr-5">
          <v-card-title>Solicitud de {{data.nombre_articulo}} [{{data.codigo_sistema}}]</v-card-title>
          <hr>
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
            <v-btn color="orange" small dark @click="Solicitar.dialogo = false">Cancelar</v-btn>
            <v-btn color="success" small dark @click="validarSolicitudEnvio">Solicitar Artículo</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-navigation-drawer v-model="sidePrecio" clipped right
                           absolute width="100%" class="side" >
        <v-container>
          <v-row no-gutters>
            <v-col cols="1" class="d-flex align-center">
              <v-btn class="ma-2" dark fab x-small text color="red" @click="sidePrecio = false">
                <v-icon>fa fa-times</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11" class="d-flex justify-center align-center"><h4>Cotizador de {{data.nombre_articulo}} [{{data.descripcion_corta}}]</h4></v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="8">
              <v-alert v-if="Precios.S_contado" dense border="left" type="warning" text>
                Este artículo solo se puede vender al contado.
              </v-alert>
            </v-col>
            <v-col cols="4" class="d-flex justify-end align-center">
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
          <hr>
          <v-row no-gutters>
            <v-col cols="4">
              <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.contado"
                            label="Precio de Contado" filled></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.min_prima"
                            label="Mínimo de Prima" filled></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field class="ma-2" dense suffix="lps" disabled v-model="Precios.saldo"
                            label="Saldo" filled></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">
              <v-text-field class="ma-2" suffix="lps" v-model="Precios.prima" filled :disabled="Precios.S_contado"
                            :rules="[rules.precios.prima]" @keyup="calcularSaldoNuevo"
                            label="Prima propuesta por el cliente" dense></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field class="ma-2" suffix="lps" disabled dense
                            label="Saldo a financiar" filled
                            v-model="Precios.saldo_nuevo"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select dense label="Forma de pagos" v-model="Precios.forma_pago"
                        filled class="ma-2" :items="formaPagos" :disabled="Precios.S_contado"></v-select>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="3">
              <v-text-field dense label="Cantidad de meses" class="ma-2" filled
                            @keyup.enter="calcularPagos"
                            :disabled="Precios.S_contado"
                            v-model="Precios.meses" suffix="lps"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field dense
                            class="ma-2"
                            filled
                            disabled
                            suffix="lps"
                            v-model="Precios.cuota"
                            label="Cuota por pago"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-text-field dense
                            class="ma-2"
                            filled
                            disabled
                            suffix="lps"
                            v-model="Precios.total_credito"
                            label="Total del Crédito"></v-text-field>
            </v-col>
            <v-col cols="3" class="d-flex align-center justify-end">
              <v-btn class="ma-2" @click="calcularPagos" dark :disabled="Precios.S_contado"
                     color="indigo">Calcular Pagos</v-btn>
            </v-col>
          </v-row>

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
        </v-container>
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


      <v-navigation-drawer v-model="sideSolicitud" clipped right absolute width="100%" class="side">
        <v-container>
          <v-row no-gutters>
            <v-col cols="1" class="d-flex align-center">
              <v-btn class="ma-2" dark fab x-small text color="red" @click="sideSolicitud = false">
                <v-icon>fa fa-times</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="11" class="d-flex justify-center align-center"><h4>Solicitud de Crédito</h4></v-col>
          </v-row>
          <hr>
          <solicitud v-if="sideSolicitud" :precio="Precios" :articulo="data" :forma_pago="forma_de_pago"/>
        </v-container>
      </v-navigation-drawer>

    </div>
</template>

<script>
  import solicitud_credito from "../Ventas/solicitud_credito";
  import seguimiento from "./seguimiento";
  import Swal from "sweetalert2";
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
          total_credito: 0
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
      calcularPagos(){
        this.calcularP = true;
        let MESES = this.Precios.meses, FIN = this.Precios.financiamiento;
        let SALDO_F = this.Precios.saldo_nuevo;
        if (MESES){
          this.Precios.cuota = 0
          this.calcularSaldoNuevo();
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
          this.crearPagos(pagos, this.Precios.forma_pago, TASA_M)
        }
      },
      crearPagos(pagos, tipo){
        this.totalRows = 1;
        let dias= 0, saldo = this.Precios.total_credito;
        let ANTES = new Date(), cuota = this.Precios.cuota;

        this.Precios.pagos.push({
          "num": 'prima',
          "fecha": ANTES.getDate()+'/'+(ANTES.getMonth() + 1)+'/'+ANTES.getFullYear(),
          "saldo": (parseFloat(saldo) + parseFloat(this.Precios.prima)).toFixed(2),
          "cuota": this.Precios.prima,
          "saldo_a": saldo
        });
        this.totalRows++;
        if (tipo === 1 || tipo === 2){
          if (tipo === 1){
            dias = 7
          }else if (tipo === 2){
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
            this.PrecioArticulo = res.data.precio[0];
            this.Precios.contado = this.PrecioArticulo.precio_contado;
            this.Precios.min_prima = this.PrecioArticulo.minimo_prima;
            this.Precios.saldo = (parseFloat(this.Precios.contado) - parseFloat(this.Precios.min_prima)).toFixed(2)
            this.Precios.prima = this.Precios.min_prima;
            this.Precios.financiamiento = this.PrecioArticulo.financiamiento_anual / 100
            this.calcularSaldoNuevo();
            if (this.Precios.min_prima === 0 && this.Precios.financiamiento === 0)
              this.Precios.S_contado = true;
            else
              this.Precios.S_contado = false;
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
</style>
