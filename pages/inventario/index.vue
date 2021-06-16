<template>
  <v-card class="pl-2">
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
        <v-col md="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar artículo" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :loading="isPeticon" @click:row="verInfo"
                    loading-text="Cargando artículos... por favor espere un momento"
                    :headers="header" :items="Inventario" :search="search" class="rowsTable">

      </v-data-table>
    </div>
    <div v-else-if="$store.state.vistaPrecioArticulo === 2">
      <v-row>
        <v-col cols="1"><v-btn color="orange" dark x-small fab @click="$store.commit('cambiarVistaPRecioArticulo', 1)">
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn></v-col>
        <v-col cols="11" class="d-flex justify-center align-center">
          {{data.nombre_articulo}}
          <small>[{{data.descripcion_corta}}]</small>
        </v-col>
      </v-row>
      <info :data="data"/>
    </div>
  </v-card>
</template>

<script>
  import info from "../../components/Inventario/info";
  export default {
    components:{
      info
    },
    name: "index",
    data(){
      return{
        data: [],
        search: '',
        header:[
          {text:'Marcá',value:'marca'},
          {text:'Módelo',value:'modelo'},
          {text:'Código Sístema',value:'codigo_sistema'},
          {text:'Nombre del Artículo',value:'nombre_articulo'},
          {text:'Código Proveedor',value:'codigo_proveedor'},
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
        }
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Inventario');
      this.cargarProveedor();
      this.cargarFamilias();
    },
    computed:{
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
      primeraPeticion:{
        get:function () {
          return this.$store.state.inventario.valor_peticion;
        },
        set: function (val) {
          return this.$store.commit('inventario/cambiarValorPeticion', val);
        }
      }
    },
    methods:{
      verInfo(data){
        this.data = data;
        this.$store.commit('cambiarVistaPRecioArticulo', 2)
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
  .rowsTable{
    cursor: pointer;
  }
</style>
