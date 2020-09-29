<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-row>
          <v-col md="6"><v-card-title>Ordenes de Ingreso de Inventario</v-card-title></v-col>
          <v-col md="6" class="d-flex justify-end">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar orden de ingreso" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-data-table :headers="header" :items="Entradas" @click:row="redireccionar"
                      class="rowsTable" :search="search">
          <template v-slot:item.proveedor.nombre="{item}">
            <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo" alt="John"></v-avatar>
            <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
            {{item.proveedor.nombre}}
          </template>
          <template v-slot:item.estado="{item}">
            <v-chip v-if="item.estado ===1" color="success">Registrado</v-chip>
            <v-chip v-else color="red">Pendiente</v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        search: '',
        header:[
          {text:'Tipo de Entrada', value:'tipo_entrada_articulo.nombre'},
          {text:'Proveedor', value:'proveedor.nombre'},
          {text:'Código', value:'codigo'},
          {text:'Estado', value:'estado'},
          {text:'Usuario Creador', value:'user.usuario'},
          {text:'Fecha Creado', value:'fecha_creacion'},
        ]
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Inventario > Ingresos');
    },
    methods:{
      redireccionar(val){
        this.$router.replace({path: '/inventario/ingresos/'+val.id})
      }
    },
    asyncData({store, $axios}){
      return $axios.get('ordenes_entrada',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Entradas: res.data.ordenes
        }
      })
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
