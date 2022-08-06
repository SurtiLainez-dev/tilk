<template>
<v-card flat>
  <v-toolbar flat>
    <v-card-title>Gestiones</v-card-title>

    <v-tooltip top>
      <template v-slot:activator="{on, attrs}">
        <v-btn v-if="VISTAEXPANDIR === 1" small text color="indigo" fab v-on="on" @click="VISTAEXPANDIR = 2"
               v-bind="attrs"><v-icon >fa fa-expand-arrows-alt</v-icon></v-btn>
        <v-btn v-else-if="VISTAEXPANDIR === 2" small text color="indigo" fab v-on="on" @click="VISTAEXPANDIR = 1"
               v-bind="attrs"><v-icon >fa fa-minus</v-icon></v-btn>
      </template>
      <span v-if="VISTAEXPANDIR === 1">Expandir ventana</span>
      <span v-else-if="VISTAEXPANDIR === 2">Minimizar ventana</span>
    </v-tooltip>

    <v-spacer></v-spacer>
    <v-spacer></v-spacer>
    <v-text-field label="Buscar ..." dense v-model="filter"></v-text-field>
  </v-toolbar>
  <v-data-table dense :loading="LOADGESTIONES" :headers="header" :items="GESTIONES"
                loading-text="Cargando gestiones ..." :search="filter" @click:row="goGestion">
    <template v-slot:item.cliente.apellidos="{item}">{{item.cliente.nombres}} {{item.cliente.apellidos}}</template>
    <template v-slot:item.saldo_actual="{item}">L {{int.format((item.saldo_actual - item.contrato.saldo_mora).toFixed(2))}}</template>
    <template v-slot:item.contrato.dias_mora="{item}">{{item.contrato.dias_mora}}</template>
    <template v-slot:item.contrato.saldo_mora="{item}">L {{int.format(item.contrato.saldo_mora)}}</template>
    <template v-slot:item.saldo_abonado="{item}">L {{int.format(item.saldo_abonado)}}</template>
    <template v-slot:item.pagando="{item}">L {{int.format(item.pagando)}}</template>

    <template v-slot:header.contrato.dias_mora="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">DM</span></template>
        <span>Días en Mora</span>
      </v-tooltip>
    </template>
    <template v-slot:header.pagando="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">SCT</span></template>
        <span>Saldo Para Ponerse al Día</span>
      </v-tooltip>
    </template>
    <template v-slot:header.saldo_dia="{item}">
      <v-tooltip top>
        <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">SPD</span></template>
        <span>Saldo para ponerse al día</span>
      </v-tooltip>
    </template>
  </v-data-table>
</v-card>
</template>

<script>
export default {
  name: "gestiones",
  data(){
    return{
      filter: '',
      int: Intl.NumberFormat(),
    }
  },
  computed:{
    header(){
      let header = [];
      if (this.VISTAEXPANDIR === 2){
        header = [
          {text:'Venta', value:'cod'},
          {text:'Cliente', value:'cliente.apellidos'},
          {text:'Saldo', value:'saldo_actual'},
          {text:'DM', value:'contrato.dias_mora'},
          {text:'Mora Acu.', value:'contrato.saldo_mora'},
          {text:'SPD', value:'pagando'},
          {text:'Segmento', value:'cob_segmento.nombre'},
          {text:'Fecha de Gestión', value:'fecha_gestion'},

        ]
      }else if (this.VISTAEXPANDIR === 1){
        header = [
          {text:'Venta', value:'cod'},
          {text:'Cliente', value:'cliente.apellidos'},
          {text:'Saldo Actual Venta', value:'saldo_actual'},
          {text:'Días en Mora', value:'contrato.dias_mora'},
          {text:'Segmento', value:'cob_segmento.nombre'},
          {text:'Fecha de Gestión', value:'proxima_gestion'},
        ]
      }
      return header;
    },
    GESTIONES(){
      return this.$store.state.cobros.portafolios.GESTIONES;
    },
    LOADGESTIONES(){
      return this.$store.state.cobros.portafolios.LOADGESTIONES;
    },
    VISTAEXPANDIR:{
      get: function (){
        return this.$store.state.cobros.portafolios.VISTAEXPANDIR;
      },
      set: function (val){
        this.$store.commit('cobros/portafolios/cambiar_VISTAEXPANDIR', val);
      }
    }
  },
  methods:{
    goGestion(data){
      this.$store.commit('cobros/portafolios/cambiar_GESTION', data);
      this.$store.commit('cobros/portafolios/cambiar_VISTAGESTION_GESTION', 2);
    }
  }
}
</script>

<style scoped>

</style>
