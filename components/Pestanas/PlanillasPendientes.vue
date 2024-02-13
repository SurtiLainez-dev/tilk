<template>
  <v-card flat tile>
    <div v-if="VISTA === 1" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Lotes de Planillas</div>
          </div>
          <div style="width: 30%; height: 100%">
            <div class="d-flex justify-start" style="display: flex">
              <span class="titleBuscar">Buscar</span>
            </div>
            <div style="border: solid 1px #b2b0b0; height: 60%; padding: 2px">
              <div style="height: 100%">
                <input class="ml-1" v-model="search" type="text" placeholder="...">
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Filtros:</span>
            </div>
            <div class="d-flex justify-start align-center">

            </div>
          </div>
          <div style="width: 30%;height: 100%">
            <div class="d-flex justify-start">
              <span class="titleAcciones">Acciones:</span>
            </div>
            <div class="d-flex justify-start align-center">
              <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="20"
                  v-if="load"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="cargarLotes"
                         fab x-small icon><v-icon small>fa fa-sync</v-icon></v-btn>
                </template>
                <span>Recargar Datos</span>
              </v-tooltip>
            </div>
          </div>
        </div>

        <v-divider></v-divider>
        <div>
          <table>
            <thead>
            <tr>
              <th>Nombre del Lote</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterDatos" @click="goLote(item)">
              <td>{{item.nombre}}</td>
              <td>
                <v-chip color="orange" x-small v-if="item.estado === 1" dark>Abierto</v-chip>
                <v-chip color="success" x-small v-else-if="item.estado === 2" dark>Cerrado Exitosamente</v-chip>
                <v-chip color="red" x-small v-else-if="item.estado === 3" dark>Cerrado sin Exito</v-chip>
              </td>
              <td>L. {{Intl.NumberFormat().format(item.total)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </v-card>

      <v-card-actions class="grey" style=" width: 100%; height: 5%">
        <v-row no-gutters>
          <v-col cols="2"><span class="text-white" style="font-size: 10px">Resultados: <strong>{{resultados}}</strong> articulos</span></v-col>
          <v-col cols="2">
            <v-row no-gutters>
              <v-col><span class="text-white" style="font-size: 10px">Filas a mostrar</span></v-col>
              <v-col>
                <select v-model="filas">
                  <option :value="100">100</option>
                  <option :value="250">250</option>
                  <option :value="500">500</option>
                  <option :value="1000">1000</option>
                  <option :value="1500">1500</option>
                  <option :value="2000">2000</option>
                  <option :value="5000">5000</option>
                  <option :value="10000">10000</option>
                  <option :value="20000">20000</option>
                </select>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="8" class="d-flex justify-end">
            <v-pagination
                v-model="page"
                :length="paginas"
                :total-visible="6"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-card-actions>
    </div>

    <v-card v-else flat>
      <v-toolbar dense flat >
        <v-row no-gutters>
          <v-col cols="1" class="d-flex justify-start">
            <v-btn fab class="ma-1" x-small dark color="orange" @click="cargarLotes"><v-icon>fa fa-arrow-left</v-icon></v-btn>
          </v-col>
          <v-col>
            <div class="pt-2">Planillas del lote:  <strong> {{Lote.nombre}}</strong></div>
          </v-col>
        </v-row>
      </v-toolbar>
      <planillas_lotes :lote="Lote"/>
    </v-card>

  </v-card>
</template>

<script>
import planillas_lotes from "@/components/contabilidad/planillas/planillas_lotes.vue";
export default {
  name: "PlanillasPendientes",
  components:{planillas_lotes},
  data(){
    return{
      search: '',
      load: true,
      Lotes: [],
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1,
      Lote: {}
    }
  },
  created() {
    this.cargarLotes();
  },
  computed:{
    filterDatos(){
      let filtro = [];
      filtro = this.Lotes.filter(fila =>{
        let nombre = fila.nombre.toString().toLowerCase();
        let search   = this.search.toLowerCase()
        //
        return nombre.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
    VISTA: {
      get: function (){
        return this.$store.state.col.VISTA;
      },
      set: function (val){
        this.$store.commit('col/cambiar_VISTA', val)
      }
    }
  },
  methods:{
    cargarLotes(){
      this.VISTA = 1;
      this.load = true;
      this.$axios.get('lotes_planillas').then((res)=>{
        this.Lotes = res.data.lotes;
        this.load  = false;
      })
    },
    goLote(item){
      this.Lote  = item;
      this.VISTA = 2;
    }
  }
}
</script>

<style scoped>
.titleTable{
  font-family: 'Rubik', sans-serif;
  font-size: 18px;
  font-weight: bold;
}
.titleAcciones{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #aaaaaa;
}
.titleBuscar{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
input{
  font-size: 14px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
.header div span{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
}
.body div span{
  font-size: 10px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
}
table{
  width: 100%;
  border-collapse: collapse;
}
table thead tr th{
  font-size: 12px;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: #7F828B;
  text-align: start;
}
table tbody tr td{
  font-size: 11px;
  font-family: 'Rubik', sans-serif;
  color: #7F828B;
  height: 22px;
  border-bottom: solid 1px #DADADA;
}
table tbody tr:hover{
  cursor: pointer;
  background-color: #f6f6f6;
}
</style>
