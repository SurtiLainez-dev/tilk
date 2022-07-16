import Swal from "sweetalert2";
<template>
  <v-container class="pl-2 pt-2 pr-2">
    <v-card class="pl-2 pr-2">
<!--  Encabezado de la pagina    -->
      <v-row>
        <v-col cols="4" class="d-flex justify-center align-center">
          <v-btn dark color="orange" tile small class="ma-2" @click="popupPlanilla = true">Crear Planilla</v-btn>
          <v-btn dark color="primary" tile small class="ma-2" @click="popupAcciones = true">Crear Acciones</v-btn>
        </v-col>
        <v-col cols="8" class="d-flex justify-center">
          <v-card-title>
            Área de Trábajo
          </v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
<!--  fin de encabezado    -->
      <v-container v-if="disabledArea">
<!--    titulo    -->
        <v-row>
          <v-col class="d-flex justify-start">
            Sucursal en la que se está trabajando: <strong>{{this.sucursal.nombre}}</strong>
          </v-col>
        </v-row>
<!--    encabezado de fechas    -->
        <v-row  class="d-flex align-center">
          <v-col cols="3">
            <v-select v-model="sucursal.mes" :items="meses" :item-text="'mes'" :item-value="'id'"
                      label="Més de Pago" @click="mesesString">
            </v-select>
          </v-col>
          <v-col cols="3">
            <v-select v-model="sucursal.ano" :items="anos"
                      label="Año de Pago">
            </v-select>
          </v-col>
          <v-col cols="6" class="d-flex align-center">
            <v-row>
              <v-col cols="6" class="d-flex justify-center">Périodo de Pago:</v-col>
              <v-col cols="3">
                <v-text-field  v-model="sucursal.periodo.inicio"
                               :rules="[rulesFinal.req,rulesFinal.num, rulesFinal.minI]"
                               label="del" required></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field  v-model="sucursal.periodo.final"
                               label="al"
                               :rules="[rulesFinal.req,rulesFinal.num,rulesFinal.lest, rulesFinal.maxF]"></v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
<!--    fin enzabezado de fechas    -->
        <v-divider></v-divider>
<!--    Cuerpo de la tabla  de los empleados   -->
        <v-row>
          <v-col class="d-flex justify-start">Colaboradores en la Planilla</v-col>
        </v-row>

        <v-form ref="FormRegistroPlanilla">
          <v-simple-table dense v-model="selected">
            <template v-slot:default>
              <thead>
              <tr>
                <th >Nombre Completo</th>
                <th >Cargo</th>
                <th >Sueldo Base</th>
                <th >Tipo de Pago</th>
                <th >Días Tra.</th>
                <th >Pago</th>
                <th >Total Agregado</th>
                <th >Total Deducido</th>
                <th >Total Pago</th>
                <th >Acciones</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in dataPlanilla">
                <td>{{item.nombreCompleto}}</td>
                <td>{{item.tipoCol}}</td>
                <td>L. {{item.sueldo_base}}</td>
                <td>
                  <select class="input" v-model="dataPlanilla[i].tipoPago" @change="diasTrabajados(i)">
                    <option v-for="item in rangos" :value="item.id+'-'+item.dias">{{item.nombre}}</option>
                  </select>
                </td>
                <td>
                  <v-text-field v-model="dataPlanilla[i].dias_trabajados" :rules="[rulesPalnilla.min]"
                                @change="totalPago(i)">
                  </v-text-field>
                </td>
                <td>
                  <v-text-field v-model="dataPlanilla[i].pago" disabled >
                  </v-text-field>
                <td>
                  <v-text-field v-model="dataPlanilla[i].totalAgregado" disabled>
                  </v-text-field>
                </td>
                <td>
                  <v-text-field v-model="dataPlanilla[i].totalDeducido" disabled>
                  </v-text-field>
                </td>
                <td>
                  <v-text-field v-model="dataPlanilla[i].totalPago" disabled>
                  </v-text-field>
                </td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="handleSelected(i)" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                        <v-icon >fa fa-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Agregar Acciones a {{item.nombreCompleto}}</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-text-field :counter="250" v-model="sucursal.observacion"
                        label="Observación de la Planilla" >
          </v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn color="orange" @click="dialogoVerificar = true" dark>Registrar Planilla</v-btn>
          </v-col>
        </v-row>
      </v-container>

    </v-card>

<!--    dialogo para crear planillas-->
    <v-dialog v-model="popupPlanilla" width="800px">
      <v-card class="pl-5 pr-5">
        <v-progress-linear indeterminate color="green" v-if="isPeticionSucursal"></v-progress-linear>
        <v-card-title>Creando Planilla de Pago</v-card-title>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="6" class="d-flex justify-center">
            <v-select v-model="sucursal_id" :items="sucursales" :item-text="'nombre'" :item-value="'id'"
                      label="Sucursal" @change="buscarColaboradores">
            </v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar colaborador" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table v-model="selectedColaboradores" :headers="header" :items-per-page="5" show-select
                      :items="colaboradores" :search="search">
          <template v-slot:item.nombres="{item}">
            {{item.nombres}} {{item.apellidos}}
          </template>
        </v-data-table>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn dark color="orange" @click="planillaCol" small tile
                   v-if="selectedColaboradores.length > 0">Registrar Empleados</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
<!--    fin dialogo para crear planillas-->
    <v-dialog v-model="popupAcciones" width="400px">
      <v-card class="pl-5 pr-5">
        <v-card-title>
          Crear una Acción Nueva
        </v-card-title>
        <v-divider></v-divider>
        <v-form ref="FormNuevoTipoAccionPlanilla">
          <v-text-field  :counter="20"  v-model="AccionesP.nombre"
                         :rules="[accion.req,accion.max, accion.min]"
                         label="Nombre de la Acción" required></v-text-field>
          <v-select v-model="AccionesP.tipo" :items="optionsAcciones" :item-text="'nombre'"
                    :item-value="'id'" :rules="[accion.req]"
                    label="Tipo de Acción" ></v-select>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn dark color="orange" @click="addAcciones">Registrar Acción</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
<!--    dialogo para crear acciones-->
<!--    fin dialogo para crear acciones-->
    <v-dialog v-if="dataPlanilla.length > 0" v-model="popupAccionPlanilla" width="700px">
      <v-card class="pr-5 pl-5">
        <v-row>
          <v-col cols="9" class="d-flex align-center">Agregando Acciones a {{dataPlanilla[index].nombreCompleto}}</v-col>
          <v-col cols="3" class="d-flex justify-end align-center">
            <v-btn dark color="orange" small class="ma-2" @click="addAccion" >Agregar Acción</v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <small>Cuadro de Acciones:</small>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
            <tr>
              <th>Seleccion Acción</th>
              <th>Total Acción</th>
              <th>Eliminar Acción</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,i) in dataPlanilla[index].acciones" @change="selectTipoAccion(i)">
              <td>
                <select class="input" v-model="dataPlanilla[index].tipoAccion[i]">
                  <option v-for="item in tipoAcciones" :value="item.id+'-'+item.tipo">{{item.nombre}}</option>
                </select>
              </td>
              <td>
                <v-text-field :value="0" :rules="[num.rule.tel]"  v-model="dataPlanilla[index].totalAccion[i]">
                </v-text-field>
              </td>
              <td>
                <v-btn small color="red" dark @click="deleteAccion(i)">
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="4">
            Agregado: L. <strong>{{dataPlanilla[this.index].totalAgregado}}</strong>
          </v-col>
          <v-col cols="4">
            Deducido: L. <strong>{{dataPlanilla[this.index].totalDeducido}}</strong>
          </v-col>
          <v-col cols="4">
            Total a Pagar: L. <strong>{{dataPlanilla[this.index].totalPago}}</strong>
          </v-col>
        </v-row>
        <v-row>
          <v-col  class="d-flex justify-end">
            <v-btn dark color="orange" small class="ma-2" @click="popupAccionPlanilla = false" >Registrar Acciones</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
<!--    fin dialogo para crear acciones nueva-->
<!--    dialogo verificacion de planillas-->
    <v-dialog v-model="dialogoVerificar" width="440px">
      <v-card class="pl-5 pr-5">
        <v-card-title>
          Verificación de datos de la planilla
        </v-card-title>
        <v-card-text>
          El periodo de pago abarca del {{sucursal.periodo.inicio}} al
          {{sucursal.periodo.final}} de {{sucursal.nombreMes}}
        </v-card-text>
        <v-card-text>Por favor verífica los todos los datos de la planilla.
          Si ya verífico los datos de la planilla habilite el siguiente switch</v-card-text>
        <v-row class="pl-5">
          <v-col class="d-flex justify-start">
            <v-switch v-model="checkEnviar"></v-switch>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn color="orange" dark :disabled="!checkEnviar" @click="crearPlanilla">Registrar Planilla</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
<!--    fin de dialogo-->
<!--    dialogo para imprimir-->
    <v-dialog v-model="dialogoImprimir" width="400px">
      <v-card class="pl-5 pr-5">
        <v-card-title>Registro Exitoso</v-card-title>
        <v-card-text>La planilla se guardo exitosamente. Puede realizar una
        de las siguientes acciones: </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn dark small color="orange" @click="verPlanillaPdf(urlPdf)" tile>Ver</v-btn>
          <v-btn dark small color="primary" @click="dialogoImprimir = false" tile>Crear Nueva</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  import {ipcRenderer} from "electron";
  var elemtos = []
  export default {
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        num:{
          rule:{
            tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Telefono no válido, tienes datos diferentes a números'
          },
        },
        overlay: false,
        rulesPalnilla:{
          min: v => v > 0 || 'Mayor a 0'
        },
        index: 0,
        accion:{
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
          max:v => (v && v.length <= 20) || 'Tiene que ser menor o igual a 20 carácteres.',
        },
        rulesFinal:{
          req: v => !!v || 'Día requerido',
          lest: v =>  v > this.sucursal.periodo.inicio || 'La fecha final no puede ser menor a la de inicio.',
          minI: v => v > 0 || 'El dato tiene que ser mayor a 0.',
          maxF: v => v <= 31 || 'El dato tiene que ser igual o menor a 31',
          num: v => /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v) || 'Dato no válido, solo acepta números'
        },
        optionsAcciones:[
          {id:'1', nombre: 'Suma'},
          {id:'2', nombre: 'Resta'},
        ],
        urlPdf: '',
        search: '',
        header:[
          {text:'Nombre Completo', value:'nombres'},
          {text:'Puesto', value:'puesto'},
          {text:'Sucursal Asignada', value:'sucursal'},
        ],
        printF:                  false,
        dialogoImprimir:        false,
        checkEnviar:            false,
        dialogoVerificar:       false,
        AccionesP:              {
          nombre: null,
          tipo: null
        },
        popupAcciones:          false,
        popupPlanilla:          false,
        sucursal_id:            '',
        selected:               [],
        sucursal:               {
          id: null,
          nombre: '',
          periodo: {
            inicio: 1,
            final: 31,
          },
          ano:null,
          mes: null,
          nombreMes: null,
          observacion: null,
        },
        selectedColaboradores:  [],
        dataPlanilla:           [],
        colaboradores:          [],
        isPeticionSucursal:     false,
        habilitarVerificacion:  [],
        disabledVerificar:      false,
        disabledArea:           false,
        empleadosSeleccionados: null,
        meses:                  [{"id":1, "mes":"enero"}, {"id":2, "mes":"febrero"}, {"id":3, "mes":"marzo"},
          {"id":4, "mes":"abril"},{"id":5, "mes":"mayo"},{"id":6, "mes":"junio"},
          {"id":7, "mes":"julio"},{"id":8, "mes":"agosto"},{"id":9, "mes":"septiembre"},
          {"id":10, "mes":"octubre"},{"id":11, "mes":"noviembre"}, {"id":12, "mes":"diciembre"}],
        anos:                   [],
        rangos:                 null,
        popupAccionPlanilla:    false,
        tipoAcciones:           null,
        codPlanillasGo:         null

      }
    },
    created() {
      this.cargarRangos();
      this.anios();
      this.cargarTipoAccionesPlanillas();
      this.$store.commit('guardarTitulo', 'Planilla > Nueva')
    },
    methods:{
      addAccion: function(){
        this.dataPlanilla[this.index].acciones++;
        this.dataPlanilla[this.index].totalAccion[this.dataPlanilla[this.index].acciones - 1] = 0
      },
      addAcciones: function(){
        if (this.$refs.FormNuevoTipoAccionPlanilla.validate()){
          this.$axios.post('tipos_acciones',{
            nombre: this.AccionesP.nombre,
            tipo: this.AccionesP.tipo
          },{
            headers:{
              'Authorization': 'Bearer '+ this.$store.state.token,
            }
          }).then((res)=>{
            if (res.data.status){
              Swal.fire(
                  'Registro Exitoso',
                  `Se registro exitosamente el tipo de acción ${this.AccionesP.nombre}.`,
                  'success'
              )
              this.AccionesP.nombre = ''
              this.AccionesP.tipo = ''
              this.cargarTipoAccionesPlanillas()
              this.popupAcciones = false
            }
          })
        }
      },
      anios: function(){
        let fecha = new Date();
        let ano = fecha.getFullYear();
        let anomas = fecha.getFullYear() + 1;
        let menosano = fecha.getFullYear() - 1;
        this.sucursal.ano = ano
        this.anos.push(menosano)
        this.anos.push(ano)
        this.anos.push(anomas)
      },
      buscarColaboradores: function() {
        console.log(this.sucursal_id)
        this.isPeticionSucursal    = true
        this.sucursal.id           = this.sucursal_id
        let fecha                  = new Date();
        this.sucursal.mes          = fecha.getMonth() + 1;
        this.selected              = []
        this.selectedColaboradores = []
        this.dataPlanilla          = []
        return this.$axios.get('empleados_plantilla/'+this.sucursal.id, {
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        }).then((res) =>{
          this.isPeticionSucursal = false
          this.colaboradores = res.data.col

        })
      },
      cargarRangos:function () {
        return this.$axios.get('rangos', {
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        }).then((res)=>{
          this.rangos = res.data.rangos
        })
      },
      cargarTipoAccionesPlanillas: function () {
        return this.$axios.get('tipos_acciones', {
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token,
          }
        }).then((res)=>{
          this.tipoAcciones = res.data.acciones
        })
      },
      crearPlanilla(){
        if (this.$refs.FormRegistroPlanilla.validate()){
          this.dialogoVerificar = false
          this.overlay = true
          return this.$axios.post("/planillas", {
            sucursalId: this.sucursal.id,
            observacion: this.sucursal.observacion,
            mesAsignado: this.sucursal.nombreMes,
            anoAsignado: this.sucursal.ano,
            periodo: `del ${this.sucursal.periodo.inicio} al ${this.sucursal.periodo.final}`,
            colaboradors: this.dataPlanilla,
            mes: this.sucursal.mes
          },{
            headers:{
              'Authorization': 'Bearer '+ this.$store.state.token,
            }
          }).then((res)=>{
            if (res.data.status){
              this.dialogoImprimir = true
              this.disabledArea = false
              this.checkEnviar = false
              this.codPlanillasGo = res.data.id
              this.overlay = false
              this.urlPdf         = res.data.url;
            }
          })
        }else{
          this.checkEnviar = false
          this.dialogoVerificar = false
        }
      },
      deleteAccion: function(item){
        if (item === 0){
          this.dataPlanilla[this.index].tipoAccion = []
          this.dataPlanilla[this.index].totalAccion = []
          this.dataPlanilla[this.index].accionesCol = []
        }
        this.dataPlanilla[this.index].acciones--
        this.dataPlanilla[this.index].tipoAccion.splice(item, item)
        this.dataPlanilla[this.index].totalAccion.splice(item, item)
        this.dataPlanilla[this.index].accionesCol.splice(item, item)
        this.suma()
      },
      diasTrabajados: function(item){
        let diasTrabajados = this.dataPlanilla[item].tipoPago.split('-')[1]
        this.dataPlanilla[item].dias_trabajados = diasTrabajados
        this.dataPlanilla[item].rangoPago = this.dataPlanilla[item].tipoPago.split('-')[0]
        this.totalPago(item)
      },
      habilitarBtnVerificacion: function(){
        if (elemtos.length == this.empleadosSeleccionados){
          this.disabledVerificar = true
        }
      },
      handleSelected(index) {
        this.index = index
        this.popupAccionPlanilla = true
      },
      irPlanillas(){
        this.dialogoImprimir = false
        this.$router.replace({path:"/colaborador/planillas/"+this.codPlanillasGo})
      },
      mesesString: function(){
        for (let item in this.meses){
          if (this.meses[item].id === this.sucursal.mes){
            this.sucursal.nombreMes = this.meses[item].mes
          }
        }
      },
      planillaCol: function() {
        this.sucursal.nombre = this.selectedColaboradores[0].sucursal
        this.habilitarVerificacion = []
        elemtos = []
        this.disabledVerificar = false
        this.dataPlanilla = [];
        this.habilitarVerificacion = 0;
        this.disabledArea = true;
        this.empleadosSeleccionados = this.selectedColaboradores.length;
        for (let item in this.selectedColaboradores){
          this.dataPlanilla.push({
            "colaborador_id": this.selectedColaboradores[item].id, // es el id del colaborador seleccionado
            "dias_trabajados": 0, //este es el campo en el que determina cuanto dias trabajo el trabajador
            "nombreCompleto": this.selectedColaboradores[item].nombres+' '+this.selectedColaboradores[item].apellidos, //nombre completo del trabajador
            "identidad": this.selectedColaboradores[item].identidad, //identidad del trabajador
            "tipoCol": this.selectedColaboradores[item].puesto, //tipo de puesto que tiene en la empresa el empleado
            "sueldo_base": this.selectedColaboradores[item].pago, //este es el sueldo base del trabajador
            "tipoPago": null, //si quicena, mensualidad, semana
            "rangoPago": null, //si quicena, mensualidad, semana
            "totalAgregado": 0, // este es total de dinero que tiene extra sobre el sueldo base
            "totalDeducido": 0, //este es el total de dinero que tiene deducido del total del pago
            "pago": 0, //este es el sueldo base sin deducciones ni sumas
            "totalPago": 0, //esto es el total que se le pagara al trabajador  =(sueldo_base - totalDeducido) + totalAgregado
            "observacion": '', //esta es la observacion corta de este empleado *esta sale impresa
            "acciones": 0, //esta es la cantidad de acciones que tiene el empleado (vales, anticipos, comision)
            "accionesCol": [], //esto es el registro de todas las acciones del empleado
            "tipoAccion":[], //este es para el campo tipo acciones en el select
            "totalAccion": [] //este es el total de la accion que se eligio
          })
        }
        this.mesesString();
        this.popupPlanilla = false
      },
      print: function(){
        this.$router.replace({path:'/colaborador/planillas/pdf/'+this.codPlanillasGo})
      },
      selectTipoAccion: function(item){
        if (this.dataPlanilla[this.index].tipoAccion[item] && this.dataPlanilla[this.index].totalAccion[item]){
          let idAccion = this.dataPlanilla[this.index].tipoAccion[item].split('-')[0]
          let Accion = this.dataPlanilla[this.index].tipoAccion[item].split('-')[1]
          if(Accion == 1){
            if (this.dataPlanilla[this.index].accionesCol[item]){
              this.dataPlanilla[this.index].accionesCol[item].tipoAccion = "suma"
              this.dataPlanilla[this.index].accionesCol[item].tipoId = 1
              this.dataPlanilla[this.index].accionesCol[item].accion_id = idAccion
              this.dataPlanilla[this.index].accionesCol[item].totalAccion = this.dataPlanilla[this.index].totalAccion[item]
            }else{
              this.dataPlanilla[this.index].accionesCol.push({
                "tipoAccion": "suma",
                "tipoId": 1,
                "accion_id": idAccion,
                "totalAccion": this.dataPlanilla[this.index].totalAccion[item]
              })
            }
            this.suma(item)
          }else if (Accion == 2){
            if (this.dataPlanilla[this.index].accionesCol[item]){
              this.dataPlanilla[this.index].accionesCol[item].tipoAccion = "resta"
              this.dataPlanilla[this.index].accionesCol[item].tipoId = 2
              this.dataPlanilla[this.index].accionesCol[item].accion_id = idAccion
              this.dataPlanilla[this.index].accionesCol[item].totalAccion = this.dataPlanilla[this.index].totalAccion[item]
            }else {
              this.dataPlanilla[this.index].accionesCol.push({
                "tipoAccion": "resta",
                "tipoId": 2,
                "accion_id": idAccion,
                "totalAccion": this.dataPlanilla[this.index].totalAccion[item]
              })
            }
            this.suma(item)
          }
        }
      },
      suma: function(){
        this.dataPlanilla[this.index].totalAgregado = 0;
        this.dataPlanilla[this.index].totalDeducido = 0;
        for (let items in this.dataPlanilla[this.index].accionesCol){
          if (this.dataPlanilla[this.index].accionesCol[items].tipoId ==  1){
            this.dataPlanilla[this.index].totalAgregado = (parseFloat(this.dataPlanilla[this.index].totalAgregado) + parseFloat(this.dataPlanilla[this.index].accionesCol[items].totalAccion)).toFixed(2)
          }else if (this.dataPlanilla[this.index].accionesCol[items].tipoId == 2){
            this.dataPlanilla[this.index].totalDeducido = (parseFloat(this.dataPlanilla[this.index].totalDeducido) + parseFloat(this.dataPlanilla[this.index].accionesCol[items].totalAccion)).toFixed(2)
          }
        }
        this.dataPlanilla[this.index].totalPago = ((parseFloat(this.dataPlanilla[this.index].pago) - parseFloat(this.dataPlanilla[this.index].totalDeducido)) + parseFloat(this.dataPlanilla[this.index].totalAgregado)).toFixed(2)
      },
      totalPago: function(item){
        let elem = elemtos.includes(item)
        if(elem === false){
          elemtos.push(item)
          this.habilitarBtnVerificacion()
        }
        let pagoDia = this.dataPlanilla[item].sueldo_base / 30;
        this.dataPlanilla[item].totalPago = (((this.dataPlanilla[item].dias_trabajados * pagoDia) + parseFloat(this.dataPlanilla[item].totalAgregado)) - parseFloat(this.dataPlanilla[item].totalDeducido)).toFixed(2)
        this.dataPlanilla[item].pago = (this.dataPlanilla[item].dias_trabajados * pagoDia).toFixed(2)
      },
      verPlanillaPdf(URL){
        this.dialogoImprimir = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',
            {ubicacion: URL}).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('pint_navegador', res.data.url);
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento', color:'error'});
          this.$store.commit('activarOverlay', false);
        })
      }
    },
    asyncData({$axios, store}){
      return $axios.get('/sucursales',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then( res =>{
        return {
          sucursales: res.data.suc
        }
      })
    },
    name: "nueva"
  }
</script>

<style scoped>
.input{
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
