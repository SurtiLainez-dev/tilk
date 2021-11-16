<template>
  <v-container class="pl-2 pr-2">
    <v-card>
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
        <v-row>
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
        <v-row no-gutters>
          <v-col class="ma-2">
            <v-row no-gutters>
              <v-col class="d-flex align-center"><v-card-title>Asignar Caja Chica</v-card-title></v-col>
              <v-col class="d-flex align-center justify-end"><v-checkbox dense label="Habilitar Formulario" v-model="visible"></v-checkbox></v-col>
            </v-row>
            <v-divider></v-divider>
            <v-form ref="FormNuevaAsignacionCajaChica" :disabled="!visible">
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
          </v-col>
          <v-col class="ma-2">
            <v-card-title>Historial</v-card-title>
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    data(){
      return{
        rule:{
          pago:{
            req: v => !!v || 'Campo requerido',
            max: v => v.length <= 200 || 'Ingresar máximo 200 carácteres',
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
        visible: true
      }
    },
    created() {
      this.cargarCaja();
    },
    methods:{
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
                nombre: item.nombre+' - L. '+this.int.format(item.total)
              })
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
            this.cargarCCCajaChica();
            this.cargarCCCajas();
          }
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
          this.cargarCaja();
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      },
      validarForm(){
        if (this.$refs.FormNuevaAsignacionCajaChica.validate())
          this.registrarAsignacion();
      }
    }
  }
</script>

<style scoped>

</style>
