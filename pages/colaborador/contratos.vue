<template>
  <v-container class="pt-2 pr-2 pl-2">
    <v-card>
      <v-row>
        <v-col cols="4">
          <v-card-title>
            Contratos
          </v-card-title>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar colaborador" single-line hide-details></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex justify-end align-center">
          <div class="pr-2">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn @click="dialogoNuevo = true" v-on="on" v-bind="attrs" color="success" fab x-small dark>
                  <v-icon >fa fa-plus</v-icon>
                </v-btn>
              </template>
              <span>Crear un Nuevo Contrato</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table dense :headers="header" :items="datosContratos" :loading="isPeticion"
                    loading-text="Cargando contratos... por favor espere un momento" class="rowsTable"
                    :search="search" :items-per-page="10" @click:row="redirectColaborador">
        <template v-slot:item.nombres="{item}" >
          {{item.nombres}} {{item.apellidos}}
        </template>
        <template v-slot:item.pago="{item}">
          L. {{item.pago}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
          <v-icon v-else color="red">fa fa-times</v-icon>
        </template>
        <template v-slot:item.observacion="{item}">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-on="on" v-bind="attrs" v-if="item.observacion">{{item.observacion.substr(0,20)}} ...</span>
              <span v-on="on" v-bind="attrs" v-else>No hay</span>
            </template>
            <span v-if="item.observacion">{{item.observacion}}</span>
            <span v-else>No hay observaciones</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog width="500" v-model="dialogoNuevo">
      <v-progress-linear indeterminate color="green" v-if="isPeticion"></v-progress-linear>
      <v-card class="pr-2 pl-2">
        <v-card-title>Creando Nuevo Contrato</v-card-title>
        <v-divider></v-divider>
        <v-form ref="FormNuevoContrato" class="pl-2 pr-2">
          <v-row>
            <v-col cols="6">
              <v-select v-model="contratos.sucursal" :items="sucursales" :item-text="'nombre'" :item-value="'id'"
                        label="Sucursal" :rules="[rule.pago.req]" @change="cargarColaborador"></v-select>
            </v-col>
            <v-col cols="6">
              <v-select v-model="contratos.empleado" :items="colaboradores"
                        :item-text="'nombres'" :item-value="'id'"
                        label="Colaboradores" :rules="[rule.pago.req]" >
                <template slot='item' slot-scope='{ item }'>
                  {{ item.nombres }} {{ item.apellidos }}
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-dialog ref="dialogFechaInicio" v-model="dialogoDateInicio" :return-value.sync="contratos.fecha_inicio"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :rules="[rule.pago.req]" v-model="contratos.fecha_inicio" label="Fecha de Inicio"
                    readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="contratos.fecha_inicio" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogoDateInicio = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(contratos.fecha_inicio)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6">
              <v-dialog ref="dialogFechaFinal" v-model="dialogoDateFinal" :return-value.sync="contratos.fecha_final"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field :rules="[rule.pago.req]" v-model="contratos.fecha_final" label="Fecha de Inicio"
                                readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="contratos.fecha_final" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogoDateFinal = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(contratos.fecha_final)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field v-model="contratos.pago" :rules="[rule.pago.req]"
                            label="Pago" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea counter="200" :rows="3" :row-height="5" v-model="contratos.observacion"
                          :rules="[rule.pago.max]"
                          label="Observacion">
              </v-textarea>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex flex-row-reverse">
              <v-btn @click="validate" :disabled="isSubmit" color="warning" dark small tile>Agregar Contrato</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    name: "contratos",
    data(){
      return{
        dialogoDateInicio: false,
        dialogoDateFinal: false,
        rule:{
          pago:{
            req: v => !!v || 'Campo requerido',
            max: v => v.length <= 200 || 'Ingresar máximo 200 carácteres',
          },
        },
        isSubmit: false,
        search: '',
        datosContratos: [],
        dialogoNuevo: false,
        isPeticion: false,
        popupContratos: false,
        sucursales:[],
        colaboradores: [],
        contratos:{
          sucursal: '',
          empleado: '',
          fecha_inicio: new Date().toISOString().substr(0, 10),
          fecha_final: new Date().toISOString().substr(0, 10),
          pago:'',
          observacion: ''
        },
        erroresServidor: [],
        header:[
          {text:'Nombre Completo', value:'nombres'},
          {text:'Fecha Comienzo', value:'fecha_inicio'},
          {text:'Fecha Finalización', value:'fecha_final'},
          {text:'Pago Contrato', value:'pago'},
          {text:'Estado', value:'estado', align:'center'},
          {text:'Observación',value:'observacion'}
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Contratos')
      this.cargarContratos();
      this.cargarSucursales()
    },
    methods:{
      validate(){
        if (this.$refs.FormNuevoContrato.validate())
          this.registrarContrato()
      },
      redirectColaborador(tr){
        this.$router.replace({path:'/colaborador/'+tr.col})
      },
      registrarContrato: function(){
        this.isSubmit = true
        let fechaI = this.contratos.fecha_inicio.split('T')[0];
        let fechaF = this.contratos.fecha_final.split('T')[0];
        this.contratos.fecha_inicio = fechaI;
        this.contratos.fecha_final  = fechaF;
        this.$axios.post('save_contrato',{
          finicio:     this.contratos.fecha_inicio,
          ffinal:      this.contratos.fecha_final,
          observacion: this.contratos.observacion,
          colaborador: this.contratos.empleado,
          pago:        this.contratos.pago
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.isSubmit = false
          this.isPeticion = false
          this.dialogoNuevo = false
          if (res.status === 200){
            Swal.fire(
              'Registro Exitoso',
              `Se registro el contrato exitosamente.`,
              'success'
            )
          }
          this.cargarContratos()
        })
      },
      cargarColaborador: function () {
        this.isPeticion = true
        this.$axios.get('colaboradores_suc/'+this.contratos.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.isPeticion = false
          if (res.status === 200){
            this.colaboradores = res.data.col
          }
        })
      },
      cargarContratos(){
        this.isPeticion = true
        this.$axios.get('/contratos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.datosContratos = res.data.contratos
          }
        })
      },
      cargarSucursales(){
        this.$axios.get('/sucursales',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status ===200){
            this.sucursales = res.data.suc
          }
        })
      }
    },
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
