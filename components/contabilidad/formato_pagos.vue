<template>
  <v-card class="ma-2" flat tile>
    <v-toolbar flat dense tile>
      <v-btn color="warning" dark small icon text v-if="VISTA === 2" @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-card-title>{{titulo}}</v-card-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-divider></v-divider>
    <v-form ref="FormNuevoContratoProveedor">
      <v-row no-gutters>
        <v-col>
          <v-autocomplete v-model="proveedor_id" :items="Proveedores" :item-text="'nombre'" :item-value="'id'"
                          @change="Proveedor = Proveedores.find(({id}) => id === proveedor_id)"
                          class="ma-2" dense label="Proveedor" :rules="[rules.req]"></v-autocomplete>
        </v-col>
        <v-col >
          <v-autocomplete dense label="Sucursal" :item-text="'nombre'" @change="cargarGASTOS"
                          v-model="sucursal" class="ma-2" :item-value="'id'" :rules="[rules.req]"
                          :items="SUCURSALES" :loading="LOADSUCURSALES"></v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete dense label="Tipo de gasto" v-model="tipo_gasto"
                          @change="selectGasto" :rules="[rules.req]"
                          :items="Gastos" :item-text="'nombre'" :item-value="'id'"
                          class="ma-2" :loading="loadGastos"></v-autocomplete>
        </v-col>
        <v-col>
          <v-select dense label="Divisa" :item-value="'id'" class="ma-2" :rules="[rules.req]"
                    :hint="Divisa.simbolo?'Cambio del '+Divisa.simbolo+' al L es de L.'+Divisa.cambio : ''" persistent-hint
                    :items="DIVISAS" :item-text="'nombre'" v-model="tipo_divisa" @change="selectDivisa"></v-select>
        </v-col>
        <v-col >
          <v-select dense label="Estado del contrato" :rules="[rules.req]"
                    class="ma-2" :items="Estados" v-model="estado"></v-select>
        </v-col>
        <v-col>
          <v-text-field dense label="# de contrato" v-model="num_contrato" counter
                        class="ma-2" :rules="[rules.req, rules.nombre.min, rules.nombre.max]"></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="2" >
          <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fecha_inicio"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de inicio del contrato" v-bind="attrs" v-on="on"
                            v-model="fecha_inicio" :rules="[rules.req]"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_inicio" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fecha_inicio)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="2" >
          <v-dialog ref="dialogFechaFinal" v-model="dialogoFechafinal" :return-value.sync="fecha_final"
                    persistent width="290px">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense class="ma-2" label="Fecha de final del contrato" v-bind="attrs" v-on="on"
                            v-model="fecha_final" :rules="[rules.req]"></v-text-field>
            </template>
            <v-date-picker v-model="fecha_final" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="dialogoFechafinal = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_final)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
        <v-col cols="2">
          <v-autocomplete label="Fomato de pago enlazado" disabled class="ma-2" dense></v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-text-field dense class="ma-2" label="Meses" v-model="meses" @change="calcularTotales(1)"
                        type="number" suffix="meses" :rules="[rules.req, rules.meses.min]"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field dense class="ma-2" label="Mes actual del contrato" @change="calcularTotales(1)"
                        v-model="mes_actual" type="number" suffix="meses" :rules="[rules.req, rules.meses.actual]"></v-text-field>
        </v-col>
        <v-col cols="2">
          <div :class="documeno_escaneado?'d-flex justify-center': ''">
            <v-file-input v-if="!documeno_escaneado" :rules="[rules.req]" dense label="Contrato Escaneado" v-model="documeno_escaneado"></v-file-input>
            <b-link v-else @click="verDocumento(documeno_escaneado)">Ver contrato</b-link>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col >
          <v-textarea dense  class="ma-2" rows="2" :rules="[rules.req, rules.detalle.min, rules.detalle.max]"
                        label="Detalle del contrato" v-model="detalle" counter></v-textarea>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-text-field class="ma-2" dense label="Divisa - Cuota" :prefix="Divisa.simbolo" :rules="[rules.meses.min]"
                        v-model="divisa_cuota" type="number" @keyup.enter="calcularTotales(1)"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Divisa - Total" :prefix="Divisa.simbolo" :rules="[rules.meses.min]"
                        v-model="divisa_total_cuota" type="number" @keyup.enter="calcularTotales(2)"> </v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Divisa - Saldo Abonado" :prefix="Divisa.simbolo"
                        v-model="divisa_total_abonado" type="number" @keyup.enter="calcularTotales(2)"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Divisa - Saldo Actual" :prefix="Divisa.simbolo"
                        v-model="divisa_saldo_actual" type="number" @keyup.enter="calcularTotales(2)"></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Cuota" :prefix="SIMDIVISA"
                        v-model="cuota" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Total" :prefix="SIMDIVISA"
                        v-model="total_cuota" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Saldo Abonado" :prefix="SIMDIVISA"
                        v-model="total_abonado" disabled></v-text-field>
        </v-col>
        <v-col>
          <v-text-field class="ma-2" dense label="Saldo Actual" :prefix="SIMDIVISA"
                        v-model="saldo_actual" disabled></v-text-field>
        </v-col>
      </v-row>
      <small>Tabla de Pagos</small>
      <v-card flat tile class="pa-4" height="400px" style="overflow-y: auto">
        <table>
          <thead>
          <tr>
            <th>#</th>
            <th>Detalle</th>
            <th>Saldo Inicial</th>
            <th>Saldo Abonado</th>
            <th>Saldo Actual</th>
            <th>Factura Escaneada</th>
            <th class="text-center">Estado</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in documentos">
            <td>{{item.key + 1}}</td>
            <td>{{item.detalle}}</td>
            <td>L. {{int.format(item.saldo_inicial)}}</td>
            <td>
              <input v-model="item.saldo_abonado" type="number"/>
            </td>
            <td>
              <input v-model="item.saldo_actual" type="number"/>
            </td>
            <td>
              <b-link v-if="item.factura_escaneada" @click="verDocumento(item.factura_escaneada)">Ver factura</b-link>
              <v-btn v-else x-small tile color="indigo" dark @click="item.dialogo = true">Subir Documento</v-btn>
              <v-dialog v-model="item.dialogo" width="30%">
                <v-card>
                  <v-card-title>Documento del pago {{item.detalle}}</v-card-title>
                  <v-divider></v-divider>
                  <div class="ma-4">
                    <v-file-input dense label="Factura escaneada" v-model="filePago"></v-file-input>
                  </div>
                  <v-card-actions class="d-flex justify-end">
                    <v-btn color="warning" tile dark small @click="item.dialogo = false" text>Cerrar</v-btn>
                    <v-btn v-if="filePago" color="success" tile dark small @click="cargarDocumento(item)">Registrar Documento</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </td>
            <td class="d-flex justify-center">
              <v-badge :color="item.estado?'green':'red'" style="margin-top: 10px" dot></v-badge>
            </td>
          </tr>
          </tbody>
        </table>
      </v-card>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile small dark class="ma-2" v-if="VISTA === 1" @click="validarForm">Registrar Contrato</v-btn>
        <v-btn color="success" tile small dark class="ma-2" v-else-if="VISTA === 2" @click="validarForm">Editar Contrato</v-btn>
      </v-card-actions>
    </v-form>

    <!--    <tipo_gasto_contrato_servicios/>-->
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  props:{
    tipo: Number,
    contrato: Object
  },
  name: "formato_pagos",
  created() {
    this.titulo = this.tipo === 1? 'Nuevo Contrato Proveedor de Servicio' : 'Editando Contrato Proveedor de Servicio'
    if (this.tipo === 2){
      this.proveedor_id = this.contrato.proveedor_id;
      this.sucursal     = this.contrato.sucursal_id;
      this.cargarGASTOS();
      this.tipo_divisa  = this.contrato.ct_divisa_id;
      this.tipo_gasto   = this.contrato.tipo_gasto_id;
      this.estado       = this.contrato.estado;
      this.num_contrato = this.contrato.num_contrato;
      this.fecha_inicio = this.contrato.fecha_inicio;
      this.fecha_final  = this.contrato.fecha_finalizacion;
      this.meses        = this.contrato.meses;
      this.mes_actual   = this.contrato.mes_actual;
      this.documeno_escaneado = this.contrato.file;
      this.detalle            = this.contrato.detalle;
      this.divisa_cuota       = this.contrato.total_divisa;
      this.divisa_total_cuota = this.contrato.total_contrato_divisa;
      this.divisa_total_abonado = this.contrato.total_abonado_divisa;
      this.divisa_saldo_actual  = this.contrato.saldo_actual_divisa;
      this.cuota                = this.contrato.total;
      this.total_cuota          = this.contrato.total_contrato;
      this.total_abonado        = this.contrato.total_abonado;
      this.saldo_actual         = this.contrato.saldo_actual;
      this.Divisa               = this.DIVISAS.find(({id}) => id === this.tipo_divisa);

      this.contrato.ct_cuerpo_contrato_proveedor.forEach((item)=>{
        this.documentos.push({
          key: item.id,
          detalle: item.detalle,
          saldo_inicial: item.saldo_inicial,
          saldo_abonado: item.saldo_abonado,
          saldo_actual:  item.saldo_actual,
          factura_escaneada: item.documento_escaneado,
          pago_id:           null,
          estado:            item.estado,
          dialogo:           false,
        })
      })
    }
    this.$store.commit('guardarTitulo','Contabilidad > '+this.titulo);
    this.$store.commit('suc/cargar_SUCURSALES');
    this.cargarProveedores();
    this.$store.commit('contabilidad/divisas/cargarMonedas');
  },
  data(){
    return{
      filePago: null,
      dialogoFiles: false,
      Pago: {},
      titulo: '',
      rules: {
        req: v => !!v || 'Campo requerido',
        nombre: {
          min: v => (v && v.length >= 2) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        detalle: {
          min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
          max: v => (v && v.length <= 300) || 'Tiene que ser menor o igual a 300 carácteres.',
        },
        meses:{
          min: v => (v && v > 1) || 'Tiene que ser mayor a 1',
          actual: v => (v > 0 && Number(v) <= Number(this.meses)) || 'Tiene que ser mayor a 0 y tiene que ser menor a los meses'
        },
        total:{
          abonado: v => (v >=0 && v <= this.divisa_saldo_actual) || 'Tiene que ser menor al total del contrato',
        }
      },
      int: Intl.NumberFormat(),
      proveedor_id: '',
      sucursal: '',
      tipo_gasto: '',
      tipo_contrato: '',
      tipo_divisa: 0,
      detalle: '',
      num_contrato: '',
      divisa_cuota: 0.00,
      divisa_total_cuota: 0.00,
      divisa_total_abonado: 0.00,
      divisa_saldo_actual: 0.00,
      cuota: 0.00,
      total_cuota: 0.00,
      total_abonado: 0.00,
      saldo_actual: 0.00,
      meses: 0,
      mes_actual: 0,
      fecha_inicio: '',
      fecha_final: '',
      estado: 1,
      documentos: [],
      documeno_escaneado: null,
      //gastos
      loadGastos: false,
      Gastos: [],
      Gasto: {},
      Divisa: {},
      //dialogos
      dialogoFechaInicio: false,
      dialogoFechafinal: false,
      //arrays
      Estados: [
        {text:'Al día', value:1},
        {text:'Vencido', value:2},
        {text:'Cancelado', value:3},
      ],
      //PRoveedores
      Proveedores: [],
      loadProveedores:  true,
      Proveedor: {}
    }
  },
  computed:{
    LOADSUCURSALES(){
      return this.$store.state.suc.LOAD_SUCURSALES;
    },
    DIVISAS(){
      return this.$store.state.contabilidad.divisas.DIVISAS
    },
    SUCURSALES(){
      return this.$store.state.suc.SUCURSALES;
    },
    SIMDIVISA(){
      return this.$store.state.contabilidad.divisas.DIVISA.simbolo;
    },
    VISTA:{
      get: function (){
        return this.$store.state.formato_pago_proveedores.contrato_servicios.VISTA;
      },
      set: function (val){
        return this.$store.commit('formato_pago_proveedores/contrato_servicios/setVISTA', val);
      }
    }
  },
  methods:{
    calcularTotales(tipo){
      if (this.tipo_divisa > 0 && this.meses > 0 && this.mes_actual && this.divisa_cuota > 0){
        if (tipo === 1){
          this.divisa_total_cuota   = (this.meses              * this.divisa_cuota).toFixed(2);
          this.divisa_total_abonado = (this.mes_actual         * this.divisa_cuota).toFixed(2);
          this.divisa_saldo_actual  = (this.divisa_total_cuota - this.divisa_total_abonado).toFixed(2);
          Number(this.divisa_total_cuota);
          Number(this.divisa_total_abonado);
          Number(this.divisa_saldo_actual);
        }

        this.cuota         = (this.divisa_cuota         * this.Divisa.cambio).toFixed(2);
        this.total_cuota   = (this.divisa_total_cuota   * this.Divisa.cambio).toFixed(2);
        this.total_abonado = (this.divisa_total_abonado * this.Divisa.cambio).toFixed(2);
        this.saldo_actual  = (this.divisa_saldo_actual  * this.Divisa.cambio).toFixed(2);

        this.crearPagos();
      }
    },
    cargarDocumento(item){
      if (this.filePago){
        item.dialogo = false;
        this.$store.commit('activarOverlay', true);
        let data = new FormData();
        data.append('id', item.key);
        data.append('file', this.filePago);
        this.$axios({
          method: 'post',
          url: 'contabilidad/formato_pago/contrato/pago_cargar_file',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.VISTA = 1
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'warning'});
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
          item.dialogo = true;
        })
      }else
        this.$store.commit('notificacion',{texto:'Tienes que cargar el documento', color:'warning'});
    },
    cargarGASTOS(){
      this.loadGastos = true;
      this.$axios.get('contabilidad/caja_chica/sucursal/'+this.sucursal).then((res)=>{
        this.Gastos     = res.data.tipo_gastos;
        this.loadGastos = false;
      });
    },
    cargarProveedores(){
      this.$axios.get('/proveedores/').then((res)=>{
        this.Proveedores    = res.data.proveedores;
        this.loadProveedores = false;
      })
    },
    crearPagos(){
      this.documentos = [];
      for (let i = 0; i < this.meses; i++){
        this.documentos.push({
          key: i,
          detalle: 'Pago # '+(parseInt(i) + 1)+' de '+this.meses+ 'pagos.',
          saldo_inicial: this.cuota,
          saldo_abonado: 0,
          saldo_actual:  0,
          factura_escaneada: null,
          pago_id: null,
          estado: false,
          dialogo: false,
        })
      }
      let totalAbonado = parseFloat(this.total_abonado);
      let abodado      = 0;
      for (let i = 0; i < this.mes_actual; i++){
        if (Number(totalAbonado) > 0){
          if (totalAbonado >= this.cuota){
            this.documentos[i].saldo_abonado = this.cuota;
            this.documentos[i].saldo_actual  = 0;
            this.documentos[i].estado        = true;
            abodado = this.cuota;
          }else{
            this.documentos[i].saldo_abonado = totalAbonado;
            this.documentos[i].saldo_actual  = (this.documentos[i].inicial - this.documentos[i].saldo_abonado).toFixed(2)
            abodado = totalAbonado;
          }
        }

        totalAbonado = (parseFloat(totalAbonado) - parseFloat(abodado)).toFixed(2);
        totalAbonado = Number(totalAbonado)
      }
    },
    editandoContraro(data){
      this.$axios({
        url: this.$store.state.formato_pago_proveedores.tipo_contrato.URLFORMATOPAGO+'contrato/editar/'+this.contrato.id,
        method: 'post',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.VISTA = 1;
      }).catch((error)=>{
        this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'success'});
        this.$store.commit('activarOverlay', false);
      })
    },
    nuevoContrato(data){
      this.$axios({
        url: this.$store.state.formato_pago_proveedores.tipo_contrato.URLFORMATOPAGO+'contrato',
        method: 'post',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$router.push('/contabilidad/formato_pagos/contratos');
      }).catch((error)=>{
        this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'success'});
        this.$store.commit('activarOverlay', false);
      })
    },
    selectDivisa(){
      this.Divisa = this.DIVISAS.find(({id}) => id === this.tipo_divisa);
      this.calcularTotales();
    },
    selectGasto(){
      this.Gasto = this.Gastos.find(({id}) => id === this.tipo_gasto);
    },
    registrarForm(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('tipo_gasto',            this.tipo_gasto)
      data.append('sucursal_id',           this.sucursal)
      data.append('divisa',                this.tipo_divisa)
      data.append('proveedor_id',          this.proveedor_id)
      data.append('num_contrato',          this.num_contrato)
      data.append('meses',                 this.meses)
      data.append('mes_actual',            this.mes_actual)
      data.append('detalle',               this.detalle)
      data.append('total_divisa',          this.divisa_cuota)
      data.append('total_contrato_divisa', this.divisa_total_cuota)
      data.append('total_abonado_divisa',  this.divisa_total_abonado)
      data.append('saldo_actual_divisa',   this.divisa_saldo_actual)
      data.append('total',                 this.cuota)
      data.append('total_contrato',        this.total_cuota)
      data.append('total_abonado',         this.total_abonado)
      data.append('saldo_actual',          this.saldo_actual)
      data.append('fecha_inicio',          this.fecha_inicio)
      data.append('fecha_finalizacion',    this.fecha_final)
      data.append('estado',                this.estado)
      data.append('pagos',                 JSON.stringify(this.documentos));
      data.append('file',                  this.documeno_escaneado);
      if (this.VISTA === 1)
        this.nuevoContrato(data);
      else if (this.VISTA === 2)
        this.editandoContraro(data);
    },
    validarForm(){
      if (this.$refs.FormNuevoContratoProveedor.validate())
        this.registrarForm();
      else this.$store.commit('notificacion', {texto:'Tienes que llenar el formulario', color:'warning'})
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.notificacion('Ocurrió un error al cargar el documento','error');
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
  margin: 2px;
  font-family: 'Open Sans', sans-serif;
  border-collapse: collapse;
  border: 1px solid #000000;
}
table thead tr th{
  font-size: 11px;
  border-bottom: solid 1px #000000;
}
table tbody tr td{
  font-size: 10px;
  padding: 2px;
  margin-left: 10px;
}
input{
  width: 50%;
  margin: 5px;
  padding: 5px;
  background-color: #DADADA;
  font-size: 8px;
}
</style>
