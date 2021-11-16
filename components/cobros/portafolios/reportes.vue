<template>
  <v-card flat>
    <v-toolbar flat><v-card-title>Reportes</v-card-title></v-toolbar>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="2">
        <v-toolbar color="grey lighten-4" dense flat>Cierres</v-toolbar>
        <v-data-table dense :headers="header" @click:row="capturar_datos" hide-default-footer
                      :items="Reporte" :height="400"></v-data-table>
      </v-col>
      <v-col class="ml-1">
        <v-toolbar color="grey lighten-4" dense flat>Datos del Cierre</v-toolbar>

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
                <v-card-subtitle>L {{int.format(data.total_ingresos)}}</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Cantidad de Gestiones</v-card-subtitle>
                <v-card-subtitle>{{data.cant_cuentas}} cuentas</v-card-subtitle>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="ma-2">
                <v-card-subtitle>Saldo Corriente</v-card-subtitle>
                <v-card-subtitle>L {{int.format(data.total_corriente)}}</v-card-subtitle>
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
                <v-card-subtitle>{{data.user}}</v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="4">
              <v-card class="ma-2">
                <v-card-subtitle>Encargado:</v-card-subtitle>
                <v-card-subtitle>{{data.colaborador}}</v-card-subtitle>
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
    Reporte(){
      if (this.$store.state.cobros.portafolios.PORTAFOLIO.reporte)
        return JSON.parse(this.$store.state.cobros.portafolios.PORTAFOLIO.reporte)
      else
        []
    }
  },
  methods:{
    capturar_datos(data){
      this.data = data;

      this.normalidad.push(
          ['Proyeccion de Normalidad', data.proyeccion_normalidad],
          ['Normalidad de Cierre', data.normalidad],
      );
      this.recaudado.push(
          ['Saldo Proyectado', data.saldo_proyeccion],
          ['Saldo Recaudado', data.saldo_cumplimiento],
      );
      this.vista = true;
    }
  }
}
</script>

<style scoped>

</style>
