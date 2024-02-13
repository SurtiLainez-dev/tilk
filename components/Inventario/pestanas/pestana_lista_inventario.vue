<template>
  <v-card flat tile>
    <v-card flat height="50" color="grey lighten-5">
      <v-toolbar color="grey lighten-5" flat dense>
        <v-toolbar-title>Inventario Imprimible Para Precios</v-toolbar-title>
      </v-toolbar>
    </v-card>

    <v-progress-linear indeterminate v-if="loadInventario"></v-progress-linear>
    <v-row no-gutters class="ml-1 mr-1">
      <v-col cols="7">
        <table>
          <thead>
          <tr style="background-color: #f1f0f0">
            <th colspan="5">Inventario</th>
            <th colspan="1" style="border-left: none" class="text-right">
              <span style="font-size: 8px"><strong>{{resultados}} resultados</strong></span>
            </th>
          </tr>
          <tr>
            <th v-for="(item,i) in header" v-if="i > 0" :colspan="i > 0 && i < 2 ? 2 : 1" v-text="item.text"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in filterInventario" :key="i">
            <td>
              <vs-checkbox size="small" v-model="item.check"></vs-checkbox>
            </td>
            <td v-html="resaltarRows(item.codigo_sistema)"><vs-checkbox size="small"></vs-checkbox></td>
            <td v-text="item.codigo_proveedor"></td>
            <td v-html="resaltarRows(item.marca)"></td>
            <td v-html="resaltarRows(item.modelo)"></td>
            <td v-html="resaltarRows(item.nombre_articulo)"></td>
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
      </v-col>
      <v-col cols="5">
        <v-row no-gutters>
          <v-col cols="11">
            <table class="ml-1">
              <thead>
              <tr>
                <th>Articulos Seleccionados</th>
                <th style="border-left: none" class="text-right">
                  <span style="font-size: 8px"><strong>{{resultadosSeleccionados}} resultados</strong></span>
                </th>
              </tr>
              <tr>
                <th v-for="item in header2">{{item}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in filetArticuloSeleccionados">
                <td v-text="item.codigo_sistema"></td>
                <td v-text="item.nombre_articulo"></td>
              </tr>
              <tr>
                <td colspan="2">-----</td>
              </tr>
              </tbody>
            </table>
            <div class="d-flex justify-end">
              <v-pagination v-if="resultadosSeleccionados >= filas"
                  v-model="pageSeleccinado"
                  :length="paginasSeleccionados"
                  :total-visible="6"
              ></v-pagination>
            </div>
          </v-col>
          <v-col cols="1">
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="300">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-if="search.length === 0" v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey"><v-icon>mdi-magnify</v-icon></v-btn>
                        <v-btn v-else v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey"><v-icon color="green">mdi-text-search</v-icon></v-btn>
                      </template>
                      <span>Buscar en el inventario</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row no-gutters>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Buscando articulos</strong></span></v-col>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Resultados: {{resultados}}</strong></span></v-col>
                    </v-row>
                    <input type="text" style="background-color: white; width: 100%;
                    padding: 8px 8px;margin: 0px 0;box-sizing: border-box;" v-model="search" placeholder="Buscar ...">
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="300">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="!selectPromo">mdi-filter</v-icon>
                          <v-icon color="green" v-else-if="selectPromo">mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por promociones vigentes</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row no-gutters>
                      <v-col cols="2">
                        <vs-checkbox v-model="selectPromo" class="ma-2" size="small" ></vs-checkbox>
                      </v-col>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Filtrar por promos</strong></span></v-col>
                    </v-row>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="400">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="proveedor_id === 0">mdi-filter</v-icon>
                          <v-icon color="green" v-else>mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por proveedores</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <span class="ml-2 text--grey" style="font-size: 10px"><strong>Filtrar por promos</strong></span>
                    <v-autocomplete class="ma-2" :items="Proveedores" :item-text="'nombre'" :item-value="'id'" dense v-model="proveedor_id"></v-autocomplete>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu :close-on-content-click="false" offset-y :nudge-width="400">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs"  fab x-small icon text color="grey">
                          <v-icon v-if="!selectPrecioContadoPagos">mdi-filter</v-icon>
                          <v-icon color="green" v-else>mdi-filter-check</v-icon>
                        </v-btn>
                      </template>
                      <span>Filtrar por precios de contado a pagos</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <v-row no-gutters>
                      <v-col cols="2">
                        <vs-checkbox v-model="selectPrecioContadoPagos" class="ma-2" size="small" ></vs-checkbox>
                      </v-col>
                      <v-col><span class="ml-2 text--grey" style="font-size: 10px"><strong>Filtrar por precios contado a pagos</strong></span></v-col>
                    </v-row>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs"  fab x-small icon text color="grey" @click="seleccionarItems(1)" @dblclick="seleccionarItems(2)">
                      <v-icon v-if="!seleccionadosTodosItems">mdi-filter</v-icon>
                      <v-icon color="green" v-else>mdi-check-all</v-icon>
                    </v-btn>
                  </template>
                  <span>Seleccionar todos los items de la tabla 1</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, attr}">
                    <v-btn v-on="on" v-bind="attr" @click="limpiarFiltro"  fab x-small icon text
                           :color="proveedor_id > 0 || search.length > 0 || selectPromo ? 'red' : 'grey'"><v-icon>mdi-filter-remove</v-icon></v-btn>
                  </template>
                  <span>Limpiar filtros</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, attr}">
                    <v-btn v-on="on" v-bind="attr" @click="filetArticuloSeleccionados = []"  fab x-small icon text
                           :color="filetArticuloSeleccionados.length > 0? 'red' : 'grey'"><v-icon>mdi-backspace</v-icon></v-btn>
                  </template>
                  <span>Limpiar la lista</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, attr}">
                    <v-btn v-on="on" v-bind="attr" @click="cargarInventario"  fab x-small icon text :color="loadInventario?'green':'grey'"><v-icon>mdi-reload</v-icon></v-btn>
                  </template>
                  <span>Recargar información</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-menu v-model="menuImprimir"  :close-on-content-click="false" offset-y :nudge-width="500">
                  <template v-slot:activator="{ on: menu, attrs }">
                    <v-tooltip left>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn v-on="{...tooltip, ...menu}" v-bind="attrs" :disabled="filetArticuloSeleccionados.length === 0"
                               fab x-small icon text :color="filetArticuloSeleccionados.length > 0? 'indigo' : 'grey'"><v-icon>mdi-printer</v-icon></v-btn>
                      </template>
                      <span>Imprimir lista de articulos</span>
                    </v-tooltip>
                  </template>
                  <v-card color="white" tile outlined>
                    <span class="ml-2 text--grey" style="font-size: 10px"><strong>Título del documento</strong></span>
                    <v-text-field class="ml-2 mr-2" dense v-model="titulo"></v-text-field>
                    <span class="ml-2 text--grey" style="font-size: 10px"><strong>Contenido del documento</strong></span>
                    <v-textarea class="ml-2 mr-2" dense rows="8" placeholder="Contenido ...." v-model="contenido"></v-textarea>
                    <v-card-actions class="d-flex justify-end">
                      <v-btn color="indigo" class="mr-2" small tile text @click="solicitarClave">Imprimir</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col class="d-flex justify-end">
                <v-tooltip left>
                  <template v-slot:activator="{on, attr}">
                    <v-btn v-on="on" v-bind="attr" fab x-small icon text :color="filetArticuloSeleccionados.length > 0? 'indigo' : 'grey'"><v-icon>mdi-email</v-icon></v-btn>
                  </template>
                  <span>Enviar lista por Correo</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


  </v-card>
</template>

<script>

import {forEach, vsCheckbox, vsIcon} from 'vuesax';
import 'vuesax/dist/vuesax.css';
import 'material-icons/iconfont/material-icons.css';
import Vue from "vue";
import {ipcRenderer} from "electron";
export default {
  name: "pestana_lista_inventario",
  data(){
    return{
      menuImprimir: false,
      search: '',
      titulo: '',
      contenido: 'Sin Observaciones',
      header:[
        {text:' ', value:'articulo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Marca',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
      ],
      header2:[
        'Código Sistema',
        'Nombre del Articulo'
      ],
      resultados: 0,
      paginas: 1,
      page: 1,
      filas: 50,
      Inventario: [],
      loadInventario: true,
      selectPromo: false,
      Proveedores: [],
      loadProveedores: false,
      proveedor_id: 0,
      selectPrecioContadoPagos: false,
      resultadosSeleccionados: 0,
      paginasSeleccionados: 1,
      pageSeleccinado: 1,
      InventarioSeleccionado: [],
      InvSeleccionado: [],
      seleccionadosTodosItems: false
    }
  },
  computed:{
    filetArticuloSeleccionados:{
      get(){
        let seleccionados            = this.Inventario.filter(item => item.check === true);
        this.resultadosSeleccionados = seleccionados.length;

        if (this.resultadosSeleccionados > 0) {
          this.paginasSeleccionados = Math.ceil(this.resultadosSeleccionados / this.filas);
          let inicio = (this.pageSeleccinado - 1) * this.filas;
          seleccionados = seleccionados.splice(inicio, this.filas)
        }else{
          this.paginasSeleccionados = 1
        }

        return seleccionados;
      },
      set(data){
        this.Inventario.map(item=>{return item.check = false})
      }
    },
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
        let search   = this.search.toLowerCase()

        return codigo_s.includes(search) || codigo_p.includes(search) || marca.includes(search) ||
            modelo.includes(search) || nombre.includes(search)
      });

      if (this.selectPromo)
        filtro = filtro.filter(item=>item.precio_promo)

      if (this.selectPrecioContadoPagos)
        filtro = filtro.filter(item => item.pagos > 0)


      if (this.proveedor_id > 0)
        filtro = filtro.filter(item=>item.proveedor_id === this.proveedor_id)

      this.resultados = filtro.length;

      if (filtro.length > 0) {
        this.paginas = Math.ceil(filtro.length / this.filas);
        let inicio = (this.page - 1) * this.filas;
        filtro = filtro.splice(inicio, this.filas)
      }else{
        this.paginas = 1
      }


      return filtro;
    },
    user(){
      return this.$store.state.usuario;
    }
  },
  methods:{
    cargarInventario(){
      this.loadInventario = true;
      this.$axios.get('/2.0/inventario_x_precio_activo').then((res=>{
        this.Inventario = [];
        res.data.inventario.forEach(item=>{
          this.Inventario.push({
            id: item.id,
            codigo_sistema: item.codigo_sistema,
            codigo_proveedor: item.codigo_proveedor,
            marca:            item.marca,
            modelo:           item.modelo,
            nombre_articulo:  item.nombre_articulo,
            check:            false,
            precio_promo:     item.precio_codigo,
            proveedor_id:     item.pro,
            pagos:            item.pagos
          })
        })
        this.loadInventario = false;
        this.cargarProveedor();
      }))
    },
    cargarProveedor(){
      this.loadProveedores = true;
      this.$axios.get('proveedores',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        this.Proveedores     = res.data.proveedores;
        this.loadProveedores = false;
      })
    },
    imprimirInventario(clave){
      let ids = [];
      let paginaActual = this.pageSeleccinado;
      for (let i = 0; i < this.paginasSeleccionados; i++){
        this.filetArticuloSeleccionados.forEach(item=>ids.push(item.id))
        this.pageSeleccinado++;
      }
      this.pageSeleccinado = paginaActual;

      let url = this.$axios.defaults.baseURL+'documentos/lista_precios/usuario='+this.user+'/titulo='+this.titulo+'/'+clave+'/ids='+JSON.stringify(ids)+'/contenido='+this.contenido;
      ipcRenderer.send('pint_navegador', url);
      this.$store.commit('activarOverlay', false);
    },
    limpiarFiltro(){
      this.proveedor_id             = 0;
      this.search                   = '';
      this.selectPromo              = false;
      this.selectPrecioContadoPagos = false;
    },
    resaltarRows(text){
      let exits = text.toLowerCase().includes(this.search.toLowerCase());
      if (!exits) return text;

      let reg = new RegExp(this.search, 'ig');
      return text.replace(reg, textoRemarcado => `<strong>${textoRemarcado}</strong>`)
    },
    seleccionarItems(val){
      this.seleccionadosTodosItems = val === 1;
      let paginaActual             = this.page;

      for (let i = 0; i < this.paginas; i++){
        if (this.seleccionadosTodosItems)
          this.filterInventario.forEach(item => item.check = true)
        else
          this.filterInventario.forEach(item => item.check = false)
        this.page++;
      }
      this.page = paginaActual;
    },
    solicitarClave(){
      if (this.titulo.length > 5 && this.contenido.length > 5){
        this.menuImprimir = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('solicitar_clave_doucmento').then((res)=>{
          this.$store.commit('notificacion',{texto:'Cargando inventario', color:'success'});
          this.imprimirInventario(res.data.clave);
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'danger'});
        })
      }else{
        this.$store.commit('notificacion',{texto:'El titulo de la impresión tiene que ser mayor a 5 carácteres', color:'warning'});
      }
    }
  },
  created() {
    Vue.use(vsCheckbox);
    Vue.use(vsIcon);
    this.cargarInventario();
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
