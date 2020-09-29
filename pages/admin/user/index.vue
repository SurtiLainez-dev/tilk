<template>
    <v-card class="mt-2">
      <v-row class="pt-2 pr-2 pl-2">
        <v-col cols="8">
          <v-card-title>
            Usuarios Existentes
          </v-card-title>
        </v-col>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
            label="Buscar usuario" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :items-per-page="10" :items="usuarios" fixed-header :search="search"
                    :headers="header" :loading="isPeticion" @click:row="redireccionar" class="rowsTable"
                    loading-text="Cargando usuarios... por favor espere un momento">
        <template v-slot:item.nombres="{item}">
          {{item.nombres }} {{item.apellidos}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
          <v-icon v-else color="red">fa fa-times</v-icon>
        </template>
      </v-data-table>
    </v-card>
</template>

<script>
    export default {
      name: "index",
      data(){
        return{
          search: '',
          usuarios: [],
          isPeticion: true,
          selectedUsuarios: null,
          header:[
            {text: 'Colaborador', value:'nombres'},
            {text: 'Puesto', value:'puesto'},
            {text: 'Usuario', value:'usuario'},
            {text: 'Tipo', value:'tipo'},
            {text: 'Correo', value:'email'},
            {text: 'Código', value:'num_ingreso'},
            {text: 'Estado', value:'estado',align: 'center'},
          ],
        }
      },
      created() {
        this.$store.commit('guardarTitulo', 'Usuarios')
      },
      methods:{
        redireccionar(val) {
          this.$router.replace({path:'/admin/user/'+val.user})
        },
      },
      async fetch (){
        this.usuarios =(await this.$axios.get('/usuarios', {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        })).data.usuarios
        this.isPeticion = false

      }
    }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
