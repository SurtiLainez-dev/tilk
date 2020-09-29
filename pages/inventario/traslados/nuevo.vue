<template>
    <v-card>
      <nuevot :sucursal_data="0" :destino_data="0" :motivo_data="0"
              :articulos_data="articulos" :tipo="1"/>
    </v-card>
</template>

<script>
  import nuevo from "../../../components/facturacion/traslados/nuevo";
  export default {
    components:{nuevot:nuevo},
    data(){
      return{
        articulos:[
          {
            articulo_id:'', articulo:'', observacion: '', compuestos: [],cantidad: 0, cod:'',
            remision: 0, compuesto: 0, fila:1, estado:false, motocicleta: false, estadoS: '',
            cantidadStock: 0, dataCompuestos: null, dataStockCompuestos: null, dataRemision:null,
            dataMotocicletas: null, revisado: false, back: false, estadoArticulo: ''
          }
        ],
      }
    },
    name: "nuevo",

  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
  .rowsTable{
    cursor: pointer;
  }
</style>
