<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Rebaja Manual de Inventario</v-card-title>
    </v-toolbar>
    <v-row no-gutters>
      <v-col class="d-flex justify-end">
        <v-btn color="indigo" tile small dark @click="dialogoBuscar = true" class="ma-2">Buscar Artículo</v-btn>
      </v-col>
    </v-row>
    <v-card-text>Este modulo del sistema solo se utilizará en el periodo de prueba del sistema</v-card-text>
    <v-divider></v-divider>

    <v-card flat v-if="load">
      <table>
        <thead>
        <tr>
          <th class="text-center" colspan="4" style="font-size: 16px; background-color: #E8E8E8">{{articulo.nombre_articulo}}</th>
        </tr>
        <tr>
          <td class="ma-2 pa-1 border" colspan="3" style="font-size: 14px; width: 80%">{{articulo.descripcion_corta}}</td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Codigo del Sistema: <strong>{{articulo.codigo_sistema}}</strong></td>
        </tr>
        <tr>
          <td class="ma-2 pa-1 border" colspan="2" style="font-size: 14px; width: 20%">Proveedor: <strong>{{articulo.proveedor}}</strong></td>
          <td class="ma-2 pa-1 border"  style="font-size: 14px; width: 20%">Marca: <strong>{{articulo.marca}}</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Modelo: <strong>{{articulo.modelo}}</strong></td>
        </tr>
        <tr>
          <td class="ma-2 pa-1 border" colspan="2" style="font-size: 14px; width: 20%">Codigo del Proveedor: <strong>{{articulo.codigo_proveedor}}</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Codigo de Barra: <strong v-if="articulo.codigo_barra">{{articulo.codigo_barra}}</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Referencia del Fabricante: <strong v-if="articulo.referencia_fabricante">{{articulo.referencia_fabricante}}</strong></td>
        </tr>
        <tr>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Familía: <strong>{{articulo.familia}}</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Sub-Familía: <strong>{{articulo.fam}}</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Vehículo: <strong v-if="articulo.is_motocicleta === 0">No</strong><strong v-else>Sí</strong></td>
          <td class="ma-2 pa-1 border" style="font-size: 14px; width: 20%">Precio de Contado: L. <strong>0</strong></td>
        </tr>
        </thead>
      </table>
      <v-card flat :loading="loadStock">
        <table>
          <thead>
            <tr>
              <th colspan="8" class="ma-1 pa-1" style="font-size: 14px; background-color: #f9f9f9">Stock de Sucursales</th>
            </tr>
            <tr>
              <th class="ma-1 pa-1" style="font-size: 13px">Sucursal</th>
              <th class="ma-1 pa-1 text-center" style="font-size: 13px">Stock Nuevo</th>
              <th class="ma-1 pa-1 text-center" style="font-size: 13px">Stock Reingreso</th>
              <th class="ma-1 pa-1 text-center" style="font-size: 13px">Stock Consignado</th>
              <th class="ma-1 pa-1 text-center" style="font-size: 13px">Total a Rebajar N.</th>
              <th class="ma-1 pa-1 text-center" style="font-size: 13px">Acciones</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in stock">
            <td class="ma-1 pa-1" style="font-size: 12px">{{item.sucursal.nombre}}</td>
            <td class="ma-1 pa-1 text-center" style="font-size: 12px">{{item.stock_actual}}</td>
            <td class="ma-1 pa-1 text-center" style="font-size: 12px">{{item.stock_reingreso}}</td>
            <td class="ma-1 pa-1 text-center" style="font-size: 12px">{{item.stock_consignado}}</td>
            <td class="ma-1 pa-1 text-center" style="font-size: 12px">
              <input class="ma-1 pa-1" v-model="stockRebajar[i]"  @change="calcularNuevoStock(i, item)"
                     style="border: 1px #f6f6f6 solid; height: 40%; width: 20%" type="number" :disabled="item.stock_actual <= 0">
            </td>
            <td class="ma-1 pa-1 text-center">
              <v-btn color="success" x-small tile class="text--white"
                     :disabled="item.stock_actual <= 0 || stockRebajar[i] <= 0"
                     @click="abrirDialogo(item, i)">Rebajar</v-btn>
            </td>
          </tr>
          </tbody>
        </table>
      </v-card>
    </v-card>

    <v-dialog v-model="dialogoBuscar" width="100%">
      <v-card class="pa-5">
        <v-toolbar flat>
          <v-card-title>Inventario</v-card-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field label="Buscar ..." dense v-model="search"></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table :loading="isPeticon" @click:row="seleccionarArticulo"
                      loading-text="Cargando artículos... por favor espere un momento"
                      :headers="header" :items="Inventario" :search="search" class="rowsTable">
        </v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogoEnvio" width="50%">
      <v-card >
        <v-card-title>Haciendo Rebaja Manual de {{articulo.nombre}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>Antes de hacer la rebaja manual debes saber las siguientes acciones que el sistema va a realizar</v-card-text>
        <ul style="font-size: 12px">
          <li>1. El sistema va a crear una "Orden de Entrada" solo que su estado va ser tiempo SALIDA MANUAL.</li>
          <li>2. Con lo anterior no confundir, el sistema no carga, la tarea que hace es rebajar stock.</li>
          <li>3. Esta salida queda registrado en el peps.</li>
          <li>4. El sistema cagara la orden de entrada de una solaa vez.</li>
          <li>5. Llenar el siguiente campo con una observación o referencia de traslado Unifile.</li>
        </ul>

        <v-textarea outlined label="Observacion" rows="3" class="ma-2" v-model="observacion"></v-textarea>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-center">
          <v-btn dark tile small color="warning" @click="dialogoEnvio = false">Cerrar</v-btn>
          <v-btn dark tile small color="success" @click="validarRebaja">Registrar Rebaja</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "salida_manual",
  data(){
    return{
      load: false,
      dialogoBuscar: false,
      search: '',
      header:[
        {text:'Marcá',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      articulo: {},
      stock: [],
      loadStock: false,
      stockRebajar: [],
      stockNuevo: [],
      lpsRebajar: 0,
      observacion: '',
      dialogoEnvio: false,
      item: {},
      i: 0
    }
  },
  computed:{
    isPeticon(){
      return this.$store.state.LOAD_ARTICULOS_EDIT;
    },
    Inventario(){
      return this.$store.state.ARTICULOS_EDIT;
    },
  },
  created() {
    this.$store.commit('cargar_ARTICULOS_EDIT');
    this.$store.commit('guardarTitulo', 'Inventario > Artículo > Salida Manual');
    this.$store.commit('activarOverlay', false);
  },
  methods:{
    abrirDialogo(item, i){
      if ( this.stockRebajar[i] <= item.stock_actual){
        this.lpsRebajar = (this.stockRebajar[i] * this.articulo.precio_costo).toFixed(2);
        this.dialogoEnvio = true;
        this.item = item;
        this.i = i;
      }else
        this.$store.commit('notificacion', {texto: 'Dato no valido', color: 'warning'})
    },
    calcularNuevoStock(i, item){
      console.log(this.stockRebajar[i] > 0 && this.stockRebajar[i] <= item.stock_actual)
      if (this.stockRebajar[i] > 0 && this.stockRebajar[i] <= item.stock_actual) {
        this.stockNuevo[i] = parseInt(item.stock_actual) - parseInt(this.stockRebajar[i]);
        console.log(this.stockNuevo)
      }else {
        this.stockNuevo[i] = item.stock_actual;
        this.$store.commit('notificacion', {texto: 'Dato no valido', color: 'warning'})
      }
      console.log(this.stockNuevo)
    },
    cargarstock(){
      this.loadStock = true;
      this.stock = [];
      this.stockRebajar = [];
      this.stockNuevo   = [];
      this.$axios.get('detalles_sucursales/'+this.articulo.articulo).then((res)=>{
        this.stock = res.data.stock
        this.stock.forEach((item)=>{
          this.stockRebajar.push(0)
          this.stockNuevo.push(item.stock_actual)
        })
        this.loadStock = false
      })
    },
    registrarSalidaManual(){

      this.dialogoEnvio = false;
      this.$store.commit('activarOverlay', true);
      let articulo = [];
      articulo.push({
        articulo: this.articulo.articulo,
        estado: 1,
        isCompuesto: 0,
        cantidad: this.stockRebajar[this.i]
      });
      this.$axios.post('registrar_salida_manual',{
        stockId: this.item.id,
        stockNuevo: this.stockNuevo[this.i],
        proveedor: this.articulo.proveedor_id,
        sucursal: this.item.sucursal_id,
        observacion: this.observacion,
        articulos: articulo,
        totalNuevo: this.lpsRebajar
      }).then((res)=>{
        this.load = false
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.observacion = '';
        this.articulo = {};
        this.stock = [];
        this.verDocumento(res.data.file)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    seleccionarArticulo(item) {
      this.articulo = item
      this.cargarstock();
      this.dialogoBuscar = false;
      this.load = true;
    },
    validarRebaja(){
      if (this.observacion.length > 0)
        this.registrarSalidaManual();
      else
        this.$store.commit('notificacion',{texto:'Su observación debe ser mayor a 20 carácteres', color:'warning'});
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay',  true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento',color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    },
  }
}
</script>

<style scoped>
table{
  width: 100%;
}
</style>
