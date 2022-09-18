<template>
  <v-card flat>

    <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
    <table>
      <thead>
      <tr>
        <th v-for="item in header">{{item}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in data">
        <td>{{item.created_at.split('T')[0]}}</td>
        <td>
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-on="on" v-bind="attrs">{{item.sucursal.abreviatura}}</span>
            </template>
            <span>{{item.sucursal.nombre}}</span>
          </v-tooltip>
        </td>
        <td>{{item.articulo.codigo_sistema}}</td>
        <td>{{item.operaciones_peps.nombre}}</td>
        <td v-if="item.orden_entrada">{{item.orden_entrada.codigo}}</td><td v-else>/</td>
        <td>{{item.referencia}}</td>
        <td>
          <v-chip style="height: 12px !important;" x-small  dark color="indigo" v-if="item.tipo_peps === 1">Entrada</v-chip>
          <v-chip style="height: 12px !important;" x-small dark color="orange" v-else>Salida</v-chip>
        </td>
        <td class="text-center">{{item.cantidad}}</td>
        <td class="text-center">L. {{int.format(item.valor_unitario)}}</td>
        <td class="text-center">L. {{int.format(item.valor_total)}}</td>
        <td class="text-center">{{ item.saldo_cantidad }}</td>
        <td class="text-center">L. {{int.format(item.saldo_valor_unitario)}}</td>
        <td>L. {{int.format(item.saldo_valor_total)}}</td>
        <td>{{item.estado_articulo.nombre}}</td>
      </tr>
      </tbody>
    </table>
    <br>
    <v-divider></v-divider>
    <br>
  </v-card>
</template>

<script>
export default {
  name: "tabla_entradas_salidas",
  props:{
    data: Array,
    loading: Boolean
  },
  data(){
    return{
      int: Intl.NumberFormat(),
      header:[
        'Fecha',
        'Sucursal',
        'Código Art.',
        'Operación',
        'Orden de Entrada',
        'Referencia',
        'Tipo',
        'Cantidad',
        'Valor Unitario',
        'Valor del Movimiento',
        'Existencia',
        'Precio Unitario',
        'Total',
        'Estado',
      ],
    }
  },
}
</script>

<style scoped>
table{
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 2px;
}
table thead{
  background: #e8e5e5;
}
table thead tr th{
  font-size: 11px;
}
table tbody tr td{
  font-size: 10px;
}
table tbody tr td:nth-child(even){
  background-color: #f2f2f2;
}
table tbody tr:hover{
  background: #f2f2f2;
  border: 1px solid;
  cursor: pointer;
}
table caption{
  font-size: 13px;
  caption-side: top;
}
table thead tr td{
  font-size: 12px;
}
#tituloTabla{
  font-size: 14px;
  color: #7F828B;
}
.borderContado{
  border: 1px solid #00b786;
}
.borderDescuento{
  border: 1px solid red;
}
</style>
