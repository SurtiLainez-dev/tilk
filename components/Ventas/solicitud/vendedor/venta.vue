<template>
    <v-card :disabled="!EstadoVista" class="pr-2 pl-2 pb-2 pt-2" flat>
        <h5>Venta</h5>
        <hr>
<!--        <v-card-actions class="d-flex justify-end">-->
<!--            <v-tooltip top v-for="item in Documentos">-->
<!--                <template v-slot:activator="{on, attrs}">-->
<!--                    <v-btn class="text-white ma-1" @click="accionDocumentos(item.val)"-->
<!--                           v-on="on" v-bind="attrs"-->
<!--                           x-small fab :color="item.color">-->
<!--                        <v-icon>{{item.icon}}</v-icon>-->
<!--                    </v-btn>-->
<!--                </template>-->
<!--                <span>{{item.tooltip}}</span>-->
<!--            </v-tooltip>-->
<!--        </v-card-actions>-->
        <v-stepper v-model="SECC" >
            <v-stepper-header>
                <v-stepper-step :complete="SECC > 1" step="1">
                    Datos del Artículo
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="SECC > 2" step="3">
                    Descarga de documentos
                </v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step step="3">
                    Subida de documentos
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
                                <v-btn v-else x-small color="red" text dark>Stock nuevo: {{statusArticulo.stock_reingreso}}</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex align-center"> <v-card-title>Datos del artículo</v-card-title></v-col>
                            <v-col class="d-flex justify-end align-center ma-2">
                                <v-btn x-small color="red" class="ma-2" dark>Declinar Solicitud</v-btn>
                                <v-btn x-small :disabled="!Is_motocicleta" color="success" class="text-white ma-2">
                                    Buscar motocicleta</v-btn>
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
                            <v-row v-if="Is_motocicleta" no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" label="Chasis"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="ma-2" label="Motor"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row v-if="Is_motocicleta" no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" label="Serie del fabricante"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="ma-2" label="Color"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row v-if="Is_motocicleta" no-gutters>
                                <v-col>
                                    <v-text-field class="ma-2" label="Cilindraje"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field class="ma-2" label="Año"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                        <small class="pl-5">Regalias</small>
                        <br>
                        <b-link @click="dialogoBuscarInventario = true" class="pl-5">Agregar regalias</b-link>
                        <v-card-actions class="d-flex justify-end">
                            <v-btn small color="success" class="text-white ma-2" @click="validarFormCrearVenta">Registrar Venta</v-btn>
                            <v-btn small color="indigo" class="text-white ma-2" :disabled="!Envios.articulo">Siguiente</v-btn>
                        </v-card-actions>
                        <pre>{{Soli.articulo.stock_articulos}}</pre>
                    </v-card>
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
                              :headers="header" :loading="isPeticon">
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
    </v-card>
</template>

<script>
    import {ipcRenderer} from "electron";
    export default {
        name: "venta",
        computed:{
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
                statusArticulo:{
                    existe: false,
                    stock_nuevo: 0,
                    stock_reingreso: 0
                },
                hints: true,
                search:'',
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
                Envios:{
                    articulo: false
                },
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
                        {text:'Contador',val:1},
                        {text:'Crédito',val:2},
                    ]
                },
                AArticulo:{
                    color: 'Cafe',
                    serie: 'HEDE###ED'
                },
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
                Is_motocicleta: false,
                SECC: 1,
                rule: {
                    serie: {
                        req: v => !!v || 'Campo requerido',
                        min: v => (v && v.length >= 3) || 'Tiene que ser mayor o igual a 3 carácteres.',
                    },
                },
                dialogoBuscarInventario: false,
                tooltip_open: false,
                load_tooltip: false,
                tooltip_data: {
                    nombre: '',
                    precio: 0
                }
            }
        },
        created() {
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
            })
        },
        methods:{
            accionDocumentos(tipo){
                if (tipo === 1)
                    this.printContratoMotocicleta()
            },
            crearVenta(){
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

                this.$axios.post('venta',{
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
                    financiamiento:              this.Soli.saldo_financiar,
                    tasa_anual:                  this.Soli.tasa
                }).then((res)=>{

                })
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
            validarFormCrearVenta(){
                if (this.$refs.FormAgregarRemisionArticulo.validate())
                    this.crearVenta()
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

</style>
