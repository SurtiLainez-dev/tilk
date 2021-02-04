<template>
<v-card>
  <v-card flat v-if="ESTADO">
    <v-toolbar flat color="grey lighten-4">
      <h5>Caja General del {{SUCURSAL}}</h5>
      <v-spacer></v-spacer>
      {{FECHA}}
    </v-toolbar>

    <v-row no-gutters class="pa-3">
      <v-col cols="3">
        <v-card height="500" width="256" class="mx-auto">
          <v-navigation-drawer permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  {{tituloMenu}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item v-for="item in items" :key="item.title" link @click="cambiarDatosMenu(item)">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card>
          <v-toolbar flat class="grey lighten-4">
            <h6>{{TITULO}}</h6>
          </v-toolbar>

          <inicio v-if="VISTA === 1"/>
          <postear v-else-if="VISTA === 2"/>

        </v-card>
      </v-col>
    </v-row>

  </v-card>
</v-card>
</template>

<script>
import inicio from "./componentes/inicio";
import postear from "./componentes/postear";
import Vue from "vue";
export default {
  components:{
    inicio,
    postear
  },
  name: "index",
  data(){
    return{
      tituloMenu: 'Inicio',
      items: [
        { title: 'Inicio', icon: 'fa fa-cash-register', val:1},
        { title: 'Postear Cuenta', icon: 'fa fa-check-circle', val:2},
        { title: 'Hacer Factura', icon: 'fa fa-file-invoice-dollar', val:3},
        { title: 'Recibos de Hoy', icon: 'fa fa-file-invoice', val:4 },
        { title: 'Facturas de Hoy', icon: 'fa fa-file-invoice-dollar', val:5 },
        { title: 'Calendario de Pago', icon: 'fa fa-calendar-day', val:6 },
        { title: 'Transacciones', icon: 'fa fa-history', val:7 },
        { title: 'Cierre de Caja', icon: 'fa fa-sign-out-alt', val:8 },
      ],
    }
  },
  computed:{
    TITULO:{
      get: function (){
        return this.$store.state.caja.TITULO;
      },
      set: function (val){
        this.$store.commit('caja/cambiar_TITULO', val);
      }
    },
    VISTA:{
      get: function (){
        return this.$store.state.caja.VISTA;
      },
      set: function (val){
        this.$store.commit('caja/cambiar_VISTA', val)
      }
    },
    ESTADO:{
      get: function (){
        return this.$store.state.caja.ESTADO;
      },
      set: function (val){
        this.$store.commit('caja/cambiar_Estado', val)
      }
    },
    SUCURSAL(){
      return this.$store.state.sucursal_id
    },
    SUCURSAL_ID(){
      return this.$store.state.sucursal;
    },
    FECHA(){
      return this.$store.state.fecha.DIA_STRING;
    },
    COLABORADOR(){
      return this.$store.state.colaborador;
    },
    CAJA:{
      get: function (){
        return this.$store.state.caja.CAJA;
      },
      set: function (val){
        this.$store.commit('caja/agregar_CAJA', val);
      }
    },

  },
  created() {
    this.$store.commit('activarOverlay', true);
    this.$axios.get('/cajas/caja/'+this.$store.state.caja.CAJA_ID).then((res)=>{
      this.CAJA = res.data.caja;
      this.ESTADO = true;
      this.$store.commit('activarOverlay', false);
    });
    this.VISTA = 1;
    this.$store.commit('caja/cargar_CUENTAS');
    this.TITULO = 'Inicio';
  },
  methods:{
    cambiarDatosMenu(val){
      this.tituloMenu = val.title
      this.VISTA = val.val;
      this.TITULO = val.title;
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
  }
}
</script>

<style scoped>

</style>
