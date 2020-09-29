<template>
  <v-container class="pl-2 pt-2 pr-2">
    <v-card>
      <v-row>
        <v-col cols="6"><v-card-title>Planillas</v-card-title></v-col>
        <v-col cols="6">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar planilla" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-data-table :headers="header" :items="Planillas" :search="search" @click:row="redirectPlanilla">
        <template v-slot:item.total_planilla="{item}">
          L. {{item.total_planilla}}
        </template>
        <template v-slot:item.mes_asignado="{item}">
          {{item.periodo}} de {{item.mes_asignado}} de {{item.ano}}
        </template>
        <template v-slot:item.estado="{item}">
          <v-icon v-if="item.estado ===1" color="success">fa fa-check-circle</v-icon>
          <v-icon v-else color="red">fa fa-times</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
    export default {
      created() {
        this.$store.commit('guardarTitulo', 'Planillas')
      },
      methods:{
        redirectPlanilla(val){
          this.$router.replace({path:'/colaborador/planillas/'+val.id})
        }
      },
      data(){
        return{
          search: '',
          header:[
            {text:'Código', value:'codigo'},
            {text:'Fecha Creación', value:'fecha_creacion'},
            {text:'Total Planilla', value:'total_planilla'},
            {text:'Périodo', value:'mes_asignado'},
            {text:'Sucursal', value:'nombre'},
            {text:'Usuario Creador', value:'usuario'},
            {text:'Estado', value:'estado'},
          ]
        }
      },
      name: "index",
      asyncData({$axios, store}){
        return $axios.get('/planillas/',{
          headers:{
            'Authorization': 'Bearer '+ store.state.token
          }
        }).then((res)=>{
          return{
            Planillas: res.data.planillas
          }
        })
      },
    }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
