<template>
  <v-card>
    <v-card-title class="grey lighten-2">Ingresar Nota de Cédito de Proveedor</v-card-title>
    <v-row no-gutters class="pl-2 pr-2">
      <v-col class="pl-2 pr-2 pt-2 pb-5">
        <v-card>
          <v-card-title>Datos de la Nota</v-card-title>
          <v-divider></v-divider>
          <v-form class="pl-2 pr-2" ref="FormNuevaNotaCreditoProveedor">
            <v-row no-gutters>
              <v-col cols="7" class="pr-2">
                <v-text-field counter v-model="Nota.referencia"
                              :rules="[rule.referencia.req, rule.referencia.max]"
                              label="Referencia de la Nota">
                </v-text-field></v-col>
              <v-col cols="5" class="pl-2">
                <v-text-field label="Total de la Nota" prefix="L"
                              :rules="[rule.referencia.req, rule.total.mayor]"
                              v-model="Nota.total"></v-text-field>
              </v-col>
            </v-row>
            <v-textarea label="Concepto de la Nota" v-model="Nota.concepto"
                        :rules="[rule.referencia.req, rule.concepto.min, rule.concepto.max]"
                        rows="4" counter></v-textarea>
            <v-file-input :rules="[rule.referencia.req]" v-model="Nota.file" label="Nota de Crédito Escaneada"></v-file-input>
            <v-row no-gutters>
              <v-col cols="8">
                <v-radio-group v-model="Nota.tipo" class="d-flex align-center" :mandatory="false">
                  <v-radio label="Enlazar con Devolución" :value="1"></v-radio>
                  <v-radio label="Enlazar con Factura" :value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="4" class="d-flex align-center justify-end">
                <v-btn color="warning" small dark v-if="Nota.tipo === 1" @click="dialogoDevoluciones = true" class="ma-2">Buscar Devolución</v-btn>
                <v-btn color="warning" small dark v-if="Nota.tipo === 2" @click="dialogoFactura = true" class="ma-2">Buscar Factura</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-radio-group label="Cuenta Contable a Acréditar" v-model="Nota.cc" :rules="[rule.referencia.req]">
              <v-radio :value="2161" label="Nota de Crédito por Volumen de Compra - 2161"></v-radio>
              <v-radio :value="2162" label="Nota de Crédito por Garantías - 2162"></v-radio>
              <v-radio :value="2163" label="Nota de Crédito por Devolución de Mercancias - 2163"></v-radio>
            </v-radio-group>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark small @click="validarForm">Registrar Nota</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="pl-2 pr-2 pt-2 pb-5">
        <v-card height="100%">
          <v-card-title>Datos de la Factura</v-card-title>
          <hr>
          <div v-if="Nota.data" class="pl-2 pr-2">
            <v-row no-gutters>
              <v-col cols="4"><small><strong>Proveedor: </strong></small><div class="fontG">
                {{Nota.data.orden_entrada.proveedor.nombre}}
              </div></v-col>
              <v-col cols="5"><small><strong>Sucursal:</strong></small><div class="fontG">
                {{Nota.data.orden_entrada.sucursal.nombre}}
              </div></v-col>
              <v-col cols="3"><small><strong># de Factura:</strong></small><div class="fontG">
                {{Nota.numFactura}}
              </div></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">
                <small><strong>Cuenta Contable:</strong></small><div class="fontG">
                <strong v-if="cc">{{cc.cod_dep}} - {{cc.nombre}}</strong>
                <v-progress-linear indeterminate rounded v-if="loadcc"></v-progress-linear>
              </div>
              </v-col>
              <v-col cols="5">
                <small><strong>Saldo Pendiente:</strong></small><div class="fontG">
                <strong>L {{int.format(Nota.Recalcular.saldoPendiente)}}</strong>
                </div>
              </v-col>
              <v-col cols="3">
                <small><strong>Total de la Factura:</strong></small><div class="fontG">
                <strong>L {{int.format(Nota.Recalcular.totalAntigulo)}}</strong>
              </div>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="4">
                <small><strong>Total de la Cuenta Contable:</strong></small><div class="fontG">
                <strong v-if="cc">L {{int.format(cc.total)}}</strong>
                <v-progress-linear indeterminate rounded v-if="loadcc"></v-progress-linear>
              </div>
              </v-col>
              <v-col cols="5">
                <small><strong>Total de la Nota:</strong></small><div class="fontG">
                <strong>L {{int.format(Nota.total)}}</strong>
              </div>
              </v-col>
              <v-col cols="3">
                <small><strong>Nuevo Saldo:</strong></small><div class="fontG">
                <strong>L {{int.format(Nota.Recalcular.nuevoSaldo)}}</strong>
              </div>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip top>
                  <template v-slot:activator="{on,attrs}">
                    <v-btn color="indigo" v-on="on" @click="recalcularSaldo"
                           v-bind="attrs" small dark>Recalcular</v-btn>
                  </template>
                  <span>Se recalcularán las cuotas pendientes y retrasadas de la factura.</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <b-table :fields="fields2" small class="fontG pt-4" hover striped
                     bordered
                     :sticky-header="true"
                     no-border-collapse
                     responsive="xl"
                     :items="Nota.pagos">
              <template v-slot:head(num_pago)="scope"><div class="text-nowrap"># Pago</div></template>
              <template v-slot:head(total_a_pagar)="scope"><div class="text-nowrap">Total de la Cuota</div></template>
              <template v-slot:head(descripcion)="scope"><div class="text-nowrap">Descripción del Pago de la Factura {{Nota.numFactura}}</div></template>
              <template v-slot:head(total_pagado)="scope"><div class="text-nowrap">Total Pagado de la Cuota</div></template>
              <template v-slot:head(saldo_pendiente)="scope"><div class="text-nowrap">Saldo Pendiente</div></template>
              <template v-slot:head(E_total_a_pagar)="scope"><div class="text-nowrap">Cuota Recalculada</div></template>
              <template v-slot:head(fecha_pago)="scope"><div class="text-nowrap">Fecha de Pago</div></template>
              <template v-slot:cell(total_a_pagar)="scope">L {{int.format(scope.item.total_a_pagar)}}</template>
              <template v-slot:cell(E_total_a_pagar)="scope">
                <b-form-input :disabled="scope.item.per" size="sm" v-model="scope.item.E_total_a_pagar"></b-form-input>
              </template>
              <template v-slot:cell(total_pagado)="scope">L {{int.format(scope.item.total_pagado)}}</template>
              <template v-slot:cell(descripcion)="scope"><small>{{scope.item.descripcion}}</small></template>
              <template v-slot:cell(saldo_pendiente)="scope">L {{int.format(scope.item.saldo_pendiente)}}</template>
              <template v-slot:cell(estado)="scope">
                <v-chip v-if="scope.item.estado === 1" color="orange" dark x-small>Al día</v-chip>
                <v-chip v-else-if="scope.item.estado === 2" color="success" dark x-small>Cancelado</v-chip>
                <v-chip v-else-if="scope.item.estado === 3" color="red" dark x-small>Retrasado</v-chip>
              </template>
            </b-table>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" small dark @click="revisadoPagos">Aprobar Pagos</v-btn>
            </v-card-actions>
          </div>
          <div v-else class="d-flex justify-center align-center">
            <h2>Sin Datos de Factura</h2>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogoDevoluciones">
      <v-card>
        <v-row no-gutters class="grey lighten-2">
          <v-col cols="9" class="d-flex justify-start">
            <v-card-title>Devoluciones</v-card-title>
          </v-col>
          <v-col cols="3" class="d-flex justify-end align-center">
            <b-form-input size="sm" class="ma-2" type="search" v-model="searchDevolucion"
                          placeholder="Buscar ..."></b-form-input>
          </v-col>
        </v-row>
        <div class="pl-2 pr-2 pt-5">
          <b-table :fields="fields" bordered small
                   sticky-header
                   select-mode="single"
                   caption-top
                   selectable
                   class="rowsTable"
                   @row-selected="onRowSelected"
                   no-border-collapse
                   responsive="sm"
                   :filter="searchDevolucion" :items="Devoluciones">
            <template v-slot:table-caption>Devoluciones Pendientes</template>
            <template v-slot:head(codigo)="scope"><div class="text-nowrap">Código de Devolución</div></template>
            <template v-slot:head(orden_entrada.codigo)="scope"><div class="text-nowrap">Orden de Entrada</div></template>
            <template v-slot:head(orden_entrada.proveedor.nombre)="scope"><div class="text-nowrap">Proveedor</div></template>
            <template v-slot:head(orden_entrada.sucursal.nombre)="scope"><div class="text-nowrap">Sucursal de Salida</div></template>
            <template v-slot:head(orden_entrada.factura_proveedor.codigo)="scope"><div class="text-nowrap">Código de Factura</div></template>
            <template v-slot:head(orden_entrada.factura_proveedor.num_factura)="scope"><div class="text-nowrap">Factura del Proveedor</div></template>
            <template v-slot:head(orden_entrada.factura_proveedor.total)="scope"><div class="text-nowrap">Total de la Factura</div></template>
            <template v-slot:head(orden_entrada.factura_proveedor.file_subir)="scope"><div class="text-nowrap">Documentos</div></template>
            <template v-slot:cell(orden_entrada.factura_proveedor.total)="scope">
              L. <strong v-if="scope.item.orden_entrada.factura_proveedor">{{scope.item.orden_entrada.factura_proveedor.total}}</strong>
              <strong v-else>0</strong>
            </template>
            <template v-slot:cell(orden_entrada.factura_proveedor.file_subir)="scope">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.file_subido, 1)"
                         width="25px" color="blue-grey" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Devolución Súbida</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.orden_entrada.file, 1)"
                         width="25px" color="success" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Orden de Entrada</span>
              </v-tooltip>
              <v-tooltip top v-if="scope.item.orden_entrada.factura_proveedor">
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.orden_entrada.factura_proveedor.file_generado, 1)"
                         width="25px" color="light-blue" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Facturada Generada</span>
              </v-tooltip>
              <v-tooltip top v-if="scope.item.orden_entrada.factura_proveedor">
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.orden_entrada.factura_proveedor.file_subir, 1)"
                         width="25px" color="deep-orange" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Factura del Proveedor</span>
              </v-tooltip>
            </template>
          </b-table>
        </div>
        <hr>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" small @click="dialogoDevoluciones = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoFactura">
      <v-card>
        <v-row no-gutters class="grey lighten-2">
          <v-col cols="9" class="d-flex justify-start">
            <v-card-title>Facturas Pendientes</v-card-title>
          </v-col>
          <v-col cols="3" class="d-flex justify-end align-center">
            <b-form-input size="sm" class="ma-2" type="search" v-model="searchFacturas"
                          placeholder="Buscar ..."></b-form-input>
          </v-col>
        </v-row>
        <div class="pl-2 pr-2 pt-5 pb-3">
          <b-table :fields="fieldsFacturas" bordered small
                   sticky-header
                   select-mode="single"
                   caption-top
                   selectable
                   @row-selected="onRowSelectedFacturas"
                   class="rowsTable"
                   no-border-collapse
                   responsive
                   :filter="searchFacturas" :items="Facturas">
            <template v-slot:table-caption>Facturas Pendientes</template>
            <template v-slot:head(num_factura)="scope"><div class="text-nowrap">Número de Factura del Proveedor</div></template>
            <template v-slot:head(codigo)="scope"><div class="text-nowrap">Código de Factura</div></template>
            <template v-slot:head(orden_entrada.codigo)="scope"><div class="text-nowrap">Código de Orden de Entrada</div></template>
            <template v-slot:head(fecha_facturada)="scope"><div class="text-nowrap">Fecha de Facturación</div></template>
            <template v-slot:head(user.usuario)="scope"><div class="text-nowrap">Usuario Creador</div></template>
            <template v-slot:head(orden_entrada.sucursal.nombre)="scope"><div class="text-nowrap">Sucursal de Recicibimiento de Artículos</div></template>
            <template v-slot:head(orden_entrada.proveedor.nombre)="scope"><div class="text-nowrap">Proveedor de Factura</div></template>
            <template v-slot:head(total)="scope"><div class="text-nowrap">Total de Factura</div></template>
            <template v-slot:head(file_generado)="scope"><div class="text-nowrap">Documentos</div></template>
            <template v-slot:head(total_abonado)="scope"><div class="text-nowrap">Total Abonado</div></template>
            <template v-slot:head(fecha_inicio_pago)="scope"><div class="text-nowrap">Fecha del Primer Pago</div></template>
            <template v-slot:head(fecha_limite_pago)="scope"><div class="text-nowrap">Fecha Límite de Cancelación</div></template>
            <template v-slot:cell(total)="scope">
              L. {{scope.item.total}}
            </template>
            <template v-slot:cell(total_abonado)="scope">
              L. {{scope.item.total_abonado}}
            </template>
            <template v-slot:cell(file_generado)="scope">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.file_subir, 2)"
                         width="25px" color="blue-grey" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Factura Súbida</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.file_generado, 2)"
                         width="25px" color="success" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Factura Generada</span>
              </v-tooltip>
              <v-tooltip top >
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark fab height="25px" @click="verDocumento(scope.item.orden_entrada.file, 2)"
                         width="25px" color="light-blue" v-on="on" v-bind="attrs">
                    <v-icon size="15px">fa fa-file-pdf</v-icon></v-btn>
                </template>
                <span>Orden de Entrada</span>
              </v-tooltip>
            </template>
          </b-table>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn dark color="warning" small @click="dialogoFactura = false">Cancelar</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import Swal from "sweetalert2";
  import {ipcRenderer} from "electron";
  export default {
    data(){
      return{
        int: new Intl.NumberFormat(),
        dialogoFactura: false,
        dialogoDevoluciones: false,
        rule: {
          referencia: {
            req: v => !!v || 'Campo requerido',
            max: v => (v && v.length <= 19) || 'Tiene que ser menor o igual a 19 carácteres.',
          },
          total:{
            mayor: v => v > 0 || 'Tiene que ser mayor a 0'
          },
          concepto:{
            min: v => (v && v.length >= 15) || 'Tiene que ser mayor a 15 carácteres.',
            max: v => (v && v.length <= 255) || 'Tiene que ser menor o igual a 255 carácteres.',
          }
        },
        Nota:{
          recalculado: false,
          isRevisado: false,
          devolucion: null,
          concepto: '',
          referencia: '',
          total: 0,
          file: null,
          data: null,
          tipo: 0,
          factura_id: null,
          pagos: [],
          numFactura: null,
          Recalcular:{
            totalAntigulo: 0,
            nuevoSaldo: 0,
            saldoPendiente: 0
          },
          cc:'',
          proveedor_id: '',
          proveedor: '',
          sucursal_id: ''
        },
        Facturas: [],
        searchDevolucion: '',
        searchFacturas: '',
        Devoluciones: [],
        fields:[
          { key: 'codigo', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'orden_entrada.codigo',
          'orden_entrada.factura_proveedor.codigo',
          'orden_entrada.factura_proveedor.num_factura',
          'orden_entrada.proveedor.nombre',
          'orden_entrada.sucursal.nombre',
          'orden_entrada.factura_proveedor.total',
          'orden_entrada.factura_proveedor.file_subir',
        ],
        fields2:[
          { key: 'num_pago', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'descripcion',
          'total_a_pagar',
          'E_total_a_pagar',
          'total_pagado',
          'saldo_pendiente',
          'fecha_pago',
          'estado'
        ],
        fieldsFacturas:[
          { key: 'num_factura', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'codigo',
          'orden_entrada.codigo',
          'fecha_facturada',
          'fecha_inicio_pago',
          'fecha_limite_pago',
          'total',
          'total_abonado',
          'user.usuario',
          'orden_entrada.sucursal.nombre',
          'orden_entrada.proveedor.nombre',
          'file_generado'
        ],
        cc: null,
        loadcc: false,
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Notas de Crédito > Proveedores > Nueva');
      this.$store.commit('activarOverlay', false);
      this.cargarDevoluciones();
      this.cargarFacturasPendientes();
    },
    name: "nuevo",
    methods:{
      asignarPago(pagos){
        this.Nota.pagos = [];
        this.Nota.recalculado = false;
        let estado, per;
        pagos.forEach( (i) => {
          estado = i.estado;
          if (estado == 2 || estado == 4)
            per = true;
          else
            per = false;
          this.Nota.pagos.push({
            "total_a_pagar":   i.total_a_pagar,
            "E_total_a_pagar": i.total_a_pagar,
            "id":              i.id,
            "num_pago":        i.num_pago,
            "descripcion":     i.descripcion,
            "total_pagado":    i.total_pagado,
            "saldo_pendiente": i.saldo_pendiente,
            "fecha_pago":      i.fecha_pago,
            "estado":          estado,
            "per":             per
          })
        })
      },
      cargarCuentaContable(){
        this.loadcc = true;
        this.$store.$axios.post('contabilidad/2.0/busqueda_cc_dep', {
          tabla1:  'proveedors',
          tabla2:  'factura_proveedors',
          id1:     this.Nota.proveedor_id,
          id2:     this.Nota.factura_id,
          cod_dep: 2111
        }).then((res)=>{
          this.cc     = res.data.cc;
          this.loadcc = false;
        })
      },
      cargarDevoluciones(){
        this.$axios.get('devoluciones_proveedor/pendientes',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Devoluciones = res.data.devoluciones;
        })
      },
      cargarFacturasPendientes(){
        this.$axios.get('facturas_proveedor/pendientes',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Facturas = res.data.facturas;
        })
      },
      onRowSelected(items){
        if (items.length > 0 ){
          if (items[0].orden_entrada.factura_proveedor){
            this.dialogoDevoluciones            = false;
            this.Nota.factura_id                = items[0].orden_entrada.factura_proveedor.id;
            this.Nota.numFactura                = items[0].orden_entrada.factura_proveedor.num_factura;
            this.Nota.Recalcular.totalAntigulo  = items[0].orden_entrada.factura_proveedor.total;
            this.Nota.Recalcular.saldoPendiente = items[0].orden_entrada.factura_proveedor.saldo_pendiente;
            this.Nota.data                      = items[0];
            this.Nota.devolucion                = items[0].id;
            this.Nota.proveedor_id              = items[0].orden_entrada.proveedor_id;
            this.Nota.proveedor                 = items[0].orden_entrada.proveedor.nombre;
            this.Nota.sucursal_id               = items[0].orden_entrada.sucursal_id;
            this.asignarPago(items[0].orden_entrada.factura_proveedor.pagos_facturas)
            this.cargarCuentaContable();
          }
        }
      },
      onRowSelectedFacturas(items){
        this.dialogoFactura                 = false;
        this.Nota.factura_id                = items[0].id;
        this.Nota.numFactura                = items[0].num_factura;
        this.Nota.Recalcular.totalAntigulo  = items[0].total;
        this.Nota.Recalcular.saldoPendiente = items[0].saldo_pendiente;
        this.Nota.data                      = items[0];
        this.Nota.proveedor_id              = items[0].orden_entrada.proveedor_id;
        this.Nota.proveedor                 = items[0].orden_entrada.proveedor.nombre;
        this.Nota.sucursal_id               = items[0].orden_entrada.sucursal_id;

        this.asignarPago(items[0].pagos_facturas);
        this.cargarCuentaContable();
      },
      recalcularSaldo(){
        this.Nota.recalculado = true;
        let coutasPendientes = 0,nuevoSaldo = 0, totalCuota= 0;
        nuevoSaldo = (parseFloat(this.Nota.Recalcular.saldoPendiente) - parseFloat(this.Nota.total)).toFixed(2);
        this.Nota.pagos.forEach( (i) => {
          if (i.estado != 2 && i.estado != 4)
            coutasPendientes++
        });
        totalCuota = (parseFloat(nuevoSaldo) / parseInt(coutasPendientes)).toFixed(2);
        this.Nota.Recalcular.nuevoSaldo = nuevoSaldo;
        let saldoResta = nuevoSaldo;
        this.Nota.pagos.forEach( (i) => {
          if (i.estado != 2 && i.estado != 4) {
            i.E_total_a_pagar = totalCuota;
            i.saldo_pendiente = (saldoResta - totalCuota).toFixed(2);
            saldoResta = saldoResta - totalCuota;
          }
        });
      },
      registrarNota(){
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        let pagos = JSON.stringify(this.Nota.pagos);
        //datos de la factura
        data.append('factura_id', this.Nota.factura_id);
        data.append('total_nuevo', this.Nota.Recalcular.nuevoSaldo);
        data.append('pagos', pagos);
        data.append('nombre_proveedor', this.Nota.proveedor);
        //datos de la nota
        data.append('referencia', this.Nota.referencia);
        data.append('total', this.Nota.total);
        data.append('concepto', this.Nota.concepto);
        data.append('file', this.Nota.file);
        data.append('tipo', this.Nota.tipo);
        //datos de la devolucion
        data.append('devolucion_id', this.Nota.devolucion);
        //cc
        data.append('ccProveedor', this.cc.id);
        data.append('ccNota',      this.Nota.cc);
        data.append('sucursal_id',      this.Nota.sucursal_id);
        this.$axios({
          method: 'post',
          url: 'notas_credito',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$router.replace({path:'/contabilidad/notas_credito/proveedor'});
          Swal.fire(
            'Registro Exitoso',
            `Se ha registrado la nota de crédito, el total y los pagos de la factura ${this.Nota.numFactura}
            se han editado exitosamente`,
            'success'
          );
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      revisadoPagos(){
        Swal.fire({
          title: `Verificar Pagos`,
          html: `Los pagos de la factura ${this.Nota.numFactura} se van a editar y guardar con los nuevos pagos que se recalcularon`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Aprobar Pagos`,
          denyButtonText: `Cerrar`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.Nota.isRevisado = true
          }
        })
      },
      validarForm(){
        if (this.$refs.FormNuevaNotaCreditoProveedor.validate() && this.Nota.isRevisado)
          this.registrarNota()
        else{
          Swal.fire(
            'Error en la Validación',
            `No se ha validado el formulario o te hace falta aceptar los pagos modificados.`,
            'error'
          );
        }
      },
      verDocumento(ubicacion, val){
        this.$store.commit('activarOverlay', true);
        if (val === 1)
          this.dialogoDevoluciones = false;
        else
          this.dialogoFactura = false
        this.$axios.post('leer_documento/',{
          ubicacion: ubicacion
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            if (val === 1)
              this.dialogoDevoluciones = true;
            else
              this.dialogoFactura = true
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          if (val === 1)
            this.dialogoDevoluciones = true;
          else
            this.dialogoFactura = true;
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
  .fontG{
    font-family: 'Courier Prime';
    font-size: 11px;
  }
</style>
