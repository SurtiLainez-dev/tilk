<template>
  <v-app>
    <side/>
    <v-app-bar height="35" app>

      <v-tabs height="35" v-model="tab" align-with-title hide-slider>
        <v-tab v-for="item in Pes" :key="item.key" class="blue-grey lighten-5">
          <small>{{ item.titulo }}</small>
          <div class="pl-5">
            <v-btn width="15px" height="15px" @click="$store.commit('quitar_pestania', item.valor)"
                   fab color="indigo" dark v-if="item.key > 0"> <small>x</small>
            </v-btn>
          </div>
        </v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main app>
      <v-tabs-items v-model="tab" >
        <v-tab-item v-for="i in Pes" :key="i.key" >
          <nuxt v-if="i.key === 0"/>
          <caja v-if="i.key === 1"/>
          <cobros v-if="i.key === 2"/>
          <to_do_inidex v-if="i.key === 3"/>
          <perfiles v-if="i.key === 4"/>
          <cuentas v-if="i.key === 5"/>
          <inventario v-if="i.key === 6"/>
          <editar_inventario v-if="i.key === 7"/>
          <articulo_nuevo v-if="i.key === 8"/>
        </v-tab-item>
      </v-tabs-items>

      <v-overlay :value="over">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>

    </v-main>
  </v-app>
</template>

<script>
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
import side from "../components/dashboard/side";
import NuxtLoading from "../.nuxt/components/nuxt-loading";
import Cuerpo from "../components/Pestanas/Cuerpo";
import caja from "../components/caja/index"
import inicio from "@/components/cobros/inicio";
import to_do_inidex from "@/components/to_to/to_do_inidex";
import perfiles from "@/components/Ventas/pes/perfiles";
import cuentas from "@/components/Ventas/pes/cuentas";
import inventario from "@/components/Inventario/inventario"
import editar_inventario from "@/components/Inventario/editar_inventario";
import articulo_nuevo from "@/components/Inventario/articulo_nuevo";
export default {
  watch: {
    over (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  components:{NuxtLoading, side, Cuerpo, caja, cobros: inicio,
    to_do_inidex, perfiles, cuentas, inventario, editar_inventario, articulo_nuevo},
  data(){
    return{
      refe: null,
      Hora: 0,
      Minuto: 0,
      Segundo: 0,
    }
  },
  created() {
    console.log(this.Pes)
    this.$store.commit('direcciones/cargar_COLONIAS');
    this.$store.commit('direcciones/cargar_DISTRITOS');
    this.$store.commit('direcciones/cargar_MUNICIPIOS');
    this.$store.commit('direcciones/cargar_DEPARTAMENTOS');
    this.calcularFecha()
  },
  computed:{
    ESTADOMENU:{
      get: function (){
        return this.$store.state.MENU;
      },
      set: function (val){
        this.$store.commit('cambiar_MENU');
      }
    },
    tab:{
      get: function (){
        return this.$store.state.tab;
      },
      set: function (val){
        this.$store.commit('cambiarTab', {val:val, tipo:true})
      }
    },
    titulo(){
      return this.$store.state.titulo
    },
    over(){
      return this.$store.state.over
    },
    Pes(){
      return this.$store.state.pestana
    }
  },
  methods:{
    calcularFecha(){
      let fecha =new Date();
      let diaS = fecha.getDay();
      let mes   = fecha.getMonth()
      let dia   = fecha.getDate();
      let fechaS = this.conocerDia(diaS)+', '+dia+' de '+this.concerMes(mes)+' de '+fecha.getFullYear();
      let fechaN = dia+'/'+mes+'/'+fecha.getFullYear();
      this.$store.commit('fecha/agregar_DIA_STRING', fechaS);
      this.$store.commit('fecha/agregar_DIA_PLECA', fechaN);
    },
    conocerDia(dia){
      let day = '';
      let dias = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sábado','Domingo']
      for (let i = 0; i < dias.length; i++){
        if ((parseInt(i) + parseInt(1)) === dia)
          day = dias[i]
      }
      return day
    },
    concerMes(mes){
      let meses = ['Enero','Febrero','Marzo','Abril','Mayo', 'Junio',
        'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      let month = '';
      for (let i = 0; i < meses.length; i++){
        if (i === mes)
          month = meses[i]
      }
      return month;
    }
  }
}
</script>

<style>
  ::-webkit-scrollbar{
    width: 8px;     /* Tamaño del scroll en vertical */
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #DADADA;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #C6C6C8;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-thumb:active{
    background-color: #BBBBBB;
  }
  ::-webkit-scrollbar-track {
    background: #E8E8E8;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track:hover, ::-webkit-scrollbar-track:active {
    background-color: #BBFDD6;
  }
  .pestanas .icon:hover{
    background-color: #7F828B;
    cursor: pointer;
  }
  #notification {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 200px;
    padding: 20px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  }
  .hidden {
    display: none;
  }
</style>
