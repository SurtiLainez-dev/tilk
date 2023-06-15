<template>
<v-card flat>
  <v-card flat v-if="vista === 1">
    <v-card flat height="100" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Inventario de Motocicletas</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn small text color="grey" :disabled="filterMOTOS.length === 0" @click="dialogoPrint = true" class="text--white">Imprimir lista</v-btn>
        <v-btn small text >Realizar una Busqueda Avanzada</v-btn>
        <v-btn small text color="indigo" fab><v-icon small @click="$store.commit('inventario/moto/cargar_VEHICULOS');">fa fa-sync</v-icon></v-btn>
      </v-toolbar>

      <v-row no-gutters >
        <v-col cols="8"></v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-text-field v-model="search" label="Buscar moto"
                        append-outer-icon="mdi-magnify"></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-progress-linear indeterminate v-if="LOADMOTOS"></v-progress-linear>
    <table>
      <thead>
      <tr><th v-for="item in headers" v-text="item.text"></th></tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in filterMOTOS" @click="goMoto(item)">
        <td v-html="resaltarRows(item.chasis)"></td>
        <td v-html="resaltarRows(item.motor)"></td>
        <td v-html="resaltarRows(item.remision_articulo.articulo.modelo)"></td>
        <td v-html="resaltarRows(item.remision_articulo.articulo.marca.nombre)"></td>
        <td v-html="resaltarRows(item.color)"></td>
        <td v-html="resaltarRows(item.remision_articulo.sucursal.nombre)"></td>
        <td v-html="resaltarRows(item.remision_articulo.estado_articulo.nombre)"></td>
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

  <v-card flat v-else-if="vista === 2">
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

  <v-dialog v-model="dialogoPrint" width="40%">
    <v-card>
      <v-toolbar flat color="grey lighten-4"><v-toolbar-title>Imprimiendo Lista de Motocicletas</v-toolbar-title></v-toolbar>
      <v-text-field label="Titulo" class="ma-2" v-model="titulo"></v-text-field>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark text tile small @click="dialogoPrint = false">Cerrar</v-btn>
        <v-btn color="success" dark tile small @click="validarTitulo">Crear Lista</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
import {ipcRenderer} from "electron";
export default {
  name: "motocicletas",
  components:{info_moto},
  data(){
    return{
      dialogoPrint: false,
      titulo: '',
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
      ],
      filas: 25,
      paginas: 1,
      page: 1,
      resultados: 0
    }
  },
  computed:{
    filterMOTOS(){
      let filtro = [];
      filtro = this.MOTOS.filter(fila =>{
        let chasis = fila.chasis.toString().toLowerCase();
        let motor = fila.motor.toString().toLowerCase();
        let modelo = fila.remision_articulo.articulo.modelo.toString().toLowerCase();
        let marca = fila.remision_articulo.articulo.marca.nombre.toString().toLowerCase();
        let color = fila.color.toString().toLowerCase();
        let sucursal = fila.remision_articulo.sucursal.nombre.toString().toLowerCase();
        let estado   = fila.remision_articulo.estado_articulo.nombre.toString().toLowerCase();
        let search   = this.search.toLowerCase()

        return chasis.includes(search) || motor.includes(search) || modelo.includes(search) ||
            marca.includes(search) || color.includes(search) || sucursal.includes(search) || estado.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
    MOTOS(){
      return this.$store.state.inventario.moto.VEHICULOS;
    },
    LOADMOTOS() {
      return this.$store.state.inventario.moto.LOAD_MOTOS;
    },
    USUARIO(){
      return this.$store.state.usuario;
    },
  },
  created() {
    this.$store.commit('activarOverlay', false);
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
    },
    imprimirMotos(clave){
      let ids = [];
      this.filterMOTOS.forEach((item)=>{
        ids.push(item.id)
      })
      let url = this.$axios.defaults.baseURL+`documentos/lista_motocicletas/usuario=${this.USUARIO}&titulo=${this.titulo}/${clave}/ids=${JSON.stringify(ids)}`;
      ipcRenderer.send('pint_navegador', url);
      this.titulo = '';
      this.$store.commit('activarOverlay', false);
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
    solicitarClave(){
      this.dialogoPrint = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.imprimirMotos(res.data.clave);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarTitulo(){
      if (this.titulo.length > 7)
        this.solicitarClave()
      else
        this.$store.commit('notificacion',{texto:'El título debe ser mayor a 7 carácteres', color:'warning'});

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