<template>
  <v-container class="pt-2 pr-2 pl-2">
    <v-card>
      <v-row class="pt-2 pr-2 pl-2">
        <v-col cols="8">
          <v-card-title>
            Colaboradores Existentes
          </v-card-title>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar colaborador" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table :items-per-page="10" :headers="header" fixed-header :loading="isPeticion"
                    class="rowsTable"  dense :items="Colaboradores" @click:row="redireccionarColaborador"
                    :search="search" loading-text="Cargando colaboradores... por favor espere un momento">
        <template v-slot:item.nombres="{item}">
          {{item.nombres}} {{item.apellidos}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
          <v-icon v-else color="red">fa fa-times</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
    export default {
      data(){
        return{
          header:[
            {text: 'Nombre Completo', value:'nombres'},
            {text: 'Identidad', value:'identidad'},
            {text: 'E-mail', value:'email'},
            {text: 'Telefono', value:'telefono'},
            {text: 'Sucursal Asignada', value:'sucursal'},
            {text: 'Puesto', value:'puesto'},
            {text: 'Estado', value:'estado', align:'center'},
          ],
          search: '',
          Colaboradores: [],
          isPeticion:    false,
          selectedTable: [],
        }
      },
      methods:{
        cargarColaboradores: function () {
          this.isPeticion = true
          this.$axios.get('/colaboradores',{
            headers:{
              'Authorization': 'Bearer '+ this.$store.state.token
            }
          }).then((res)=>{
            this.Colaboradores = res.data.colaboradores
            this.isPeticion = false
          })
        },
        redireccionarColaborador: function (val) {
          this.$router.replace({path:'/colaborador/'+val.col})
        }
      },
      mounted() {
        this.cargarColaboradores();
      },
      created() {
        this.$store.commit('guardarTitulo', 'Colaboradores')
      },
      name: "index"
    }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
