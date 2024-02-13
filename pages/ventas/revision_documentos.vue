<template>
  <v-card flat>

    <v-card flat v-if="vista === 1">
      <v-toolbar flat color="grey lighten-3">
        <v-card-title>Ventas Pendiente Revisión de Documentos</v-card-title>
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-text-field label="buscar..." dense v-model="search"></v-text-field>
      </v-toolbar>
      <v-data-table :headers="header" :items="VENTAS" dense @click:row="goVenta"
                    :search="search" :loading="LOAD">
        <template v-slot:item.nombresCol="{item}">
          {{item.nombresCol}} {{item.apellidosCol}}
        </template>
        <template v-slot:item.nombres="{item}">
          {{item.nombres}} {{item.apellidos}}
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
          <strong>L {{int.format(item.total)}}</strong>
        </template>
      </v-data-table>
    </v-card>

    <v-card v-else flat>
      <v-toolbar dense flat >
        <v-btn fab x-small dark color="orange" @click="vista = 1"><v-icon>fa fa-arrow-left</v-icon></v-btn>
        <v-divider></v-divider>
        Venta # {{venta.cod}} - {{venta.nombres}} {{venta.apellidos}}
      </v-toolbar>

      <revision_doc/>
    </v-card>
  </v-card>
</template>

<script>
import revision_doc from "@/components/Ventas/revision_doc";
export default {
  name: "revision_documentos",
  components:{revision_doc},
  data(){
    return{
      int: Intl.NumberFormat(),
      search: '',
      header:[
        {text: 'Cliente',         value:'nombres'},
        {text: 'Vendedor',        value:'nombresCol'},
        {text: 'Tipo de venta',   value:'tipo_venta'},
        {text: 'Código',          value:'cod'},
        {text: 'Estado',          value:'estado'},
        {text: 'Aceptado por F.', value:'is_aceptado'},
      ],
      vista: 1,
      venta: {}
    }
  },
  computed:{
    VENTAS(){
      return this.$store.state.cuentas.VENTAS_REV_DOC;
    },
    LOAD(){
      return this.$store.state.cuentas.LOAD_CUENTAS_REV_DOC;
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Facturación > Ventas > Revisión de Documentos');
    this.$store.commit('cuentas/cargar_VENTAS_REV_DOC');
  },
  methods:{
    goVenta(data){
      this.venta = data;
      this.vista = 2;
      this.$store.commit('cuentas/agregar_CUENTA', data);
      this.$store.commit('cuentas/cargar_VENTA_REV_DOC', data.id);
    }
  }
}
</script>

<style scoped>

</style>
