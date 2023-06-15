<template>
  <v-card flat>
    <v-card flat v-if="VISTA === 1">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Sub Secciones del Manual</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-row no-gutters >
          <v-col cols="8"></v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-text-field v-model="search" label="Buscar sección"
                          append-outer-icon="mdi-magnify"></v-text-field>
          </v-col>
        </v-row>
      </v-card>
      <v-progress-linear v-if="LOADSECCIONES"></v-progress-linear>
      <table>
        <thead>
        <tr><th v-for="item in headers" v-text="item.text"></th></tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in SECCIONES" @click="goSeccion(item)">
          <td>{{item.titulo}}</td>
          <td>{{item.manual_seccion.titulo_corto}}</td>
        </tr>
        </tbody>
      </table>
      <div class="d-flex justify-end">
        <v-pagination
            v-model="page"
            :length="paginas"
            :total-visible="6"
        ></v-pagination>
      </div>
    </v-card>
    <v-card flat v-else-if="VISTA === 2">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-btn icon small color="orange" fab text @click="VISTA = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            Editando {{$store.state.manual.manual.SECCION.titulo}} - {{$store.state.manual.manual.SECCION.manual_seccion.titulo_corto}}
          </v-toolbar-title>
        </v-toolbar>
        <NuevaSubSeccion/>
    </v-card>
  </v-card>
  </v-card>
</template>

<script>

import NuevaSubSeccion from "@/pages/admin/manual/NuevaSubSeccion.vue";
export default {
  name: "SubSecciones",
  created() {
    this.$store.commit('guardarTitulo', 'Administrador > Manual > Sub Secciones');
    this.$store.commit('manual/manual/cargarSUBSECCIONES');
    this.VISTA = 1;
  },
  components:{NuevaSubSeccion},
  data(){
    return{
      search: '',
      headers:[
        {text:'Sub Sección'},
        {text:'Sección Padre'},
      ],
      filas: 25,
      paginas: 1,
      page: 1,
      resultados: 0
    }
  },
  computed:{
    LOADSECCIONES() {
      return this.$store.state.manual.manual.LOADSECCIONES;
    },
    SECCIONES() {
      let filtro = [];
      filtro = this.$store.state.manual.manual.SUBSECCIONES.filter(fila =>{
      let seccion = fila.titulo.toString().toLowerCase();
      let subseccion = fila.manual_seccion.titulo_corto.toString().toLowerCase();
      let search   = this.search.toLowerCase()
      return seccion.includes(search) || subseccion.includes(search)
      });

      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      console.log(filtro)
      return filtro;
    },
    VISTA: {
      get: function (){
        return this.$store.state.manual.manual.VISTA;
      },
      set: function (vista){
        this.$store.commit('manual/manual/cambiarVISTA', vista)
      }
    }
  },
  methods:{
    goSeccion(data){
      this.$store.commit('manual/manual/asignarSECCION', data);
      this.VISTA = 2;
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
  cursor: pointer;
}
table thead tr th{
  padding: 5px;
  font-size: 12px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 10px;
  cursor: pointer;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr:hover{
  background-color: #f6f6f6;
}
</style>