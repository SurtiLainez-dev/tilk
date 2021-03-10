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
                    <v-card color="grey lighten-5">
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
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card-text>La venta se realizó con exito, descarga y sube los documentos de la venta desde el apartado
                  de MIS VEENTAS en el menú. Tienes que esperar a que el facturado apruebe la venta. Si estas en la
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
                    <v-btn color="orange" small dark @click="dialogoBusquedaMoto = false">Cerrar</v-btn>
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
    import {ipcRenderer} from "electron";
    import Vue from "vue";
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
                return this.$store.state.solicitud_credito.Solicitud.articulo;
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
            }
        },
        created() {
            if (this.Soli.estado === 5)
                this.vistaVenta = true;

            if (!this.vistaVenta){
                this.$store.commit('inventario/cargarInventario');
                this.Is_motocicleta       = this.Articulo.is_motocicleta === 1;
                this.Venta.sucursal       = this.Soli.user.colaborador.sucursal.nombre;
                this.Venta.sucursal_id    = this.Soli.user.colaborador.sucursal.id;
                this.Venta.articulo       = this.Soli.articulo.nombre_articulo;
                this.Venta.articulo_id    = this.Soli.articulo.id;
                this.Venta.colaborador    = this.Soli.user.colaborador.nombres+ ' ' +this.Soli.user.colaborador.apellidos;
                this.Venta.colaborador_id = this.Soli.user.colaborador.id;
                this.Soli.articulo.stock_articulos.forEach( (i) => {
                    if (i.sucursal_id === this.Venta.sucursal_id){
                        console.log(i)
                        this.statusArticulo.stock_nuevo     = i.stock_actual;
                        this.statusArticulo.stock_reingreso = i.stock_reingreso;
                    }
                });
                if (this.Is_motocicleta)
                    this.cargarMotocicletas()

                this.cargarRemision()
            }
        },
        methods:{
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
                this.$axios.get('/motocicletas_x_sucursal/'+this.SUCURSAL+'/'+this.Articulo.modelo)
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
            declinarVenta(){
              this.$store.commit('activarOverlay', true);
              this.$axios.post('venta',{
                tipo:              2,
                solicitud_credito: this.Soli.id,
              }).then((res)=>{
                this.$store.commit('activarOverlay', false);
                this.notificacion('Se ha declinado la solicitúd de crédito','error');
                this.dialogo = true;
                this.vistaVenta = true
              })
            },
            crearVenta(){
                this.AArticulo.remision = this.AArticulo.serie === this.AArticulo.verificar_remision;

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

                console.log(this.AArticulo)
                this.$axios.post('venta',
                    {
                    tipo:                    1,
                    articulo:                this.Venta.articulo_id,
                    serie_articulo:          this.AArticulo.serie,
                    color_articulo:          this.AArticulo.color,
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

                    is_remision:                 this.AArticulo.remision,
                    precio_contado:              this.Soli.precio_contado,
                    venta_id:                    this.Venta.id
                }, {
                      timeout: 15000,
                    }).then((res)=>{
                    this.$store.commit('activarOverlay', false);
                    this.notificacion('Se ha registró la venta exitosamente.','success')
                    this.SECC = 2;
                    this.dialogo = true;
                    this.vistaVenta = true
                }).catch((error)=>{
                    this.$store.commit('activarOverlay', false);
                    this.notificacion('Hubo un error al ingresar la venta','error');
                    if (error.response.status === 422)
                      this.notificacion(error.response.data.msg,'success');

                    this.dialogo = true;
                })
            },
            dataMotocicleta(data){
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
                console.log(this.Is_motocicleta)
                if (this.Is_motocicleta) {
                    if (this.$refs.FormAgregarRemisionArticulo.validate() && this.$refs.FormAgregarDatosMotocicletaVenta.validate())
                        this.crearVenta()
                }else {
                    if (this.$refs.FormAgregarRemisionArticulo.validate())
                        this.crearVenta()
                }
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
</style>
