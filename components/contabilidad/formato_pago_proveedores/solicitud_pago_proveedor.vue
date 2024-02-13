<template>
<v-card tile flat>
  <div class="ma-2">
    <table>
      <tr>
        <td colspan="5"><strong>Detalle: </strong>{{SOLICITUD.detalle}}</td>
      </tr>
      <tr>
        <td><strong>Detalle corto: </strong>{{SOLICITUD.detalle_print}}</td>
        <td><strong>Codigo: </strong>{{SOLICITUD.cod}}</td>
        <td v-if="SOLICITUD.ct_acreedor"><strong>Acreedor: </strong>{{SOLICITUD.ct_acreedor.nombre}}</td>
        <td v-else><strong>Acreedor: </strong>-----</td>
        <td v-if="SOLICITUD.proveedor"><strong>Proveedor: </strong>{{SOLICITUD.proveedor.nombre}}</td>
        <td v-else><strong>Proveedor: </strong>-----</td>
        <td v-if="SOLICITUD.tipo_busqueda === 1"><strong>Tipo: </strong>Dedicado al acreedor</td>
        <td v-else-if="SOLICITUD.tipo_busqueda === 2"><strong>Tipo: </strong>Dedicado al Proveedor/Gastos</td>
        <td v-else-if="SOLICITUD.tipo_busqueda === 3"><strong>Tipo: </strong>Dedicado al Proveedor/Contratos</td>
      </tr>
      <tr>
        <td><strong>Usuario:</strong> {{SOLICITUD.user.usuario}}</td>
        <td v-if="SOLICITUD.tipo === 0"><strong>Tipo:</strong> Normal</td>
        <td v-else-if="SOLICITUD.tipo === 1"><strong>Tipo:</strong> Extendida</td>
        <td><strong>Estado: </strong>
          <v-chip x-small dark color="success" v-if="SOLICITUD.estado === 0">Abierto</v-chip>
          <v-chip x-small dark color="red" v-else-if="SOLICITUD.estado === 1">Cerrado</v-chip>
        </td>
        <td ><strong>Fecha progromado:</strong> {{SOLICITUD.fecha_programado.split('-')[2]}}/{{SOLICITUD.fecha_programado.split('-')[1]}}/{{SOLICITUD.fecha_programado.split('-')[0]}}</td>
        <td ><strong>Dia de acredotaciones:</strong>
          <span v-if="SOLICITUD.fecha_acreditacion">Cada {{SOLICITUD.fecha_acreditacion.split('-')[2]}}</span>
          <span v-else>-----</span>
        </td>
      </tr>
      <tr>
        <td><strong>Cant. de pagos:</strong></td>
        <td><strong>Total acumulado:</strong></td>
        <td><strong>Total a pagar:</strong></td>
        <td><strong>Documento:</strong> <b-link @click="solicitarClave(1)">Imprimir solicitud</b-link></td>
        <td><strong>Docomento Cargado:</strong></td>
      </tr>
    </table>

    <span style="font-size: 10px; margin-top: 10px; font-weight: bold">Pagos</span>


    <div style="display: flex; flex-direction: row">
      <div style="width: 97%;">
        <table v-if="SOLICITUD.tipo_busqueda < 3">
          <thead>
          <tr>
            <th>Nivel</th>
            <th>Detalle del Gasto</th>
            <th>Gasto</th>
            <th>Documento</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in SOLICITUD.ct_cuerpo_solicitud_pago">
            <td style="border-left: solid 1px #aaaaaa">{{item.nivel}}</td>
            <td style="border-left: 0px">{{item.gasto.detalle}}</td>
            <td style="border-left: 0px">{{item.gasto.tipo_gasto.nombre}}</td>
            <td style="border-left: 0px"><b-link @click="verDocumento(item.gasto.file)">Ver documento</b-link></td>
            <td style="border-left: 0px">
              <v-row no-gutters>
                <v-col><span >L {{Intl.NumberFormat().format(item.gasto.total)}}</span></v-col>
                <v-col>
                  <div class="cajaInput">
                    <input disabled type="text" v-model="item.total">
                  </div>
                </v-col>
              </v-row>
            </td>
            <td style="border-left: 0px">
              <v-chip x-small v-if="item.estado === 0" color="red" dark>Pendiente</v-chip>
              <v-chip x-small v-else-if="item.estado === 1" color="success" dark>Cancelado</v-chip>
            </td>
            <td style="border-left: 0px">
              <b-link >Ver acciones</b-link>
            </td>
          </tr>
          </tbody>
        </table>
        <v-data-table
            dense v-if="SOLICITUD.tipo_busqueda === 3 && this.SOLICITUD.tipo == 1"
            :headers="headers3"
            :items="SOLICITUD.ct_cuerpo_solicitud_pago"
            item-key="id"
            sort-by="nivel"
            group-by="nivel"
            class="elevation-1"
            :items-per-page="150"
        >
          <template v-slot:item.ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.num_contrato="{item}"># {{item.ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.num_contrato}}</template>
          <template v-slot:item.ct_cuerpo_contrato_proveedor.saldo_actual="{item}">{{DIVISA.simbolo}}. {{ Intl.NumberFormat().format(item.ct_cuerpo_contrato_proveedor.saldo_inicial)}}</template>
          <template  v-slot:item.estado="{item}">
            <v-chip x-small color="warning" dark v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small color="success" dark v-else-if="item.estado === 1">Cancelado</v-chip>
          </template>
          <template  v-slot:item.ct_cuerpo_contrato_proveedor.estado="{item}">
            <v-chip x-small color="warning" dark v-if="item.ct_cuerpo_contrato_proveedor.estado === 0">Pendiente</v-chip>
            <v-chip x-small color="success" dark v-else-if="item.ct_cuerpo_contrato_proveedor.estado === 1">Cancelado</v-chip>
          </template>
          <template v-slot:item.id="{item}"><b-link>ver ...</b-link></template>
        </v-data-table>
      </div>
      <div style="width: 3%; display: flex; flex-direction: column" >
        <v-tooltip left>
          <template v-slot:activator="{on, attrs}">
            <v-btn color="success" dark fab x-small icon v-on="on" v-bind="attrs" @click="dialogoSoli = true"><v-icon>mdi-file-document-arrow-right</v-icon></v-btn>
          </template>
          <span>Crear Solicitud de Pago por Niveles</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{on, attrs}">
            <v-btn color="success" dark fab x-small icon v-on="on" :disabled="solicitudes.length === 0"
                   v-bind="attrs" @click="dialogoSoliHechas = true"><v-icon>mdi-check</v-icon></v-btn>
          </template>
          <span>Revisar las documentos fabricados</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{on, attrs}">
            <v-btn color="success" dark fab x-small icon v-on="on" :disabled="solicitudes.length === 0"
                   v-bind="attrs" @click="dialogoEnvioCorreo   = true"><v-icon>mdi-email-fast</v-icon></v-btn>
          </template>
          <span>Enviar Correo Electronico</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{on, attrs}">
            <v-btn color="success" dark fab x-small icon v-on="on" :disabled="solicitudes.length === 0"
                   v-bind="attrs" @click="dialogoPago = true"><v-icon>mdi-file-document-check</v-icon></v-btn>
          </template>
          <span>Aplicar pago</span>
        </v-tooltip>
      </div>
    </div>
  </div>

  <v-dialog v-model="dialogoSoli" :width="SOLICITUD.tipo_busqueda < 3? '70%':'100%'">
    <v-card>
      <v-card-title>Creando Solicitud de Pago por Niveles</v-card-title>
      <v-divider></v-divider>
      <div class="ma-5">
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field dense label="Nivel" :value="1" disabled v-if="SOLICITUD.tipo_busqueda < 3"></v-text-field>
            <v-autocomplete v-model="nivel" :items="niveles" :item-text="'nivel'" :item-value="'nivel'"
                            dense label="Seleccionar Nivel" v-else @change="selectNivel"></v-autocomplete>
          </v-col>
          <v-col class="d-flex justify-end ma-2">
            L. {{Intl.NumberFormat().format(total)}}
          </v-col>
        </v-row>
        <v-data-table v-if="SOLICITUD.tipo_busqueda < 3" show-select v-model="seleccionados"
            :items="SOLICITUD.ct_cuerpo_solicitud_pago" dense :headers="headers">
        </v-data-table>

        <v-data-table v-else dense show-select v-model="seleccionados" :items="pagosSeleccionadoXnivel" :headers="headers3">
          <template v-slot:item.ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.num_contrato="{item}"># {{item.ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.num_contrato}}</template>
          <template v-slot:item.ct_cuerpo_contrato_proveedor.saldo_actual="{item}">
            <div class="cajaInput">
              <input type="number" v-model="item.ct_cuerpo_contrato_proveedor.saldo_inicial">
            </div>
          </template>
          <template  v-slot:item.estado="{item}">
            <v-chip x-small color="warning" dark v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small color="success" dark v-else-if="item.estado === 1">Cancelado</v-chip>
          </template>
          <template  v-slot:item.ct_cuerpo_contrato_proveedor.estado="{item}">
            <v-chip x-small color="warning" dark v-if="item.ct_cuerpo_contrato_proveedor.estado === 0">Pendiente</v-chip>
            <v-chip x-small color="success" dark v-else-if="item.ct_cuerpo_contrato_proveedor.estado === 1">Cancelado</v-chip>
          </template>
        </v-data-table>
        <v-card-text v-if="SOLICITUD.tipo_busqueda === 3">
          Si cambias los precios de pago, tienes que actualizarlos. Sino lo actualizas, el documento generado va a tener
          el saldo incorrecto.
        </v-card-text>
      </div>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" dark text small @click="dialogoSoli = false" tile class="ma-2">Cerrar</v-btn>
        <v-btn color="success" dark small @click="actualizarPagos" v-if="SOLICITUD.tipo_busqueda === 3" tile text  class="ma-2" >Actualizar Pagos</v-btn>
        <v-btn color="success" dark small @click="solicitarClave(2)" tile  class="ma-2">Generar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogoSoliHechas" width="60%">
    <v-card>
      <v-card-title>Documentos Creados</v-card-title>
      <v-divider></v-divider>
      <div class="ma-2">
        <v-card-text>En esta sección tienes que seleccionar cual documento es el correcto para cuando se haga el pago
          puedas tome los gastos que seleccionastes. Si hay documento en estado pendiente, no podrás liquidar el pago.</v-card-text>
        <v-data-table
                      :items="solicitudes" dense :headers="headersSoli">
          <template v-slot:item.total="{item}">L. {{Intl.NumberFormat().format(item.total)}}</template>
          <template v-slot:item.estado="{item}">
            <v-chip x-small dark color="warning" v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small dark color="success" v-else-if="item.estado === 1">Aceptado</v-chip>
            <v-chip x-small dark color="red" v-else-if="item.estado === 2">Rechazado</v-chip>
          </template>
          <template v-slot:item.ids="{item}">
            <b-link @click="selectSoli(item)">Acciones</b-link>
          </template>
        </v-data-table>
        <v-card class="ma-4" flat v-if="vistaSoli">
          <v-card-subtitle>Documento: {{Soli.ref}}</v-card-subtitle>
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <b-link @click="solicitarClave(3)">Ver documento</b-link>
            </v-col>
            <v-col>
              <v-select dense label="Cambiar estado" :items="estados" :disabled="Soli.estado > 0" v-model="estado"></v-select>
            </v-col>
          </v-row>
          <v-card-actions v-if="Soli.estado === 0" class="d-flex justify-end">
            <v-btn color="success" text tile small dark @click="cambiarEstadoSoli">Registrar cambio de estado</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" dark text small @click="dialogoSoliHechas = false" tile class="ma-2">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogoEnvioCorreo" width="40%">
    <v-card>
      <v-card-title>Envio de Correo</v-card-title>
      <v-divider></v-divider>
      <div class="pa-4">
        <v-data-table
            :items="solicitudesConfirmadas" dense :headers="headersSoliEmail">
          <template v-slot:item.total="{item}">L. {{Intl.NumberFormat().format(item.total)}}</template>
          <template v-slot:item.estado="{item}">
            <v-chip x-small dark color="warning" v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small dark color="success" v-else-if="item.estado === 1">Aceptado</v-chip>
            <v-chip x-small dark color="red" v-else-if="item.estado === 2">Rechazado</v-chip>
          </template>
          <template v-slot:item.ids="{item}">
            <b-link @click>Acciones</b-link>
          </template>
          <template v-slot:item.email="{item}">
            <v-chip x-small dark color="success" v-if="item.mail === 1 || item.mail">Enviado</v-chip>
            <b-link v-else @click="selectSoli(item)">Enviar Correo</b-link>
          </template>
        </v-data-table>

        <v-card flat tile v-if="vistaSoli">
          <v-text-field label="Buscar ..." dense v-model="search"></v-text-field>
          <v-data-table v-model="UsuariosSeleccionados" show-select :headers="headerUsuario"
                        :items="Usuarios" dense :search="search" item-key="nombres">
            <template v-slot:item.nombres="{item}">{{item.nombres}} {{item.apellidos}}</template>
          </v-data-table>
        </v-card>
      </div>

      <v-card-actions class="d-flex justify-end">
        <v-btn text color="warning" dark tile small @click="dialogoEnvioCorreo = false" class="ma-2">Cerrar</v-btn>
        <v-btn v-if="vistaSoli && this.UsuariosSeleccionados.length > 0" color="success" small tile dark @click="envioCorreo">Enviar Correo</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <v-dialog v-model="dialogoPago" width="55%">
    <v-card>
      <v-card-title>Aplicando Pago</v-card-title>
      <v-divider></v-divider>
      <v-card-text>Para aplicar el pago, tienes que seleccionar el documento aceptado por nivel, y tienes que
      seleccionar un banco o una caja general.</v-card-text>

      <div class="pa-4">
        <v-data-table
            :items="solicitudesConfirmadas" dense :headers="headersPagol">
          <template v-slot:item.total="{item}">L. {{Intl.NumberFormat().format(item.total)}}</template>
          <template v-slot:item.estado="{item}">
            <v-chip x-small dark color="warning" v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small dark color="success" v-else-if="item.estado === 1">Aceptado</v-chip>
            <v-chip x-small dark color="red" v-else-if="item.estado === 2">Rechazado</v-chip>
            <v-chip x-small dark color="indigo" v-else-if="item.estado === 4">Pagado</v-chip>
          </template>
          <template v-slot:item.ids="{item}">
            <b-link :disabled="item.estado === 4" @click="selectSoli(item)">Acciones</b-link>
          </template>
        </v-data-table>

        <div v-if="vistaSoli">
          <v-divider></v-divider>
          <v-card-subtitle>Documento: {{Soli.ref}}</v-card-subtitle>
          <v-row no-gutters>
            <v-col>
              <v-select v-model="forma_pago" dense :items="tipoPagos" label="Forma de pago" class="ma-2"></v-select>
            </v-col>
            <v-col>
              <v-autocomplete dense v-if="forma_pago === 1" :items="CUENTAS" :loading="LOAD_CUENTAS"
                              label="Seleccionar cuenta" class="ma-2" v-model="cuenta_id"></v-autocomplete>
              <v-autocomplete dense v-else-if="forma_pago === 2" label="Seleccionar caja" class="ma-2" :items="cajas"
                              :loading="loadCajas" :item-text="'nombre'" :item-value="'id'" v-model="caja_id"></v-autocomplete>
            </v-col>
            <v-col>
              <v-file-input dense label="Documento" accept="application/pdf"  class="ma-2" v-model="filePago"></v-file-input>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-end">
            <v-btn class="ma-2" color="success" tile dark small @click="validarRegistroPago">Registrar Pago</v-btn>
          </v-card-actions>
          <v-divider></v-divider>
        </div>
      </div>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark tile small @click="dialogoPago = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "solicitud_pago_proveedor",
  props:{
    niveles: Array
  },
  computed:{
    DIVISA(){
      return this.$store.state.contabilidad.divisas.DIVISA
    },
    SOLICITUD() {
      return this.$store.state.contabilidad.solicitudes_pago.SOLICITUD;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
    total(){
      if (this.seleccionados.length === 0)
        return 0
      else{
        let total = 0;
        this.seleccionados.forEach(item=>{
          if (this.SOLICITUD.tipo_busqueda < 3)
            total = parseFloat(total) + parseFloat(item.gasto.total);
          else
            total = parseFloat(total) + parseFloat(item.ct_cuerpo_contrato_proveedor.saldo_inicial)
        })
        return total
      }
    },
    CUENTAS(){
      let cuentas = [];
      this.$store.state.contabilidad.bancos.CUENTAS.forEach(item=>{
        cuentas.push({
          value: item.id,
          text: item.descripcion+' - '+item.num+' - '+item.tipo.nombre
        })
      })
      return cuentas;
    },
    LOAD_CUENTAS(){
      return this.$store.state.contabilidad.bancos.LOADCUENTAS;
    }
  },
  data(){
    return{
      cuenta_id: 0,
      caja_id: 0,
      filePago: false,
      cajas: [],
      loadCajas: true,
      forma_pago: 1,
      tipoPagos:[
        {text:'Banco', value: 1},
        {text:'Caja', value: 2},
      ],
      search: '',
      dialogoPago: '',
      dialogoEnvioCorreo: false,
      estado: 0,
      estados:[
        {text:'Pendiente', value: 0},
        {text:'Aceptado',  value: 1},
        {text:'Rechazado', value: 2},
      ],
      dialogoSoli: false,
      dialogoSoliHechas: false,
      headers: [
        {text: 'Gasto', value:'gasto.tipo_gasto.nombre'},
        {text: 'Detalle', value:'gasto.detalle'},
        {text: 'Total Gasto', value:'gasto.total'},
        {text: 'Total del Pago', value:'total'},
      ],
      headersSoli: [
        {text: 'Nivel', value:'nivel'},
        {text: 'Referencia', value:'ref'},
        {text: 'Fecha', value:'fecha'},
        {text: 'Total', value:'total'},
        {text: 'Estado', value:'estado'},
        {text: 'Acciones', value:'ids'},
      ],
      headersSoliEmail: [
        {text: 'Referencia', value:'ref'},
        {text: 'Total', value:'total'},
        {text: 'Estado', value:'estado'},
        {text: 'Envio Correo', value:'email'},
      ],
      headersPagol: [
        {text: 'Referencia', value:'ref'},
        {text: 'Total', value:'total'},
        {text: 'Estado', value:'estado'},
        {text: 'Nivel', value:'nivel'},
        {text: 'Acciones', value:'ids'},
      ],
      seleccionados: [],
      solicitudes: [],
      solicitudesConfirmadas: [],
      vistaSoli: false,
      Soli: {},
      loadUsuarios: true,
      Usuarios: [],
      UsuariosSeleccionados: [],
      headerUsuario:[
        {text:'Usuario', value:'usuario'},
        {text:'Nombre', value:'nombres'},
        {text:'Correo', value:'email'},
      ],
      documentosCount: 0,
      headers3: [
        {
          text: 'Nivel',
          // align: 'start',
          value: 'nivel',
          // groupable: true,
        },
        { text: 'Cod. CC', value: 'ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.tipo_gasto.cod'},
        { text: 'Gasto', value: 'ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.tipo_gasto.nombre'},
        { text: 'Contrato', value: 'ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.num_contrato'},
        { text: 'Detalle del Contrato', value: 'ct_cuerpo_contrato_proveedor.ct_contrato_proveedor.detalle'},
        { text: 'Detalle del Pago', value: 'ct_cuerpo_contrato_proveedor.detalle'},
        { text: 'Saldo Pendiente', value: 'ct_cuerpo_contrato_proveedor.saldo_actual'},
        { text: 'Estado S.', value: 'estado'},
        { text: 'Estado C.', value: 'ct_cuerpo_contrato_proveedor.estado'},
        { text: 'Acciones', value: 'id'},
      ],
      nivel: 0,
      pagosSeleccionadoXnivel: []
    }
  },
  created() {
    if (this.SOLICITUD.solicitudes) {
      this.solicitudes = JSON.parse(this.SOLICITUD.solicitudes);
      this.solicitudesConfirmadas = this.solicitudes.filter(item=>item.estado === 1);
    }
    this.SOLICITUD.ct_cuerpo_solicitud_pago.forEach(item=>{
      if (this.SOLICITUD.tipo_busqueda < 3 && item.gasto.file) {
        this.documentosCount++;
      }
    })
    this.cargarUsuarios();
    this.$store.commit('activarOverlay', false);
    this.$store.commit('contabilidad/bancos/cargar_CUENTAS');
    this.cargarCajas();
  },
  methods:{
    actualizarPagos(){
      this.$store.commit('activarOverlay', false);
      this.dialogoSoli = false;
      this.$axios.post('contabilidad/formato_pago/solicutd_pago/actualizar_pagos',{
        pagos: this.seleccionados,
        nivel: this.nivel,
        id:    this.SOLICITUD.id
      }).then((res)=>{
        this.cargarSOLICITUD();
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.seleccionados = [];
        this.nivel         = 0;
        this.pagosSeleccionadoXnivel = [];
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.dialogoSoli = true;
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    abrirNavegador(clave, tipo, ref, fecha){
      let url = ''
      if (tipo === 1)
        url = this.$axios.defaults.baseURL+'documentos/contabilidad/solicitud_pago/usuario='+this.USUARIO+'&solicitud='+this.SOLICITUD.cod+'&'+clave;
      else if (tipo === 2) {
        let ids = []
        this.seleccionados.forEach(item=>{
          ids.push(item.id);
        })
        url = this.$axios.defaults.baseURL + 'documentos/contabilidad/soli_pago/usuario=' + this.USUARIO + '&solicitud=' + this.SOLICITUD.cod + '&' + clave + '&soli='+JSON.stringify(ids)+'&total='+this.total+'&ref='+ref+'&fecha='+fecha;
        this.cargarSOLICITUD();
      } else if (tipo === 3){
        url = this.$axios.defaults.baseURL + 'documentos/contabilidad/soli_pago/usuario=' + this.USUARIO + '&solicitud=' + this.SOLICITUD.cod + '&' + clave + '&soli='+JSON.stringify(this.Soli.ids)+'&total='+this.Soli.total+'&ref='+this.Soli.ref+'&fecha='+this.Soli.fecha;
      }

      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    cambiarEstadoSoli(){
      if (this.estado > 0){
        this.dialogoSoliHechas = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('contabilidad/formato_pago/solicitud_pado/cambiar_estado',{
          id: this.SOLICITUD.id,
          estado: this.estado,
          nivel:  this.Soli.nivel,
          ref:    this.Soli.ref,
          ids:    this.Soli.ids,
          tipo_busqueda: this.SOLICITUD.tipo_busqueda,
          total:         this.total
        }).then((res)=>{
          this.vistaSoli = false;
          this.Soli      = {};
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{color:'success', texto:res.data.msj});
          this.cargarSOLICITUD();
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{color:'error', texto:'Hubo un error en el servidor'})
        })
      }else
        this.$store.commit('notificacion',{color:'warning', texto:'Tiene que ser un estado diferente a pendiente'})
    },
    cargarCajas(){
      this.$axios.get('cajas').then((res)=>{
        this.cajas     = res.data.cajas;
        this.loadCajas = false;
      })
    },
    cargarSOLICITUD() {
      this.$store.commit('activarOverlay', true);
      this.$axios.get('contabilidad/formato_pago/solicitud_pago/'+this.SOLICITUD.id).then((res)=>{
        this.$store.commit('contabilidad/solicitudes_pago/setSOLICITUD', res.data.solicitud)
        this.$store.commit('activarOverlay', false);
        this.solicitudes = JSON.parse(this.SOLICITUD.solicitudes);
        this.solicitudesConfirmadas = this.solicitudes.filter(item=>item.estado === 1);
      })
    },
    cargarUsuarios(){
      this.$axios.get('/usuarios').then((res)=>{
        this.Usuarios = res.data.usuarios;
        this.loadUsuarios = false;
      })
    },
    envioCorreo() {
      if ((this.documentosCount == this.SOLICITUD.ct_cuerpo_solicitud_pago.length) || (this.SOLICITUD.tipo_busqueda === 3 && this.SOLICITUD.tipo === 1)){
        this.dialogoEnvioCorreo = false
        this.$store.commit('activarOverlay', true);
        let correos = [];
        this.UsuariosSeleccionados.forEach(item=>{
          correos.push(item.email)
        })
        let ids = []
        this.$axios.post('contabilidad/formato_pago/solicitud_pago/envio_correo',{
          id:    this.SOLICITUD.id,
          total: this.Soli.total,
          ref:   this.Soli.ref,
          fecha: this.Soli.fecha,
          correos: correos,
          codigo:  this.SOLICITUD.cod,
          ids:     this.Soli.ids
        }).then((res)=>{
          this.cargarSOLICITUD();
          this.vistaSoli = false;
          this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
          this.$store.commit('activarOverlay', false);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      }else {
        this.$store.commit('notificacion', {texto: 'Hay un gasto que no tiene la factura cargada', color: 'warning'});
      }
    },
    registrarPago(){
      this.dialogoPago = false;
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('ids',        JSON.stringify(this.Soli.ids));
      data.append('file',       this.filePago);
      data.append('tipo',       this.SOLICITUD.tipo_busqueda);
      data.append('forma_pago', this.forma_pago);
      data.append('cuenta_id',  this.cuenta_id);
      data.append('caja_id',    this.caja_id);
      data.append('total',      this.Soli.total);
      data.append('id',         this.SOLICITUD.id);
      data.append('ref',        this.Soli.ref);
      this.$axios({
        method: 'post',
        url: 'contabilidad/formato_pago/solicitud_pago/pago',
        data:data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.cargarSOLICITUD();
        this.forma_pago = 1;
        this.caja_id    = 0;
        this.cuenta_id  = 1;
        this.filePago   = false;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.dialogoPago = true;
      })
    },
    selectNivel(){
      this.pagosSeleccionadoXnivel = [];
      this.pagosSeleccionadoXnivel = this.SOLICITUD.ct_cuerpo_solicitud_pago.filter(item=> item.nivel === this.nivel);
    },
    selectSoli(data){
      this.Soli      = data;
      this.estado    = data.estado;
      this.vistaSoli = true;
    },
    solicitarClave(tipo){
      this.dialogoSoli = false;
      this.dialogoSoliHechas = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        if (tipo === 1 || tipo === 3)
          this.abrirNavegador(res.data.clave, tipo);
        else if (tipo === 2)
          this.storeHistorialSolicitud(res.data.clave, tipo)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
    storeHistorialSolicitud(clave, tipo){
      this.dialogoSoli = false;
      let nivel = this.SOLICITUD.tipo_busqueda < 3 ? 1: this.nivel
      let ids = []
      this.seleccionados.forEach(item=>{
        ids.push(item.id);
      })
      this.$axios.post('contabilidad/formato_pago/solicitud_pado/hist_soli',{
        ids:   ids,
        total: this.total,
        nivel: nivel,
        id:    this.SOLICITUD.id
      }).then((res)=>{
        this.abrirNavegador(clave,tipo, res.data.ref, res.data.fecha);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al registrar el correlativo', color:'error'});
        this.$store.commit('activarOverlay', false)
      })
    },
    validarRegistroPago(){
      if (this.forma_pago === 1 && this.cuenta_id > 0 && this.filePago)
        this.registrarPago();
      else if (this.forma_pago === 2 && this.caja_id > 0 && this.filePago)
        this.registrarPago();
      else
        this.$store.commit('notificacion', {texto:'Si seleccionaste forma de pago banco, tienes que seleccionar una cuenta.' +
              ' Si seleccionaste caja, tienes que seleccionar una caja, ademas tienes que cargar un documento.', color:'warning'});
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        ipcRenderer.send('pint_navegador', res.data.url);
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
  position: relative;
  cursor: pointer;
  border: solid 1px #aaaaaa;
}
table tr{
  border-bottom: solid 1px #aaaaaa;
}
table thead tr th{
  font-size: 11px;
}
table tr td{
  font-size: 11px;
  border-left: solid 4px #aaaaaa;
  margin-left: 7px;
  padding: 2px;
}
table tr td:hover{
  color: blue;
}
input{
  border: none;
  font-size: 10px;
  height: 20px;
  padding: 5px;
  width: 70px;
  border-bottom: solid 1px #FFFFFF;
}
.cajaInput {
  border:1px solid #d9d9d9;
  height:20px;
  overflow: hidden;
  width: 70px;
  position:relative;
}
</style>
