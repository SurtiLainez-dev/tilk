<template>
    <v-card flat class="pl-2 pr-2">
      <div v-if="!vista">
        <v-row>
          <v-col><v-card-title>Guías de Remisiones</v-card-title></v-col>
          <v-col>
            <v-text-field v-model="search" label="Buscar Guía de Remisión"></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header"
                      :search="search"
                      @click:row="goRemision"
                      class="rowsTable"
                      :items="Remisiones">
          <template v-slot:item.estado="{item}">
            <v-chip v-if="item.estado === 1" small color="success">Terminado</v-chip>
            <v-chip v-else-if="item.estado === 0" color="orange" small dark>En Espera</v-chip>
          </template>
        </v-data-table>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="1">
            <v-btn fab x-small color="orange" dark @click="vista = false">
              <v-icon>fa fa-arrow-left</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="11" class="d-flex justify-center">
            <h3>Guía de Remisión {{Remision.codigo_remision}}</h3>
          </v-col>
        </v-row>
        <hr>
        <guia_remision :remision="Remision"/>
      </div>
    </v-card>
</template>

<script>
  import guia_remision from "../../../components/facturacion/traslados/guia_remision";
  export default {
    components:{guia_remision},
    created() {
      this.$store.commit('guardarTitulo', 'Remisiones');
    },
    name: "remisiones",
    data(){
      return{
        vista: false,
        search:'',
        header:[
          {text:'Transferencia',value:'transferencia_articulo.codigo'},
          {text:'Cód. Remisión',value:'codigo_remision'},
          {text:'Origen',value:'transferencia_articulo.sucursal.nombre'},
          {text:'Destino',value:'transferencia_articulo.destino.nombre'},
          {text:'Aprobador por',value:'user.usuario'},
          {text:'Estado',value:'estado'},
        ],
        Remision: null
      }
    },
    methods:{
      goRemision(val){
        this.Remision = val;
        this.vista = true;
      }
    },
    asyncData({$axios, store}){
      return $axios.get('remisiones_traslado',{
        headers:{
          'Authorization': `Bearer ${store.state.token}`
        },
      }).then(res =>{
        return{
          Remisiones: res.data.remisiones
        }
      })
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
