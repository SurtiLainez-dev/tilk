<template>
  <v-container>
    <v-card>
      <v-card-title>Registrando Factura</v-card-title>
      <v-divider></v-divider>
      <v-stepper v-model="vista">
        <v-stepper-header>
          <v-stepper-step :complete="vista > 1" step="1">Unir con Orden de Ingreso</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="vista > 2" step="2">Revisión de Artículos</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Condiciones de Pago</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card height="100%" width="100%">
              <v-row>
                <v-col md="6"><v-card-title>Ordenes de Ingreso Pendientes</v-card-title>
                  <v-btn x-small color="orange" dark @click="dialogRemision = true">Buscar Remisión</v-btn>
                </v-col>
                <v-col md="6" class="d-flex justify-end">
                  <v-text-field v-model="search" append-icon="mdi-magnify"
                                label="Buscar orden de ingreso" single-line hide-details></v-text-field>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-radio-group v-model="Factura.select">
                <v-data-table :headers="headerIngresos" :loading="loads.ingresos" :search="search"
                              loading-text="Cargando Ordenes..." :items="OrdenesIngreso" :items-per-page="6">
                  <template v-slot:item.proveedor.nombre="{item}">
                    <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo" alt="John"></v-avatar>
                    <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
                    {{item.proveedor.nombre}}
                  </template>
                  <template v-slot:item.estado="{item}">
                    <v-btn fab x-small @click="fileIngreso(item.id)" width="25px" height="25px" dark color="indigo">
                      <v-icon size="15px">fa fa-eye</v-icon>
                    </v-btn>
                  </template>
                  <template v-slot:item.id="{item}">
                    <v-radio :value="item"></v-radio>
                  </template>
                </v-data-table>
              </v-radio-group>
              <v-divider></v-divider>
              <v-card-actions class="d-flex justify-end">
                <v-btn @click="cuerpoFactura" v-if="Factura.select" color="success" small dark>Continuar</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-row>
              <v-col cols="6">
                <strong>Verificación de Datos</strong>
                <v-btn @click="impuesto.dialogo = true" class="ma-2" color="orange" x-small dark>Crear Impuesto</v-btn>
              </v-col>
              <v-col cols="6" class="d-flex justify-end align-center">
                <v-avatar size="30px"><img :src="Factura.logoProveedor"></v-avatar>
                <strong>{{Factura.nombreProveedor}}</strong>
              </v-col>
            </v-row>
            <v-card height="100%" width="100%">
              <v-form ref="FormValidandoDatosFacturaProveedor">
                <div class="bordes">
                  <v-row class="pl-2 pr-2">
                    <v-col cols="3">
                      <v-text-field disabled v-model="Factura.codIngreso" label="Entrada Asignada"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field v-model="Factura.num" :rules="[rules.mayor.req]" label="Número de Factura" :counter="22"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-dialog ref="dialogFechaRegistroFactura" v-model="Factura.dialogoFechaFacturada" persistent width="290px"
                                :return-value.sync="Factura.fecha_facturada">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="Factura.fecha_facturada" label="Fecha de facturación del proveedor"
                                        readonly :rules="[rules.mayor.req]" v-bind="attrs" v-on="on"></v-text-field>
                        </template>
                        <v-date-picker v-model="Factura.fecha_facturada" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="Factura.dialogoFechaFacturada = false">Cancelar</v-btn>
                          <v-btn text color="primary" @click="$refs.dialogFechaRegistroFactura.save(Factura.fecha_facturada)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-end">
                      <strong>Total de la Factura: L.</strong>{{int.format(Factura.totalFactura)}}
                    </v-col>
                  </v-row>
                </div>
                <div class="bordes">
                  <v-simple-table dense class="rowsTable" height="350px" fixed-header>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Artículo</th>
                        <th>Código</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Descuento</th>
                        <th>Sub-total</th>
                        <th>Impuesto</th>
                        <th>Total</th>
                        <th>Observación</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in Factura.cuerpo">
                        <td width="35%">{{item.articulo}}
                          <br>
                          <small>{{item.descripcion}}</small></td>
                        <td width="10%">{{item.codigo}}</td>
                        <td width="5%">{{item.cantidad}}</td>
                        <td width="10%">
                          <v-text-field v-model="item.precio_unitario" :rules="[rules.mayor.req, rules.mayor.mayor]"
                                        @keyup="sumaTotal(item)" dense></v-text-field>
                        </td>
                        <td width="10%">
                          <v-text-field v-model="item.descuento" @keyup="sumaTotal(item)" :rules="[rules.condicion.igual]"
                                        dense></v-text-field>
                        </td>
                        <td width="10%">
                          <v-text-field disabled v-model="item.sub_total" dense></v-text-field>
                        </td>
                        <td width="5%">
                          <v-select :items="impuesto.Impuestos" @change="leerImpuesto(item)"
                                    v-model="item.imp" :rules="[rules.mayor.req]"></v-select>
                        </td>
                        <td width="10%">
                          <v-text-field disabled v-model="item.total" dense></v-text-field>
                        </td>
                        <td class="d-flex justify-center align-center">
                          <v-btn fab width="25px" height="25px" color="success" dark @click="item.dialogoObs = true">
                            <v-icon size="15px">fa fa-comment-alt</v-icon>
                          </v-btn>
                          <v-dialog v-model="item.dialogoObs" width="30%">
                            <v-card class="pl-5 pr-5">
                              <v-card-title>Observación</v-card-title>
                              <v-textarea :rows="3" v-model="item.observacion" :label="'Observación de '+item.articulo"></v-textarea>
                              <v-card-actions class="d-flex justify-end">
                                <v-btn small dark color="orange" @click="item.dialogoObs = false">Aceptar</v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <br>
                <v-row no-gutters>
                  <v-col cols="8">
                    <v-checkbox label="Seleccionar si viene un cargo por flete"
                                v-model="flete.is" dense class="ma-2"></v-checkbox>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field class="ma-2" dense :disabled="!flete.is"
                                  label="Total del Flete" v-model="flete.total" suffix="lps"></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="8">
                  </v-col>
                  <v-col cols="4">
                    <v-text-field class="ma-2" dense :disabled="Factura.is_descuento" @change="habilitarDescuento"
                                  label="Total del Descuento" v-model="Factura.decuento" suffix="lps"></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions>
                  <v-row>
                    <v-col class="d-flex justify-start">
                      <v-btn class="ma-2" @click="vista = 1" color="orange" small dark>Volver</v-btn></v-col>
                    <v-col class="d-flex justify-end">
                      <v-btn class="ma-2" @click="vistaPago" color="success" small dark>Condiciones de Pago</v-btn></v-col>
                  </v-row>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-row>
              <v-col cols="6" class="d-flex align-center">
                <strong>Condiciones de Pago</strong>
              </v-col>
              <v-col cols="6" class="d-flex justify-end">
                <v-btn @click="dialogoTipoFactura" class="ma-2" color="success" fab x-small dark>
                  <v-icon>fa fa-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-card class="pl-2 pr-2" width="100%" height="100%">
              <div class="bordes pl-3 pr-3">
                <v-form ref="FormVerificarPagosFacturas1">
                  <v-row>
                    <v-col cols="3">
                      <v-autocomplete :items="TipoFactura.Tipos" v-model="Factura.tipo" :item-text="'nombre'"
                                      label="Tipo de Factura" :item-value="'id'" :rules="[rules.mayor.req]">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="3">
                      <v-autocomplete :items="opcionesPagos" v-model="Factura.formaPago"
                                      label="Tipo de Pago" :rules="[rules.mayor.req]"></v-autocomplete>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-start">
                      <v-btn @click="crearPagos" dark small color="indigo">Generar Pagos</v-btn>
                    </v-col>
                    <v-col cols="3" class="d-flex justify-end align-center">
                      <h2><strong>Total: L.</strong>{{int.format(Factura.totalFactura.toFixed(2))}}</h2>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <div class="bordes">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>Descripción</th>
                      <th>Fecha de Pago</th>
                      <th>Total a Pagar</th>
                      <th>Total Abonado</th>
                      <th>Nuevo Saldo</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in Factura.pagosGenerados">
                      <td>{{item.numPago}}</td>
                      <td>{{item.descripcion}}</td>
                      <td>
                        <v-menu v-model="item.dialogo" :close-on-content-click="false"
                                :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="item.fecha_pago" readonly
                                          v-bind="attrs" v-on="on"></v-text-field>
                          </template>
                          <v-date-picker v-model="item.fecha_pago"  @input="reajutarFecha(index, item)"></v-date-picker>
                        </v-menu>
                      </td>
                      <td>L. {{item.total_a_pagar}}</td>
                      <td>L. {{item.total_pagado}}</td>
                      <td>L. {{item.saldo_pendiente}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
              <div class="bordes pl-3 pr-3">
                <v-textarea rows="2" v-model="Factura.observacion" label="Comentario de Partida"></v-textarea>
              </div>
              <v-card-actions>
                <v-row>
                  <v-col class="d-flex justify-start">
                    <v-btn class="ma-2" @click="vista = 2" color="orange" small dark>Volver</v-btn></v-col>
                  <v-col class="d-flex justify-end">
                    <v-btn class="ma-2" color="success" @click="subirFactura" small dark>Registrar Factura</v-btn></v-col>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>

    <v-dialog v-model="TipoFactura.dialogo" width="50%">
      <v-card class="pl-5 pr-5">
        <v-card-title>Creando Tipo de Facturas</v-card-title>
        <hr>
        <v-form ref="FormNuevoTipodeFactura">
          <v-row>
            <v-col cols="8">
              <v-text-field label="Nombre" v-model="TipoFactura.nombre"
                            :rules="[rules.mayor.req, rules.nombre.min, rules.nombre.max]"
                            :counter="50"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field :rules="[rules.mayor.req, rules.condicion.min]"
                            v-model="TipoFactura.pagos" label="Cantidad de Pagos"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" small dark @click="creandoTipoFactura">Registrar Tipo de Factura</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="Factura.dialogoEviar" width="35%">
      <v-card class="pl-5 pr-5">
        <v-card-title>Verificación de vencimiento de la Factura</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          La factura que acabas de ingresar vencerá dentro de {{Factura.dias}} días, el primer pago
          de la factura se debe realizar el {{Factura.primerPago}}.
          Para poder avanzar con el registro de la factura tienes que subir la factura escaneada en pdf.
        </v-card-text>
        <v-form ref="FormNuevaFacturaProveedor">
          <v-file-input accept="application/pdf" v-model="Factura.File"
                        :rules="[rules.mayor.req]" label="Factura Escaneada"></v-file-input>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" dark small @click="Factura.dialogoEviar = false">Cerrar</v-btn>
            <v-btn color="success" dark small @click="verificarForm">Registrar Factura</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="impuesto.dialogo" width="40%">
      <v-card class="pl-5 pr-5">
        <v-card-title>Creando Impuesto</v-card-title>
        <v-divider></v-divider>
        <v-form ref="FormNuevoImpuesto">
          <v-row>
            <v-col cols="8">
              <v-text-field :rules="[rules.mayor.req, rules.mayor.mayor]" v-model="impuesto.nombre"
                            :counter="50" label="Nombre del Impuesto"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field :rules="[rules.mayor.req, rules.condicion.min]"
                            v-model="impuesto.porcentaje" label="Porcebtaje" suffix="%"></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2" small color="orange" dark @click="impuesto.dialogo = false">Cerrar</v-btn>
            <v-btn class="ma-2" small color="success" dark @click="crearImpuesto">Crear Impuesto</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogRemision" width="100%">
      <v-card class="pl-5 pr-5 pt-5">
        <v-row>
          <v-col cols="6"><v-card-title>Buscar por Guía de Remision o Motocicleta</v-card-title></v-col>
          <v-col cols="6">
            <v-text-field v-model="searchRemison" append-icon="mdi-magnify"
                          label="Buscar" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="headerRemision" @click:row="verificarIgualOrden" class="rowsTable"
                      :items="Guias" :search="searchRemison" :items-per-page="5" item-key="id">
          <template v-slot:item.file="{item}">
            <v-btn color="red" fab dark x-small @click="verGuiaRemision(item.file)">
              <v-icon>fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <template v-slot:item.id="{item}" >
            <v-checkbox v-model="item.estado"></v-checkbox>
          </template>
        </v-data-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark class="ma-2" small @click="dialogRemision = false">Cerrar</v-btn>
          <v-btn color="success" dark class="ma-2" small @click="cuerpoFacturaRemision">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron';
  import Swal from 'sweetalert2'
  export default {
    name: "registrar",
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Facturas > Proveedor > Registar');
      this.$store.commit('activarOverlay', false);
    },
    data(){
      return{
        flete:{
          is: false,
          total: 0
        },
        int: new Intl.NumberFormat(),
        headerRemision:[
          {text:'Chasis', value:'chasis'},
          {text:'Motor', value:'motor'},
          {text:'Color', value:'color'},
          {text:'Proveedor', value:'proveedor'},
          {text:'Orden de Entrada', value:'codigo_orden'},
          {text:'Ver', value:'file'},
          {text:'Seleccionar', value:'id'},
        ],
        dialogRemision: false,
        searchRemison: '',
        impuesto:{
          dialogo: false,
          nombre:  '',
          porcentaje: 0,
          Impuestos: []
        },
        FECHA_AC: new  Date(),
        FECHA: new Date(),
        opcionesPagos:[
          {text:'Cada 15', value:1},
          {text:'Cada fin de més', value:2},
          {text:'Pagado hoy', value:3},
          {text:'Fin del més, a partir del més siguiente', value:4},
        ],
        rules:{
          nombre:{
            max: v => v.length < 50 || 'No puede ser mayor a 50 carácteres',
            min: v => v.length > 5  || 'Tiene que ser mayor a 5 carácteres'
          },
          condicion:{
            min: v => v > 0 || 'Tiene que ser mayor a 0',
            igual: v => v >= 0 || 'no tiene que ser menor a cero'
          },
          mayor:{
            req: v => !!v || 'Campo requerido',
            mayor: v => v > 0 || 'Invalido',
          }
        },
        loads:{
          ingresos: true,
        },
        search:'',
        searchC: '',
        headerIngresos:[
          {text:'Tipo de Entrada', value:'tipo_entrada_articulo.nombre'},
          {text:'Código', value:'codigo'},
          {text:'Sucursal de Entrada', value:'sucursal.nombre'},
          {text:'Proveedor', value:'proveedor.nombre'},
          {text:'Ver', value:'estado'},
          {text:'Seleccionar', value:'id'},
        ],
        vista: 1,
        OrdenesIngreso: [],
        OrdenesCompra: [],
        Factura:{
          is_descuento: false,
          decuento: 0,
          proveedor_id: null,
          isRemision:  false,
          File: null,
          dialogoEviar: false,
          nombreProveedor: '',
          logoProveedor: '',
          select: null,
          ingreso: 0,
          codIngreso: '',
          num:'',
          dialogoFechaFacturada: false,
          fecha_facturada: '',
          tipoFactura: 0,
          pagos: 0,
          totalFactura: 0,
          cuerpo: [],
          pagosGenerados: [],
          formaPago: 0,
          tipo: 0,
          dias: 0,
          primerPago: '',
          ultimoPago: '',
          observacion: 'SC',
          sucursal:    ''
        },
        TipoFactura:{
          dialogo: false,
          nombre: '',
          pagos: 1,
          Tipos: [],
          load: true
        },
        Pagos:{
          cuota: 0,
          totalNuevo: 0
        },
        Guias:[]
      }
    },
    methods:{
      calcularMensual(){
        let SALDO = this.Factura.totalFactura;
        let FECHA = this.FECHA;
        console.log(FECHA)
        let dia = new Date(FECHA.getFullYear(), FECHA.getMonth() + 1, 0).getDate();
        for (let i = 0; i < this.Factura.pagos; i++){
          SALDO = (SALDO - this.Pagos.cuota).toFixed(2);
          if (SALDO < 0)
            SALDO = 0
          this.Factura.pagosGenerados.push({
            "descripcion": 'Pago #'+(parseInt(i) + parseInt(1))+' de factura: '+this.Factura.num+', a '+this.Factura.nombreProveedor+'.',
            "numPago": parseInt(i)+ 1,
            "total_a_pagar": this.Pagos.cuota,
            "total_pagado": 0,
            "saldo_pendiente": SALDO,
            "fecha_pago": FECHA.getFullYear()+'-'+(FECHA.getMonth() + 1)+'-'+dia,
            "dialogo": false,
            "estado":  1
          })
          if (this.Factura.primerPago.length === 0)
            this.Factura.primerPago = FECHA.getFullYear()+'-'+(FECHA.getMonth()+ 1)+'-'+dia
          this.Factura.ultimoPago = new Date(FECHA.getFullYear(),FECHA.getMonth(),dia)
          FECHA.setMonth(FECHA.getMonth() + 1)
          dia = new Date(FECHA.getMonth(), FECHA.getMonth() + 1, 0).getDate()
        }
      },
      calcularMensualDespues(){
        let SALDO = this.Factura.totalFactura;
        let FECHA = this.FECHA;
        let dia = new Date(FECHA.getMonth(), FECHA.getMonth(), 0).getDate()
        for (let i = 0; i < this.Factura.pagos; i++){
          SALDO = (SALDO - this.Pagos.cuota).toFixed(2);
          if (SALDO < 0)
            SALDO = 0

          FECHA.setMonth(FECHA.getMonth() + 1)
          dia = new Date(FECHA.getMonth(), FECHA.getMonth() + 1, 0).getDate()

          this.Factura.pagosGenerados.push({
            "descripcion": 'Pago #'+(parseInt(i) + parseInt(1))+' de factura: '+this.Factura.num+', a '+this.Factura.nombreProveedor+'.',
            "numPago": parseInt(i)+ 1,
            "total_a_pagar": this.Pagos.cuota,
            "total_pagado": 0,
            "saldo_pendiente": SALDO,
            "fecha_pago": FECHA.getFullYear()+'-'+(FECHA.getMonth() + 1)+'-'+dia,
            "dialogo": false,
            "estado":  1
          })
          if (this.Factura.primerPago.length === 0)
            this.Factura.primerPago = FECHA.getFullYear()+'-'+(FECHA.getMonth() + 1)+'-'+dia
          this.Factura.ultimoPago = new Date(FECHA.getFullYear(),FECHA.getMonth(),dia)
        }
      },
      calcularQuincena(){
        let MES_ACTUAL = this.FECHA.getMonth();
        let DIA_ACTUAL = this.FECHA.getDate();
        let SALDO = this.Factura.totalFactura;
        let PRIMER_FECHA = new Date(this.FECHA.getFullYear(),MES_ACTUAL, 15)
        if (DIA_ACTUAL >= 14)
          PRIMER_FECHA.setMonth(PRIMER_FECHA.getMonth() + 1)
        for (let i = 0; i < this.Factura.pagos; i++){
          SALDO = (SALDO - this.Pagos.cuota).toFixed(2);
          if (SALDO < 0)
            SALDO = 0
          this.Factura.pagosGenerados.push({
            "descripcion": 'Pago #'+(parseInt(i) + parseInt(1))+' de factura: '+this.Factura.num+', a '+this.Factura.nombreProveedor+'.',
            "numPago": parseInt(i)+ 1,
            "total_a_pagar": this.Pagos.cuota,
            "total_pagado": 0,
            "saldo_pendiente": SALDO,
            "fecha_pago": PRIMER_FECHA.getFullYear()+'-'+(PRIMER_FECHA.getMonth() + 1)+'-'+PRIMER_FECHA.getDate(),
            "dialogo": false,
            "estado": 1
          })
          if (this.Factura.primerPago.length === 0)
            this.Factura.primerPago = PRIMER_FECHA.getFullYear()+'-'+(PRIMER_FECHA.getMonth() + 1)+'-'+PRIMER_FECHA.getDate()
          this.Factura.ultimoPago = new Date(PRIMER_FECHA.getFullYear(),PRIMER_FECHA.getMonth(),PRIMER_FECHA.getDate())
          PRIMER_FECHA.setMonth(PRIMER_FECHA.getMonth() + 1)
        }
      },
      cargarGuias(){
        let Guias = [];
        this.$axios.get('motocicletas_pendiente_facturacion',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            console.log(res.data)
            res.data.guias.forEach( (i) => {
              if (i.guia_remision){
                i.guia_remision.motocicletas.forEach( (a) =>{
                  if (a.facturado === 0){
                    Guias.push({
                      "remision_id":          i.guia_remision.id,
                      "orden":                i.cuerpo_orden_entradas[0].orden_entrada_id,
                      "codigo_orden":         i.codigo,
                      "motor":                a.motor,
                      "chasis":               a.chasis,
                      "color":                a.color,
                      "moto_id":              a.id,
                      "file":                 i.file,
                      "orden_entrada_id":     i.id,
                      "proveedor":            i.proveedor.nombre,
                      "logo":                 i.proveedor.logo,
                      "articulo_id":          i.cuerpo_orden_entradas[0].articulo.id,
                      "articulo_descripcion": i.cuerpo_orden_entradas[0].articulo.nombre_articulo+' - '+a.chasis,
                      "articulo_nombre":      i.cuerpo_orden_entradas[0].articulo.descripcion_corta,
                      "codigo":               i.cuerpo_orden_entradas[0].articulo.codigo_sistema,
                      "estado":               false,
                      "proveedor_id":         i.proveedor.id,
                      "sucursal_id":          i.sucursal_id
                    })
                  }
                })
              }
            })
            this.Guias = Guias
          }
        })
      },
      cargarImpuestos(){
        this.$axios.get('impuestos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            res.data.impuestos.forEach( (i) => {
              this.impuesto.Impuestos.push({
                "text": i.nombre,
                "value"    : i.id+'-'+i.porcentaje
              })
            })
          }
        })
      },
      cargarTipoFacturas(){
        this.TipoFactura.load = true
        this.$axios.get('tipo_facturas',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            res.data.tipos.forEach( (i) =>{
              this.TipoFactura.Tipos.push({
                "nombre": i.nombre,
                "id"    : i.id+'-'+i.cantidad_pagos
              })
            })
            this.TipoFactura.load = false
          }
        })
      },
      crearImpuesto(){
        if (this.$refs.FormNuevoImpuesto.validate()){
          this.impuesto.dialogo = false
          this.$store.commit('activarOverlay', true);
          this.$axios.post('impuestos',{
            nombre:     this.impuesto.nombre,
            porcentaje: this.impuesto.porcentaje
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.cargarImpuestos()
              this.$store.commit('activarOverlay', false);
              Swal.fire(
                  'Registro Exitoso',
                  `Se registro exitosamente el impuesto ${this.impuesto.nombre}.`,
                  'success'
              );
            }
          })
        }
      },
      crearPagos(){
        this.Factura.primerPago = ''
        this.FECHA =  new Date();
        this.Factura.pagosGenerados = []
        let FORMA_PAGO = this.Factura.formaPago;
        if (this.$refs.FormVerificarPagosFacturas1.validate()){
          this.Factura.pagos        = this.Factura.tipo.split('-')[1];
          this.Factura.tipoFactura  = this.Factura.tipo.split('-')[0];
          this.Pagos.cuota          = (this.Factura.totalFactura / this.Factura.pagos).toFixed(2);
          switch (FORMA_PAGO) {
            case 1:
              this.calcularQuincena();
              break;
            case 2:
              this.calcularMensual();
              break;
            case 3:
              this.Factura.pagosGenerados.push({
                "descripcion": "Pago único de factura: "+this.Factura.num+" a "+this.Factura.nombreProveedor,
                "numPago": 1,
                "total_a_pagar": this.Factura.totalFactura,
                "total_pagado": 0,
                "saldo_pendiente": 0,
                "fecha_pago": `${this.FECHA.getFullYear()}-${this.FECHA.getMonth() + 1}-${this.FECHA.getDate()}`,
                "dialogo": false,
                "estado": 1
              })
              if (this.Factura.primerPago.length === 0)
                this.Factura.primerPago = this.FECHA.getFullYear()+'-'+(this.FECHA.getMonth() + 1)+'-'+this.FECHA.getDate()
              this.Factura.ultimoPago = new Date(this.FECHA.getFullYear(),this.FECHA.getMonth(),this.FECHA.getDate())
              break;
            case 4:
              this.calcularMensualDespues();
              break;
          }
        }
      },
      creandoTipoFactura(){
        if (this.$refs.FormNuevoTipodeFactura.validate()){
          this.$store.commit('activarOverlay', true);
          this.TipoFactura.dialogo = false
          this.$axios.post('tipo_facturas',{
            nombre: this.TipoFactura.nombre,
            pagos:  this.TipoFactura.pagos
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              Swal.fire(
                  'Registro Exitoso',
                  `Se registro exitosamente el tipo de factura ${this.TipoFactura.nombre}.`,
                  'success'
              );
              this.cargarTipoFacturas();
              this.$store.commit('activarOverlay', false);
              this.TipoFactura.nombre = ''
              this.TipoFactura.pagos  = 1
            }
          })
        }
      },
      //se crea el cuerpo de la factura
      cuerpoFactura(){
        this.Factura.isRemision = false
        this.Factura.cuerpo = []
        this.$store.commit('activarOverlay', true);
        this.Factura.select.cuerpo_orden_entradas.forEach( (i) => {
          this.Factura.cuerpo.push({
            "articulo_id":     i.articulo_id,
            "articulo":        i.articulo.nombre_articulo,
            "descripcion":     i.articulo.descripcion_corta,
            "codigo":          i.articulo.codigo_sistema,
            "cantidad":        i.cantidad,
            "precio_unitario": 0,
            "sub_total":       0,
            "impuesto":        0,
            "impuesto_id":     0,
            "imp":             0,
            "total":           0,
            "observacion":     '',
            "dialogoObs":      false,
            "motocicleta_id":  0,
            "guia_remision":   0,
            "descuento":       0
          })
        });
        console.log(this.Factura.select)
        this.Factura.logoProveedor   = this.Factura.select.proveedor.logo;
        this.Factura.proveedor_id    = this.Factura.select.proveedor.id;
        this.Factura.nombreProveedor = this.Factura.select.proveedor.nombre;
        this.Factura.ingreso         = this.Factura.select.id;
        this.Factura.codIngreso      = this.Factura.select.codigo;
        this.Factura.sucursal        = this.Factura.select.sucursal_id;
        this.$store.commit('activarOverlay', false);
        this.vista = 2;
      },
      cuerpoFacturaRemision(){
        this.Factura.isRemision = true
        this.Factura.cuerpo = []
        this.Guias.forEach( (i) => {
          if (i.estado === true){
            console.log(i)
            this.Factura.codIngreso      = i.codigo_orden;
            this.Factura.logoProveedor   = i.logo;
            this.Factura.nombreProveedor = i.proveedor;
            this.Factura.ingreso         = i.orden;
            this.Factura.proveedor_id    = i.proveedor_id;
            this.Factura.sucursal        = i.sucursal_id;
            this.Factura.cuerpo.push({
              "articulo_id":     i.articulo_id,
              "articulo":        i.articulo_nombre,
              "descripcion":     i.articulo_descripcion,
              "codigo":          i.codigo,
              "cantidad":        1,
              "precio_unitario": 0,
              "sub_total":       0,
              "impuesto":        0,
              "impuesto_id":     0,
              "total":           0,
              "observacion":     '',
              "dialogoObs":      false,
              "motocicleta_id":  i.moto_id,
              "guia_remision":   i.remision_id
            });
            this.$store.commit('activarOverlay', false);
            this.dialogRemision = false;
            this.vista = 2;
          }
        })
      },
      dialogoTipoFactura(){
        this.TipoFactura.dialogo = true
      },
      fileIngreso(id){
        this.$store.commit('activarOverlay', true);
        this.$axios.get('orden_entrada/print/'+id,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        })
      },
      habilitarDescuento(){
        if (this.Factura.decuento === '')
          this.Factura.decuento = 0;

        if (!this.Factura.is_descuento){
          let cantidad  = this.Factura.cuerpo.reduce((total,i)=> total + i.cantidad, 0);
          let descuento = (this.Factura.decuento/cantidad).toFixed(2);
          this.Factura.cuerpo.forEach((i)=>{
            i.descuento = descuento;
            i.sub_total = (i.cantidad * (i.precio_unitario - descuento)).toFixed(2);
            i.total     = (i.sub_total * (parseFloat(i.impuesto) + parseFloat(1))).toFixed(2);
          });
          this.Factura.totalFactura = this.Factura.totalFactura - this.Factura.decuento;
        }
      },
      leerImpuesto(item){
        item.impuesto_id = item.imp.split('-')[0];
        item.impuesto    = item.imp.split('-')[1];
        this.sumaTotal(item)
      },
      reajutarFecha(index, item){
        let long = this.Factura.pagosGenerados.length;
        if (index === 0){
          this.Factura.primerPago = item.fecha_pago
        }
        if (long === (parseInt(1) + parseInt(index))){
          this.Factura.ultimoPago = new Date(item.fecha_pago.split('-')[0],(parseInt(item.fecha_pago.split('-')[1]) - parseInt(1)), item.fecha_pago.split('-')[2])
        }
        item.dialogo = false
      },
      registrarFactura(){
        this.Factura.dialogoEviar = false
        let cuerpoFactura  = JSON.stringify(this.Factura.cuerpo);
        let pagosGenerados = JSON.stringify(this.Factura.pagosGenerados);
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append("orden_entrada_id",   this.Factura.ingreso);
        data.append("proveedor_id",       this.Factura.proveedor_id);
        data.append("tipo_factura_id" ,   this.Factura.tipoFactura);
        data.append("num_factura",        this.Factura.num);
        data.append("fecha_facturada",    this.Factura.fecha_facturada);
        data.append("total",              this.Factura.totalFactura);
        data.append("fecha_limite_pago",  this.Factura.ultimoPago.getFullYear()+'-'+(this.Factura.ultimoPago.getMonth()+ 1)+'-'+this.Factura.ultimoPago.getDate());
        data.append("fecha_inicio_pago",  this.Factura.primerPago);
        data.append("file_subir",         this.Factura.File);
        data.append("observacion",        this.Factura.observacion);
        data.append("cuerpo",             cuerpoFactura);
        data.append("pagos",              pagosGenerados);
        data.append("remision",           this.Factura.isRemision);
        data.append("sucursal",           this.Factura.sucursal);
        data.append("is_flete",           this.flete.is);
        data.append("flete",              this.flete.total);
        data.append("descuento",              this.Factura.decuento);
        this.$axios({
          method: 'post',
          url: '/facturas_proveedor',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          if (res.status === 200){
            this.$router.replace({path:'/contabilidad/facturas/proveedor/'})
            this.$store.commit('activarOverlay', false);
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente la factura ${this.Factura.num}.`,
                'success'
            );
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          Swal.fire(
              'Hubo un error en el servidor',
              `La factura ${this.Factura.num} no se pudo regstrar correctamente.`,
              'error'
          );
        })
      },
      subirFactura(){
        if (this.$refs.FormVerificarPagosFacturas1.validate() && this.Factura.pagosGenerados.length > 0){
          let tiempo = this.Factura.ultimoPago.getTime() - this.FECHA_AC.getTime();
          this.Factura.dias = Math.floor(tiempo / (1000 * 60 * 60 * 24));
          this.Factura.dialogoEviar = true
        }
      },
      sumaTotal(item){
        let total      = 0;
        item.sub_total = (item.cantidad * (item.precio_unitario -  item.descuento)).toFixed(2)
        if (item.impuesto > 0 ){
          this.Factura.decuento = 0;
          item.total     = (item.sub_total * (parseFloat(item.impuesto) + parseInt(1))).toFixed(2)
          this.Factura.cuerpo.forEach( (i) => {
            total = parseFloat(i.total) + parseFloat(total);
            this.Factura.totalFactura = total;
            this.Factura.decuento     = parseFloat(this.Factura.decuento) + (i.descuento * i.cantidad);
          });

          this.Factura.decuento = this.Factura.decuento.toFixed(2);
          if (this.Factura.decuento > 0) {
            this.Factura.is_descuento = true;
          }else {
            this.Factura.is_descuento = false;
            this.Factura.descuento = 0;
          }
        }
      },
      verGuiaRemision(file){
        this.dialogRemision = false
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: file
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
            this.dialogRemision = true
          }
        })
      },
      verificarForm(){
        if (this.$refs.FormNuevaFacturaProveedor.validate())
          this.registrarFactura()
      },
      verificarIgualOrden(data){
        data.estado = !data.estado
        this.Guias.forEach( (i) => {
          if (i.estado === true){
            if (i.orden !== data.orden){
              Swal.fire(
                'Selección Erronea',
                `La mototicleta que haz seleccionado no concuerda con la orden en entrada que ya estan seleccionadas`,
                'error'
              );
              data.estado = false
            }else{
              data.estado = true
            }
          }
        })
      },
      vistaPago(){
        if (this.$refs.FormValidandoDatosFacturaProveedor.validate()){
          if (!this.flete.is)
            this.flete.total = 0;
          this.Factura.totalFactura = parseFloat(this.Factura.totalFactura) + parseFloat(this.flete.total);
          this.vista = 3
        }
      }
    },
    async fetch (){
      this.OrdenesIngreso  = (await this.$axios.get('ordenes_entradas_pendientes', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.ordenes
      this.loads.ingresos = false
      this.cargarGuias();
      this.cargarImpuestos();
      this.cargarTipoFacturas()
    }
  }
</script>

<style scoped>
.bordes{
  border: solid 1px #000;
}
.rowsTable{
  cursor: pointer;
}

</style>
