<template>
<v-card>
  <v-toolbar flat color="grey lighten-4">
    <h5>Agregando Cuenta</h5>
  </v-toolbar>

  <v-form ref="FormNuevaCuentaManual">
    <v-card-text>Datos del Cliente</v-card-text>
    <v-row no-gutters class="ma-5">
      <v-col>
        <v-text-field class="ma-1" v-model="data.cliente.identidad"
                      @keyup.enter="cargarCliente" loader-height="4"
                      :rules="[rules.select.req, rules.identidad.some, rules.identidad.id]"
                      :loading="load.identidad" dense outlined label="Identidad del Cliente"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-1" v-model="data.cliente.nombres"
                      :disabled="!data.disabled.cliente":rules="[rules.select.req]"
                      dense outlined label="Nombres del Cliente"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-1" v-model="data.cliente.apellidos"
                      :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                      dense outlined label="Apellidos del Cliente"></v-text-field>
      </v-col>
      <v-col>
        <v-select class="ma-1" v-model="data.cliente.sexo"
                  :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                  dense :items="SelectSexos" outlined label="Sexo del Cliente"></v-select>
      </v-col>
      <v-col>
        <v-text-field class="ma-1" v-model="data.cliente.nacionalidad"
                      :disabled="!data.disabled.cliente" :rules="[rules.select.req]"
                      dense label="Nacionalidad" outlined></v-text-field>
      </v-col>
    </v-row>

    <v-card flat :disabled="!data.disabled.cuerpo">
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            Direcciones
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table dense class="rowsTable">
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Municipio</th>
                  <th>Ciudad/Aldea/Caserio</th>
                  <th>Colonia</th>
                  <th>Dirección Completa</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.direcciones">
                  <td>
                    <v-select v-model="item.departamento" :rules="[rules.select.req]"
                              @change="cargarMunicipio(item)" outlined dense
                              :disabled="item.key < logns.direcciones"
                              :items="DEPARTAMENTOS" :item-text="'nombre'" :item-value="'id'">
                    </v-select>
                  </td>
                  <td>
                    <v-autocomplete :items="item.Municipios" v-model="item.municipio"
                                    :disabled="item.key < logns.direcciones"
                                    :rules="[rules.select.req]" dense
                                    :item-text="'nombre'" :item-value="'id'" outlined
                                    @change="cargarCiudades(item)">
                    </v-autocomplete>
                  </td>
                  <td>
                    <v-autocomplete :items="item.Ciudades" v-model="item.ciudad"
                                    :disabled="item.key < logns.direcciones"
                                    :rules="[rules.select.req]" outlined
                                    @change="cargarColonias(item)" dense
                                    :item-text="'nombres'" :item-value="'id'">
                    </v-autocomplete>
                  </td>
                  <td>
                    <v-autocomplete :items="item.Colonias" :rules="[rules.select.req]"
                                    v-model="item.colonia" outlined
                                    :disabled="item.key < logns.direcciones" dense
                                    :item-text="'nombre'" :item-value="'id'">
                    </v-autocomplete>
                  </td>
                  <td>
                    <v-textarea v-model="item.detalle" counter :disabled="item.key < logns.direcciones"
                                :rules="[rules.select.req, rules.detalle.min, rules.detalle.max]"
                                :rows="2" dense outlined>
                    </v-textarea>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header>
            Telefonos
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table class="rowsTable" dense>
              <template v-slot:default>
                <thead>
                <tr>
                  <th>Detalle</th>
                  <th>Teléfono</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in data.telefonos">
                  <td width="50%">
                    <v-text-field dense :disabled="item.key < logns.telefonos" outlined counter
                                  :rules="[rules.select.req, rules.detalleTelefono.min, rules.detalleTelefono.max]"
                                  v-model="item.detalle"></v-text-field>
                  </td>
                  <td>
                    <v-text-field dense :disabled="item.key < logns.telefonos" outlined counter
                                  :rules="[rules.select.req, rules.num.min, rules.num.max, rules.num.tel]"
                                  v-model="item.num"></v-text-field>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider></v-divider>
      <v-card-text>Datos del Artículo</v-card-text>

      <v-row no-gutters class="ma-5">

        <v-col cols="4">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-text-field dense class="ma-1" v-on="on" v-bind="attrs" v-model="data.articulo.nombre"
                            :rules="[rules.select.req]"
                            outlined label="Artículo" @keyup.enter="dialogo.articulos = true">
              </v-text-field>
            </template>
            <span>Enter para expandir los artículos</span>
          </v-tooltip>
        </v-col>

        <v-col>
          <v-text-field dense class="ma-1" disabled v-model="data.articulo.familia"
                        outlined label="Familía" :rules="[rules.select.req]">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-1" v-model="data.articulo.serie" :rules="[rules.select.req]"
                        outlined label="Serie del Fabricante">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense outlined class="ma-1" :rules="[rules.select.req]"
                        v-model="data.articulo.color" label="Color">
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-text>Datos del Crédito</v-card-text>

      <v-row no-gutters class="ma-5">
        <v-col>
          <v-text-field dense class="ma-1" label="Total Inicial del Crédito"
                        prefix="L" :rules="[rules.select.req, rules.moneda.num]"
                        outlined v-model="data.cuenta.total_inicial"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-1" label="Prima" prefix="L"
                        :rules="[rules.select.req, rules.moneda.num]"
                        outlined v-model="data.cuenta.prima"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-1" label="Tiempo" persistent-hint
                        :rules="[rules.select.req, rules.moneda.num]"
                        hint="Tiempo en meses" outlined v-model="data.cuenta.tiempo">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense class="ma-1" label="# de Cuotas" v-model="data.cuenta.cuotas"
                        outlined :rules="[rules.select.req, rules.moneda.num]">
          </v-text-field>
        </v-col>
        <v-col>
          <v-select dense class="ma-1" label="Estado de la Cuenta" :items="selectEstado"
                    outlined v-model="data.cuenta.estado" :rules="[rules.select.req]">
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters class="ma-5">
        <v-col>
          <v-text-field prefix="L" class="ma-1" :rules="[rules.select.req, rules.moneda.num]"
                        v-model="data.cuenta.saldo_actual"
                        dense outlined label="Saldo Actual de la cuenta">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense outlined label="Total Abonado" prefix="L"
                        v-model="data.cuenta.total_abonado"
                        hint="Abonado a Capital e Intereses(mora no)" persistent-hint
                        class="ma-1" :rules="[rules.select.req, rules.moneda.num]"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense outlined label="Saldo en Mora" class="ma-1"
                        :rules="[rules.moneda.num]"
                        prefix="L" v-model="data.cuenta.saldo_mora">
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field dense outlined label="Cuota" class="ma-1"
                        v-model="data.cuenta.couta"
                        prefix="L" :rules="[rules.select.req, rules.moneda.num]">
          </v-text-field>
        </v-col>
        <v-col>
          <v-select dense outlined label="Forma de Pago"
                    v-model="data.cuenta.forma_pago"
                    class="ma-1" :items="selectFormaPago" :rules="[rules.select.req]">
          </v-select>
        </v-col>
      </v-row>
      <v-row no-gutters class="ma-5">
        <v-col>
          <v-dialog ref="dialogoFechaPrima" :return-value.sync="data.cuenta.fecha_prima" persistent
                    width="290px" v-model="dialogo.fechaPrima">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="data.cuenta.fecha_prima" label="Fecha de la Prima"
                            :rules="[rules.select.req]" dense class="ma-1"
                            readonly v-bind="attrs" v-on="on" outlined></v-text-field>
            </template>
            <v-date-picker v-model="data.cuenta.fecha_prima" scrollable>
              <v-spacer></v-spacer>
              <v-btn tile small dark color="orange" @click="dialogo.fechaPrima = false">Cerrar</v-btn>
              <v-btn tile small color="indigo" class="text-white"
                     @click="saveFechaPrima" :disabled="!data.cuenta.fecha_prima">Seleccionar</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-dialog ref="dialogoFechaVencimiento" :return-value.sync="data.cuenta.fecha_vencimiento" persistent
                    width="290px" v-model="dialogo.fechaVencimiento">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="data.cuenta.fecha_vencimiento" label="Fecha de Vencimiento"
                            persistent-hint hint="Último Pago de la Cuenta"
                            :rules="[rules.select.req]" dense class="ma-1"
                            readonly v-bind="attrs" v-on="on" outlined></v-text-field>
            </template>
            <v-date-picker v-model="data.cuenta.fecha_vencimiento" scrollable>
              <v-spacer></v-spacer>
              <v-btn tile small dark color="orange" @click="dialogo.fechaVencimiento = false">Cerrar</v-btn>
              <v-btn tile small color="indigo" class="text-white"
                     @click="saveFechaVencimiento" :disabled="!data.cuenta.fecha_vencimiento">Seleccionar</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col>
          <v-select dense class="ma-1" outlined :rules="[rules.select.req]"
                    v-model="data.cuenta.sucursal" :item-value="'id'"
                    :loading="load.sucursales" loader-height="3"
                    @change="cargarColaboradores"
                    :items="Sucursales" :item-text="'nombre'" label="Sucursal de Venta">
          </v-select>
        </v-col>
        <v-col>
          <v-autocomplete dense class="ma-1" outlined :rules="[rules.select.req]"
                    v-model="data.cuenta.colaborador"
                    :loading="load.colaboradores" loader-height="3"
                    :items="Colaboradores" label="Colaborador">
          </v-autocomplete>
        </v-col>
        <v-col class="d-flex justify-end align-center">
          <v-btn small dark color="indigo" @click="crearPagos" tile>Crear Pagos</v-btn>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <v-card-text>Revisión de los Pagos</v-card-text>


      <v-row no-gutters>
        <v-col cols="10">
          <v-card class="ma-2">
            <b-table responsive small
                     class="rowsTable"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :fields="headerPagos"
                     :items="data.pagos"
                     hover>
              <template v-slot:head(fecha_pago)><div class="text-nowrap">Fecha de Pago</div></template>
              <template v-slot:head(detalle)><div class="text-nowrap">Detalle del Pago</div></template>
              <template v-slot:head(pago_inicial)><div class="text-nowrap">Pago Inicial</div></template>
              <template v-slot:head(total_abonado)><div class="text-nowrap">Total Abonado</div></template>
              <template v-slot:head(saldo_abonado)><div class="text-nowrap">Saldo Abonado</div></template>
              <template v-slot:head(total_mora)><div class="text-nowrap">Saldo en Mora</div></template>
              <template v-slot:head(total_pago)><div class="text-nowrap">Total del Pago</div></template>
              <template v-slot:head(saldo_actual)><div class="text-nowrap">Saldo Actual</div></template>
              <template v-slot:head(is_mora)><div class="text-nowrap">Estado de la Mora</div></template>
              <template v-slot:head(estado)><div class="text-nowrap">Estado del Pago</div></template>
              <template v-slot:head(inicio_mora)><div class="text-nowrap">Inicio de la Mora</div></template>
              <template v-slot:head(revisado)><div class="text-nowrap">Revisado</div></template>
              <template v-slot:head(dias_mora)><div class="text-nowrap">Dias en Mora</div></template>

              <template v-slot:cell(fecha_pago)="scope">
                <v-menu v-model="scope.item.dialogo" :nudge-right="40" offset-y min-width="auto"
                        :close-on-content-click="false" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="scope.item.fecha_pago"
                                  :rules="[rules.select.req]" dense
                                  readonly v-bind="attrs" v-on="on" outlined>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="scope.item.fecha_pago"
                      @input="scope.item.dialogo = false"></v-date-picker>
                </v-menu>
              </template>
              <template v-slot:cell(detalle)="scope">
                <div class="text-nowrap">{{scope.item.detalle}}</div>
              </template>
              <template v-slot:cell(pago_inicial)="scope">L {{scope.item.pago_inicial}}</template>
              <template v-slot:cell(total_abonado)="scope">
                <v-text-field dense prefix="L" outlined @change="sumarTotalPago(scope.item)"
                              :rules="[rules.select.req, rules.moneda.num]"
                              v-model="scope.item.total_abonado"></v-text-field>
              </template>
              <template v-slot:cell(total_mora)="scope">
                <v-text-field dense prefix="L" outlined @change="sumarTotalPago(scope.item)"
                              :rules="[rules.moneda.num]"
                              v-model="scope.item.total_mora"></v-text-field>
              </template>
              <template v-slot:cell(total_pago)="scope">
                <v-text-field dense prefix="L" outlined
                              :rules="[rules.select.req, rules.moneda.num]"
                              disabled v-model="scope.item.total_pago"></v-text-field>
              </template>
              <template v-slot:cell(saldo_actual)="scope">
                <v-text-field dense prefix="L" outlined
                              :rules="[rules.moneda.num]"
                              v-model="scope.item.saldo_actual"></v-text-field>
              </template>
              <template v-slot:cell(is_mora)="scope">
                <v-select dense outlined :items="selectEstado" v-model="scope.item.is_mora"></v-select>
              </template>
              <template v-slot:cell(estado)="scope">
                <v-select dense outlined :items="selectPago" v-model="scope.item.estado"></v-select>
              </template>
              <template v-slot:cell(inicio_mora)="scope">
                <v-menu v-model="scope.item.dialogoMora" :nudge-right="40" offset-y min-width="auto"
                        :close-on-content-click="false" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="scope.item.inicio_mora"
                                  :rules="[rules.select.req]" dense
                                  readonly v-bind="attrs" v-on="on" outlined>
                    </v-text-field>
                  </template>
                  <v-date-picker
                      v-model="scope.item.inicio_mora"
                      @input="scope.item.dialogoMora = false"></v-date-picker>
                </v-menu>
              </template>
              <template v-slot:cell(dias_mora)="scope">
                <v-text-field outlined dense v-model="scope.item.dias_mora"></v-text-field>
              </template>
              <template v-slot:cell(revisado)="scope" class="d-flex align-center">
                <v-checkbox @change="contPagosRevisados(scope.item)" v-model="scope.item.revisado"></v-checkbox>
              </template>
            </b-table>
            <v-row no-gutters>
              <v-col class="d-flex justify-center">
                <b-pagination v-model="currentPage"
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
        <v-col cols="">
          <v-card class="ma-2">
            <v-card-title>Revisión</v-card-title>
            <v-divider></v-divider>
            <v-text-field class="ma-1" outlined dense disabled :rules="[rules.revision.revisados]"
                          label="Pagos Revisados" v-model="revision.user.revisados">
            </v-text-field>
            <v-text-field class="ma-1" outlined dense disabled prefix="L" :rules="[rules.revision.saldo_actual]"
                          label="Saldo Actual" v-model="revision.user.saldo_actual">
            </v-text-field>
            <v-text-field class="ma-1" outlined dense disabled :rules="[rules.revision.saldo_mora]"
                          label="Saldo en Mora" v-model="revision.user.mora">
            </v-text-field>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-form>


  <v-dialog v-model="dialogo.articulos" width="90%">
    <v-card class="pa-5">
      <v-toolbar flat color="grey lighten-4">
        <h5>Artículos Existentes</h5>
        <v-spacer></v-spacer>
        <v-text-field dense label="Buscar Artículo" v-model="searchArticulo"></v-text-field>
      </v-toolbar>
      <v-data-table :headers="headerArticulo"
                    class="rowsTable"
                    @click:row="addArticulo"
                    :loading="load.articulos"
                    loading-text="Cargando Inventario"
                    :search="searchArticulo"
                    :items="articulos"
                    dense>
        <template v-slot:item.id="{item}">
          <v-btn color="success" class="ma-1" dark fab tile x-small>
            <v-icon>fa fa-arrow-right</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-divider></v-divider>
      <v-card-title class="d-flex justify-end">
        <v-btn color="orange" tile small dark @click="dialogo.articulos = false">Cerrar</v-btn>
      </v-card-title>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "nueva_venta_manual",
  data(){
    return{
      currentPage: 1,
      totalRows: 1,
      perPage:10,
      Colaboradores:[],
      searchArticulo: '',
      headerArticulo:[
        {text: 'Nombre del Artículo', value:'nombre_articulo'},
        {text: 'Módelo', value:'modelo'},
        {text: 'Código del Proveedor', value:'codigo_proveedor'},
        {text: 'Familía', value:'sub_familia_articulo.familia_articulo.nombre'},
        {text: 'Sub-familía', value:'sub_familia_articulo.nombre'},
        {text: 'Marca', value:'marca.nombre'},
        {text: 'Proveedor', value:'marca.proveedor.nombre'},
        {text: 'Seleccionar', value:'id'},
      ],
      headerPagos:[
        'fecha_pago',
        {key: 'detalle',stickyColumn: true, isRowHeader: true, variant: 'light'},
        'pago_inicial',
        'total_abonado',
        'total_mora',
        'total_pago',
        'saldo_actual',
        'is_mora',
        'estado',
        'inicio_mora',
        'dias_mora',
        'revisado',
      ],
      SelectSexos:[
        {text: 'Masculino', value: 1},
        {text: 'Femenino', value: 2},
      ],
      selectEstado:[
        {text:'Sin Mora Actual', value:0},
        {text:'Cuenta en Mora', value:1},
      ],
      selectFormaPago:[
        {text:'Semanal', value:1},
        {text:'Quincenal', value:2},
        {text:'Mensual', value:3},
      ],
      selectPago:[
        {text:'Al día', value:1},
        {text:'Mora', value:2},
        {text:'Cancelado', value:3},
        {text:'Condonado', value:4},
      ],
      Sucursales: [],
      logns:{
        direcciones:0,
        telefonos: 0
      },
      data:{
        disabled: {
          cliente: false,
          cuerpo:  true
        },
        articulo:{
          id: null,
          nombre: '',
          familia: '',
          color:   '',
          serie:   ''
        },
        cliente:{
          nombres: '',
          apellidos: '',
          identidad: '',
          sexo: '',
          nacionalidad: 'Hondureña'
        },
        direcciones:[],
        telefonos: [],
        cuenta:{
          total_inicial: 0,
          prima: 5000,
          tiempo: 0,
          cuotas: 6,
          estado: '',
          saldo_actual: 0,
          total_abonado: 0,
          saldo_mora: 0,
          couta: 560,
          forma_pago: 3,
          fecha_prima:'',
          fecha_vencimiento: '',
          sucursal: '',
          colaborador: '',
        },
        pagos: []
      },
      load:{
        identidad: false,
        articulos: false,
        sucursales: false,
        colaboradores: false
      },
      rules: {
        revision:{
          revisados: value => this.revision.sis.revisados === value || this.revision.user.revisados +' de '+this.revision.sis.revisados+' revisados',
          saldo_actual: value => this.data.cuenta.saldo_actual == value || 'Saldo actual de la cuenta: L '+this.data.cuenta.saldo_actual+' - Saldo de actual de los pagos: L '+value,
          saldo_mora:   value => this.data.cuenta.saldo_mora == value || 'Saldo en mora de la cuenta: L '+this.data.cuenta.saldo_mora+' - Saldo en mora de los pagos: L'+ value
        },
        moneda:{
          num: v => (v.length === 0 || v < 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Carácter invalído'
        },
        select: {
          req: v => !!v || 'Campo requerido',
        },
        detalle:{
          min: v => (v && v.length >= 40) || 'Tiene que ser mayor a 40 carácteres.',
          max: v => (v && v.length <= 250) || 'Tiene que ser menor o igual a 250 carácteres.',
        },
        identidad: {
          some:v => (v.length === 0 || v.length === 13 || v.length === 14) || 'Tiene que ser de 13 o 14 carácteres.',
          id: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Identidad no válida, tienes datos diferentes a números'
        },
        num: {
          min:v => (v && v.length >= 8) || 'Tiene que ser mayor O igual a 8 números.',
          max:v => (v && v.length <= 20) || 'Tiene que ser menor o igual a 20 números.',
          tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Campo no válido, tienes datos diferentes a números'
        },
        detalleTelefono:{
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        }
      },
      articulos: [],
      dialogo:{
        articulos: false,
        fechaPrima: false,
        fechaVencimiento: false
      },
      revision:{
        sis:{
          revisados: 0,
          mora:      0
        },
        user:{
          revisados: 0,
          mora:      0,
          saldo_actual: 0
        }
      }
    }
  },
  computed:{
    DEPARTAMENTOS(){
      return this.$store.state.direcciones.DEPARTAMENTOS;
    },
    MUNICIPIOS(){
      return this.$store.state.direcciones.MUNICIPIOS;
    },
    DISTRITOS(){
      return this.$store.state.direcciones.DISTRITOS;
    },
    COLONIAS(){
      return this.$store.state.direcciones.COLONIAS;
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Ventas > Nueva Venta Manual');
    this.data.direcciones.push({
      departamento: '',
      municipio:    '',
      ciudad:       '',
      colonia:      '',
      detalle:      '',
      key:          this.data.direcciones.length,
      Municipios:   [],
      Ciudades:     [],
      Colonias:     [],
    });
    this.data.telefonos.push({
      num:     '',
      detalle: 'Telefono '+(parseInt(this.data.telefonos.length) + parseInt(1)),
      key:     this.data.telefonos.length
    });
    // this.cargarInventario();
    // this.cargarSucursales();
  },
  methods:{
    addArticulo(data){
      this.data.articulo.id      = data.id;
      this.data.articulo.nombre  = data.nombre_articulo;
      this.data.articulo.familia = data.sub_familia_articulo.familia_articulo.nombre;
      this.dialogo.articulos     = false;
    },
    agregarPago(p_i, t_p, t_a, s_a, f_p, d){
      this.data.pagos.push({
        pago_inicial:  p_i,//
        total_pago:    t_p,//
        total_abonado: t_a,//
        saldo_actual:  s_a,//
        is_mora:       '',//
        inicio_mora:   '',//
        fecha_pago:    f_p,//
        estado:        '',
        dias_mora:     0,//
        detalle:       d,//
        revisado:      false,//
        total_mora:    0,//,
        dialogo:       false,
        key:           this.data.pagos.length,
        dialogoMora:   false
      })
    },
    calcularPagos(){
      if (this.data.cuenta.forma_pago === 1)
        return this.data.cuenta.cuotas * 4;
      else if (this.data.cuenta.forma_pago === 2)
        return this.data.cuenta.cuotas * 2;
      else if (this.data.cuenta.forma_pago === 3)
        return this.data.cuenta.cuotas
    },
    cargarCiudades(data){
      console.log(data.municipio)
      data.Ciudades = this.DISTRITOS.filter(muni => muni.municipio_id === data.municipio);
    },
    cargarCliente(){
      if (this.data.cliente.identidad.length === 13){
        this.data.disabled.cliente = false;
        this.load.identidad        = true;
        this.data.direcciones      = [];
        this.$axios.get('cliente_segumiento/'+this.data.cliente.identidad).then((res)=>{
          if (res.data.cliente){
            this.data.cliente.nombres      = res.data.cliente.nombres;
            this.data.cliente.apellidos    = res.data.cliente.apellidos;
            this.data.cliente.sexo         = res.data.cliente.sexo;
            this.data.cliente.nacionalidad = res.data.cliente.nacionalidad;
            this.data.direcciones          = JSON.parse(res.data.cliente.direcciones);
            this.data.telefonos            = JSON.parse(res.data.cliente.telefonos);
            this.logns.direcciones         = this.data.direcciones.length;
            this.logns.telefonos           = this.data.telefonos.length;
            this.distribuirDirecciones();
            this.load.identidad = false;
            this.notificacion('Se cargaron las direcciones del cliente','success');
            this.notificacion('Se cargaron los telefonos del cliente',  'success');
          }else{
            this.load = false;
            this.data.direcciones.push({
              departamento: '',
              municipio:    '',
              ciudad:       '',
              colonia:      '',
              detalle:      '',
              key:          this.data.direcciones.length,
              Municipios:   [],
              Ciudades:     [],
              Colonias:     [],
            });
            this.data.telefonos.push({
              num:     '',
              detalle: 'Telefono '+(parseInt(this.data.telefonos.length) + parseInt(1)),
              key: this.data.telefonos.length
            })
            this.logns.direcciones     = 0;
            this.logns.telefonos       = 0;
            this.data.disabled.cliente = true;
          }
        })
      }else{
        this.notificacion('Identidad incorrecta','error');
      }
    },
    cargarColaboradores(){
      this.load.colaboradores = true;
      this.$axios.get('colaboradores_suc/'+this.data.cuenta.sucursal).then((res)=>{
        res.data.col.forEach((i)=>{
          this.Colaboradores.push({
            text: i.nombres+ ' '+ i.apellidos,
            value: i.id
          })
        })
        this.load.colaboradores = false;
      })
    },
    cargarColonias(data){
      data.Colonias = this.COLONIAS.filter(ciudad => ciudad.ciudade_id === data.ciudad)
    },
    cargarInventario(){
      this.load.articulos = true;
      this.$axios.get('/2.0/articulos/').then((res)=>{
        this.articulos = res.data.articulos;
        this.load.articulos = false;
      })
    },
    cargarMunicipio(data){
      data.Municipios = this.MUNICIPIOS.filter(depto => depto.departamento_id === data.departamento);
    },
    cargarSucursales(){
      this.load.sucursales = true;
      this.$axios.get('sucursales').then((res)=>{
        this.Sucursales = res.data.suc;
        this.load.sucursales = false;
      });
    },
    contPagosRevisados(data){
      if (data.revisado)
        this.revision.user.revisados++;
      else
        this.revision.user.revisados--;
    },
    crearPagos(){
      this.data.pagos = [];
      this.revision.user.mora = 0;
      this.revision.user.revisados = 0;
      let pagos = this.calcularPagos();
      let fecha = new Date(this.data.cuenta.fecha_prima+'T00:00:00');
      for (let i = 0; i <= pagos; i++){
        if (i === 0){
          this.agregarPago(this.data.cuenta.prima, this.data.cuenta.prima, 0,
              this.data.cuenta.prima, this.data.cuenta.fecha_prima, 'Pago Inicial - Prima')
        }else{
          fecha = this.sumarDias(fecha);
          this.agregarPago(this.data.cuenta.couta, this.data.cuenta.couta, 0,
              this.data.cuenta.couta,
              fecha.getFullYear()+'-'+fecha.getMonth()+'-'+fecha.getDate(), 'Cuota #'+(i));

        }
        this.revision.sis.revisados++;
      }
      this.totalRows = this.data.pagos.length;
    },
    distribuirDirecciones(){
      this.data.direcciones.forEach((i)=>{
        this.cargarMunicipio(i);
        this.cargarCiudades(i);
        this.cargarColonias(i);
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    saveFechaPago(data){
      this.data.pagos.forEach((i, cont)=>{
        console.log(this.$refs.dialogoFechaPago[cont])
      })
      data.dialogo = false;
    },
    saveFechaPrima() {
      this.$refs.dialogoFechaPrima.save(this.data.cuenta.fecha_prima);
      this.dialogo.fechaPrima = false;
    },
    saveFechaVencimiento(){
      this.$refs.dialogoFechaVencimiento.save(this.data.cuenta.fecha_vencimiento);
      this.dialogo.fechaVencimiento = false;
    },
    saveInicioMora(data){
      // this.$refs.dialogoInicioMora[data.key].save(data.inicio_mora);
      // console.log(this.$refs.dialogoFechaPago)
      data.dialogoMora = false;
    },
    sumarDias(fecha){
      let dias = 0;
      console.log(fecha)
      if(this.data.cuenta.forma_pago !== 3){
        if (this.data.cuenta.forma_pago === 1)
          dias = 7;
        else if (this.data.cuenta.forma_pago === 2)
          dias = 15;

        fecha.setDate(fecha.getDate() + dias);
        return fecha;
      }else{
        fecha.setMonth(fecha.getMonth() + 1);
        return  fecha;
      }

    },
    sumarTotalMora(data){
      this.revision.user.mora = 0;
      this.data.pagos.forEach((i)=>{
        if (i.total_mora > 0 && i.total_abonado > 0 && i.total_abonado < i.total_pago && i.saldo_actual > 0) {
          this.revision.user.mora = parseFloat(this.revision.user.mora) + parseFloat(i.total_mora);
          data.is_mora = 1;
          data.estado  = 2;
        }else{
          data.is_mora = 0;
        }
      })

    },
    sumarTotalPago(data){
      this.revision.user.saldo_actual = 0;
      if (!isNaN(data.total_mora) || data.total_mora > 0) {
        data.total_pago = parseFloat(data.total_mora) + parseFloat(data.pago_inicial);
      }

      if (!isNaN(data.total_abonado) && !isNaN(data.total_pago) || data.total_abonado > 0 && data.total_pago > 0)
        data.saldo_actual =  parseFloat(data.total_pago) - parseFloat(data.total_abonado);

      this.data.pagos.forEach((i)=>{
        if (i.saldo_actual)
          this.revision.user.saldo_actual = parseFloat(this.revision.user.saldo_actual) + parseFloat(i.saldo_actual);
      })

      if (data.saldo_actual === 0){
        data.estado = 3;
      }

      this.sumarTotalMora(data);
    },
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
