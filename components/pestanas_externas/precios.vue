<template>
  <v-card flat tile>
    <div v-if="$store.state.vistaPrecioArticulo === 1" style="height: 95vh">
      <v-card class="pa-2" flat tile style="height: 95%;overflow-y: auto; overflow-x: hidden">
        <div class="mt-3 d-flex justify-start" style="width: 100%; height: 50px;">
          <div style="width: 70%; height: 100%" class="d-flex align-center">
            <div class="titleTable">Todos los Articulos Creados</div>
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
          <div style="width: 70%; height: 100%">
            <div class="col d-flex justify-start">
              <span class="titleAcciones">Filtros:</span>
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
                  v-if="isPeticon"
              ></v-progress-circular>
              <v-tooltip bottom>
                <template v-slot:activator="{on, attr}">
                  <v-btn v-on="on" v-bind="attr" color="indigo" text
                         @click="consultarInventario"
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
              <th>Proveedor</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Codigo del Sistema</th>
              <th>Nombre del Articulo</th>
              <th>Codigo del Proveedor</th>
              <th>Sub-Familia</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterINVENTARIO" @click="goPrecio(item)">
              <td>{{item.proveedor}}</td>
              <td>{{item.marca}}</td>
              <td>{{item.modelo}}</td>
              <td>{{item.codigo_sistema}}</td>
              <td>{{item.nombre_articulo}}</td>
              <td>{{item.codigo_proveedor}}</td>
              <td>{{item.fam}}</td>
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
    <div v-else-if="$store.state.vistaPrecioArticulo === 2" class="ma-2">
      <v-card-actions class="d-flex justify-start">
        <div class="row no-gutters" style="height: 60px; width: 100%">
          <div class="col-1">
            <v-btn color="orange" dark x-small fab @click="$store.commit('cambiarVistaPRecioArticulo', 1)">
              <v-icon>fa fa-arrow-left</v-icon>
            </v-btn>
          </div>
          <div class="col">
            <div>
              <span class="titleTable">Asignación de precio: {{dataPrecio.nombre_articulo}} [{{dataPrecio.codigo_sistema}}]</span>
            </div>
            <div>
              <span class="titleBuscar">{{dataPrecio.descripcion_corta}}</span>
            </div>
            <div>
              <span class="titleBuscar">Proveedor: {{dataPrecio.proveedor}}</span>
            </div>
          </div>
        </div>
      </v-card-actions>
      <v-divider></v-divider>
      <asignacion-precio :data="dataPrecio"/>
    </div>
  </v-card>
</template>

<script>
import AsignacionPrecio from "../contabilidad/AsignacionPrecio.vue";
export default {
  components:{AsignacionPrecio},
  name: "precios",
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Inventario > Asignación de Precio')
    this.cargarProveedor();
    this.cargarFamilias();
  },
  data(){
    return{
      search: '',
      header:[
        {text:'Proveedor',value:'proveedor'},
        {text:'Marcá',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      primer:[
        {text:'Traer Todo el Inventario',value:1},
        {text:'Traer por Proveedor',value:2},
        {text:'Traer por Marca',value:3},
        {text:'Traer por Familia',value:4},
      ],
      show: false,
      Inventario:[],
      tooltipInventario:[
        {titulo:'Traer todo el inventario', val:1},
        {titulo:'Proveedor', val:2},
        {titulo:'Marca', val:3},
        {titulo:'Familia', val:4},
      ],
      primeraPeticion: 1,
      segundaPeticion: null,
      isPeticon: false,
      Proveedores: null,
      Marcas: [],
      buscador: '',
      buscadorProveedor: [],
      buscadorAfectado: null,
      Familias: null,
      modalArticulo:{
        state: false,
        info: null
      },
      dataPrecio: [],
      resultados: 0,
      paginas: 0,
      filas: 50,
      page: 1
    }
  },
  methods:{
    cargarFamilias(){
      this.$axios.get('familias',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status === 200){
          this.Familias = res.data.familias
        }
      })
    },
    cargarMarcasP(){
      for (let i in this.Proveedores){
        for (let e in this.Proveedores[i].marcas){
          this.Marcas.push({
            "proveedor_id" : this.Proveedores[i].id,
            "nombre": this.Proveedores[i].marcas[e].nombre,
            "id": this.Proveedores[i].marcas[e].id,
            "estado": true
          })
        }
      }
    },
    cargarProveedor(){
      this.$axios.get('proveedores',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status == 200){
          this.Proveedores = res.data.proveedores
          this.buscadorProveedor = res.data.proveedores
          this.cargarMarcasP()
        }
      })
    },
    consultarInventario(){
      this.isPeticon = true
      this.$axios.get('/2.0/inventario_contabilidad').then((res)=>{
        if (res.status === 200){
          this.Inventario = res.data.inventario
          this.isPeticon = false
        }
      })
    },
    goPrecio(item){
      this.dataPrecio = item
      this.$store.commit('cambiarVistaPRecioArticulo', 2);
    }
  },
  computed:{
    filterINVENTARIO(){
      let filtro = [];
      filtro = this.Inventario.filter(fila =>{
        let proveedor = fila.proveedor.toString().toLowerCase();
        let modelo = fila.modelo.toString().toLowerCase();
        let marca = fila.marca.toString().toLowerCase();
        let cod_sistema = fila.codigo_sistema.toString().toLowerCase();
        let articulo = fila.nombre_articulo.toString().toLowerCase();
        let cod_proveedor = fila.codigo_proveedor?fila.codigo_proveedor.toString().toLowerCase():'';
        let fam = fila.fam.toString().toLowerCase();
        let search   = this.search.toLowerCase()
        //
        return proveedor.includes(search) || modelo.includes(search) || cod_sistema.includes(search) ||
            articulo.includes(search) || cod_proveedor.includes(search) || fam.includes(search) || marca.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro
    },
  },
  async fetch(){
    this.$store.commit('cambiarVistaPRecioArticulo', 1);
    this.primeraPeticion = 1;
    this.consultarInventario()
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
