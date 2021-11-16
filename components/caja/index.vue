<template>
<v-card flat>
  <v-card flat v-if="ESTADO">
    <v-toolbar flat color="grey lighten-2">
      <h5>Caja General del {{SUCURSAL}}</h5>
      <v-spacer></v-spacer>
      {{FECHA}}
    </v-toolbar>

    <v-row no-gutters class="pa-3">
      <v-col cols="3">
        <v-card height="650" width="256" class="mx-auto">
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
          <v-toolbar flat class="grey lighten-3">
            <h6>{{TITULO}}</h6>
          </v-toolbar>

          <inicio        v-if="VISTA === 1"/>
          <postear       v-else-if="VISTA === 2"/>
          <venta         v-else-if="VISTA === 3"/>
          <recibos_hoy   v-else-if="VISTA === 4"/>
          <facturas_hoy  v-else-if="VISTA === 5"/>
          <transacciones v-else-if="VISTA === 7"/>
          <egreso        v-else-if="VISTA === 8"/>
          <caja_chica    v-else-if="VISTA === 9"/>
          <anticipos     v-else-if="VISTA === 10"/>
          <cierre        v-else-if="VISTA === 11"/>
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
import venta from "./componentes/venta";
import facturas_hoy from "./componentes/facturas_hoy";
import recibos_hoy from "./componentes/recibos_hoy";
import egreso from "@/components/caja/componentes/egreso";
import transacciones from "@/components/caja/componentes/transacciones";
import cierre from "@/components/caja/componentes/cierre";
import caja_chica from "@/components/caja/componentes/caja_chica";
import anticipos from "@/components/caja/componentes/anticipos";

export default {
  components:{
    inicio,
    postear,
    venta,
    facturas_hoy,
    recibos_hoy,
    egreso,
    transacciones,
    cierre,
    caja_chica,
    anticipos
  },
  name: "index",
  data(){
    return{
      tituloMenu: 'Inicio',
      items: [
        { title: 'Inicio', icon: 'fa fa-cash-register', val:1},
        { title: 'Postear Cuenta', icon: 'fa fa-check-circle', val:2},
        { title: 'Factura de Contado', icon: 'fa fa-file-invoice-dollar', val:3},
        { title: 'Recibos de Hoy', icon: 'fa fa-file-invoice', val:4 },
        { title: 'Facturas de Hoy', icon: 'fa fa-file-invoice-dollar', val:5 },
        { title: 'Calendario de Pago', icon: 'fa fa-calendar-day', val:6 },
        { title: 'Transacciones', icon: 'fa fa-history', val:7 },
        { title: 'Egreso', icon: 'fa fa-file-invoice-dollar', val:8 },
        { title: 'Caja Chica', icon: 'fa fa-wallet', val:9},
        { title: 'Anticipos', icon: 'fa fa-file-invoice-dollar', val:10},
        { title: 'Cierre de Caja', icon: 'fa fa-sign-out-alt', val:11 },
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
    this.$store.commit('activarOverlay', false);
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
