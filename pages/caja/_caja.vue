<template>
<v-card>
  <v-toolbar flat color="grey lighten-4">
    <h5>Caja General del {{SUCURSAL}}</h5>
    <v-spacer></v-spacer>
    {{FECHA}}
  </v-toolbar>

  <v-row no-gutters>
    <v-col cols="3">
      <v-card height="670" width="256" class="mx-auto">
        <v-navigation-drawer permanent>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                <v-btn color="warning" x-small tile dark fab
                       @click="$router.replace({path:'/clientes/'})"><v-icon >fa fa-arrow-left</v-icon></v-btn>
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
          <v-row align="center" no-gutters>
            <v-col class="text-center">
              <div class="my-2">
                <v-btn  color="indigo" @click="dialogoNotas = true"
                        small depressed dark>Agregar una Nota</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-navigation-drawer>
      </v-card>
    </v-col>
    <v-col></v-col>
  </v-row>


</v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "caja",
  data(){
    return{
      tituloMenu: 'Datos Personales',
      vistaMenu: 1,
      items: [
        { title: 'Datos Personales', icon: 'fa fa-user', val:1},
        { title: 'Detalles del Cliente', icon: 'fa fa-table', val:2},
        { title: 'Telefonos', icon: 'fa fa-address-book', val:3 },
        { title: 'Direcciones', icon: 'fa fa-map-marker-alt', val:4 },
        { title: 'Documentos', icon: 'fa fa-file-pdf', val:5 },
        { title: 'Cuentas Asociadas', icon: 'fa fa-th-list', val:6 },
        { title: 'Notas de Crédito', icon: 'fa fa-file', val:7 },
        { title: 'Agregar Pagos a Cuentas', icon: 'fa fa-money-check-alt', val:8 },
        { title: 'Notas', icon: 'fa fa-sticky-note', val:9 },
        { title: 'Pagos Realizados', icon: 'fa fa-file-invoice-dollar', val:10 },
        { title: 'Solicitudes de Crédito', icon: 'fa fa-file', val:11 }
      ],
    }
  },
  created() {
    this.notificacion('Datos de la caja cargados','success');
    this.$store.commit('guardarTitulo', 'Caja >'+this.SUCURSAL+' > '+this.CAJA.codigo)
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
  },
  computed:{
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
    }
  },
  asyncData({$axios, store, route}){
    store.commit('activarOverlay', true);
    return $axios.get('/cajas/caja/'+route.params.caja).then((res)=>{
      return{
        CAJA: res.data.caja,
      }
    })
  },
}
</script>

<style scoped>

</style>
