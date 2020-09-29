<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-progress-linear color="green" indeterminate v-if="isPeticion"></v-progress-linear>
      <v-container v-else>
        <v-card-title>Caja Chica {{Caja.nombre}}</v-card-title>
        <v-row>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
              <v-row>
                <v-col cols="10"><strong>Total Inicial</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-dollar-sign</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">L. {{Caja.total_inicial}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
              <v-row>
                <v-col cols="10"><strong>Total Actual</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-dollar-sign</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">L. {{Caja.total_actual}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
              <v-row>
                <v-col cols="10"><strong>Fecha Asignación</strong></v-col>
                <v-col cols="2">
                  <v-icon>fa fa-calendar-alt</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.fecha_asignacion}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="3" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="light-blue">
              <v-row>
                <v-col cols="10"><strong>Fecha Finalización</strong></v-col>
                <v-col cols="2">
                  <v-icon>fa fa-calendar-alt</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.fecha_finalizacion}}</v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    data(){
      return{
        Caja: null,
        isPeticion: true
      }
    },
    created() {
      this.cargarCaja()
    },
    methods:{
      cargarCaja(){
        this.$axios.get('/caja_chica/'+this.$route.params.caja,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Caja = res.data.caja
            this.isPeticion = false
            this.$store.commit('guardarTitulo', 'Caja Chica > '+this.Caja.nombre)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
