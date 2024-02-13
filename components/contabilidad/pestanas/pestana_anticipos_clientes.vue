<template>

  <v-card flat >
    <v-card flat v-if="vista === 1">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Anticipos de Clientes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn tile small text icon color="indigo" class="ma-2  mb-4" @click="$store.commit('contabilidad/anticipos/cargar_ANTICIPOS')"><v-icon small>fa fa-sync</v-icon></v-btn>
        </v-toolbar>

        <v-row no-gutters >
          <v-col cols="8"></v-col>
          <v-col cols="4" class="d-flex justify-end">
            <v-text-field v-model="search" label="Buscar cliente anticipo"
                          append-outer-icon="mdi-magnify"></v-text-field>
          </v-col>
        </v-row>
      </v-card>

      <v-progress-linear v-if="LOADANTICIPOS" indeterminate></v-progress-linear>

      <table>
        <thead>
        <tr><th v-for="i in headers" v-text="i.text"></th></tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in filterData" :key="i" @click="asignarAnticipo(item)">
          <td v-html="resaltarRows(item.identidad)"></td>
          <td > {{item.nombres}} {{item.apellidos}}</td>
          <td>{{int.format(item.monto)}} lps</td>
          <td v-html="resaltarRows(item.motivo)"></td>
          <td>{{item.created_at.split('T')[0].split('-')[2]}}/{{item.created_at.split('T')[0].split('-')[1]}}/{{item.created_at.split('T')[0].split('-')[0]}}</td>
          <td>
            <v-chip x-small dark color="red" v-if="item.estado === 0">Pendiente</v-chip>
            <v-chip x-small dark color="green" v-else-if="item.estado === 1">Liquidado</v-chip>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="d-flex justify-end">
        <v-spacer></v-spacer>
        <v-card-text class="grey--text">{{resultados}} Resultados</v-card-text>
        <v-pagination
            v-model="page"
            :length="paginas"
            :total-visible="6"
        ></v-pagination>
      </div>
    </v-card>

    <v-card flat v-else-if="vista === 2">
      <v-card flat height="100" color="grey lighten-5">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-btn icon small color="orange" fab text @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title>
            {{anticipo.nombres}} {{anticipo.apellidos}} - {{anticipo.motivo}}
          </v-toolbar-title>
        </v-toolbar>
      </v-card>
      <info_anticipo/>
    </v-card>
  </v-card>
</template>

<script>
import info_anticipo from "@/components/contabilidad/info_anticipo.vue";
export default {
  name: "pestana_anticipos_clientes",
  components:{info_anticipo},
  data(){
    return{
      vista: 1,
      search: '',
      int: Intl.NumberFormat(),
      headers:[
        {text:'Identidad', value:'identidad'},
        {text:'Nombre Cliente', value:'nombre'},
        {text:'Monto Disponible', value:'monto'},
        {text:'Motivo', value:'motivo'},
        {text:'Creado', value:'created_at'},
        {text:'Estado', value:'estado'},
      ],
      filas: 25,
      paginas: 1,
      page: 1,
      resultados: 0,
      anticipo: {}
    }
  },
  computed:{
    filterData(){
      let filtro = [];
      filtro = this.ANTICIPOS.filter(fila =>{
        let identidad = fila.identidad.toString().toLowerCase();
        let nombres = fila.nombres.toString().toLowerCase();
        let apellidos = fila.apellidos.toString().toLowerCase();
        let motivo = fila.motivo.toString().toLowerCase();
        let search   = this.search.toLowerCase()

        return identidad.includes(search) || nombres.includes(search) || apellidos.includes(search) || motivo.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
    LOADANTICIPOS(){
      return this.$store.state.contabilidad.anticipos.LOADANTICIPOS;
    },
    ANTICIPOS(){
      return this.$store.state.contabilidad.anticipos.ANTICIPOS;
    }
  },
  created() {
    this.$store.commit('contabilidad/anticipos/cargar_ANTICIPOS');
  },
  methods:{
    asignarAnticipo(data){
      this.$store.commit('contabilidad/anticipos/cargar_ANTICIPO', data.id);
      this.anticipo = data;
      this.vista    = 2;
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
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
