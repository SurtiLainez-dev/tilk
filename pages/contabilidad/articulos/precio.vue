<template>
  <v-card class="pl-2 pr-2">
    <div v-if="$store.state.vistaPrecioArticulo === 1">
      <v-row >
        <v-col md="3"><v-card-title>Inventario</v-card-title></v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row class="d-flex justify-end">
        <v-col md="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar artículo" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :loading="isPeticon" loading-text="Cargando artículos... por favor espere un momento"
                    :headers="header" :items="Inventario" :search="search"
                    class="rowsTable" @click:row="goPrecio">

      </v-data-table>
    </div>
    <div v-else-if="$store.state.vistaPrecioArticulo === 2">
      <v-row>
        <v-col><v-btn color="orange" dark x-small fab @click="$store.commit('cambiarVistaPRecioArticulo', 1)">
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn></v-col>
      </v-row>
      <asignacion-precio :data="dataPrecio"/>
    </div>
  </v-card>
</template>

<script>
  import AsignacionPrecio from "../../../components/contabilidad/AsignacionPrecio";
  export default {
    components:{AsignacionPrecio},
    name: "precio",
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
    async fetch(){
      this.$store.commit('cambiarVistaPRecioArticulo', 1);
      this.primeraPeticion = 1;
      this.consultarInventario()
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
