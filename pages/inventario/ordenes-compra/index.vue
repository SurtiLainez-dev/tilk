<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-row>
        <v-col cols="8"><v-card-title>Ordenes de Compra Realizadas a Proveedores</v-card-title></v-col>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar cotización" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table :headers="header" :items="Ordenes" @click:row="redireccionar"
                    class="rowsTable" :search="search">
        <template v-slot:item.proveedor.nombre="{item}" >
          <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo"></v-avatar>
          <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
          {{item.proveedor.nombre}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-chip v-if="item.estado ===1" color="success">Recibida</v-chip>
          <v-chip v-else color="warning">Sin Acciones</v-chip>
        </template>
        <template v-slot:item.total="{item}">
          L. {{int.format(item.total)}}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    created() {
      this.$store.commit('guardarTitulo', 'Ordenes de Compra');
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        search: '',
        header:[
          {text:'Código',value:'codigo'},
          {text:'Proveedor',value:'proveedor.nombre'},
          {text:'Usuario Creador',value:'user.usuario'},
          {text:'Sucursal Asignada',value:'sucursal.nombre'},
          {text:'Fecha Creación',value:'fecha_creacion'},
          {text:'Total Orden',value:'total'},
          {text:'Estado',value:'estado'},
        ]
      }
    },
    name: "index",
    methods:{
      redireccionar(val){
        this.$router.replace({path:'/inventario/ordenes-compra/'+val.id})
      }
    },
    asyncData({$axios, store, route}){
      return $axios.get('orden_compra',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Ordenes: res.data.ordenes
        }
      })
    }
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
  .rowsTable{
    cursor: pointer;
  }
</style>
