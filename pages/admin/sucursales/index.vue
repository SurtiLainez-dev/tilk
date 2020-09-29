<template>
    <v-container class="pt-2 pr-2 pl-2">
      <v-card>
        <v-row class="pt-2 pr-2 pl-2">
          <v-col cols="8">
            <v-card-title>
              Sucursales Existentes
            </v-card-title>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar sucursal" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :items-per-page="10" :headers="header" fixed-header :loading="isReload"
                      class="rowsTable" :items="datosSucursal" dense @click:row="goSucursal"
                      :search="search" loading-text="Cargando sucursales... por favor espere un momento">
          <template v-slot:item.ciudad="{item}">
            {{item.depto }}, {{item.ciudad}}
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
        isPeticion:      false,
        isReload:        true,
        isPopup:         false,
        selectedTable:   [],
        erroresServidor: [],
        datosSucursal:   [],
        isContable:      false,
        select:          [],
        header:[
          {text: 'Nombre', value:'nombre'},
          {text: 'Abreviatura', value:'abreviatura'},
          {text: 'Email', value:'email'},
          {text: 'Telefono', value:'telefono'},
          {text: 'Ubicación', value:'ciudad'},
        ],
      }
    },
    methods:{
      goSucursal(val){
        this.$router.replace({path:"/admin/sucursales/"+val.id})
      },

      reloadPage: function () {
        this.isReload = true
        this.$axios.get('/sucursales',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.isReload = false
          this.datosSucursal = res.data.suc
        })
      }
    },
    created() {
      this.$store.commit('guardarTitulo', 'Sucursales')
      this.reloadPage()
    },
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
