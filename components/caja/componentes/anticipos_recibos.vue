<template>
<v-card flat tile>
  <v-card flat v-if="vista === 1">
    <v-row no-gutters >
      <v-col cols="8"></v-col>
      <v-col cols="4" class="d-flex justify-end">
        <v-text-field v-model="search" label="Buscar cliente anticipo"
                      append-outer-icon="mdi-magnify"></v-text-field>
      </v-col>
    </v-row>

    <v-progress-linear indeterminate v-if="load"></v-progress-linear>
    <table>
      <thead>
      <tr><th v-for="i in headers" v-text="i.text"></th></tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in filterData" :key="i" @click="asignarAnticipo(item)">
        <td v-html="resaltarRows(item.cliente.identidad)"></td>
        <td > {{item.cliente.nombres}} {{item.cliente.apellidos}}</td>
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
          {{anticipo.cliente.nombres}} {{anticipo.cliente.apellidos}} - {{anticipo.motivo}}
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
  name: "anticipos_recibos",
  components:{info_anticipo},
  data(){
    return{
      load: true,
      anticipos: [],
      vista: 1,
      search: '',
      int: Intl.NumberFormat(),
      headers:[
        {text:'Identidad', value:'cliente.identidad'},
        {text:'Nombre Cliente', value:'cliente.nombre'},
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
  created() {
    this.vista = 1;
    this.cargarAnticipos();
  },
  computed:{
    filterData(){
      let filtro = [];
      if (this.anticipos.length > 0){
        filtro = this.anticipos.filter(fila =>{
          let identidad = fila.cliente.identidad.toString().toLowerCase();
          let nombres = fila.cliente.nombres.toString().toLowerCase();
          let apellidos = fila.cliente.apellidos.toString().toLowerCase();
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
      }
      return filtro
    },
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
    cargarAnticipos(){
      this.$axios.get('caja/anticipos/'+this.$store.state.caja.CAJA.id).then((res)=>{
        this.anticipos = res.data.anticipos;
        this.load = false;
      })
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