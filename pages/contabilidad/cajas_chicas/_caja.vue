<template>
  <v-container class="pl-2 pr-2">
    <v-card flat>
      <v-progress-linear color="green" indeterminate v-if="isPeticion"></v-progress-linear>
      <v-container v-else>
        <v-card-title>Caja Chica {{Caja.nombre}}</v-card-title>
        <v-row>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
              <v-row>
                <v-col cols="10"><strong>Total Inicial</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-dollar-sign</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">L. {{Caja.total_inicial}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
              <v-row>
                <v-col cols="10"><strong>Total Actual</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-dollar-sign</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">L. {{Caja.total_actual}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
              <v-row>
                <v-col cols="10"><strong>Fecha Asignación</strong></v-col>
                <v-col cols="2">
                  <v-icon>fa fa-calendar-alt</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.fecha_asignacion ? Caja.fecha_asignacion : 'Sin fecha'}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="light-blue">
              <v-row>
                <v-col cols="10"><strong>Fecha Finalización</strong></v-col>
                <v-col cols="2">
                  <v-icon>fa fa-calendar-alt</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.fecha_finalizacion ? Caja.fecha_finalizacion : 'Sin fecha'}}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="6">
            <v-text-field label="Nombre de la Cuenta Contable" :loading="loadCC"
                          :value="cc_caja ? cc_caja.nombre : 'Cargando'" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field label="Código de la Cuenta" :value="cc_caja ? cc_caja.cod : '0000'"
                          :loading="loadCC" disabled></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field label="Total de la Cuenta" :value="cc_caja ? cc_caja.total : 0"
                          suffix="lps" disabled :loading="loadCC"></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions class="d-flex justify-end">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="orange" v-on="on" text
                     v-bind="attrs" x-small dark fab><v-icon>fa fa-plus</v-icon></v-btn>
            </template>
            <span>Agregar Extensiones de Caja Chica</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="green" v-on="on" text
                     v-bind="attrs" x-small dark fab><v-icon>fa fa-file-excel</v-icon></v-btn>
            </template>
            <span>Informe semanal exportado a Excel</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="red" v-on="on" text
                     v-bind="attrs" x-small dark fab><v-icon>fa fa-file-pdf</v-icon></v-btn>
            </template>
            <span>Informe semanal exportado a PDF</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="indigo" v-on="on" text @click="cambiarVista(3)"
                     v-bind="attrs" x-small dark fab><v-icon>fa fa-plus</v-icon></v-btn>
            </template>
            <span>Incrementar Saldo Actual</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="indigo" v-on="on" text
                     v-bind="attrs" x-small dark fab @click="cambiarVista(4)"><v-icon>fa fa-history</v-icon></v-btn>
            </template>
            <span>Historial de Cuentas</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="indigo" v-on="on" text
                     v-bind="attrs" x-small dark fab @click="cambiarVista(1)"><v-icon>fa fa-history</v-icon></v-btn>
            </template>
            <span>Historial de Transacciones</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn class="ma-2" color="indigo" v-on="on" text @click="cambiarVista(2)"
                     v-bind="attrs" x-small dark fab><v-icon>fa fa-edit</v-icon></v-btn>
            </template>
            <span>Asignar Caja Chica</span>
          </v-tooltip>
        </v-card-actions>
        <v-divider></v-divider>
        <v-card flat :loading="loadHistorial">
          <v-card v-if="vista === 1 || vista === 4" flat>
            <v-toolbar color="grey lighten-3" flat>
              <v-card-title>{{tituloVista}}</v-card-title>
              <v-spacer></v-spacer>
              <v-spacer></v-spacer>
              <v-dialog ref="dialogFechaInicio" v-model="dialogoFechaInicio" :return-value.sync="fecha_inicio"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                                :rules="[rule.pago.req]" v-model="fecha_inicio"></v-text-field>
                </template>
                <v-date-picker v-model="fecha_inicio" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogoFechaInicio = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogFechaInicio.save(fecha_inicio)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              <v-dialog ref="dialogFechaFinal" v-model="dialogoFechaFinal" :return-value.sync="fecha_final"
                        persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense class="ma-2" label="Fecha de inicio" v-bind="attrs" v-on="on"
                                :rules="[rule.pago.req]" v-model="fecha_final"></v-text-field>
                </template>
                <v-date-picker v-model="fecha_final" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dialogoFechaFinal = false">Cancelar</v-btn>
                  <v-btn text color="primary" @click="$refs.dialogFechaFinal.save(fecha_final)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              <v-spacer></v-spacer>
              <v-btn small tile dark @click="consultarHistorialFecha" color="success">Consultar</v-btn>
            </v-toolbar>
            <historial v-if="vista === 1" :historial="Historial"/>
            <historial_cuentas v-else-if="vista === 4" :historial="HistorialCuentas"/>
          </v-card>

          <v-card flat class="d-flex justify-center" v-else-if="vista === 2" :disabled="!PERMISOS.includes(45)">
            <v-card width="50%">
              <v-card-title>Asignar Caja Chica</v-card-title>
              <v-divider></v-divider>
              <v-form ref="FormNuevaAsignacionCajaChica">
                <br>
                <v-text-field label="Observación" :rules="[rule.pago.req, rule.pago.max]"
                              counter dense class="ma-2" v-model="caja.observacionn"></v-text-field>
                <v-row no-gutters>
                  <v-col>
                    <v-text-field label="Total que se Asígnara" :rules="[rule.pago.req]"
                                  suffix="lps" dense class="ma-2" v-model="caja.total_asignado"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-dialog ref="dialogFechaLimte" v-model="dialogoFecha" :return-value.sync="caja.fecha_limite"
                              persistent width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field :rules="[rule.pago.req]" v-model="caja.fecha_limite" label="Fecha de Cierre"
                                      v-bind="attrs" v-on="on" class="ma-2" dense></v-text-field>
                      </template>
                      <v-date-picker v-model="caja.fecha_limite" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="dialogoFecha = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.dialogFechaLimte.save(caja.fecha_limite)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-select class="ma-2" :items="ccCajas" label="Seleccionar una Caja" :loading="loadCCCaja"
                          :item-text="'nombre'" :item-value="'id'" :rules="[rule.pago.req]" v-model="caja.cc_caja_salida"></v-select>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="success" @click="validarForm" dark tile small>Asignar caja chica</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-card>

          <v-card flat class="d-flex justify-center" v-else-if="vista === 3" :disabled="!PERMISOS.includes(45)">

            <v-card width="40%">
              <v-card-title>Aumentar saldo a la caja chica</v-card-title>
              <v-divider></v-divider>
              <v-form ref="FormAumentarCajaChica">
                <v-text-field label="Comentario" :rules="[rule.pago.req, rule.pago.max]"
                              dense class="ma-2" v-model="caja.observacionn"></v-text-field>
                <v-select class="ma-2" :items="ccCajas" label="Seleccionar una caja" :loading="loadCCCaja" @change="seleccionarTotalCaja"
                          :item-text="'nombre'" :item-value="'id'" :rules="[rule.pago.req]" v-model="caja.cc_caja_salida"></v-select>
                <v-text-field label="Saldo que se va aumentar" :rules="[rule.pago.req, rule.pago.min, rule.pago.mayor]"
                              v-model="caja.total_asignado" persistent-hint
                              suffix="lps"  dense class="ma-2" :hint="'Saldo de la caja seleccionada L. '+saldoCajaGeneral"></v-text-field>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="success" dark tile small @click="validarFormAumento">Registrar Aumento</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-card>
        </v-card>
        <br>
        <v-card-actions class="d-flex justify-center">
          <v-card-subtitle>Final de la Caja Chica</v-card-subtitle>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
  import {ipcRenderer} from "electron";
  import historial from "@/components/caja/caja_chica/historial";
  import historial_cuentas from "@/components/caja/caja_chica/historial_cuentas";
  export default {
    components:{historial, historial_cuentas},
    data(){
      return{
        tituloVista: '',
        dialogoFechaInicio: false,
        dialogoFechaFinal: false,
        rule:{
          pago:{
            req: v => !!v || 'Campo requerido',
            max: v => v.length <= 200 || 'Ingresar máximo 200 carácteres',
            min: v => v > 0 || 'Ingresar datos mayor a 0',
            mayor: v => v <= this.saldoCajaGeneral || 'El saldo tiene que ser menor o igual al saldo en '
          },
        },
        Caja: null,
        isPeticion: true,
        caja:{
          cc_caja_salida: '',
          cc_caja_chica: '',
          total_asignado: 0,
          fecha_limite:  '',
          observacionn:  ''
        },
        loadCC: true,
        cc_caja: null,
        loadCCCaja: true,
        ccCajas: [],
        dialogoFecha: false,
        int: new Intl.NumberFormat(),
        visible: true,
        loadHistorial: false,
        Historial: [],
        vista: 1,
        saldoCajaGeneral: 0,
        fecha_final: '',
        fecha_inicio: '',
        HistorialCuentas: []
      }
    },
    created() {
      this.cargarCaja();
    },
    methods:{
      cambiarVista(val){
        this.vista = val;

        if (this.vista === 1) {
          this.tituloVista = 'Historial de Transacciones';
          this.cargarFecha();
        }else if (this.vista === 4){
          this.tituloVista = 'Historial de Cuentas de Gastos';
          this.consultarHistorialCuentas();
        }
      },
      cargarCCCajaChica(){
        this.$axios.get('contabilidad/2.0/cargar_cuenta/cod_dep/1112/tabla/cajas_chicas/id/'+this.Caja.id).then((res)=>{
          this.cc_caja = res.data.cc
          this.loadCC = false;
        })
      },
      cargarCCCajas(){
        this.$axios.get('contabilidad/2.0/cargando_cuentas/1111').then((res)=>{
          if (res.data.cuentas){
            res.data.cuentas.forEach((item)=>{
              this.ccCajas.push({
                id: item.id,
                nombre: item.nombre+' - L. '+this.int.format(item.total),
                total: item.total
              });
              this.saldoCajaGeneral = item.total;
            })
          }else{
            this.$store.commit('notificacion',{texto:'No hay cajas', color:'warning'})
          }
          this.loadCCCaja = false;
        })
      },
      cargarCaja(){
        this.$axios.get('/caja_chica/'+this.$route.params.caja,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Caja = res.data.caja
            this.isPeticion = false
            this.$store.commit('guardarTitulo', 'Caja Chica > '+this.Caja.nombre);
            this.fecha_final = this.Caja.fecha_finalizacion;
            this.fecha_inicio =  this.Caja.fecha_asignacion;
            this.cargarCCCajaChica();
            this.cargarCCCajas();
            this.cargarFecha();
          }
        })
      },
      cargarFecha(){
        if (this.Historial.length === 0){
          this.tituloVista = 'Historial de Transacciones';
          this.consultarHistorialFecha();
        }
      },
      consultarHistorialFecha(){
        this.loadHistorial = true;
        if (this.vista === 1){
          this.Historial = [];
          this.$axios.get('contabilidad/caja_chica/'+this.Caja.id+'/historial/fecha_inicio='+this.fecha_inicio+'/fecha_final='+this.fecha_final).then((res)=>{
            this.Historial = res.data.historial;
            this.loadHistorial = false;
          })
        }else if (this.vista === 4){
          this.consultarHistorialCuentas();
        }
      },
      consultarHistorialCuentas(){
        this.loadHistorial = true;
        this.$axios.get('contabilidad/caja_chica/'+this.Caja.id+'/historial_cuentas/fecha_inicio='+this.fecha_inicio+'/fecha_final='+this.fecha_final).then((res)=>{
          this.HistorialCuentas = res.data.historial;
          this.loadHistorial = false;
        })
      },
      registrarAsignacion(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('contabilidad/caja_chica/asignar',{
          caja_chica:    this.Caja.id,
          total:         this.caja.total_asignado,
          fecha:         this.caja.fecha_limite,
          observacion:   this.caja.observacionn,
          cc_caja:       this.caja.cc_caja_salida,
          cc_caja_chica: this.cc_caja.id,
        }).then((res)=>{
          this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
          this.$store.commit('activarOverlay', false);
          this.caja.cc_caja_salida = '';
          this.caja.fecha_limite   = '';
          this.caja.observacionn   = '';
          this.caja.total_asignado = 0;
          let url = this.$axios.defaults.baseURL+res.data.url;
          ipcRenderer.send('pint_navegador', url);
          this.cargarCaja();
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      registrarAumento(){
        this.$store.commit('activarOverlay', true);
        this.$axios.put('contabilidad/caja_chica/'+this.Caja.id+'/aumento', {
          caja_chica:    this.Caja.id,
          total:         this.caja.total_asignado,
          observacion:   this.caja.observacionn,
          cc_caja:       this.caja.cc_caja_salida,
          cc_caja_chica: this.cc_caja.id,
        }).then((res)=>{
          this.caja.total_asignado = 0;
          this.caja.observacionn   = '';
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          let url = this.$axios.defaults.baseURL+res.data.url;
          ipcRenderer.send('pint_navegador', url);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      seleccionarTotalCaja(){
        let caja = this.ccCajas.filter(item => item.id === this.caja.cc_caja_salida)
        this.saldoCajaGeneral = parseFloat(caja[0].total)
      },
      validarForm(){
        if (this.$refs.FormNuevaAsignacionCajaChica.validate())
          this.registrarAsignacion();
      },
      validarFormAumento(){
        if (this.$refs.FormAumentarCajaChica.validate())
          this.registrarAumento();
      }
    },
    computed:{
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
    }
  }
</script>

<style scoped>

</style>
