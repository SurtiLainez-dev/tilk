<template>
  <v-card flat>
    <div v-if="vista === 1">
      <v-toolbar flat>
        <h6>Cuentas de Clientes de SURTIDORA LAÍNEZ</h6>
        <v-btn tile small text icon color="indigo" class="ma-2 mb-4" @click="cargarCuentas"><v-icon small>fa fa-sync</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-text-field label="Buscar Cuenta" dense v-model="search"></v-text-field>
      </v-toolbar>

      <v-data-table :items="CUENTAS"
                    :search="search"
                    dense
                    :items-per-page="50"
                    :loading="Load"
                    loading-text="Cargando Cuentas"
                    @click:row="goCuenta"
                    :headers="header"
                    class="rowsTable">
        <template v-slot:item.total="{item}">
          L {{int.format(item.total)}}
        </template>
        <template v-slot:item.saldo_actual="{item}">
          L {{int.format(item.saldo_actual)}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
          <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
          <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
          <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
        </template>

      </v-data-table>
    </div>
    <div v-else>
      <v-card flat>
        <v-toolbar flat>
          <v-btn color="orange" fab tile dark x-small @click="vista = 1">
            <v-icon>fa fa-arrow-left</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <h5 v-if="CUENTA.cliente" class="grey--text">Cuenta de {{CUENTA.cliente.nombres}} {{CUENTA.cliente.apellidos}}</h5>
          <h5 v-else class="grey--text">Cuenta de {{CUENTA.nombres}} {{CUENTA.apellidos}}</h5>
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
import cuenta from "@/components/Ventas/cuenta";
import Vue from "vue";
export default {
  name: "ventas_canceladas",
  components:{cuenta},
  data(){
    return{
      int: new Intl.NumberFormat(),
      Load:    true,
      vista: 1,
      search: '',
      header:[
        {text: 'Código', value: 'cod'},
        {text: 'Nombres del Cliente', value: 'nombres'},
        {text: 'Apellidos del Cliente', value: 'apellidos'},
        {text: 'Identidad del Cliente', value: 'identidad'},
        {text: 'total', value: 'total'},
        {text: 'Saldo Actual', value: 'saldo_actual'},
        {text: 'Estado', value: 'estado'},
      ],
      Cuentas: []
    }
  },
  computed:{
    CUENTAS:{
      get: function (){
        return this.$store.state.cuentas.CUENTAS_CANCELADAS;
      },
      set: function (cuentas){
        this.$store.commit('cuentas/agregar_CUENTAS_CANCELADAS', cuentas);
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
      this.$axios.get('cuentas/canceladas').then((res)=>{
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
      this.$store.commit('cuentas/agregar_CUENTA', data);
      this.vista = 2;
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
