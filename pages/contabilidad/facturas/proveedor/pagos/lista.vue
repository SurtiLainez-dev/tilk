<template>
   <v-card>
     <v-row no-gutters class="grey lighten-2">
       <v-col cols="9">
         <v-card-title>Creando Lista de Pago</v-card-title>
       </v-col>
       <v-col cols="3" class="d-flex align-center">
         <v-text-field class="ma-2" dense label="Buscar" v-model="search"></v-text-field>
       </v-col>
     </v-row>
     <v-data-table dense :headers="header"
                   :loading="loading"
                   v-model="selected"
                   class="rowsTable"
                   :search="search"
                   show-select
                   loading-text="Cargando Pagos. Espere un momento ..."
                   :items="Pagos">
       <template v-slot:item.factura_proveedor.total="{item}">
         L {{item.factura_proveedor.total}}
       </template>
       <template v-slot:item.factura_proveedor.total_abonado="{item}">
         L {{item.factura_proveedor.total_abonado}}
       </template>
       <template v-slot:item.total_a_pagar="{item}">
         L {{item.total_a_pagar}}
       </template>
       <template v-slot:item.estado="{item}">
         <v-chip v-if="item.estado === 1" color="orange" dark x-small>Al día</v-chip>
         <v-chip v-else-if="item.estado === 2" color="success" dark x-small>Cancelado</v-chip>
         <v-chip v-else-if="item.estado === 3" color="red" dark x-small>Retrasado</v-chip>
       </template>
     </v-data-table>
     <v-row no-gutters>
       <v-col class="d-flex justify-end ma-5">
         <strong>Total de la Lista: L {{total}}</strong>
       </v-col>
     </v-row>
     <hr>
     <v-card-actions class="d-flex justify-end">
       <v-btn class="ma-2" color="success" small dark @click="crearLista">Crear Lista</v-btn>
     </v-card-actions>
   </v-card>
</template>

<script>
  import { ipcRenderer } from 'electron';
  export default {
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Facturas > Proveedores > Pagos > Creando Lista de Pago');
      this.cargarPagos();
    },
    name: "lista",
    data(){
      return{
        loading: true,
        search:'',
        header:[
          {text: 'Proveedor', value:'factura_proveedor.proveedor.nombre'},
          {text: 'Factura', value:'factura_proveedor.num_factura'},
          {text: 'Total de la Factura', value:'factura_proveedor.total'},
          {text: 'Total Abonado', value:'factura_proveedor.total_abonado'},
          {text: 'Fecha de Cancelación', value:'factura_proveedor.fecha_limite_pago'},
          {text: 'Fecha Pago de Cuota', value:'fecha_pago'},
          {text: '# Pago', value:'num_pago'},
          {text: 'Cuota', value:'total_a_pagar'},
          {text: 'Estado del Pago', value:'estado'},
        ],
        Pagos: [],
        selected: [],
        Enviar: [],
        todos: [
          {title: 'todo 1', description: 'description 1'},
          {title: 'todo 2', description: 'description2'},
          {title: 'todo 3', description: 'description 3'},
          {title: 'todo 4', description: 'description 4'},
          {title: 'todo 5', description: 'description 5'}
        ]
      }
    },
    computed:{
      total(){
        let total = 0;
        if (this.selected.length > 0){
          this.selected.forEach( (i) => {
            total = parseFloat(total) + parseFloat(i.total_a_pagar)
          });
          return total;
        }else{
          return total;
        }
      }
    },
    methods:{
      cargarPagos(){
        this.$axios.get('pagos_facturas_proveedor/pendientes',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.Pagos = res.data.pagos;
          this.loading = false;
        })
      },
      crearLista(){
        this.Enviar = [];
        this.selected.forEach( (i) => {
          this.Enviar.push({
            "proveedor": i.factura_proveedor.proveedor.nombre,
            "factura":   i.factura_proveedor.num_factura,
            "num_pago":  i.num_pago,
            "total":     i.total_a_pagar
          })
        });
        let datos = JSON.stringify(this.Enviar);
        let url = this.$axios.defaults.baseURL+'/crear_lista_pago/'+datos+'/'+this.total;
        ipcRenderer.send('open-nav', url);
      }
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
