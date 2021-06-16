<template>
<v-card flat>
  <v-card flat v-if="VISTACHEQUE === 1">
    <v-toolbar flat>
      <h6>Cheques Usados</h6>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table :headers="header" @click:row="capturarCheque"
                  :search="search" class="cursor" :items="CHEQUESUSADOS">
      <template v-slot:item.estado="{item}">
        <v-chip dark x-small color="success" v-if="item.estado === 1">DISPONIBLE</v-chip>
        <v-chip dark x-small color="indigo" v-else-if="item.estado === 2">CREADO</v-chip>
        <v-chip dark x-small color="grey" v-else-if="item.estado === 3">ENTREGADO</v-chip>
        <v-chip dark x-small color="orange" v-else-if="item.estado === 4">ANULADO</v-chip>
      </template>
      <template v-slot:item.total="{item}">L {{int.format(item.total)}}</template>
      <template v-slot:item.fecha_uso="{item}">
        {{item.fecha_uso.split('-')[2]+'/'+item.fecha_uso.split('-')[1]+'/'+item.fecha_uso.split('-')[0]}}
      </template>
    </v-data-table>
  </v-card>

  <v-card flat v-else-if="VISTACHEQUE === 2">
    <info/>
  </v-card>
</v-card>
</template>

<script>
import info from "./info";
export default {
  name: "usados",
  components:{
    info
  },
  computed:{
    CHEQUESUSADOS(){
      return this.$store.state.contabilidad.cheques.CHEQUESUSADOS;
    },
    CHEQUE(){
      return this.$store.state.contabilidad.cheques.CHEQUE;
    },
    VISTACHEQUE:{
      get: function (){
        return this.$store.state.contabilidad.cheques.VISTACHEQUE;
      },
      set: function (val){
        this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', val)
      }
    }
  },
  data(){
    return{
      search: '',
      int: new Intl.NumberFormat(),
      header:[
        {text:'Correlativo', value:'numeracion'},
        {text:'Estado', value:'estado'},
        {text:'Detalle', value:'detalle'},
        {text:'Total', value:'total'},
        {text:'Partida', value:'partida.referencia'},
        {text:'Fecha de Uso', value:'fecha_uso'},
      ],
    }
  },
  methods:{
    capturarCheque(data){
      this.$store.commit('contabilidad/cheques/capturar_CHEQUE', data);
    }
  }
}
</script>

<style scoped>
.cursor{
  cursor: pointer;
}
</style>
