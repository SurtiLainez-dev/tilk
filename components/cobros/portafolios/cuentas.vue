<template>
  <v-card flat v-if="VISTAEXPANDIR === 1">
    <v-card flat height="100%">
      <v-row no-gutters>
        <v-col>
          <v-card height="100%" class="pa-2 ma-1">
            <v-row no-gutters>
              <v-col class="d-flex justify-center"><v-card-title>Sucursal</v-card-title></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center">
                <v-icon x-large>fa fa-store-alt</v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center"><v-card-subtitle>{{PORTAFOLIO.sucursal.nombre}}</v-card-subtitle></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card height="100%" class="pa-2 ma-1" >
            <v-row no-gutters>
              <v-col class="d-flex justify-center"><v-card-title>Usuario</v-card-title></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center">
                <v-icon x-large>fa fa-user</v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center"><v-card-subtitle>{{PORTAFOLIO.user.usuario}}</v-card-subtitle></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card height="100%" class="pa-2 ma-1" >
            <v-row no-gutters>
              <v-col class="d-flex justify-center"><v-card-title>Código</v-card-title></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center">
                <v-icon x-large>fa fa-qrcode</v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center"><v-card-subtitle>{{PORTAFOLIO.codigo}}</v-card-subtitle></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col>
          <v-card height="100%" class="pa-2 ma-1" >
            <v-row no-gutters>
              <v-col class="d-flex justify-center"><v-card-title>Cantidad de Cuentas</v-card-title></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center">
                <v-icon x-large>fa fa-file-invoice</v-icon>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="text-center"><v-card-subtitle>{{PORTAFOLIO.cant_cuentas}}</v-card-subtitle></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Saldo Capital</h6>
            <h6 class="text-center grey--text">L. {{int.format(PORTAFOLIO.total_ingresos)}}</h6>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Saldo Corriente</h6>
            <h6 class="text-center grey--text">L. {{int.format(PORTAFOLIO.total_corriente)}}</h6>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Total de Cuotas</h6>
            <h6 class="text-center grey--text">L. {{int.format(PORTAFOLIO.valor_cuotas)}}</h6>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Proyección</h6>
            <h6 class="text-center grey--text">L. {{int.format(PORTAFOLIO.saldo_proyeccion)}}</h6>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Cumplimiento</h6>
            <h6 class="text-center grey--text">L. {{int.format(PORTAFOLIO.saldo_cumplimiento)}}</h6>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="ma-1" height="100%">
            <h6 class="text-center grey--text">Gerencial</h6>
            <h6 class="text-center">
              <v-icon small color="green" v-if="PORTAFOLIO.gerencial === 1">fa fa-check</v-icon>
              <v-icon small color="red" v-else-if="PORTAFOLIO.gerencial === 0">fa fa-times</v-icon>
            </h6>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card flat class="ma-2">
      <v-row>
        <v-col cols="2">
          <v-row no-gutters>
            <v-col>
              <v-card class="pa-2" height="100%">
                <v-row no-gutters>
                  <v-col class="d-flex justify-center">
                    <v-progress-circular :size="110" :width="18" :color="colorNormalidad" :value="PORTAFOLIO.normalidad">{{PORTAFOLIO.normalidad}}%</v-progress-circular>
                  </v-col>
                </v-row>
                <v-card-text class="text-center grey--text">Normalidad Actual</v-card-text>
                <h6 class="text-center grey--text">Normalidad Proyectada {{PORTAFOLIO.proyeccion_normalidad}}%</h6>
              </v-card>
            </v-col>
          </v-row>

          <v-btn class="mt-3 text--white" tile block small @click="actualizar" text> Actualizar</v-btn>
          <v-btn class="mt-3" tile block small dark @click="VISTAPORTAFOLIO = 1"> Gestiones</v-btn>
          <v-btn class="mt-3 text-white" tile block small color="black"
                 @click="VISTAPORTAFOLIO = 2" :disabled="LOADPORTAFOLIO"> Gestiones de Hoy</v-btn>
          <v-btn class="mt-3" tile block small dark @click="VISTAPORTAFOLIO = 3"> Historial</v-btn>
          <v-btn class="mt-3" tile block small dark @click="VISTAPORTAFOLIO = 9"> Avance</v-btn>
          <v-btn tile block small class="mt-3 text-white" color="black"
                 @click="VISTAPORTAFOLIO = 4" :disabled="LOADPORTAFOLIO">Reportes</v-btn>
          <v-btn class="mt-3" tile block small dark v-if="PORTAFOLIO.gerencial === 1" @click="VISTAPORTAFOLIO = 5">Portafolios</v-btn>
          <v-btn class="mt-3" tile block small dark v-if="PORTAFOLIO.gerencial === 1" @click="VISTAPORTAFOLIO = 6">Transferir</v-btn>
          <v-btn class="mt-3" tile block small dark @click="VISTAPORTAFOLIO = 7" v-if="PERMISOS.includes(75)">Editar</v-btn>
          <v-btn class="mt-3" tile block small dark @click="VISTAPORTAFOLIO = 8" v-if="PERMISOS.includes(76)">Crear Cierre</v-btn>
        </v-col>


        <v-col cols="10">
          <v-card flat>
            <gestiones v-if="VISTAPORTAFOLIO === 1"/>
            <gestiones_hoy v-else-if="VISTAPORTAFOLIO === 2"/>
            <historial v-else-if="VISTAPORTAFOLIO === 3"/>
            <reportes v-else-if="VISTAPORTAFOLIO === 4"/>
            <portafolios v-else-if="VISTAPORTAFOLIO === 5"/>
            <transferencia v-else-if="VISTAPORTAFOLIO === 6"/>
            <editar_ortafolio v-else-if="VISTAPORTAFOLIO === 7"/>
            <cierre v-else-if="VISTAPORTAFOLIO === 8"/>
            <avance v-else-if="VISTAPORTAFOLIO === 9"/>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>

  <v-card flat v-else>
    <gestiones/>
  </v-card>
</template>

<script>

import gestiones from "@/components/cobros/portafolios/gestiones";
import porta from "@/components/cobros/portafolios/editar/porta";
import gestiones_hoy from "@/components/cobros/portafolios/gestiones/gestiones_hoy";
import cierre from "@/components/cobros/portafolios/editar/cierre";
import transferencia from "@/components/cobros/portafolios/transferencia";
import portafolios from "@/components/cobros/portafolios/portafolios";
import historial from "@/components/cobros/portafolios/historial";
import reportes from "@/components/cobros/portafolios/reportes";
import avance from "@/components/cobros/portafolios/avance.vue";
export default {
  components:{
    gestiones,
    editar_ortafolio: porta,
    gestiones_hoy,
    cierre,
    transferencia,
    portafolios,
    historial,
    reportes,
    avance
  },
  data(){
    return{
      colorNormalidad: '',
      int: Intl.NumberFormat(),
    }
  },
  name: "cuentas",
  computed:{
    LOADPORTAFOLIO(){
      return this.$store.state.cobros.portafolios.LOADPORTAFOLIO;
    },
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
    PORTAFOLIO() {
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
    VISTAEXPANDIR(){
      return this.$store.state.cobros.portafolios.VISTAEXPANDIR;
    },
    VISTAPORTAFOLIO:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTAPORTAFOLIO;
      },
      set: function (val){
        this.$store.commit('cobros/portafolios/cambiar_VISTAPORTAFOLIO', val);
      }
    },
  },
  created() {
    this.VISTAPORTAFOLIO = 1;
  },
  mounted() {
    this.cambiarColorNormalidad();
  },
  methods:{
    actualizar(){
      this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
      this.$store.commit('cobros/portafolios/cargar_GESTIONES');
    },
    cambiarColorNormalidad(){
      if (this.PORTAFOLIO.normalidad < 35)
        this.colorNormalidad = 'red';
      else if (this.PORTAFOLIO.normalidad > 35 && this.PORTAFOLIO.normalidad < 70)
        this.colorNormalidad = 'yellow darken-3';
      else if (this.PORTAFOLIO.normalidad > 71 && this.PORTAFOLIO.normalidad < 90)
        this.colorNormalidad = 'teal';
      else if (this.PORTAFOLIO.normalidad > 90)
        this.colorNormalidad = 'green';
    }
  }
}
</script>

<style scoped>

</style>
