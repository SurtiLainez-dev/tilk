<template>
<v-card flat>
  <v-row no-gutters>

    <v-col cols="2">
      <v-card class="mx-auto ma-2">
        <v-navigation-drawer permanent>
          <v-list dense nav>
            <v-list-item v-for="item in items" :key="item.title" link @click="cambiarVista(item.val)">
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

        </v-navigation-drawer>
      </v-card>
    </v-col>

    <v-col cols="10">
      <v-card flat class="ma-2">
        <info v-if="VISTA === 1"/>
        <depreciacion   v-else-if="VISTA === 2"/>
        <referencias    v-else-if="VISTA === 3"/>
        <detalles       v-else-if="VISTA === 4"/>
        <componentes    v-else-if="VISTA === 5"/>
        <historial      v-else-if="VISTA === 6"/>
        <traslados      v-else-if="VISTA === 7"/>
        <mantenimientos v-else-if="VISTA === 8"/>
        <etiquetas      v-else-if="VISTA === 10"/>
      </v-card>
    </v-col>

  </v-row>
</v-card>
</template>

<script>
import info from "./info";
import depreciacion from "./depreciacion";
import referencias from "./referencias";
import detalles from "./detalles";
import componentes from "./componentes";
import historial from "./historial";
import traslados from "./traslados";
import etiquetas from "./etiquetas";
import mantenimientos from "./mantenimientos";
export default {
  components:{
    info,
    depreciacion,
    referencias,
    detalles,
    componentes,
    historial,
    traslados,
    etiquetas,
    mantenimientos
  },
  name: "mob",
  data(){
    return{
      items:[
        {title: 'Información General', val:1},
        {title: 'Depreciación', val:2},
        {title: 'Referencias', val:3},
        {title: 'Detalles Técnicos', val:4},
        {title: 'Componentes', val:5},
        {title: 'Historial', val:6},
        {title: 'Traslados', val:7},
        {title: 'Mantenimientos', val:8},
        {title: 'Historial de Uso', val:9},
        {title: 'Etiquetas', val:10},
      ]
    }
  },
  created() {
    this.VISTA = 1;
  },
  computed:{
    MOBILIARIO(){
      return this.$store.state.mob.familias.MOBILIARIO;
    },
    VISTA:{
      get: function (){
        return this.$store.state.mob.familias.VISTA;
      },
      set: function (val){
        this.$store.commit('mob/familias/cambiar_VISTA', val)
      }
    }
  },
  methods:{
    cambiarVista(val){
      this.VISTA = val;
    }
  }
}
</script>

<style scoped>

</style>
