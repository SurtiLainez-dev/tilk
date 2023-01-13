<template>
<v-card flat>
  <v-card flat v-if="vista === 1">
    <v-card flat height="100" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Inventario de Motocicletas</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn small text disabled>Imprimir lista</v-btn>
        <v-btn small text >Realizar una Busqueda Avanzada</v-btn>
      </v-toolbar>
      <v-row no-gutters >
        <v-col cols="8"></v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-text-field v-model="search" label="Buscar moto"
                        append-outer-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>
    </v-card>

    <v-data-table dense :headers="headers" :items="MOTOS" :search="search" @click:row="goMoto" :items-per-page="25"
                  :loading="LOADMOTOS" loading-text="Cargando motos ..."></v-data-table>
  </v-card>

  <v-card v-else-if="vista === 2">
    <v-card flat height="100" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-btn icon small color="orange" fab text @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          {{moto.remision_articulo.articulo.marca.nombre}} - {{moto.remision_articulo.articulo.modelo}} - {{moto.chasis}} - {{moto.color}}
        </v-toolbar-title>
      </v-toolbar>
      <v-row no-gutters>
        <v-col></v-col>
        <v-col class="d-flex justify-end">
          <v-btn small tile text class="ma-2" @click="capturarFicha">Guardar Ficha</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <info_moto id="FichaMotocicleta" :moto="moto"/>
  </v-card>


  <v-dialog v-model="dialogo" width="30%">
    <v-card>
      <v-card-title>Busqueda Avanzada</v-card-title>
      <v-divider></v-divider>
      <v-btn text class="ma-2" block>Todas las Motocicletas</v-btn>
    </v-card>
  </v-dialog>

</v-card>
</template>

<script>
import info_moto from "@/components/Inventario/info_moto.vue";
import html2canvas from "html2canvas";
export default {
  name: "motocicletas",
  components:{info_moto},
  data(){
    return{
      dialogo: false,
      vista: 1,
      search: '',
      moto: {},
      headers:[
        {text:'Chasis', value:'chasis'},
        {text:'Motor', value:'motor'},
        {text:'Modelo', value:'remision_articulo.articulo.modelo'},
        {text:'Marca', value:'remision_articulo.articulo.marca.nombre'},
        {text:'Color', value:'color'},
        {text:'Sucursal', value:'remision_articulo.sucursal.nombre'},
        {text:'Estado', value:'remision_articulo.estado_articulo.nombre'},
      ]
    }
  },
  computed:{
    MOTOS(){
      return this.$store.state.inventario.moto.VEHICULOS;
    },
    LOADMOTOS() {
      return this.$store.state.inventario.moto.LOAD_MOTOS;
    }
  },
  created() {
    this.$store.commit('inventario/moto/cargar_VEHICULOS');
  },
  methods:{
    async capturarFicha(){
      let canvas = (await html2canvas(document.querySelector('#FichaMotocicleta')))
      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      let ran    = Math.floor(Math.random() * (100 - 200)) + 200;
      let articulo = this.moto.remision_articulo.articulo;
      let nombre   = articulo.marca.nombre+' '+articulo.modelo+ ' '+this.moto.chasis+' '+this.moto.color
      let file = 'Ficha de moto '+nombre+' - '+ran+'.png'
      a.setAttribute("download", file);
      a.setAttribute("href", image);
      a.click();
    },
    goMoto(data){
      this.moto = data;
      this.vista = 2;
    }
  }
}
</script>

<style scoped>

</style>