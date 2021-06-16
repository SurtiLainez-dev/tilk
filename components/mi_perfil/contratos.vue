<template>
<v-card>
  <v-toolbar dense flat><h6>Contratos</h6></v-toolbar>
  <v-data-table dense :headers="headers" class="rowsTable"
                :items="USER.colaborador.contratos">
    <template v-slot:item.pago="{item}">
      L {{int.format(item.pago)}}
    </template>
    <template v-slot:item.fecha_inicio="{item}">
      {{item.fecha_inicio.split('-')[2]}}/{{item.fecha_inicio.split('-')[1]}}/{{item.fecha_inicio.split('-')[0]}}
    </template>
    <template v-slot:item.fecha_final="{item}">
      {{item.fecha_final.split('-')[2]}}/{{item.fecha_final.split('-')[1]}}/{{item.fecha_final.split('-')[0]}}
    </template>
    <template v-slot:item.estado="{item}">
      <v-chip x-small dark v-if="item.estado === 1" color="success">Vigente</v-chip>
      <v-chip x-small dark v-else-if="item.estado === 0" color="red">Vencido</v-chip>
    </template>
    <template v-slot:item.observacion="{item}">
      <v-tooltip v-if="item.observacion && item.observacion.length > 20">
        <template v-slot:activator="{on, attrs}">
          <span v-bind="attrs" v-on="on">{{item.observacion.substr(0,20)}}</span>
        </template>
        <span>{{item.observacion}}</span>
      </v-tooltip>
      <span v-else>{{item.observacion}}</span>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "contratos",
  data(){
    return{
      int: new Intl.NumberFormat(),
      headers:[
        {text: 'Fecha de Inicio', value: 'fecha_inicio'},
        {text: 'Fecha Finalización', value: 'fecha_final'},
        {text: 'Estado', value: 'estado'},
        {text: 'Pago', value: 'pago'},
        {text: 'Observación', value: 'observacion'},
      ]
    }
  },
  computed:{
    USER(){
      return this.$store.state.perfil.USER;
    }
  },
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
