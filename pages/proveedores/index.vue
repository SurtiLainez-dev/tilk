<template>
  <v-container class="pl-2 pr-2">
    <v-card class="pl-2">
      <v-card-title>Proveedores Afiliados</v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar proveedor" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :headers="header" :loading="isPeticion" :items="Proveedores" class="rowsTable"
                    :search="search" @click:row="goProveedor"
                    loading-text="Cargando colaboradores... por favor espere un momento">
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
          {text:'Nombre', value:'nombre'},
          {text:'Rtn', value:'rtn'},
          {text:'País', value:'pais'},
          {text:'E-mail', value:'email'},
          {text:'Teléfono', value:'telefono'},
        ],
        Proveedores: [],
        isPeticion: true
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Proveedores');
    },
    methods:{
      goProveedor(val){
        this.$router.replace({path:'/proveedores/'+val.id})
      }
    },
    async fetch (){
      this.isPeticion = true
      this.Proveedores =(await this.$axios.get('/proveedores/', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.proveedores
      this.isPeticion = false
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
