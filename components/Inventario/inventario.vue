<template>
  <v-card flat class="pl-2">
    <div v-if="$store.state.vistaPrecioArticulo === 1">
      <v-row >
        <v-col md="3"><v-card-title>Inventario</v-card-title></v-col>
        <v-col md="3" class="d-flex align-center">
          <v-autocomplete v-model="primeraPeticion" label="Buscar por" :items="primer"></v-autocomplete>
        </v-col>
        <v-col md="3">
          <v-autocomplete v-model="segundaPeticion" v-if="primeraPeticion === 2" :items="Proveedores"
                          :item-value="'id'" :item-text="'nombre'" label="Buscar Proveedor"></v-autocomplete>
          <v-autocomplete v-model="segundaPeticion" v-if="primeraPeticion === 3" :items="Marcas"
                          :item-value="'id'" :item-text="'nombre'" label="Buscar Marca"></v-autocomplete>
          <v-autocomplete v-model="segundaPeticion" v-if="primeraPeticion === 4" :items="Familias"
                          :item-value="'id'" :item-text="'nombre'" label="Buscar Familia"></v-autocomplete>
        </v-col>
        <v-col md="3" class="d-flex justify-end align-center">
          <v-btn v-if="segundaPeticion || primeraPeticion == 1" small color="indigo" class="ma-2"
                 @click="$store.commit('inventario/cargarInventario')" outlined dark>Consultar Inventario</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="d-flex justify-end">
        <v-col class="d-flex align-self-center justify-start">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn v-on="on" v-bind="attrs" fab x-small dark @click="solicitarClave"><v-icon>fa fa-print</v-icon></v-btn>
            </template>
            <span>Imprimir inventario</span>
          </v-tooltip>
        </v-col>
        <v-col md="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar artículo" single-line hide-details></v-text-field>
        </v-col>
      </v-row>

      <v-progress-linear indeterminate v-if="isPeticon"></v-progress-linear>
      <table>
        <thead>
        <tr><th v-for="item in header" v-text="item.text"></th></tr>
        </thead>
        <tbody>
        <tr @click="verInfo(item)" v-for="(item, i) in filterInventario" :key="i">
          <td v-html="resaltarRows(item.codigo_sistema)"></td>
          <td v-text="item.codigo_proveedor"></td>
          <td v-html="resaltarRows(item.marca)"></td>
          <td v-html="resaltarRows(item.modelo)"></td>
          <td v-html="resaltarRows(item.nombre_articulo)"></td>
          <td v-html="resaltarRows(item.fam)"></td>
        </tr>
        <tr>
          <td colspan="6" class="text-center">------</td>
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
    </div>
    <div v-else-if="$store.state.vistaPrecioArticulo === 2">
      <v-row>
        <v-col cols="1"><v-btn color="orange" dark x-small fab @click="$store.commit('cambiarVistaPRecioArticulo', 1)">
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn></v-col>
        <v-col cols="11" class="d-flex justify-center align-center">
          <h4>{{data.nombre_articulo}}
            <small>[{{data.descripcion_corta}}]</small></h4>
        </v-col>
      </v-row>
      <info v-if="!data.combo" :data="data"/>
      <combo_vista_venta v-else-if="data.combo" :combo="data"/>
    </div>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import info from "@/components/Inventario/info";
import combo_vista_venta from "@/components/Inventario/combos/combo_vista_venta.vue";

export default {
  name: "inventario",
  components:{
    info,
    combo_vista_venta
  },
  data(){
    return{
      data: [],
      search: '',
      header:[
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Marca',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Sub-familia',value:'fam'},
      ],
      show: false,
      tooltipInventario:[
        {titulo:'Traer todo el inventario', val:1},
        {titulo:'Proveedor', val:2},
        {titulo:'Marca', val:3},
        {titulo:'Familia', val:4},
      ],
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
      resultados: 0,
      paginas: 1,
      page: 1,
      filas: 100
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Inventario');
    this.cargarProveedor();
    this.cargarFamilias();
  },
  computed:{
    filterInventario(){
      let filtro = [];
      filtro = this.Inventario.filter(fila => {
        let codigo_s = fila.codigo_sistema.toString()
        let codigo_p = '';
        if (fila.codigo_peoveedor)
          codigo_p = fila.codigo_peoveedor.toString().toLowerCase();

        let marca    = fila.marca.toString().toLowerCase();
        let modelo   = fila.modelo.toString().toLowerCase();
        let nombre   = fila.nombre_articulo.toString().toLowerCase();
        let familia  = fila.fam.toString().toLowerCase();
        let search   = this.search.toLowerCase()

        return codigo_s.includes(search) || codigo_p.includes(search) || marca.includes(search) ||
            modelo.includes(search) || nombre.includes(search) || familia.includes(search)
      });
      this.resultados = filtro.length;
      if (filtro.length) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }
      return filtro;
    },
    isPeticon(){
      return this.$store.state.inventario.load;
    },
    Inventario(){
      return this.$store.state.inventario.data;
    },
    primer(){
      return this.$store.state.inventario.tipo_peticion;
    },
    segundaPeticion:{
      get:function () {
        return this.$store.state.inventario.segunda_peticion
      },
      set: function (val) {
        return this.$store.commit('inventario/cambiarValorSegundaPeticion', val);
      }
    },
    Sucursal(){
      return this.$store.state.sucursal;
    },
    primeraPeticion:{
      get:function () {
        return this.$store.state.inventario.valor_peticion;
      },
      set: function (val) {
        return this.$store.commit('inventario/cambiarValorPeticion', val);
      }
    },
    user(){
      return this.$store.state.usuario;
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
    imprimirInventario(clave){
      let url = this.$axios.defaults.baseURL+'documentos/inventario_x_sucursal/usuario='+this.user+'/sucursal='+this.Sucursal+'/'+clave;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
    solicitarClave(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
        this.imprimirInventario(res.data.clave);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
      })
    },
    verInfo(data){
      this.data = data;
      this.$store.commit('cambiarVistaPRecioArticulo', 2)
    }
  },
  async fetch(){
    this.$store.commit('cambiarVistaPRecioArticulo', 1);
    this.primeraPeticion = 1;
    this.$store.commit('inventario/cargarInventario');
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
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
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
