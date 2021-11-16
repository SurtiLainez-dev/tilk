<template>
  <v-card flat>
    <v-card v-if="vista === 1 ">
      <v-toolbar color="grey lighten-3" flat>
        <h6>Cuentas Pendientes</h6>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field dense label="Buscar ..." v-model="search"></v-text-field>
      </v-toolbar>
      <v-data-table :search="search" dense :loading="load"
                    :headers="header" @click:row="go" :items="CUENTAS"
                    loading-text="Cargando cuentas ...">
        <template v-slot:item.total="{item}">
          L {{int.format(item.total)}}
        </template>
        <template v-slot:item.saldo_actual="{item}">
          L {{int.format(item.saldo_actual)}}
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
    </v-card>

    <v-card v-else-if="vista === 2">
      <v-toolbar dense color="grey lighten-3">
        <v-btn color="orange" dark fab x-small @click="vista =1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <h6>{{CUENTA.cliente.nombres}} {{CUENTA.cliente.apellidos}} - {{CUENTA.cod}}</h6>
      </v-toolbar>
      <devo/>
    </v-card>
  </v-card>
</template>

<script>
import devolucion from "@/components/contabilidad/devolucion";
export default {
  components:{devo: devolucion},
  name: "devolucion",
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Inventario > Nueva Devolución');
    this.cargarCuentas();
  },
  data(){
    return{
      vista:1,
      int: new Intl.NumberFormat(),
      search: '',
      load:   false,
      header:[
        {text: 'Código', value: 'cod'},
        {text: 'Identidad', value: 'cliente.identidad'},
        {text: 'Nombre del Cliente', value: 'cliente.nombres'},
        {text: 'total', value: 'total'},
        {text: 'Saldo Actual', value: 'saldo_actual'},
        {text: 'Estado', value: 'estado'},
      ],
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
  methods:{
    cargarCuentas(){
      this.load = true;
      this.$axios.get('cuentas/ventas/pendientes').then((res)=>{
        this.CUENTAS = res.data.ventas;
        this.load    = false;
      })
    },
    go(data){
      this.$store.commit('cuentas/agregar_CUENTA', data);
      this.vista = 2;
    },
  }
}
</script>

<style scoped>

</style>
