<template>
  <v-card flat>
    <v-toolbar flat>
      <v-card-title>Gestiones de Hoy</v-card-title>

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

      <v-tooltip top>
        <template v-slot:activator="{on, attrs}">
          <v-btn text small fab v-on="on" v-bind="attrs"><v-icon>fa fa-print</v-icon></v-btn>
        </template>
        <span>Imprimir Gestiones de Hoy</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar ..." dense v-model="filter"></v-text-field>
    </v-toolbar>
    <v-data-table dense :loading="LOADGESTIONES" :headers="header" :items="GESTIONES"
                  loading-text="Cargando gestiones ..." :search="filter" @click:row="goGestion">
      <template v-slot:item.venta.cliente.apellidos="{item}">{{item.venta.cliente.nombres}} {{item.venta.cliente.apellidos}}</template>
      <template v-slot:item.venta.saldo_actual="{item}">L {{int.format((item.venta.saldo_actual - item.venta.contrato.saldo_mora).toFixed(2))}}</template>
      <template v-slot:item.saldo_actual="{item}">L {{int.format(item.saldo_actual)}}</template>
      <template v-slot:item.venta.contrato.dias_mora="{item}">{{item.venta.contrato.dias_mora}}</template>
      <template v-slot:item.intereses="{item}">L {{int.format(item.intereses)}}</template>
      <template v-slot:item.saldo_abonado="{item}">L {{int.format(item.saldo_abonado)}}</template>
      <template v-slot:item.pagando="{item}">L {{int.format(item.pagando)}}</template>
      <template v-slot:item.saldo_dia="{item}">L {{int.format(item.saldo_dia)}}</template>

      <template v-slot:header.venta.saldo_actual="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">SAV</span></template>
          <span>Saldo Actual de la Venta</span>
        </v-tooltip>
      </template>
      <template v-slot:header.saldo_actual="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">SAG</span></template>
          <span>Saldo Actual de la Gestión</span>
        </v-tooltip>
      </template>
      <template v-slot:header.venta.contrato.dias_mora="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">DM</span></template>
          <span>Días en Mora</span>
        </v-tooltip>
      </template>
      <template v-slot:header.intereses="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">Mora Acu.</span></template>
          <span>Mora Acumulada</span>
        </v-tooltip>
      </template>
      <template v-slot:header.pagando="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">SCT</span></template>
          <span>Saldo de Cuotas Atrasadas</span>
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
  name: "gestiones_hoy",
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
          {text:'Venta', value:'venta.cod'},
          {text:'Cliente', value:'venta.cliente.apellidos'},
          {text:'SAV', value:'venta.saldo_actual'},
          {text:'SAG', value:'saldo_actual'},
          {text:'DM', value:'venta.contrato.dias_mora'},
          {text:'Mora Acu.', value:'intereses'},
          {text:'SCT', value:'pagando'},
          {text:'SPD', value:'saldo_dia'},
          {text:'Segmento', value:'cob_segmento.nombre'},
          {text:'Fecha de Gestión', value:'fecha_gestion'},

        ]
      }else if (this.VISTAEXPANDIR === 1){
        header = [
          {text:'Venta', value:'venta.cod'},
          {text:'Cliente', value:'venta.cliente.apellidos'},
          {text:'Saldo Actual Venta', value:'venta.saldo_actual'},
          {text:'Saldo Actual Gestión', value:'saldo_actual'},
          {text:'Días en Mora', value:'venta.contrato.dias_mora'},
          {text:'Segmento', value:'cob_segmento.nombre'},
          {text:'Fecha de Gestión', value:'fecha_gestion'},
        ]
      }
      return header;
    },
    GESTIONES(){
      let gestiones = [];
      let fecha     = new Date();
      let fecha2    = new Date();
      this.$store.state.cobros.portafolios.GESTIONES.forEach((item)=>{
        fecha2 = new Date(item.fecha_gestion)
        if (fecha2.getTime() < fecha.getTime() && item.venta.contrato.dias_mora > 0){
          gestiones.push(item);
        }
      });
      return gestiones;
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
