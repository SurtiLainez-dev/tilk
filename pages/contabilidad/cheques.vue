<template>
<v-card flat>
  <v-card flat v-if="VISTA === 1">
    <v-toolbar flat color="grey lighten-3"><h5>Cuentas de Cheques</h5></v-toolbar>
    <v-data-table :loading="LOADCUENTAS" loading-text="Cargando Cuentas"
                  :headers="header" :items="CUENTAS"
                  dense @click:row="seleccionarCuenta">
      <template v-slot:item.total="{item}">
        L {{int.format(item.total)}}
      </template>
    </v-data-table>
  </v-card>

  <v-card flat v-if="VISTA === 2">
    <v-toolbar dense flat color="grey lighten-3">
      <v-btn v-if="VISTA === 2 && VISTACHEQUE === 1" @click="VISTA = 1" dark color="orange" fab x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-btn v-if="VISTA === 2 && VISTACHEQUE === 2" @click="VISTACHEQUE = 1" dark color="orange" fab x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h5 v-if="CUENTA">Cuenta de Banco {{CUENTA.num}} - {{CUENTA.banco.nombre}}</h5 >
    </v-toolbar>
    <cheques/>
  </v-card>
</v-card>
</template>

<script>
import cheques from "../../components/contabilidad/cheques";
export default {
  components:{
    cheques
  },
  data(){
    return{
      vista: 1,
      int: new Intl.NumberFormat(),
      header:[
        {text:'Banco', value:'banco.nombre'},
        {text:'Tipo de Cuenta', value:'tipo_cuenta_banco.nombre'},
        {text:'Número de Cuenta', value:'num'},
        {text:'Total', value:'total'},
      ],
    }
  },
  computed:{
    CUENTAS(){
      return this.$store.state.contabilidad.cheques.CUENTAS;
    },
    LOADCUENTAS(){
      return this.$store.state.contabilidad.cheques.LOADCUENTAS;
    },
    VISTA:{
      get: function (){
        return this.$store.state.contabilidad.cheques.VISTA;
      },
      set: function (val){
        this.$store.commit('contabilidad/cheques/cambiar_VISTA', val);
      }
    },
    VISTACHEQUE:{
      get: function (){
        return this.$store.state.contabilidad.cheques.VISTACHEQUE;
      },
      set: function (val){
        this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', val);
      }
    },
    CUENTA(){
      return this.$store.state.contabilidad.cheques.CUENTA;
    }
  },
  created() {
    this.VISTA       = 1;
    this.VISTACHEQUE = 1;
    this.$store.commit('contabilidad/cheques/cargar_CUENTAS');
    this.$store.commit('guardarTitulo', 'Contabilidad > Cuentas de Cheques')
  },
  methods:{
    seleccionarCuenta(data){
      this.$store.commit('contabilidad/cheques/asignar_CUENTA', data);
      this.$store.commit('activarOverlay', true);
      this.$store.commit('contabilidad/cheques/cargar_CHEQUES', data);
    }
  }
}
</script>

<style scoped>

</style>
