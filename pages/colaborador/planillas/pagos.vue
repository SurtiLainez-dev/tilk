import Swal from "sweetalert2";
<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-row>
          <v-col cols="10"><v-card-title>Pagos de Planillas</v-card-title></v-col>
          <v-col cols="2" class="d-flex justify-end">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-2" v-on="on" v-bind="attrs" @click="popupInicio = true" color="success" fab x-small dark>
                  <v-icon>fa fa-sync-alt</v-icon>
                </v-btn>
              </template>
              <span>Buscar Información Diferente</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="ma-2">
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header" :items="Colaboradores" :search="search">
          <template v-slot:item.nombres="{item}">
            {{item.nombres}} {{item.apellidos}}
          </template>
          <template v-slot:item.periodo="{item}">
            <strong>{{item.periodo}} de {{item.mes_asignado}}</strong>
          </template>
          <template v-slot:item.total_pagar="{item}">
            <strong>L {{item.total_pagar}}</strong>
          </template>
          <template v-slot:item.estado="{item}">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs" v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
                <v-icon v-on="on" v-bind="attrs" v-else color="red">fa fa-times</v-icon>
              </template>
              <span v-if="item.estado ===1">Planilla Firmada</span>
              <span v-else>Los colaboradores en esta planilla aún no han firmado la planilla</span>
            </v-tooltip>
          </template>
          <template v-slot:item.is_pagado="{item}">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-on="on" v-bind="attrs" v-if="item.is_pagado ===1" color="success">fa fa-check-circle</v-icon>
                <v-icon v-on="on" v-bind="attrs" v-else color="red">fa fa-times</v-icon>
              </template>
              <span v-if="item.is_pagado ===1">Colaborador pagado</span>
              <span v-else>Aún no se le ha pagado al colaborador</span>
            </v-tooltip>
          </template>
          <template v-slot:item.id="{item}">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-if="item.is_pagado ===1" v-on="on" v-bind="attrs" @click="abrirModalPagado(item)"
                       fab x-small color="success" dark>
                  <v-icon>fa fa-eye</v-icon>
                </v-btn>
                <v-btn v-else v-on="on" v-bind="attrs" fab x-small  @click="abrirPopupPagos(item)"
                       color="orange" dark>
                  <v-icon >fa fa-upload</v-icon>
                </v-btn>
              </template>
              <span v-if="item.is_pagado ===1">Ver Comprobante de Pago</span>
              <span v-else>Pagar a {{item.nombres}} {{item.apellidos}}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="popupPago" width="700px">
        <v-card class="pl-5 pr-5">
          <v-card-title>Pagando a {{Pago.nombreCompleto}}</v-card-title>
          <v-divider></v-divider>
          <v-form ref="FormPagoPlanilla">
            <v-row class="pl-2 pr-2">
              <v-col md="5" cols="12">
                <v-select disabled label="Selecione un banco" ></v-select>
              </v-col>
              <v-col md="4" cols="12">
                <v-select disabled label="Selecione una cuenta" ></v-select>
              </v-col>
              <v-col md="3" cols="12">
                <v-text-field  v-model="Pago.montoPagar" disabled label="Monto a Pagar"></v-text-field>
              </v-col>
            </v-row>
            <v-row class="pl-2 pr-2">
              <v-col md="5"cols="12">
                <v-text-field  v-model="Pago.referencia" :rules="[req.req, req.max]" :counter="25"
                               label="Referencia de Pago"></v-text-field>
              </v-col>
              <v-col md="7"cols="12">
                <v-file-input  accept="application/pdf, image/*" v-model="Pago.file"
                               :rules="[req.req]" label="Comprobante de Pago en PDF"></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small color="orange" dark @click="validate">Registrar Pago</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="popupInicio" width="600px">
        <v-card class="pl-5 pr-5">
          <v-progress-linear indeterminate color="green" v-if="isPeticion"></v-progress-linear>
          <div>
            <v-card-title>Pagos de Planillas</v-card-title>
            <v-divider></v-divider>
            <small>Seleccione un Año</small>
            <v-radio-group v-model="Consulta.anio">
              <v-radio
                v-for="item in Anios"
                :key="item.ano"
                :label="`Año ${item.ano}`"
                :value="item.ano"
              ></v-radio>
            </v-radio-group>
            <small>Seleccione un més</small>
            <v-radio-group v-model="Consulta.mes" v-for="item in Anios">
              <v-radio
                v-for="i in item.mes"
                v-if="item.ano === Consulta.anio"
                :label="`Més de ${i.mes_asignado}`"
                :value="i.mes"
              ></v-radio>
            </v-radio-group>
            <small>Seleccione una Sucursal</small>
            <v-radio-group v-model="Consulta.sucursal">
              <v-radio
                v-for="item in Sucursales"
                :label="`${item.nombre}`"
                :value="item.id"
              ></v-radio>
            </v-radio-group>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small color="orange" @click="cargarColaboradores" dark>Consultar Planillas</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalPagado" width="500px">
        <v-card class="pl5 pr-5">
          <v-card-title>Pago de {{Pago.nombreCompleto}}</v-card-title>
          <v-container class="pl-4">
            <v-row class="filas">
              <v-col cols="4">Nombre:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{Pago.nombreCompleto}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Identidad:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{Pago.identidad}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Sucuesal:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{Pago.sucursal}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Planilla:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{Pago.planilla}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Referencia:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{cargaPago.referencia}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Observación:</v-col>
              <v-col cols="8" class="d-flex justify-start">{{cargaPago.obs}}</v-col>
            </v-row>
            <v-row class="filas">
              <v-col cols="4">Ver Comprobante:</v-col>
              <v-col cols="8" class="d-flex justify-start">
                <v-tooltip top v-if="cargaPago.cargando">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn  v-on="on" v-bind="attrs" @click="verPdf"
                           fab x-small color="red" dark>
                      <v-icon>fa fa-file-pdf</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Referencia de Pago</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="orange" dark @click="modalPagado = false">Cerrar</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import Swal from 'sweetalert2'
  export default {
    name: "pagos",
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        search: '',
        overlay: false,
        req:{
          req: v => !!v || 'Campo requerido',
          max:v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        },
        header:[
          {text:'Sucursal', value:'suc'},
          {text:'Colaborador', value:'nombres'},
          {text:'Identidad', value:'identidad'},
          {text:'Planilla', value:'codigo'},
          {text:'Periodo', value:'periodo'},
          {text:'Total a Pagar', value:'total_pagar'},
          {text:'Estado', value:'estado'},
          {text:'Estado Pago', value:'is_pagado'},
          {text:'Acciones', value:'id'},
        ],
        urlPago: '',
        modalPagado: false,
        Anios:null,
        popupInicio: true,
        Consulta:{
          anio: null,
          mes: null,
          sucursal: null
        },
        Colaboradores: [],
        isPeticion:true,
        Sucursales:null,
        popupPago: false,
        Pago:{
          file: null,
          nombreCompleto: null,
          cuerpoId:null,
          referencia: null,
          observacion: null,
          montoPagar: null,
          planilla: null,
          identidad: null,
          sucursal: null
        },
        isPago: false,
        cargaPago:{
          cargando: false,
          referencia: 'cargando...',
          obs: 'cargando...'
        }
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Planillas > Pagos')
      this.isPeticion = true
      this.cargarInfo()
    },
    methods:{
      verPdf(){
        ipcRenderer.send('open-nav', this.urlPago)
      },
      validate(){
        if (this.$refs.FormPagoPlanilla.validate())
          this.registrarPago()
      },
      registrarPago(){
        this.overlay = true
        this.popupPago = false
        let data = new FormData()
        this.isPago = true
        data.append('cuerpo', this.Pago.cuerpoId);
        data.append('referencia', this.Pago.referencia);
        data.append('observacion', this.Pago.observacion);
        data.append('planilla', this.Pago.planilla);
        data.append('foto', this.Pago.file);
        this.$axios({
          method: 'post',
          url:    'pagos',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          if (res.status === 200){
            this.overlay = false
            Swal.fire(
              'Registro Exitoso',
              `El pago se registró exitosamente en la base de datos.`,
              'success'
            )
            this.cargarColaboradores()
            this.Pago.file = null
            this.Pago.referencia = null
            this.isPago = false
          }
        })
      },
      abrirModalPagado(tr){
        this.Pago.nombreCompleto = tr.nombres+' '+tr.apellidos
        this.Pago.identidad = tr.identidad
        this.Pago.planilla = tr.codigo
        this.Pago.sucursal = tr.suc
        this.cargaPago.cargando = true
        this.urlPago = null
        this.Pago.cuerpoId = tr.cuerpo
        this.modalPagado = true
        this.cargarPago()
      },
      abrirPopupPagos(tr){
        this.Pago.planilla = tr.codigo
        this.Pago.nombreCompleto = tr.nombres+' '+tr.apellidos
        this.Pago.cuerpoId = tr.cuerpo
        this.Pago.montoPagar= tr.total_pagar
        this.Pago.observacion = `Pagando a ${this.Pago.nombreCompleto} ${tr.total_pagar} lps de planilla ${tr.codigo}`
        this.popupPago = true
      },
      cargarColaboradores(){
        this.isPeticion = true
        this.$axios.get(`revision_planillas/${this.Consulta.anio}/${this.Consulta.mes}/${this.Consulta.sucursal}`,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        })  .then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.Colaboradores = res.data.col
            this.popupInicio = false

          }
        })
      },
      cargarInfo(){
        this.Sucursales = []
        this.Anios = []
        this.$axios.get('revision_planillas',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Anios = res.data.anos
            this.Sucursales = res.data.suc
            this.isPeticion = false
          }
        })
      },
      cargarPago(){
        this.urlPago = 'cargando...'
        this.cargaPago.obs = 'cargando...'
        this.cargaPago.referencia = 'cargando...'
        this.cargaPago.cargando = false
        this.$axios.get('pagos/'+this.Pago.cuerpoId,{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        }).then((res)=>{
          if (res.status === 200){
            this.urlPago = res.data.url
            this.cargaPago.referencia = res.data.cuerpo.referencia
            this.cargaPago.obs = res.data.cuerpo.observacion
            this.cargaPago.cargando = true
          }
        })
      }
    }
  }
</script>

<style scoped>
.filas{
  border: solid #000 1px;
}
</style>
