<template>
  <v-container class="pl-2 pr-2 d-flex justify-center">
    <v-card width="900px" class="pl-2">
      <v-card-title>Cajas Chicas de Surtidora Laínez</v-card-title>
      <v-data-table :items-per-page="10" :items="Cajas" :search="search" @click:row="irCajasChicas"
                    :headers="header" :loading="isPeticion" class="rowsTable"
                    loading-text="Cargando cajas... por favor espere un momento">
        <template v-slot:item.total_inicial="{item}">
          L. {{item.total_inicial}}
        </template>
        <template v-slot:item.total_actual="{item}">
          L. {{item.total_actual}}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: "cajas_chicas",
    data(){
      return{
        search: '',
        isPeticion:   true,
        header:[
          {text:'Sucursal', value:'nombre'},
          {text:'Total Inicial', value:'total_inicial'},
          {text:'Total Actual', value:'total_actual'},
          {text:'Fecha Asignación', value:'fecha_asignacion'},
          {text:'Fecha de Cierre', value:'fecha_finalizacion'},
        ],
        Cajas:        [],
        selectedCaja: []
      }
    },
    created() {
      this.cargarCajas()
      this.$store.commit('guardarTitulo', 'Contabilidad > Cajas Chicas')
    },
    methods:{
      irCajasChicas(val){
        this.$router.replace({path:'/contabilidad/cajas_chicas/'+val.id})
      },
      cargarCajas(){
        this.$axios.get('cajas_chicas',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Cajas = res.data.cajas
            this.isPeticion = false
          }
        })
      }
    },
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
  #side{
    opacity: 0.8;
  }
</style>
