<template>
  <v-card flat tile>
    <v-card flat v-if="VISTA === 1">
      <v-card-title>Gastos de Surtidora Lainez</v-card-title>
      <v-divider></v-divider>
      <v-container class="d-flex justify-center" >
        <v-card class="ma-5 mt-10 hover d-flex justify-center align-center"
                width="250px" height="250" @click="goConsulta(2,'Gastos por Sucursales')">
          <h6>Gastos por Sucursales</h6>
        </v-card>
        <v-card class="ma-5 mt-10 hover d-flex justify-center align-center"
                width="250px" height="250" @click="goConsulta(3,'Gastos Asignados por Sucursales')">
          <h6>Gastos Asignados por Sucursal</h6>
        </v-card>
        <v-card class="ma-5 mt-10 hover d-flex justify-center align-center"
                width="250px" height="250" @click="goConsulta(4,'Todos los Tipos de Gastos')">
          <h6>Todos los Tipos de Gastos</h6>
        </v-card>
        <v-card class="ma-5 mt-10 hover d-flex justify-center align-center"
                width="250px" height="250" @click="solicitarClave" >
          <h6>Solicitar Token</h6>
        </v-card>
      </v-container>
    </v-card>

    <v-card flat v-else-if="VISTA > 1">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-btn fab text small dark icon @click="goBack" v-if="VISTA < 5" color="warning"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-btn fab text small dark icon @click="goBack" v-else-if="VISTA >= 5" color="warning"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-toolbar-title v-if="VISTA < 5">{{TITULO}}</v-toolbar-title>
      </v-toolbar>

      <gastos_sucursal v-if="VISTA === 2 || VISTA === 3 || VISTA === 5 || VISTA === 6"/>
      <tipos_gastos v-else-if="VISTA === 4"/>
    </v-card>

    <v-dialog v-model="dialogo" width="40%">
      <v-card>
        <v-card-title>Token para Cargar Facturas</v-card-title>
        <v-card-text>Este token tiene una duración de una hora, sino logras cargar las facturas en una hora, tendras que
          solicitar un nuevo token,</v-card-text>
        <v-card flat tile class="ma-4">
          <v-text-field class="ma-2" v-model="token"></v-text-field>
        </v-card>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" small tile dark @click="dialogo = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import gastos_sucursal from "@/components/contabilidad/gastos/gastos_sucursal.vue";
import tipos_gastos from "@/components/contabilidad/gastos/tipos_gastos.vue";

export default {
  components:{gastos_sucursal, tipos_gastos},
  name: "gastos_index",
  created() {
    this.VISTA = 1;
    this.goBack();
  },
  data(){
    return{
      token: 'ueueueu',
      dialogo: false
    }
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.suc.VISTA_MULTIPLE;
      },
      set: function (val){
        this.$store.commit('suc/cambiar_VISTA_MULTIPLE', val);
      }
    },
    TITULO:{
      get: function (){
        return this.$store.state.suc.TITULO_GENERICO;
      },
      set: function (val){
        this.$store.commit('suc/cambiar_TITULO_GENERICO', val);
      }
    }
  },
  methods:{
    goBack(){
      if (this.VISTA < 5){
        this.VISTA = 1;
        this.$store.commit('guardarTitulo', 'Contabilidad > Gastos');
      }else if (this.VISTA === 5) this.VISTA = 2;
      else if (this.VISTA === 6) this.VISTA = 3;
    },
    goConsulta(val, titulo){
      this.VISTA  = val;
      this.TITULO = titulo;
      this.$store.commit('guardarTitulo', 'Contabilidad > Gastos > '+this.TITULO);
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave').then((res)=>{
        this.token   = this.$store.state.usuario+'['+res.data.clave;
        this.dialogo = true;
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.dialogoPartida = true;
        this.$store.commit('activarOverlay', false);
      });
    },
  }
}
</script>

<style scoped>
.hover:hover{
  cursor: pointer;
  background-color: #e5e5e5;
}
</style>
