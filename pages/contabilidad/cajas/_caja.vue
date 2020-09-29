<template>
  <v-container class="pl-2 pr-2">
    <v-card>
      <v-progress-linear indeterminate color="green" v-if="isPeticion"></v-progress-linear>
      <v-container v-else>
        <v-card-title>Caja {{Caja.codigo}}</v-card-title>
        <v-row>
          <v-col md="4" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="pink">
              <v-row>
                <v-col cols="10"><strong>Usuario Responsable</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-user</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.usuario}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="4" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="deep-orange ">
              <v-row>
                <v-col cols="10"><strong>Nombre</strong></v-col>
                <v-col cols="2"><v-icon>fa fa-store</v-icon></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.nombre}}</v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col md="4" cols="6">
            <v-card hover class="pl-2 pr-2 pb-2 pt-2" dark color="purple">
              <v-row>
                <v-col cols="10"><strong>Número de Caja</strong></v-col>
                <v-col cols="2">
                  <v-icon>fa fa-list-ol</v-icon>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-center">{{Caja.num_caja}}</v-col>
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
    created() {
      this.cargarCaja()
    },
    data(){
      return{
        Caja: null,
        isPeticion: true
      }
    },
    methods:{
      cargarCaja(){
        this.$axios.get('/caja/'+this.$route.params.caja,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.isPeticion = false
            this.Caja = res.data.caja[0]
            this.$store.commit('guardarTitulo', 'Caja > '+this.Caja.codigo)
          }
        })
      }
    },
  }
</script>

<style scoped>

</style>
