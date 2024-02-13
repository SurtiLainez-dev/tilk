<template>
  <v-card>
    <v-card flat v-if="vista === 1" >
      <v-toolbar flat color="grey lighten-3">
        <v-card-title>Depósitos</v-card-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-text-field v-model="buscar" dense label="Buscar ..."></v-text-field>
      </v-toolbar>
      <v-data-table :headers="header" :items="DEPOSITOS" :loading="LOADDEPOSITOS" @click:row="goDeposito"
                    dense :search="buscar" loading-text="Cargando datos ...">
        <template v-slot:item.monto="{item}">L. {{int.format(item.monto)}}</template>
        <template v-slot:item.monto_actual="{item}">L. {{int.format(item.monto_actual)}}</template>
        <template v-slot:item.estado="{item}">
          <v-chip x-small dark color="orange" v-if="item.estado === 1">No valídado</v-chip>
          <v-chip x-small dark color="success" v-else>Valídado</v-chip>
        </template>
      </v-data-table>
    </v-card>

    <v-card v-else>
      <v-toolbar flat color="grey lighten-3">
        <v-btn fab x-small text color="warning" dark @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-card-title>{{titulo}}</v-card-title>
      </v-toolbar>
      <deposito/>
    </v-card>
  </v-card>
</template>

<script>
import deposito from "@/components/contabilidad/deposito";
export default {
  name: "validar_depositos",
  components:{deposito},
  data(){
    return{
      int: Intl.NumberFormat(),
      vista: 1,
      buscar: '',
      titulo: '',
      header:[
        {text:'Referencia', value:'referencia'},
        {text:'Saldo', value:'monto'},
        {text:'Saldo Actual', value:'monto_actual'},
        {text:'Estado', value:'estado'},
        {text:'Venta', value:'cod'},
        {text:'Nombres', value:'nombres'},
        {text:'Apellidos', value:'apellidos'},
        {text:'Caja', value:'codigo'},
        {text:'Usuario', value:'usuario'},
      ]
    }
  },
  created() {
    this.$store.commit('contabilidad/depositos/cargar_DEPOSITOS')
  },
  methods:{
    goDeposito(item){
      this.titulo = 'Depósito de '+item.nombres+' '+item.apellidos;
      this.LOADDEPOSITOS = true;
      this.$axios.get('caja/deposito_cliente/'+item.id).then((res)=>{
        this.$store.commit('contabilidad/depositos/asignar_DEPOSITO', res.data.deposito);
        this.$store.commit('cuentas/agregar_CUENTA', res.data.deposito.venta);
        this.LOADDEPOSITOS = false;
        this.vista = 2;
      })
    }
  },
  computed:{
    LOADDEPOSITOS:{
      get: function () {
        return this.$store.state.contabilidad.depositos.LOADDEPOSITOS;
      },
      set(val){
        this.$store.commit('contabilidad/depositos/cambiar_LOADDEPOSITO', val);
      }
    },
    DEPOSITOS(){
      return this.$store.state.contabilidad.depositos.DEPOSITOS;
    }
  }
}
</script>

<style scoped>

</style>
