<template>
  <v-card>
    <v-row class="grey lighten-2" no-gutters>
      <v-col cols="9"><v-card-title>Pagos Realizados</v-card-title></v-col>
      <v-col cols="3" class="d-flex align-center">
        <b-form-input v-model="search" class="ma-2" placeholder="Buscar pago" size="sm"></b-form-input>
      </v-col>
    </v-row>
    <b-table small
             :filter="search"
             :current-page="currentPage"
             :per-page="perPage"
             :fields="field"
             class="rowsTable" hover
             responsive
             :items="Pagos"
             @filtered="onFiltered"
             :busy="loading"
             striped bordered>
<!--      <template v-slot:head(pagos_factura.factura_proveedor.proveedor.nombre)><div class="text-nowrap">Proveedor</div></template>-->
      <template v-slot:head(pagos_factura.factura_proveedor.num_factura)><div class="text-nowrap"># de Factura</div></template>
      <template v-slot:head(total_mora)><div class="text-nowrap">Mora</div></template>
      <template v-slot:head(total_pago)><div class="text-nowrap">Total Pagado</div></template>
      <template v-slot:head(pagos_factura.total_a_pagar)><div class="text-nowrap">Total de la Cuota</div></template>
      <template v-slot:head(pagos_factura.total_pagado)><div class="text-nowrap">Total de la Cuota Pagado</div></template>
      <template v-slot:head(pagos_factura.factura_proveedor.total)><div class="text-nowrap">Total de la Factura</div></template>
      <template v-slot:head(forma_pago.nombre)><div class="text-nowrap">Forma de Pago</div></template>
      <template v-slot:head(cuenta_banco.num)><div class="text-nowrap"># de Cuenta</div></template>
      <template v-slot:head(cuenta_banco.banco.nombre)><div class="text-nowrap">Banco</div></template>
      <template v-slot:head(cuenta_banco.tipo_cuenta_banco.nombre)><div class="text-nowrap">Tipo de Cuenta</div></template>
      <template v-slot:head(created_at)><div class="text-nowrap">Fecha de Pago</div></template>

      <template v-slot:cell(pagos_factura.factura_proveedor.proveedor.nombre)="scope">
        <div class="text-nowrap">{{scope.item.pagos_factura.factura_proveedor.proveedor.nombre}}</div></template>
      <template v-slot:cell(pagos_factura.factura_proveedor.num_factura)="scope">
        <div class="text-nowrap">{{scope.item.pagos_factura.factura_proveedor.num_factura}}</div></template>
      <template v-slot:cell(referencia)="scope"><div class="text-nowrap">{{scope.item.referencia}}</div></template>
      <template v-slot:cell(pago)="scope"><div class="text-nowrap">L {{scope.item.pago}}</div></template>
      <template v-slot:cell(total_mora)="scope"><div class="text-nowrap">L {{scope.item.total_mora}}</div></template>
      <template v-slot:cell(total_pago)="scope"><div class="text-nowrap">L {{scope.item.total_pago}}</div></template>
      <template v-slot:cell(pagos_factura.total_a_pagar)="scope">
        <div class="text-nowrap">L {{scope.item.pagos_factura.total_a_pagar}}</div></template>
      <template v-slot:cell(pagos_factura.total_pagado)="scope">
        <div class="text-nowrap">L {{scope.item.pagos_factura.total_pagado}}</div></template>
      <template v-slot:cell(pagos_factura.factura_proveedor.total)="scope">
        <div class="text-nowrap">L {{scope.item.pagos_factura.factura_proveedor.total}}</div></template>
      <template v-slot:cell(forma_pago.nombre)="scope"><div class="text-nowrap">{{scope.item.forma_pago.nombre}}</div></template>
      <template v-slot:cell(cuenta_banco.banco.nombre)="scope"><div class="text-nowrap">{{scope.item.cuenta_banco.banco.nombre}}</div></template>
      <template v-slot:cell(cuenta_banco.num)="scope"><div class="text-nowrap">{{scope.item.cuenta_banco.num}}</div></template>
      <template v-slot:cell(created_at)="scope"><div class="text-nowrap">{{scope.item.created_at.split('T')[0]}}</div></template>
      <template v-slot:table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando Pagos...</strong>
        </div>
      </template>
    </b-table>
    <v-row>
      <v-col class="d-flex justify-center">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  export default {
    name: "index",
    created() {
      this.$store.commit('activarOverlay', false);
      this.$store.commit('guardarTitulo', 'Contabilidad > Facturas > Proveedores > Pagos Realizados');
      this.cargarPagos()
    },
    data(){
      return{
        search: '',
        loading: true,
        currentPage: 1,
        totalRows: 1,
        perPage: 20,
        field:[
          {key:'pagos_factura.factura_proveedor.proveedor.nombre', label:'Proveedor'},
          'pagos_factura.factura_proveedor.num_factura',
          { key: 'referencia', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'created_at',
          'pago',
          'total_mora',
          'total_pago',
          'pagos_factura.total_a_pagar',
          'pagos_factura.total_pagado',
          'pagos_factura.factura_proveedor.total',
          'forma_pago.nombre',
          'cuenta_banco.banco.nombre',
          'cuenta_banco.num',
          'cuenta_banco.tipo_cuenta_banco.nombre',
        ],
        Pagos: [],
      }
    },
    methods:{
      onFiltered(filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      cargarPagos(){
        this.$axios.get('pagos_realizados_proveedores',{
          headers:{
            'Authorization': 'Bearer '+ this.$store.state.token
          }
        }).then((res)=>{
          this.Pagos     = res.data.pagos;
          this.totalRows = this.Pagos.length;
          this.loading   = false;
        })
      }
    },
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
