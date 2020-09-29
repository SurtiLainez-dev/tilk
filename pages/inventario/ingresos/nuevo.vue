<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-row>
        <v-col md="9"><v-card-title>Entrada de Artículos</v-card-title></v-col>
        <v-col md="3" class="d-flex justify-end">
          <v-btn color="orange" class="ma-2" @click="popupInicio = true" small dark>Cambiar Tipo de Entrada</v-btn>
        </v-col>
      </v-row>
      <facturadas  v-if="opcion === 1" :tipo="opcion" :proveedores="Proveedores" :sucursales="Sucursales"/>
      <motocicletas v-else-if="opcion === 2" :tipo="opcion" :proveedores="Proveedores" :sucursales="Sucursales"/>
      <manual v-else-if="opcion === 3" :tipo="opcion" :proveedores="Proveedores" :sucursales="Sucursales"/>
    </v-card>

    <v-dialog v-model="popupInicio" width="400px">
      <v-card class="pl-5 pr-5">
        <v-card-title>Seleccionar opción de Entrada</v-card-title>
        <v-radio-group v-model="opcion">
          <v-radio v-for="item in Tipos" :label="item.nombre" :value="item.id"></v-radio>
        </v-radio-group>
        <v-row>
          <v-col class="d-flex justify-end">
            <v-btn dark small color="orange" @click="popupInicio = false">Aceptar</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import manual from "../../../components/Inventario/Entradas/manual";
  import motocicletas from "../../../components/Inventario/Entradas/motocicletas";
  import facturadas from "../../../components/Inventario/Entradas/facturadas";
  export default {
    components:{manual,motocicletas, facturadas},
    name: "nuevo",
    data(){
      return{
        popupInicio: true,
        opcion: 1,
        Sucursales: [],
        Proveedores: []
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Inventario > Ingresos > Nuevo');
      this.cargarSucursales();
      this.cargarProveedor()
    },
    methods:{
      goBack(){
        this.$router.replace({path:'/inventario/'})
      },
      cargarSucursales(){
        this.$axios.get('/sucursales',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Sucursales = res.data.suc
          }
        })
      },
      cargarProveedor(){
        this.$axios.get('proveedores',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status == 200){
            this.Proveedores = res.data.proveedores
          }
        })
      },
    },
    asyncData({store, $axios}){
      return $axios.get('tipos_entrada_articulos',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Tipos: res.data.tipos
        }
      })
    }
  }
</script>

<style scoped>

</style>
