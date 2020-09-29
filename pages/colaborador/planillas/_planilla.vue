import Swal from "sweetalert2";
<template>
    <v-container class="pl-2 pt-2 pr-2">
      <v-card>
        <v-progress-linear indeterminate color="green" v-if="!cargaPagina"></v-progress-linear>
        <div v-if="Planilla">
          <v-row>
            <v-col cols="9"><v-card-title>Información General de la Planilla {{Planilla.codigo}}</v-card-title></v-col>
            <v-col cols="3" class="d-flex align-center justify-end">
              <div class="pl-2 pr-2" v-if="estadoPlanillaSubida || estadoPlanillaSubida === 1">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="verFile"  v-on="on" v-bind="attrs" color="red" fab x-small dark>
                      <v-icon>fa fa-file-pdf</v-icon>
                    </v-btn>
                  </template>
                  <span>Ver planilla subida firmada</span>
                </v-tooltip>
              </div>
              <div class="pl-2 pr-2">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="popupSubir = true"  v-on="on" v-bind="attrs" color="success" fab x-small dark>
                      <v-icon>fa fa-upload</v-icon>
                    </v-btn>
                  </template>
                  <span>Subir planilla firmada</span>
                </v-tooltip>
              </div>
              <div class="pl-2 pr-2">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="pdf"  v-on="on" v-bind="attrs" color="primary" fab x-small dark>
                      <v-icon>fa fa-print</v-icon>
                    </v-btn>
                  </template>
                  <span>Imprimir Planilla</span>
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
          <div style="border: solid #000 1px; height: 160px">
            <v-row class="pl-2 pr-2" dense >
              <v-col cols="6">Périodo: <strong>{{Planilla.periodo}} de {{Planilla.mes_asignado}} de {{Planilla.ano}}</strong></v-col>
              <v-col cols="6" class="d-flex justify-end">Fecha de Creación: <strong>{{Planilla.fecha_creacion}}</strong></v-col>
            </v-row>
            <v-row class="pl-2 pr-2" dense>
              <v-col class="d-flex justify-end">Usuario Creador: <strong>{{Planilla.user.usuario}}</strong></v-col>
            </v-row>
            <v-row dense class="pl-2 pr-2">
              <v-col cols="6" class="d-flex justify-start">
                Sucursal: <strong>{{Planilla.sucursal.nombre}}</strong>
              </v-col>
              <v-col class="d-flex justify-end">Total de la Planilla: <strong>L. {{Planilla.total_planilla}}</strong></v-col>
            </v-row>
            <v-row class="pl-2 pr-2" dense><v-col class="d-flex justify-end">
              Estado de Firma:
              <v-icon v-if="Planilla.estado ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon v-else color="red">fa fa-times</v-icon>
            </v-col></v-row>
            <v-row class="pl-2 pr-2" dense><v-col class="d-flex justify-end">
              Estado de Pagado el Total de la Planilla:
              <v-icon v-if="Planilla.is_pagado ===1" color="success">fa fa-check-circle</v-icon>
              <v-icon v-else color="red">fa fa-times</v-icon>
            </v-col></v-row>
          </div>
          <v-card-title>Cuerpo de la Planilla</v-card-title>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Colaborador</th>
                  <th>Identidad</th>
                  <th>Sueldo Base</th>
                  <th>Días Tra.</th>
                  <th>Pago</th>
                  <th>T. Agregado</th>
                  <th>T. Deducido</th>
                  <th>Total Pago</th>
                  <th>Pagado</th>
                </tr>
              </thead>
              <tbody v-for="item in Planilla.cuerpo_planillas" style="border: solid #000 1px">
                <tr>
                  <td> * {{item.colaborador[0].nombres}} {{item.colaborador[0].apellidos}}</td>
                  <td>{{item.colaborador[0].identidad}}</td>
                  <td>L. {{item.sueldo_base}}</td>
                  <td>{{item.dias_trabajados}} días</td>
                  <td>L. {{item.pago}}</td>
                  <td>L. {{item.total_agregado}}</td>
                  <td>L. {{item.total_deducido}}</td>
                  <td>L. {{item.total_pagar}}</td>
                  <td>
                    <v-icon v-if="item.is_pagado || item.is_pagado === 1" color="green">fa fa-check</v-icon>
                    <v-icon v-else color="red">fa fa-times</v-icon>
                  </td>
                </tr>
                <tr v-if="item.acciones.length > 0">
                  <td colspan="2">
                    <v-simple-table v-if="item.acciones.length > 0">
                      <template v-slot:default>
                        <thead>
                          <th>Nomre Acción</th>
                          <th>Agregado</th>
                          <th>Deducido</th>
                        </thead>
                        <tbody>
                        <tr v-for="i in Planilla.acciones_planillas" v-if="i.cuerpo_planilla_id === item.id">
                          <td>{{i.acciones[0].nombre}}</td>
                          <td v-if="i.acciones[0].tipo === 1">L. {{i.total}}</td>
                          <td v-else>L. 0</td>
                          <td v-if="i.acciones[0].tipo === 2">L. {{i.total}}</td>
                          <td v-else>L. 0</td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card>

      <v-dialog v-model="popupSubir" width="400px">
        <v-card class="pl-5 pr-5">
          <v-card-title>Subiendo Planilla Firmada</v-card-title>
          <v-divider></v-divider>
          <v-form ref="FormSubirPlanillaFirmada">
            <v-file-input v-model="filePlanilla" accept="application/pdf"
                          :rules="req" label="Planilla Firmada"></v-file-input>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small color="orange" @click="subirPlanillaFirmada" dark>Subir Planilla</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>

      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import { ipcRenderer} from 'electron'
  import Swal from 'sweetalert2'
  export default {
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        req:[
          v => !!v || 'Campo requerido',
        ],
        dialogoSubir: false,
        isFIleSubir: false,
        popupSubir: false,
        infoPlantilla:       {
          fecha_creacion: null,
          total:          null,
          usuario_creador: null,
          periodo:        null,
          estado:        null,
        },
        Planilla:            null,
        theadAcciones:       ['Nombre Completo',
          'Nombre de la Acción','Agregados','Deducidos'],
        theadCuerpoPlanilla: ['Colaborador','Identidad','Puesto','Suedlo Base','Días T.',
          'Pago','Total Agregado','Total Deducido','Total'],
        filePlanilla: null,
        errorSubida: false,
        cargaPagina: false,
        estadoPlanillaSubida: null,
        overlay: false,
      }
    },
    created() {
      this.cargarPlanilas()
    },
    methods:{
      subirPlanillaFirmada(){
        if (this.$refs.FormSubirPlanillaFirmada.validate()){
          this.isFIleSubir  = true
          this.errorSubida = false
          let data = new FormData();
          data.append('id', this.Planilla.id);
          data.append('planilla', this.filePlanilla);
          this.popupSubir = false;
          this.overlay = true
          this.$axios({
            method: 'post',
            url: 'planilla/subir',
            data:data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            if (res.status === 200){
              this.overlay = false
              this.estadoPlanillaSubida = true
              Swal.fire(
                'Carga Exitosa',
                `Se cargó exitosamente la planilla firmada.`,
                'success'
              )
            }
          })
        }
      },
      pdf(){
        this.overlay = true
        this.$axios.get('planillas_pdf/'+this.Planilla.id,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.overlay = false
          ipcRenderer.send('open-nav', res.data.url)
        })
      },
      verFile(){
        this.overlay = true
        this.$axios.get('planillas_file/'+this.Planilla.id,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.overlay = false
          ipcRenderer.send('open-nav', res.data.url)
        })
      },
      cargarPlanilas(){
        this.$axios.get('/planillas/'+this.$route.params.planilla,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.cargaPagina = true
            this.Planilla = res.data.planilla
            this.estadoPlanillaSubida = this.Planilla.estado
            this.$store.commit('guardarTitulo', 'Planilla > '+this.Planilla.codigo)
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
