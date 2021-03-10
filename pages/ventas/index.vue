<template>
<v-card >
  <div v-if="vista === 1">
    <v-toolbar flat>
      <h6>Cuentas de Clientes de SURTIDORA LAÍNEZ</h6>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar Cuenta" dense v-model="search"></v-text-field>
    </v-toolbar>

    <v-data-table :items="CUENTAS"
                  :search="search"
                  dense
                  :loading="Load"
                  loading-text="Cargando Cuentas"
                  @click:row="goCuenta"
                  :headers="header"
                  class="rowsTable">
      <template v-slot:item.total="{item}">
        L {{item.total}}
      </template>
      <template v-slot:item.saldo_actual="{item}">
        L {{item.saldo_actual}}
      </template>
      <template v-slot:item.cliente.nombres="{item}">
        {{item.cliente.nombres}} {{item.cliente.apellidos}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
        <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
        <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
        <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
      </template>
      <template v-slot:item.is_aceptado="{item}">
        <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Sí</v-chip>
        <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>No</v-chip>
        <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente</v-chip>
      </template>

    </v-data-table>
  </div>
  <div v-else>
    <v-card>
      <v-toolbar flat>
        <v-btn color="orange" fab tile dark x-small @click="vista = 1">
          <v-icon>fa fa-arrow-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <h5 class="grey--text">Cuenta de {{CUENTA.cliente.nombres}} {{CUENTA.cliente.apellidos}}</h5>
        <v-spacer></v-spacer>
        <small class="grey--text"><strong>Cuenta #{{CUENTA.cod}}</strong></small>
      </v-toolbar>
      <v-divider></v-divider>
      <cuenta/>
    </v-card>
  </div>
</v-card>
</template>

<script>
import cuenta from "../../components/Ventas/cuenta";
import Vue from "vue";
export default {
  name: "index",
  components:{cuenta},
  data(){
    return{
      Load:    true,
      vista: 1,
      search: '',
      header:[
        {text: 'Código', value: 'cod'},
        {text: 'Nombre del Cliente', value: 'cliente.nombres'},
        {text: 'Artículo', value: 'remision_articulo.articulo.nombre_articulo'},
        {text: 'total', value: 'total'},
        {text: 'Saldo Actual', value: 'saldo_actual'},
        {text: 'Estado', value: 'estado'},
        {text: 'Fue Aceptada', value: 'is_aceptado'},
      ],
      Cuentas: []
    }
  },
  computed:{
    CUENTAS:{
      get: function (){
        return this.$store.state.cuentas.CUENTAS;
      },
      set: function (cuentas){
        this.$store.commit('cuentas/agregar_CUENTAS', cuentas);
      },
    },
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Cuentas');
    this.cargarCuentas();
  },
  methods:{
    cargarCuentas(){
      this.Load = true;
      this.$axios.get('cuentas/ventas/pendientes').then((res)=>{
        this.CUENTAS = res.data.ventas;
        this.Load    = false;
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    goCuenta(data){
      if(data.estado === 1 || data.estado === 2 && data.is_aceptado === 1){
        this.$store.commit('cuentas/agregar_CUENTA', data);
        this.vista = 2;
      }else{
        this.notificacion('No se puede abrir esta cuenta.','warning')
      }
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
