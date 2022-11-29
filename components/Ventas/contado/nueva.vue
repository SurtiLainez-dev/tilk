<template>
  <v-card flat>
    <v-toolbar color="grey lighten-3" flat>
      <h6>Nueva Venta de Contado</h6>
      <v-spacer></v-spacer>
      <v-btn small color="indigo" @click="Cliente.dialogo = true" tile class="text-white">Cliente Nuevo</v-btn>
    </v-toolbar>
    <small class="pl-5">Datos de la Venta</small>
    <v-form ref="formVentaContado">
      <v-row no-gutters >
        <v-col><v-autocomplete class="ma-2" :rules="[rules.select.req]" v-model="Venta.vendedor" loader-height="3"
                               label="Vendedor" dense :items="Colaboradores" :loading="loadColaborador">
        </v-autocomplete></v-col>
        <v-col>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-text-field dense class="ma-2" v-on="on" v-bind="attrs" v-model="Venta.identificacion"
                            :rules="[rules.identidad.id, rules.identidad.some]" :loading="loadCliente"
                            label="Identificación del Cliente" loader-height="4" @keyup.enter="buscarCliente">
              </v-text-field>
            </template>
            <span>Identificación solo para buscar el cliente</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-text-field dense disabled class="ma-2" v-model="Venta.rtn"
                        label="Rtn del Cliente"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense disabled class="ma-2" v-model="Venta.nombre" :rules="[rules.select.req]"
                        label="Nombre del Cliente"></v-text-field>
        </v-col>
        <v-col>
          <v-dialog ref="dialogoFechaVenta" :return-value.sync="Venta.fecha" persistent
                    width="290px" v-model="dialogoFecha">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="Venta.fecha" label="Fecha de la Venta"
                            :rules="[rules.select.req]" dense class="ma-2"
                            readonly v-bind="attrs" v-on="on">
              </v-text-field>
            </template>
            <v-date-picker v-model="Venta.fecha" scrollable>
              <v-spacer></v-spacer>
              <v-btn tile small dark color="orange" @click="dialogoFecha = false">Cerrar</v-btn>
              <v-btn tile small color="indigo" class="text-white"
                     @click="saveFecha" :disabled="!Venta.fecha">Seleccionar</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-card class="ma-2" flat height="500px" style="border: solid 1px #000">
        <v-toolbar flat>
          <small>Cuerpo de la factura</small>
          <v-spacer></v-spacer>
          <v-btn small tile dark class="ma-1" color="orange" @click="dialogoRegalia = true">Agregar Regalia</v-btn>
          <v-btn small tile dark class="ma-1" @click="dialogoBusqueda = true" color="success">Agregar Artículo</v-btn>
        </v-toolbar>
        <table>
          <thead>
          <tr>
            <th v-for="(item, i) in newHeaderArticulos">{{item}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in Venta.filas">
            <td style="width: 2%">{{item.key + 1}}</td>
            <td style="width: 17%">{{item.articulo}}</td>
            <td style="width: 15%">{{item.cod_sistema}}</td>
            <td style="width: 15%">{{item.cod_provee}}</td>
            <td style="width: 6%">
              <select class="select" v-model="item.is_serie">
                <option v-for="val in selectSerie" :value="val.value">{{val.text}}</option>
              </select>
            </td>
            <td style="width: 6%">
              <select class="select" v-model="item.is_moto">
                <option v-for="val in selectSerie" :value="val.value">{{val.text}}</option>
              </select>
            </td>
            <td style="width: 11%">
              <input type="text" v-model="item.serie" placeholder="Serie del fabricante">
            </td>
            <td style="width: 10%">
              <input type="text" v-model="item.color" placeholder="Color">
            </td>
            <td style="width: 10px !important;">
              <input type="number" v-model="item.cantidad">
            </td>
            <td style="width: 10%">L {{int.format(item.precio)}}</td>
            <td style="width: 10%">L {{int.format(item.totalFila)}}</td>
            <td style="width: 5%">
              <v-btn fab text color="red" @click="deleteFila(scope.item.key)"
                     width="18" height="19" dark><v-icon size="12">fa fa-times</v-icon></v-btn>
            </td>
          </tr>
          <tr v-if="Venta.filas.length > 0">
            <td class="text-center" colspan="12">----- Fin -----</td>
          </tr>
          <tr v-else>
            <td colspan="12" class="text-center">POR FAVOR SELECCIONAR UN ARTICULO PARA FACTURAR</td>
          </tr>
          </tbody>
        </table>

        <v-divider></v-divider>
        <v-card-text>Descuento que se puede aplicar L. {{descuento.inicial}}</v-card-text>
        <br>
        <v-alert dense type="warning" class="ma-2" border="left" outlined dismissible dark>Recuerda que solo puedes facturar <strong>un artículo</strong>, para cosas pequeñas, se debe facturar en caja.</v-alert>
      </v-card>
      <v-card class="ma-2" flat style="border: solid 1px #000">
        <v-row no-gutters>
          <v-col cols="7">
            <v-simple-table dense class="rowsTable">
              <template v-slot:default>
                <caption class="pl-5">Regalias</caption>
                <thead>
                <tr>
                  <th>Artículo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Quitar</th>
                </tr>
                </thead>
                <tbody >
                  <tr v-for="item in Venta.regalias">
                    <td>{{item.nombre}}</td>
                    <td>{{item.cantidad}}</td>
                    <td>{{item.precio}}</td>
                    <td>
                      <v-btn color="red" fab tile dark x-small @click="deleteRegalia(item.key)"
                             width="22" height="22"><v-icon>fa fa-times</v-icon></v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="2">
            <v-card flat>
              <v-toolbar flat dense>Tipo de Venta</v-toolbar>
              <v-chip class="ma-2" small v-if="tipoVenta === 1">Nuevo</v-chip>
              <v-chip class="ma-2" small v-else-if="tipoVenta === 2">Consignado</v-chip>
              <v-chip class="ma-2" small v-else-if="tipoVenta === 3">Reingreso</v-chip>
              <v-chip class="ma-2" small v-else>No identificado</v-chip>
            </v-card>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-col>
                <v-btn color="grey" small dark block tile @click="descuento.dialogo = true">Descuento</v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="8">
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>Sub-total:</strong></span>
                  </v-col>
                </v-row>
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>Impuesto:</strong></span>
                  </v-col>
                </v-row>
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>Total:</strong></span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>L {{Venta.sub_total}}</strong></span>
                  </v-col>
                </v-row>
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>L {{Venta.impuesto}}</strong></span>
                  </v-col>
                </v-row>
                <v-row no-gutters style="border: solid 1px #000">
                  <v-col class="d-flex justify-end">
                    <span class="ma-2"><strong>L {{Venta.total}}</strong></span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="indigo" @click="validarEnvio" small dark tile>Registrar Factura</v-btn>
      </v-card-actions>
    </v-form>

    <v-dialog v-model="Cliente.dialogo" width="25%">
      <v-card >
        <v-toolbar flat>
          <h5>Cliente Nuevo</h5>
        </v-toolbar>
        <v-divider></v-divider>
        <v-form ref="FormClienteNuevo">
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Identidad"
                          :rules="[rules.select.req,rules.identidad.id, rules.identidad.some]"
                          v-model="Cliente.identidad"></v-text-field>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Nombres" :rules="[rules.select.req]"
                          v-model="Cliente.nombres"></v-text-field>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Apellidos" :rules="[rules.select.req]"
                          v-model="Cliente.apellidos"></v-text-field>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Rtn"
                          :rules="[rules.identidad.id, rules.identidad.some]"
                          v-model="Cliente.rtn"></v-text-field>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-select class="ma-2" dense :items="selectSexo" :rules="[rules.select.req]"
                      label="Sexo" v-model="Cliente.sexo"></v-select>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Nacionalidad" :rules="[rules.select.req]"
                          v-model="Cliente.nacionalidad"></v-text-field>
          </v-col></v-row>
          <v-divider></v-divider>
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn tile small dark color="orange" @click="Cliente.dialogo = false">Cerrar</v-btn>
          <v-btn tile small dark color="indigo" @click="validarFormNuevoCliente">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoBusqueda" width="100%">
      <v-card>
        <v-tabs v-model="tab" align-with-title>
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <v-tab :key="0">Todos los Artículos</v-tab>
          <v-tab :key="1">Motocicletas</v-tab>
          <v-tab :key="2">Artículos con Seríe</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <v-toolbar color="grey lighten-4">
              <h6>Todos los Artículos</h6>
              <v-spacer></v-spacer>
              <v-text-field dense v-model="search" label="Buscar Artículo"></v-text-field>
            </v-toolbar>
            <v-data-table dense :items="ArticulosI" :search="search"
                          class="rowsTable"
                          loading-text="Cargando inventario de la sucursal"
                          :headers="header" :loading="loadArticulos">
              <template v-slot:item.articulo.id="{item}">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn color="success" v-on="on" v-bind="attrs"
                           @click="addLineaArticulo(item)"
                           x-small text fab class="text-white">
                      <v-icon>fa fa-arrow-right</v-icon>
                    </v-btn>
                  </template>
                  <span>Seleccionar {{item.nombre_articulo}}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.articulo.precio_activo.precio_contado="{item}">
                <span v-if="item.articulo.precio_activo">
                  L {{item.articulo.precio_activo.precio_contado}}</span>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-toolbar color="grey lighten-4">
              <h6>Todas las Motocicletas</h6>
              <v-spacer></v-spacer>
              <v-text-field dense label="Buscar Motocicleta" v-model="searchMoto"></v-text-field>
            </v-toolbar>
            <v-data-table :headers="headerMoto"
                          :loading="loadMotocicletas"
                          loading-text="Cargando motocicletas del piso"
                          :items="Motocicletas"
                          class="rowsTable"
                          :search="searchMoto"
                          dense>
              <template v-slot:item.remision_articulo_id="{item}">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn fab width="22px" v-on="on" v-bind="attrs"
                           @click="addLineaMoto(item)"
                           height="22px" color="success" dark>
                      <v-icon size="15">fa fa-arrow-right</v-icon></v-btn>
                  </template>
                  <span>Seleccionar</span>
                </v-tooltip>
              </template>
              <template v-slot:item.remision_articulo.precio_actual="{item}">
                <span v-if="item.remision_articulo.estado_articulo_id === 1 || item.remision_articulo.estado_articulo_id === 2">
                  L {{item.remision_articulo.articulo.precio_activo.precio_contado}}
                </span>
                <span v-else-if="item.remision_articulo.estado_articulo_id === 3">
                  L {{item.remision_articulo.precio_actual}}
                </span>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-toolbar color="grey lighten-4">
              <h6>Todos los Artículos con Seríe</h6>
              <v-spacer></v-spacer>
              <v-text-field dense label="Buscar Artículo" v-model="searchRemision"></v-text-field>
            </v-toolbar>

            <v-data-table :headers="headerRemision"
                          :loading="loadRemision"
                          loading-text="Cargando artículos del piso"
                          :items="data_RemisionArticulo"
                          class="rowsTable"
                          :search="searchRemision"
                          dense>
              <template v-slot:item.articulo_id="{item}">
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn fab width="22px" v-on="on" v-bind="attrs"
                           @click="addLineaRemision(item)"
                           height="22px" color="success" dark>
                      <v-icon size="15">fa fa-arrow-right</v-icon></v-btn>
                  </template>
                  <span>Seleccionar</span>
                </v-tooltip>
              </template>
              <template v-slot:item.precio_actual="{item}">
                L {{item.precio_actual}}
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" tile small dark @click="dialogoBusqueda = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoRegalia" width="100%">
      <v-card>
        <v-toolbar color="grey lighten-4">
          <h6>Todos los Artículos</h6>
          <v-spacer></v-spacer>
          <v-text-field dense v-model="searchRegalia" label="Buscar Artículo"></v-text-field>
        </v-toolbar>
        <v-data-table dense :items="ArticulosI" :search="searchRegalia"
                      class="rowsTable"
                      loading-text="Cargando inventario de la sucursal"
                      :headers="header" :loading="loadArticulos">
          <template v-slot:item.articulo.id="{item}">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn color="success" v-on="on" v-bind="attrs"
                       @click="addRegalia(item)"
                       x-small text fab class="text-white">
                  <v-icon>fa fa-arrow-right</v-icon>
                </v-btn>
              </template>
              <span>Seleccionar {{item.nombre_articulo}}</span>
            </v-tooltip>
          </template>
          <template v-slot:item.articulo.precio_activo.precio_contado="{item}">
                <span v-if="item.articulo.precio_activo">
                  L {{item.articulo.precio_activo.precio_contado}}</span>
          </template>
        </v-data-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn small color="orange" dark tile @click="dialogoRegalia = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="descuento.dialogo" width="25%">
      <v-card >
        <v-toolbar flat color="gray lighten-3">
          Aplicando Descuento a la Venta
        </v-toolbar>
        <v-card-text>El descuento que se le puede aplicar a la venta es de L. {{descuento.inicial}}</v-card-text>

        <v-text-field class="ma-5" suffix="lps" dense label="Descuento a Aplicar" v-model="descuento.aplicado"></v-text-field>
       <v-card-actions class="d-flex justify-end">
         <v-btn color="warning" dark small tile @click="validarDescuento">Cerrar</v-btn>
       </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "nueva",
  props:{
    Articulos: Object,
    tipo:      Number
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      tipoVenta: 0,
      descuento:{
        inicial:  0,
        aplicado: 0,
        dialogo:  false,
        stateTotal: 0
      },
      tab: 0,
      dialogoRegalia: false,
      search: '',
      searchMoto: '',
      searchRemision: '',
      searchRegalia:  '',
      headerArticulos:[
          '#',
          {key: 'articulo',stickyColumn: true, isRowHeader: true, variant: 'light'},
          'cod_sistema',
          'cod_provee',
          'is_serie',
          'is_moto',
          'serie',
          'color',
          'cantidad',
          'precio',
          'totalFila',
          'key'
      ],
      newHeaderArticulos:[
        '#',
        'Artículo',
        'Código del Sistema',
        'Código del Proveedor',
        'Serie',
        'Vehículo',
        'Serie del Fabricante',
        'Color',
        'Cant.',
        'Precio',
        'Total',
        'Quitar',
      ],
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
        {text:'Precio',value:'precio_actual'},
      ],
      header:[
        {text:'Proveedor',value:'articulo.marca.proveedor.nombre'},
        {text:'Marcá',value:'articulo.marca.nombre'},
        {text:'Módelo',value:'articulo.modelo'},
        {text:'Código Sístema',value:'articulo.codigo_sistema'},
        {text:'Nombre del Artículo',value:'articulo.nombre_articulo'},
        {text:'Código Proveedor',value:'articulo.codigo_proveedor'},
        {text:'Sub-familia',value:'articulo.sub_familia_articulo.nombre'},
        {text:'Familia',value:'articulo.sub_familia_articulo.familia_articulo.nombre'},
        {text: 'Precio de Contado', value:'articulo.precio_activo.precio_contado'},
        {text: 'Stock Nuevo', value:'stock_actual'},
        {text:'Acciones',value:'articulo.id'},
      ],
      headerMoto:[
        {text:'Chasis',      value:'chasis'},
        {text:'Motor',       value:'motor'},
        {text:'Año',         value:'anio'},
        {text:'CC',          value:'cilindraje'},
        {text:'Color',       value:'color'},
        {text:'Precio Actual', value:'remision_articulo.precio_actual'},
        {text:'Seleccionar', value:'remision_articulo_id'},
      ],
      selectSexo:[
        {text:'Masculino', value:1},
        {text:'Femenino', value:2},
        {text:'Empresa', value:3},
      ],
      selectSerie:[
        {text:'No' , value:false},
        {text:'Sí' , value:true},
      ],
      dialogoBusqueda: false,
      Cliente:{
        dialogo: false,
        identidad:    '',
        nombres:      '',
        apellidos:    '',
        rtn:          '',
        sexo:         '',
        nacionalidad: 'Hondureña'
      },
      Venta:{
        sub_total: 0,
        impuesto:  0,
        total:     0,
        fecha:'',
        nombre: '',
        rtn: '',
        vendedor: '',
        cliente_id: null,
        identificacion: '',
        filas: [],
        regalias: []
      },
      rules: {
        select: {
          req: v => !!v || 'Campo requerido',
        },
        identidad: {
          some:v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.',
          id: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números'
        },
      },
      dialogoFecha: false,
      loadCliente: false,
      data_RemisionArticulo: [],
      Motocicletas: [],
      loadMotocicletas: false,
      loadRemision: false,
      loadArticulos: false,
      ArticulosI: [],
      Colaboradores: [],
      loadColaborador: false
    }
  },
  created() {
    this.cargarColaboradores();
    this.cargarRemision();
    this.cargarMotocicletas();
    this.cargarInventario();
  },
  computed:{
    SUCURSAL(){
      return this.$store.state.sucursal;
    },
  },
  methods:{
    addLineaArticulo(data){
      this.tipoVenta = 1;
      if (data.articulo.precio_activo){
        if (data.articulo.is_motocicleta !== 1){
          this.Venta.filas.push({
            key:         this.Venta.filas.length,
            articulo:    data.articulo.nombre_articulo,
            cantidad:    1,
            cantidadMax: data.stock_actual,
            precio:      data.articulo.precio_activo.precio_contado,
            cod_sistema: data.articulo.codigo_sistema,
            cod_provee:  data.articulo.codigo_proveedor,
            is_serie:    true,
            serie:       '',
            color:       '',
            is_remision: false,
            is_moto:     this.esVehiculo(data.articulo),
            remision_id: null,
            articulo_id: data.articulo.id,
            totalFila:   (1 * data.articulo.precio_activo.precio_contado).toFixed(2),
            estado:      1,
            vali_serie:  false,
            vali_color:  false,
            descuento:   data.articulo.precio_activo.descuento
          });

          this.sumarTotalFactura(1);
          this.descuento.inicial = this.Venta.filas.reduce((total, item) => total + item.descuento, 0);
          this.dialogoBusqueda = false;
        }else{
          this.notificacion('El artículo que seleccionaste es una motocicleta','warning');
        }
      }else{
        this.notificacion('Este artículo no cuenta con un precio activo aún','warning');
      }
    },
    addLineaMoto(data){
      this.Venta.filas.push({
        key:         this.Venta.filas.length,
        articulo:    data.remision_articulo.articulo.nombre_articulo,
        cantidad:    1,
        cantidadMax: 1,
        precio:      this.precioMotocicleta(data),
        cod_sistema: data.remision_articulo.articulo.codigo_sistema,
        cod_provee:  data.remision_articulo.articulo.codigo_proveedor,
        is_serie:    true,
        serie:       data.remision_articulo.serie_fabricante,
        color:       data.remision_articulo.color,
        is_remision: true,
        is_moto:     true,
        remision_id: data.remision_articulo.id,
        articulo_id: data.remision_articulo.articulo_id,
        totalFila:   (1 * this.precioMotocicleta(data)).toFixed(2),
        estado:      data.remision_articulo.estado_articulo_id,
        vali_serie:  false,
        vali_color:  false,
        descuento:   0
      });

      this.tipoVenta = data.remision_articulo.estado_articulo_id;

      this.sumarTotalFactura(data.estado_articulo_id);
      this.descuento.inicial = this.Venta.filas.reduce((total, item) => total + item.descuento, 0);
      this.dialogoBusqueda = false;
    },
    addLineaRemision(data){
      console.log(data)
      if (data.articulo.is_motocicleta !== 1){
        this.Venta.filas.push({
          key: this.Venta.filas.length,
          articulo:    data.articulo.nombre_articulo,
          cantidad:    1,
          cantidadMax: 1,
          precio:      data.precio_actual,
          cod_sistema: data.articulo.codigo_sistema,
          cod_provee:  data.articulo.codigo_proveedor,
          is_serie:    true,
          serie:       data.serie_fabricante,
          color:       data.color,
          is_remision: true,
          is_moto:     this.esVehiculo(data.articulo),
          remision_id: data.id,
          articulo_id: data.articulo_id,
          totalFila:   (1 * data.precio_actual).toFixed(2),
          estado:      data.estado_articulo_id,
          vali_serie:  false,
          vali_color:  false,
          descuento:   0
        });
        this.tipoVenta = data.estado_articulo_id;
        this.sumarTotalFactura(data.estado_articulo_id);
        this.validarColor(data);
        this.descuento.inicial = this.Venta.filas.reduce((total, item) => total + item.descuento, 0);
        this.dialogoBusqueda = false;
      }else{
        this.notificacion('El artículo que seleccionaste es una motocicleta','warning');
      }
    },
    addRegalia(data){
      if (data.stock_actual > 0 && data.articulo.precio_activo){
        this.Venta.regalias.push({
          articulo_id: data.articulo.id,
          nombre:      data.articulo.nombre_articulo,
          precio:      data.articulo.precio_activo.precio_contado,
          cantidad:    1,
          key:         this.Venta.regalias.length
        });
        this.dialogoRegalia = false;
      }
    },
    buscarCliente(){
      this.loadCliente = true;
      this.$axios.get('cliente_segumiento/'+this.Venta.identificacion).then((res)=>{
        if (res.data.cliente){
          this.Venta.rtn        = res.data.cliente.rtn;
          this.Venta.nombre     = res.data.cliente.nombres+' '+res.data.cliente.apellidos;
          this.Venta.cliente_id = res.data.cliente.id;
          this.notificacion('Datos cargados exitasamente','success');
        }else{
          this.notificacion('El cliente no existe. Tienes que crear el cliente','warning');
        }
        this.loadCliente = false;
      });
    },
    cargarColaboradores(){
      this.Colaboradores = [];
      this.loadColaborador = true;
      this.$axios.get('colaboradores_suc/'+this.SUCURSAL).then((res)=>{
        res.data.col.forEach((i)=>{
          this.Colaboradores.push({
            text: i.nombres+ ' '+i.apellidos,
            value: i.id
          })
        })
        this.loadColaborador = false;
      })
    },
    cargarInventario(){
      this.loadArticulos = true;
      this.$axios.get('/2.0/inventario_x_sucursal/disponible/'+this.SUCURSAL).then((res)=>{
        this.ArticulosI    = res.data.inventario;
        this.loadArticulos = false;
      })
    },
    cargarMotocicletas(){
      this.loadMotocicletas = true;
      this.$axios.get('/2.0/motocicletas_x_sucursal/'+this.SUCURSAL)
          .then((res)=>{
            this.Motocicletas = res.data.motocicletas;
            this.loadMotocicletas = false;
            this.notificacion('Se han cargado las motocicletas','success');
          })
    },
    cargarRemision(){
      this.loadRemision = true;
      this.$axios.get('/2.0/inventario/remision/'+this.SUCURSAL)
          .then((res)=>{
            this.loadRemision = false;
            this.data_RemisionArticulo = res.data.inventario;
            this.notificacion('Se han cargado los artículos con seríe','success');
          })
    },
    deleteFila(key){
      this.Venta.filas.splice(key, 1);
      this.Venta.filas.forEach((item, i)=>{
        item.key = i;
      });
      this.sumarTotalFactura(1);
    },
    deleteRegalia(key){
      this.Venta.regalias.splice(key, 1);
      this.Venta.regalias.forEach((item,i)=>{
        item.key = 1;
      })
    },
    esVehiculo(data){
      if (data.is_motocicleta === 0)
        return false;
      else
        return true;
    },
    multiplicarTotalFla(data){
      data.totalFila = (data.cantidad * data.precio).toFixed(2);

      this.sumarTotalFactura();
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    precioMotocicleta(data){
      if(data.remision_articulo.estado_articulo_id === 1 || data.remision_articulo.estado_articulo_id === 2)
        return data.remision_articulo.articulo.precio_activo.precio_contado;
      else if (data.remision_articulo.estado_articulo_id === 3)
        return data.remision_articulo.precio_actual;
    },
    registrarCliente(){
      this.Cliente.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cuenta/nueva/manual/cliente',{
        identidad:    this.Cliente.identidad,
        nombres:      this.Cliente.nombres,
        apellidos:    this.Cliente.apellidos,
        sexo:         this.Cliente.sexo,
        nacionalidad: this.Cliente.nacionalidad,
        direcciones:  null,
        telefonos:    null,
        rtn:          this.Cliente.rtn
      }).then((res)=>{
        this.Cliente.rtn       = '';
        this.Cliente.identidad = '';
        this.Cliente.nombres   = '';
        this.Cliente.apellidos = '';
        this.notificacion(res.data.msj,'success');
        this.$store.commit('activarOverlay', false)
      }).catch((error)=>{
        if (error.response.status === 422)
          this.notificacion('El cliente ya existe','error');
        else
          this.notificacion('Hubo un error inesperado en el servidor','error');

        this.$store.commit('activarOverlay', false)
      })
    },
    registrarVenta(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('venta/contado',{
        cliente_id:  this.Venta.cliente_id,
        identidad:   this.Venta.identificacion,
        sucursal_id: this.SUCURSAL,
        total:       this.Venta.total,
        fecha:       this.Venta.fecha,
        colaborador_id: this.Venta.vendedor,
        filas:       this.Venta.filas,
        regalias:    this.Venta.regalias,
        descuento:   this.descuento.aplicado,
        tipoVenta:   this.tipoVenta
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion(res.data.msj,'success');
        this.$router.replace({path:'/inicio/otras_gestiones/ventas'})
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Hubo un error en el servidor al ingresar la venta','success')
      })
    },
    saveFecha() {
      this.$refs.dialogoFechaVenta.save(this.Venta.fecha);
      this.dialogoFecha = false;
    },
    sumarTotalFactura(reingreso){
      let total = 0;
      if(reingreso !== 3){
        this.Venta.filas.forEach((i)=>{
          total = (parseFloat(total) + (i.precio) * i.cantidad).toFixed(2);
        });
        this.Venta.total = total;
        this.Venta.impuesto = (this.Venta.total - (this.Venta.total / 1.15)).toFixed(2);
        this.Venta.sub_total = (this.Venta.total - this.Venta.impuesto).toFixed(2);
        this.descuento.stateTotal = this.Venta.total;
      }else{
        this.Venta.filas.forEach((i)=>{
          total = (parseFloat(total) + (i.precio) * i.cantidad).toFixed(2);
        });
        this.Venta.total = total;
        this.Venta.impuesto = 0;
        this.Venta.sub_total = (this.Venta.total - this.Venta.impuesto).toFixed(2);
        this.descuento.stateTotal = this.Venta.total;
      }
    },
    validarColor(data){
      data.vali_color = data.color.length > 1;
    },
    validarDescuento(){
      if (this.descuento.aplicado > this.descuento.inicial) {
        this.$store.commit('notificacion', {texto: 'No se pudo aplicar el descuento', color: 'warning'});
        this.descuento.aplicado = 0;
        this.sumarTotalFactura();
      }else{
        if (this.descuento.aplicado && this.descuento.aplicado > 0){
          this.Venta.total     = (this.descuento.stateTotal - this.descuento.aplicado).toFixed(2);
          this.Venta.impuesto  = (this.Venta.total - (this.Venta.total / 1.15)).toFixed(2);
          this.Venta.sub_total = (this.Venta.total - this.Venta.impuesto).toFixed(2);
        }else{
          this.sumarTotalFactura();
        }
        this.descuento.dialogo = false;
      }
    },
    validarEnvio(){
      if (this.tipoVenta > 0 && this.tipoVenta <=3){

        let longIsSerie = 0, isColor = 0, isSerie = 0;
        this.Venta.filas.forEach((i)=>{
          if (i.is_serie){
            longIsSerie++;
            if (i.serie){
              isSerie++;
              i.vali_serie = true;
            }else{
              i.vali_serie = false;
            }

            if (i.color){
              isColor++;
              i.vali_color = true;
            }else{
              i.vali_color = false;
            }
          }
        });

        if (longIsSerie === isSerie && longIsSerie === isColor
            && this.$refs.formVentaContado.validate() && this.Venta.filas.length > 0)
          if (this.descuento.aplicado > this.descuento.inicial){
            this.$store.commit('notificacion', {texto: 'No se pudo aplicar el descuento', color: 'warning'});
            this.descuento.aplicado = 0;
            this.sumarTotalFactura();
          }else
            this.registrarVenta();
        else
          this.notificacion('Hay datos incompletos','error');
      }
    },
    validarFormNuevoCliente(){
      if (this.$refs.FormClienteNuevo.validate())
        this.registrarCliente();
      else {
        this.notificacion('Hay campos incompletos', 'error');
      }
    },
    validarSerie(data){
      data.vali_serie = data.serie.length > 2;
    }
  }
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}
table{
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 2px;
}
table thead{
  background: #e8e5e5;
}
table thead tr th{
  font-size: 12px;
}
table tbody tr td{
  font-size: 11px;
}
table tbody tr td:nth-child(even){
  background-color: #f2f2f2;
}
table tbody tr:hover{
  background: #f2f2f2;
  border: 1px solid;
  cursor: pointer;
}
table caption{
  font-size: 13px;
  caption-side: top;
}
table thead tr td{
  font-size: 12px;
}

select{
/*// A reset of styles, including removing the default dropdown arrow*/
  appearance: none;
/*// Additional resets for further consistency*/
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  outline: none;
}
:root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
}
select::-ms-expand {
  display: none;
}
.select {
  width: 100%;
  /*min-width: 15ch;*/
  /*max-width: 30ch;*/
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  /*font-size: 1.25rem;*/
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
}
.select::after {
  content: "";
  width: 0.8em;
  height: 0.5em;
  background-color: var(--select-arrow);
  clip-path: polygon(100% 0%, 0 0%, 50% 100%);
}
input{
  padding: 2px;
  border: 0.5px solid #7F828B;
}
</style>
