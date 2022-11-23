<template>
  <v-card >
    <v-toolbar flat>
      <h6>Clientes Existentes en Surtidora Laínez</h6>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar Cliente" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table dense
                  :items-per-page="15"
                  :search="search"
                  class="rowsTable"
                  @click:row="goCliente"
                  :loading="LOAD_CLIENTES"
                  loading-text="Cargando Clientes"
                  :items="CLIENTES"
                  :headers="header">
      <template v-slot:header.sexo>
        <div class="d-flex justify-center">Sexo</div>
      </template>
      <template v-slot:item.sexo="{item}">
        <div class="d-flex justify-center">
          <v-icon color="indigo" v-if="item.sexo === 1">fa fa-male</v-icon>
          <v-icon color="pink" v-else>fa fa-female</v-icon>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "perfiles",
  data(){
    return{
      search:'',
      header:[
        {text:'Nombres del Cliente', value: 'nombres'},
        {text:'Apellidos del Cliente', value: 'apellidos'},
        {text:'Identidad del Cliente', value: 'identidad'},
        {text:'Sexo', value: 'sexo'},
        {text:'Correo Eléctronico', value: 'email'},
      ]
    }
  },
  computed:{
    CLIENTES(){
      return this.$store.state.cliente.CLIENTES;
    },
    LOAD_CLIENTES(){
      return this.$store.state.cliente.LOAD_CLIENTES;
    }
  },
  created() {
    // this.$store.commit('guardarTitulo', 'Clientes');
    this.$store.commit('cliente/cargar_CLIENTES');
  },
  methods:{
    goCliente(cliente){
      this.$router.replace({path:'/clientes/'+cliente.id});
      this.notificacion('Cargando los datos del cliente','success');
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
  }
}
</script>

<style scoped>

</style>
