<template>
  <v-card flat :loading="LOADREPORTE">
    <v-toolbar flat><v-card-title>Reportes</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="2">
        <v-toolbar color="grey lighten-4" dense flat>Cierres</v-toolbar>
        <v-data-table dense :headers="header" @click:row="capturar_datos" hide-default-footer
                      :items="REPORTE" :height="400" :loading="LOADREPORTE"></v-data-table>
      </v-col>
      <v-col class="ml-1" cols="9">
        <v-toolbar color="grey lighten-4" dense flat>{{titulo}}</v-toolbar>

        <v-card flat v-if="vista">
          <v-row no-gutters>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Datos de la Normalidad</v-card-subtitle>
                <bar-chart height="300px" :max="100" :data="normalidad" thousands="," :discrete="true"></bar-chart>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Datos de Saldo Recaudado</v-card-subtitle>
                <bar-chart height="300px" :colors="['#666']" :data="recaudado" thousands="," :discrete="true"></bar-chart>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Costo del Portafolio</v-card-subtitle>
                <v-card-subtitle>L {{int.format(data.valor_portafolio)}}</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Cantidad de Gestiones</v-card-subtitle>
                <v-card-subtitle>{{data.cantidad_cuentas}} cuentas</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Saldo Corriente</v-card-subtitle>
                <v-card-subtitle>L {{int.format(data.saldo_corriente)}}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Total de Cuotas</v-card-subtitle>
                <v-card-subtitle>L {{int.format(data.valor_cuotas)}}</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Total de Cuotas al Crear el Periodo</v-card-subtitle>
                <v-card-subtitle>L {{int.format(data.valor_cuotas_proyeccion)}}</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Cierre Hecho por:</v-card-subtitle>
                <v-card-subtitle>{{data.user.usuario}}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">
              <v-card class="ma-2">
                <v-card-subtitle>Encargado:</v-card-subtitle>
                <v-card-subtitle>{{data.colaborador.nombres}} {{data.colaborador.apellidos}}</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Comentario:</v-card-subtitle>
                <v-card-subtitle>{{data.comentario}}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "reportes",
  data(){
    return{
      titulo: 'Datos del Cierre',
      vista: false,
      data: {},
      header:[
        {text:'Cierre', value:'fecha_guardado'}
      ],
      normalidad: [],
      recaudado: [],
      int: Intl.NumberFormat(),
    }
  },
  computed:{
    REPORTE(){
      return this.$store.state.cobros.portafolios.REPORTE;
    },
    LOADREPORTE(){
      return this.$store.state.cobros.portafolios.LOADREPORTE;
    }
  },
  created() {
    this.$store.commit('cobros/portafolios/cargar_REPORTE');
  },
  methods:{
    capturar_datos(data){
      this.data = data;

      this.normalidad.push(
          ['Proyeccion de Normalidad', data.normalidad_proyectada],
          ['Normalidad de Cierre', data.normalidad],
      );
      this.recaudado.push(
          ['Saldo Proyectado', data.saldo_proyeccion],
          ['Saldo Recaudado', data.saldo_cumplimiento],
      );
      this.titulo = 'Datos del Cierre de la fecha '+data.fecha_guardado
      this.vista = true;
    }
  }
}
</script>

<style scoped>

</style>
