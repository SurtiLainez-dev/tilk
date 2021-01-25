<template>
  <v-card flat>
    <v-toolbar flat>
      <h6>Solicitudes de Crédito del cliente</h6>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar" dense v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table :headers="header"
                  :search="search"
                  :items="SOLICITUDES"
                  class="rowsTable"
                  loading-text="Cargando Solicitudes de Crédito"
                  :loading="Load">
      <template v-slot:item.tiempo="{item}">
        {{item.tiempo}} meses
      </template>
      <template v-slot:item.prima="{item}">
        L. {{item.prima}}
      </template>
      <template v-slot:item.fecha_creado="{item}">
        {{item.fecha_creado.split('-')[2]+'/'+item.fecha_creado.split('-')[1]+'/'+item.fecha_creado.split('-')[0]}}
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip v-if="item.estado === 1" x-small dark color="warning">Pendiente</v-chip>
        <v-chip v-else-if="item.estado === 2" x-small dark color="indigo">Falta documentación</v-chip>
        <v-chip v-else-if="item.estado === 3" x-small dark color="red">Rechazado</v-chip>
        <v-chip v-else-if="item.estado === 4" x-small dark color="success">Aprobado</v-chip>
        <v-chip v-else-if="item.estado === 5" x-small dark color="success">Venta Realizada</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "solicitudes_cliente",
  computed:{
    CLIENTE(){
      return this.$store.state.cliente.CLIENTE;
    },
    SOLICITUDES: {
      get: function(){
        return this.$store.state.cliente.SOLICITUDES;
      },
      set: function(solicitudes){
        this.$store.commit('cliente/agregar_SOLICITUDES', solicitudes);
      }
    },
  },
  data(){
    return{
      search: '',
      Load: true,
      header:[
        {text:'Código',value: 'codigo'},
        {text:'Artículo',value: 'articulo.nombre_articulo'},
        {text:'Forma de Pago',value: 'forma_pago'},
        {text:'Tiempo',value: 'tiempo'},
        {text:'Prima',value: 'prima'},
        {text:'Estado',value: 'estado'},
        {text:'Fecha',value: 'fecha_creado'},
      ]
    }
  },
  created() {
    this.cargarSolicitudes();
  },
  methods:{
    cargarSolicitudes(){
      this.Load = true
      this.$axios.get('solicitudes_credito/'+this.CLIENTE.id).then((res)=>{
        this.SOLICITUDES = res.data.solicitudes;
        this.Load = false
      })
    }
  }
}

</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
