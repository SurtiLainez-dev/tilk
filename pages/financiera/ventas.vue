<template>
  <v-card flat tile>
    <v-toolbar tile flat>
      <v-spacer v-if="VISTA === 2"></v-spacer>
      <v-card-title>{{titulo}}</v-card-title>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-spacer v-if="VISTA === 1"></v-spacer>
      <v-text-field v-if="VISTA === 1" dense label="Buscar ..." v-model="search"></v-text-field>
    </v-toolbar>

    <v-data-table v-if="VISTA === 1" :headers="header"
                  :search="search"
                  dense
                  @click:row="verVista"
                  :loading="LOADVENTAS"
                  loading-text="Actualizando ventas"
                  class="rowsTable"
                  :items="VENTAS">
      <template v-slot:item.colaborador.nombres="{item}">
        {{item.colaborador.nombres}} {{item.colaborador.apellidos}}
      </template>
      <template v-slot:item.cliente.nombres="{item}">
        {{item.cliente.nombres}} {{item.cliente.apellidos}}
      </template>
      <template v-slot:item.tipo_venta="{item}">
        <v-chip color="success" x-small v-if="item.tipo_venta === 1" dark>Contado</v-chip>
        <v-chip color="orange" x-small v-else-if="item.tipo_venta === 2" dark>Crédito</v-chip>
      </template>
      <template v-slot:item.estado="{item}">
        <v-chip color="orange" x-small v-if="item.estado === 1" dark>Al día</v-chip>
        <v-chip color="red" x-small v-else-if="item.estado === 2" dark>Mora</v-chip>
        <v-chip color="success" x-small v-else-if="item.estado === 3" dark>Cancelada</v-chip>
        <v-chip color="indigo" x-small v-else-if="item.estado === 4" dark>Pendiente por aceptar</v-chip>
      </template>
      <template v-slot:item.is_aceptado="{item}">
        <v-chip color="success" x-small v-if="item.is_aceptado === 1" dark>Sí</v-chip>
        <v-chip color="red" x-small v-else-if="item.is_aceptado === 2" dark>No</v-chip>
        <v-chip color="orange" x-small v-else-if="item.is_aceptado === 3" dark>Pendiente</v-chip>
      </template>
      <template v-slot:item.total="{item}">
        <strong>L {{item.total}}</strong>
      </template>
    </v-data-table>

    <div v-else-if="VISTA === 2">
      <v-row no-gutters>
        <v-col cols="1" class="d-flex align-center">
          <v-btn color="warning" @click="VISTA = 1" fab x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
        </v-col>
        <v-col cols="11" class="d-flex align-center justify-center">
          <v-card-title>Datos de la venta</v-card-title>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <mis_ventas/>
    </div>

  </v-card>
</template>

<script>
import mis_ventas from "@/components/Ventas/mis_ventas.vue";
export default {
  components:{mis_ventas},
  name: "ventas",
  data(){
    return{
      titulo: 'Mis Ventas',
      search: '',
      header:[
        {text: 'Cliente',         value:'cliente.nombres'},
        {text: 'Vendedor',        value:'colaborador.nombres'},
        {text: 'Tipo de venta',   value:'tipo_venta'},
        {text: 'Código',          value:'cod'},
        {text: 'Estado',          value:'estado'},
        {text: 'Aceptado por F.', value:'is_aceptado'},
        {text: 'Total',           value:'total'},
      ],
    }
  },
  created() {
    this.VISTA = 1;
    this.$store.commit('guardarTitulo','Mis Ventas');
    this.$store.commit('surticredito/surticredito/cargarVENTAS', this.SUCURSAL);
  },
  computed:{
    SUCURSAL(){
      return this.$store.state.sucursal;
    },
    VISTA:{
      get(){
        return this.$store.state.surticredito.surticredito.VISTA;
      },
      set(val){
        this.$store.commit('surticredito/surticredito/cambiar_VISTA', val)
      }
    },
    LOADVENTAS(){
      return this.$store.state.surticredito.surticredito.LOADSOLICITUDES;
    },
    VENTAS(){
      return this.$store.state.surticredito.surticredito.VENTAS
    }
  },
  methods:{
    verVista(data){
      this.$store.commit('ventas/asignar_ID_VENTA', data.id);
      this.VISTA = 2;
    }
  }
}
</script>

<style scoped>

</style>
