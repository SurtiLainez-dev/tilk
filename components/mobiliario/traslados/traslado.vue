<template>
<v-card flat>
  <v-row no-gutters>
    <v-col cols="2">
      <v-card class="mx-auto ma-2">
        <v-navigation-drawer permanent>
          <v-list dense nav>
            <v-list-item v-for="item in items" :key="item.title" :disabled="item.view"
                         link @click="cambiarVista(item.val)">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-navigation-drawer>
      </v-card>
    </v-col>
    <v-col cols="10">
      <v-card class="ma-2">
        <info v-if="VISTA === 1"/>
        <actualizar v-else-if="VISTA === 2"/>

      </v-card>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
import info from "./info";

import {ipcRenderer} from "electron";
import actualizar from "./actualizar";
export default {
  components:{info, actualizar},
  name: "traslado",
  data(){
    return{
      items:[
        {title: 'Información General', val:1, view: false},
        {title: 'Cargar Documento', val:2, view: false},
      ]
    }
  },
  created() {
    this.verificarEstado();
    this.VISTA = 1;
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.mob.familias.VISTA;
      },
      set: function (val){
        this.$store.commit('mob/familias/cambiar_VISTA', val)
      }
    },
    TRASLADO: {
      get: function (){
        return this.$store.state.mob.familias.TRASLADO;
      },
      set: function (data){
        this.$store.commit('mob/familias/asignar_TRASLADO', data)
      }
    }
  },
  methods:{
    cambiarVista(val){
      this.VISTA = val;
    },
    verificarEstado(){
      if (this.TRASLADO.estado !== 1){
        this.items.forEach((i)=>{
          if (i.val === 2)
            i.view = true;
        });
      }
    }
  }
}
</script>

<style scoped>

</style>
