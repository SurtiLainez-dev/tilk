<template>
<v-card flat>
  <h6 class="text-center">Entrada y Salida</h6>
  <v-divider></v-divider>
  <v-card class="ma-4" flat>
    <v-data-table :headers="header" dense :loading="LOAD_PEPS" loading-text="Cargando datos ..."
                  :items="PEPS">
      <template v-slot:header.cantidad>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Movimiento</span>
          </template>
          <span>Cantidad que se movió</span>
        </v-tooltip>
      </template>
      <template v-slot:header.valor_unitario>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Valor uni.</span>
          </template>
          <span>Valor unitario en ese momento</span>
        </v-tooltip>
      </template>
      <template v-slot:header.valor_total>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Valor Mov.</span>
          </template>
          <span>Total del movimiento</span>
        </v-tooltip>
      </template>
      <template v-slot:header.sucursal.nombre>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Sucursal</span>
          </template>
          <span>Sucursal de entrada</span>
        </v-tooltip>
      </template>
      <template v-slot:header.saldo_cantidad>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Stock</span>
          </template>
          <span>Existencia Actual</span>
        </v-tooltip>
      </template>
      <template v-slot:header.saldo_valor_unitario>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Precio Uni.</span>
          </template>
          <span>Precio Unitario</span>
        </v-tooltip>
      </template>
      <template v-slot:header.estado_articulo.nombre>
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">Estado</span>
          </template>
          <span>Estado de Artículos</span>
        </v-tooltip>
      </template>
      <template v-slot:item.tipo_peps="{item}">
        <v-chip x-small dark color="indigo" v-if="item.tipo_peps === 1">Entrada</v-chip>
        <v-chip x-small dark color="orange" v-else>Salida</v-chip>
      </template>
      <template v-slot:item.valor_unitario="{item}">L {{int.format(item.valor_unitario)}}</template>
      <template v-slot:item.valor_total="{item}">L {{int.format(item.valor_total)}}</template>
      <template v-slot:item.saldo_valor_unitario="{item}">L {{int.format(item.saldo_valor_unitario)}}</template>
      <template v-slot:item.saldo_valor_total="{item}">L {{int.format(item.saldo_valor_total)}}</template>
      <template v-slot:item.sucursal.nombre="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}"><span v-on="on" v-bind="attrs">{{item.sucursal.abreviatura}}</span></template>
          <span>{{item.sucursal.nombre}}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "entradas_salidas",
  data(){
    return{
      int: new Intl.NumberFormat(),
      header:[
        {text:'Código Art.',      value:'articulo.codigo_sistema'},
        {text:'Operación',        value:'operaciones_peps.nombre'},
        {text:'Orden de Entrada', value:'orden_entrada.codigo'},
        {text:'Referencia',       value:'referencia'},
        {text:'Tipo',             value: 'tipo_peps'},
        {text:'Movimiento',       value:'cantidad'},
        {text:'Valor Uni.',       value:'valor_unitario'},
        {text:'Total Mov.',       value:'valor_total'},
        {text:'Sucursal',         value:'sucursal.nombre'},
        {text:'Existencia',       value:'saldo_cantidad'},
        {text:'Precio uni.',      value:'saldo_valor_unitario'},
        {text:'Total',            value:'saldo_valor_total'},
        {text:'Estado Art.',      value:'estado_articulo.nombre'},
      ]
    }
  },
  computed:{
    ARTICULO(){
      return this.$store.state.inventario.inventario.ARTICULO;
    },
    LOAD_PEPS(){
      return this.$store.state.inventario.inventario.LOAD_PEPS;
    },
    PEPS(){
      return this.$store.state.inventario.inventario.PEPS;
    }
  },
}
</script>

<style scoped>

</style>
