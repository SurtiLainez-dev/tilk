<template>
  <v-card flat>

    <v-form ref="FormVentaContadoCaja" class="ma-2">
      <v-alert color="orange" dark dense border="left"
               dismissible type="warning">
        Recuerda que esta venta de contado es para artículos que no tienen serie
        y que no tiene componentes. Por ejemplo:
        ventiladores, juego de vasos, planchas, muebles de madera, etc...
      </v-alert>
      <v-row no-gutters >
        <v-col>
          <v-card flat>
            <v-toolbar flat color="grey lighten-5">
              Totales de la Factura
            </v-toolbar>

            <v-text-field class="ma-4"  v-model="Venta.sub_total" suffix="lps"
                          disabled dense label="Sub Total"></v-text-field>

            <v-text-field class="ma-4" disabled dense suffix="lps"
                          label="Total de Impuesto" v-model="Venta.impuesto">
            </v-text-field>

            <v-text-field class="ma-4" suffix="lps" v-model="Venta.total"
                          disabled  dense label="Total de la Factura">
            </v-text-field>

            <v-text-field class="ma-4" suffix="lps" dense label="Total del Descuento a Aplicar"
                          v-model="pago.des_aplicado" @keyup="aplicarDescuento" :rules="[rules.select.des]">
            </v-text-field>

          </v-card>
        </v-col>
        <v-col >
          <v-card flat >
            <v-toolbar color="grey lighten-5" flat>
              Datos de la Factura
              <v-spacer></v-spacer>
              <v-btn small tile dark class="ma-2" color="indigo"
                     @click="Cliente.dialogo = true">Crear Cliente</v-btn>
            </v-toolbar>
            <v-autocomplete class="ma-4" :rules="[rules.select.req]" v-model="Venta.colaborador"
                            dense label="Vendedor" :items="Colaboradores" :loading="loadColaboradores">
            </v-autocomplete>

            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-text-field v-on="on" v-bind="attrs" class="ma-4" dense @dblclick="dialogoBuscarCliente = true"
                              v-model="Venta.nombre" :rules="[rules.select.req]"
                              label="Cliente" @keyup.enter="dialogoBuscarCliente = true">
                </v-text-field>
              </template>
              <span>Presione ENTER para buscar</span>
            </v-tooltip>

            <v-text-field class="ma-2" dense v-model="Venta.rtn"
                          label="Rtn del Cliente" disabled>
            </v-text-field>
          </v-card>

        </v-col>
      </v-row>

      <v-toolbar flat color="grey lighten-5">
        <small>Cuerpo de la factura</small>
        <v-spacer></v-spacer>
        <v-btn small tile dark class="ma-2"
               @click="dialogoBusqueda = true" color="success">Agregar Artículo</v-btn>

      </v-toolbar>

      <v-simple-table dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th>Detalle del Artículo</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Quitar</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in Venta.filas" >
            <td>{{i+1}} - {{item.articulo}} - Cod.Sis[{{item.cod_sistema}}]</td>
            <td>
              <b-form-input dense type="number" size="sm" style="height: 25px"
                            :min="1" :max="item.cantidadMax"
                            v-model="item.cantidad" @change="multiplicarTotalFla(item)">
              </b-form-input>
            </td>
            <td>L {{item.precio}}</td>
            <td>L {{item.totalFila}}</td>
            <td>
              <v-btn x-small fab color="red" @click="deleteFila(item.key)"
                     tile width="25" height="25" dark>
                <v-icon>fa fa-times</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-card-text>Descuento que se puede aplicar L. {{int.format(pago.descuento)}}</v-card-text>
      <br>
      <v-toolbar flat color="grey lighten-5">
        <small>Cuerpo de Regalías</small>
        <v-spacer></v-spacer>
        <v-btn small tile dark class="ma-2" color="orange"
               @click="dialogoRegalia = true">Agregar Regalia</v-btn>

      </v-toolbar>

      <v-simple-table dense>
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Quitar</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in Venta.regalias">
              <td>{{i + 1}}</td>
              <td>{{item.nombre}}</td>
              <td>{{item.cantidad}}</td>
              <td>L {{item.precio}}</td>
              <td>
                <v-btn width="20" height="20" @click="deleteRegalia(item.key)"
                       color="red" dark tile fab>
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </td>
            </tr>

          </tbody>
        </template>
      </v-simple-table>
      <br>
      <br>
      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" dark small @click="validarForm" tile>Registrar Factura</v-btn>
      </v-card-actions>
    </v-form>


    <v-dialog v-model="dialogoBusqueda" width="100%">
      <v-card>

        <v-toolbar color="grey lighten-4">
          <h6>Todos los Artículos</h6>
          <v-spacer></v-spacer>
          <v-text-field dense v-model="search" label="Buscar Artículo"></v-text-field>
        </v-toolbar>
        <v-data-table dense :items="ArticulosI" :search="search"
                      class="rowsTable"
                      @click:row="addLineaArticulo"
                      loading-text="Cargando inventario de la sucursal"
                      :headers="header" :loading="loadArticulos">
          <template v-slot:item.articulo.precio_activo.precio_contado="{item}">
                <span v-if="item.articulo.precio_activo">
                  L {{item.articulo.precio_activo.precio_contado}}</span>
          </template>
        </v-data-table>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" tile small dark @click="dialogoBusqueda = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <v-text-field class="ma-2" dense label="Apellidos"
                          v-model="Cliente.apellidos"></v-text-field>
          </v-col></v-row>
          <v-row no-gutters><v-col>
            <v-text-field class="ma-2" dense label="Rtn"
                          :rules="[rules.select.req,rules.identidad.id, rules.identidad.some]"
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
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn tile small dark color="orange" @click="Cliente.dialogo = false">Cerrar</v-btn>
          <v-btn tile small dark color="indigo" @click="validarFormNuevoCliente">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoBuscarCliente" width="55%">
      <v-card>
        <v-toolbar flat color="grey lighten-4">
          <h6>Clientes Existentes</h6>
          <v-spacer></v-spacer>
          <v-text-field dense label="Buscar Cliente" class="ma-4"
                        v-model="searchCliente"></v-text-field>
        </v-toolbar>

        <v-card flat height="420">
          <v-data-table dense :items="CLIENTES"
                        :loading="LOAD_CLIENTES"
                        class="rowsTable"
                        :search="searchCliente"
                        @click:row="asignarCliente"
                        loading-text="Cargando Clientes"
                        :headers="headerCliente">
            <template v-slot:item.sexo="{item}">
              <span v-if="item.sexo === 1">Masculino</span>
              <span v-else-if="item.sexo === 2">Femenino</span>
              <span v-else-if="item.sexo === 3">Empresa</span>
            </template>
          </v-data-table>
        </v-card>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn small color="orange" tile dark @click="dialogoBuscarCliente = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="pago.dialogo" width="30%">
      <v-card >
        <v-toolbar flat color="grey lighten-5">
          <h6>Realizar Documento</h6>
        </v-toolbar>
        <v-form class="pl-5 pr-5 pb-5" ref="FormRegistrarVenta">
          <v-select dense :items="FormasPago" label="Forma de Pago"
                    v-model="pago.forma_pago" :rules="[rules.referencia.req, rules.referencia.prohibido]"
                    :item-value="'id'" :item-text="'nombre'">
          </v-select>
          <v-autocomplete dense v-if="pago.forma_pago === 2 || pago.forma_pago === 4"
                          :rules="[rules.select.req]" v-model="pago.cc_banco"
                          :loading="loadccBancos" :items="ccCuentasB" :item-text="'nombre'"
                          label="Seleccionar Cuenta" :item-value="'id'"></v-autocomplete>
          <v-text-field dense v-model="pago.referencia"
                        label="Referencia Pago"></v-text-field>
          <v-text-field dense v-model="pago.efectivo" label="Efectivo" type="number"
                        :rules="[rules.referencia.req, rules.efectivo.min]" @keyup="calucularCambio"
                        prefix="L" @click="calucularCambio" @keyup.enter="calucularCambio">
          </v-text-field>
          <v-text-field dense v-model="Venta.total" label="Total de la Compra" disabled prefix="L"></v-text-field>
          <v-text-field dense v-model="pago.cambio" label="Cambio" disabled prefix="L"></v-text-field>
        </v-form>
        <v-card-actions class="d-flex justify-end">
          <v-btn small tile color="orange" dark @click="pago.dialogo = false">Cerrar</v-btn>
          <v-btn small tile color="success" dark @click="validarFormPago">Registrar Posteo</v-btn>
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
                      @click:row="addRegalia"
                      loading-text="Cargando inventario de la sucursal"
                      :headers="header" :loading="loadArticulos">
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
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "venta",
  computed:{
    SUCURSAL(){
      return this.$store.state.sucursal;
    },
    CLIENTES(){
      return this.$store.state.cliente.CLIENTES;
    },
    LOAD_CLIENTES(){
      return this.$store.state.cliente.LOAD_CLIENTES;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  data(){
    return{
      int: new Intl.NumberFormat(),
      loadccBancos: false,
      ccCuentasB: [],
      searchRegalia: '',
      dialogoRegalia: false,
      FormasPago: [],
      pago:{
        cc_banco:     '',
        dialogo:      false,
        referencia:   '',
        forma_pago:   '',
        efectivo:     0,
        cambio:       0,
        descuento:    0,
        des_aplicado: 0,
        totalState:   0,
        ccDescuento:  0,
        impState:     0
      },
      searchCliente:        '',
      dialogoBuscarCliente: false,
      rules: {
        referencia: {
          req: v => !!v || 'Campo requerido',
          prohibido:  v => v == 3 || v == 5 || 'Tienes prohibido a seleccionar este opción'
        },
        select: {
          req: v => !!v || 'Campo requerido',
          des: v => v <= this.pago.descuento || 'El descuento máximo es de L. '+this.pago.descuento
        },
        efectivo:{
          min: v => parseFloat(v) >= parseFloat(this.Venta.total) || 'No puede ser menor que el total que se distribuyó',
        },
        identidad: {
          some:v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.',
          id: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números'
        },
      },
      selectSexo:[
        {text:'Masculino', value:1},
        {text:'Femenino', value:2},
        {text:'Empresa', value:3},
      ],
      Cliente:{
        dialogo: false,
        identidad:    '',
        nombres:      '',
        apellidos:    '',
        rtn:          '',
        sexo:         '',
        nacionalidad: 'Hondureña'
      },
      search:            '',
      dialogoBusqueda:   false,
      Colaboradores:     [],
      loadColaboradores: false,
      ArticulosI:        [],
      loadArticulos:     false,
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
      ],
      Venta:{
        colaborador: '',
        filas:     [],
        total:     0,
        impuesto:  0,
        sub_total: 0,
        cliente_id: null,
        rtn:        '',
        nombre:     '',
        regalias:  [],
      },
      headerCliente:[
        {text:'Nombres',value:'nombres'},
        {text:'Apellidos',value:'apellidos'},
        {text:'Identidad',value:'identidad'},
        {text:'Rtn',value:'rtn'},
        {text:'Sexo',value:'sexo'},
      ]
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
    this.$store.commit('cliente/cargar_CLIENTES');
    this.cargarColaboradores();
    this.cargarInventario();
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
    addLineaArticulo(data){
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
            is_moto:     false,
            remision_id: null,
            articulo_id: data.articulo.id,
            totalFila:   (1 * data.articulo.precio_activo.precio_contado).toFixed(2),
            estado:      1,
            vali_serie:  false,
            vali_color:  false,
            descuento:   data.articulo.precio_activo.descuento
          });

          this.sumarTotalFactura();
          this.dialogoBusqueda = false;
        }else{
          this.$store.commit('notificacion',{
            texto: 'El artículo que seleccionaste es una motocicleta',
            color: 'warning'
          });
        }
      }else{
        this.$store.commit('notificacion',{
          texto: 'Este artículo no cuenta con un precio activo aún',
          color: 'warning'
        });
      }

      this.pago.descuento = this.Venta.filas.reduce((total, item) => total + item.descuento, 0);
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
    aplicarDescuento(){
      if (this.pago.des_aplicado && this.pago.des_aplicado > 0){
        this.Venta.total     = (this.pago.totalState - this.pago.des_aplicado).toFixed(2);
        this.Venta.impuesto  = (this.Venta.total - (this.Venta.total / 1.15)).toFixed(2);
        this.Venta.sub_total = (this.Venta.total - this.Venta.impuesto).toFixed(2);
        this.pago.ccDescuento = (this.pago.impState - this.Venta.impuesto).toFixed(2);
        console.log(this.pago.ccDescuento)
      }else{
        this.sumarTotalFactura();
      }
    },
    asignarCliente(data){
      this.Venta.cliente_id = data.id;
      this.Venta.nombre = data.nombres+ ' '+data.apellidos;
      if (data.rtn)
        this.Venta.rtn = data.rtn;
      else
        this.Venta.rtn = '00000000000000';
      this.dialogoBuscarCliente = false
    },
    calucularCambio(){
      this.pago.cambio = (parseFloat(this.pago.efectivo) - parseFloat(this.Venta.total)).toFixed(2);
      if (this.pago.cambio < 0)
        this.pago.cambio = 0;
    },
    cargarCcCuentasBancos(){
      if (this.ccCuentasB.length === 0){
        if (this.pago.forma_pago === 2 || this.pago.forma_pago === 4){
          this.loadccBancos = true;
          this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=>{
            this.ccCuentasB   = res.data.cuentas;
            this.loadccBancos = false
          });
        }
      }
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
    cargarFormaPago(){
      this.$axios.get('forma_pagos').then((res)=>{
        this.FormasPago = res.data.formas
      })
    },
    cargarInventario(){
      this.loadArticulos = true;
      this.$axios.get('/2.0/inventario_x_sucursal/disponible/'+this.SUCURSAL).then((res)=>{
        this.ArticulosI    = res.data.inventario;
        this.loadArticulos = false;
      })
    },
    deleteFila(key){
      this.Venta.filas.splice(key, 1);
      this.Venta.filas.forEach((item, i)=>{
        item.key = i;
      });
      this.sumarTotalFactura();
    },
    deleteRegalia(key){
      this.Venta.regalias.splice(key, 1);
      this.Venta.regalias.forEach((item,i)=>{
        item.key = 1;
      })
    },
    multiplicarTotalFla(data){
      data.totalFila = (data.cantidad * data.precio).toFixed(2);

      this.sumarTotalFactura();
      this.pago.descuento = this.Venta.filas.reduce((total, item) => total + (item.descuento * item.cantidad), 0);
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
        this.$store.commit('cliente/cargar_CLIENTES');
        this.Cliente.rtn       = '';
        this.Cliente.identidad = '';
        this.Cliente.nombres   = '';
        this.Cliente.apellidos = '';
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.$store.commit('activarOverlay', false)
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{
            texto:'El cliente ya existe',color:'error'});
        else
          this.$store.commit('notificacion',{
            texto:'Hubo un error inesperado en el servidor',color:'error'});

        this.$store.commit('activarOverlay', false)
      })
    },
    registrarCompra(){
      this.$store.commit('activarOverlay', true);
      this.pago.dialogo = false;
      this.$axios.post('venta/contado/rapida',{
        cliente_id:     this.Venta.cliente_id,
        colaborador_id: this.Venta.colaborador,
        total:          this.Venta.total,
        identidad:      this.Venta.rtn,
        sucursal_id:    this.SUCURSAL,
        filas:          this.Venta.filas,
        regalias:       this.Venta.regalias,
        caja_id:        this.CAJA.id,
        cambio:         this.pago.cambio,
        efectivo:       this.pago.efectivo,
        forma_pago_id:  this.pago.forma_pago,
        referencia:     this.pago.referencia,
        ccBanco:        this.pago.cc_banco,
        descuento:      this.pago.des_aplicado,
        impuesto:       this.pago.impState,
        stateTotal:     this.pago.totalState
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.abrirNavegador(res.data.clave, 1,1, res.data.codigo);
        this.$store.commit('caja/cambiar_VISTA', 1);
      }).catch((error)=>{
        this.pago.dialogo = true;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Ha ocurrido un error en el servidor', color:'error'});
      }).catch(()=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    sumarTotalFactura(){
      let total = 0;
      this.Venta.filas.forEach((i)=>{
        total = (parseFloat(total) + (i.precio) * i.cantidad).toFixed(2);
      });
      this.Venta.total     = total;
      this.Venta.impuesto  = (this.Venta.total - (this.Venta.total / 1.15)).toFixed(2);
      this.Venta.sub_total = (this.Venta.total - this.Venta.impuesto).toFixed(2);
      this.pago.totalState = this.Venta.total;
      this.pago.impState   = this.Venta.impuesto;
    },
    validarForm(){
      if (this.$refs.FormVentaContadoCaja.validate() && this.Venta.filas.length > 0) {
        if (this.Venta.regalias.length === 0 && this.pago.des_aplicado == 0 ||
            this.Venta.regalias.length > 0 && this.pago.des_aplicado === 0 ||
            this.Venta.regalias.length === 0 && this.pago.des_aplicado > 0)
          this.pago.dialogo = true;
        else
          this.$store.commit('notificacion', {texto: 'No se puede dar descuento, si hay regalías', color: 'warning'})
      }else
        this.$store.commit('notificacion',{texto:'Hay datos invalidos',color:'warning'})
    },
    validarFormNuevoCliente(){
      if (this.$refs.FormClienteNuevo.validate())
        this.registrarCliente();
      else
        this.$store.commit('notificacion',{texto: 'Hay campos incompletos', color:'error'});
    },
    validarFormPago(){
      if (this.$refs.FormRegistrarVenta.validate())
        this.registrarCompra();
        // alert("paso")
      else
        this.$store.commit('notificacion',{texto:'No puedes registrar la venta',color:'warning'})
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$store.commit('notificacion',{
        texto:'Cargando datos', color:'success'}
        );
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
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
