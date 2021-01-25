<template>
  <v-app>
    <side/>
    <v-app-bar color="grey darken-3" height="40px" app dark>
      <!-- -->
      <strong>{{titulo}}</strong>
    </v-app-bar>
    <v-main app>
      <div height="100%" class="pt-2 pr-2 pl-2">
        <nuxt/>
      </div>
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
export default {
  watch: {
    over (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  components:{NuxtLoading, side, Cuerpo},
  data(){
    return{
      tab: 1,
      refe: null,
    }
  },
  created() {
    this.$store.commit('direcciones/cargar_COLONIAS');
    this.$store.commit('direcciones/cargar_DISTRITOS');
    this.$store.commit('direcciones/cargar_MUNICIPIOS');
    this.$store.commit('direcciones/cargar_DEPARTAMENTOS');
  },
  computed:{
    titulo(){
      return this.$store.state.titulo
    },
    over(){
      return this.$store.state.over
    }
  },
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
