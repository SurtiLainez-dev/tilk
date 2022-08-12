<template>
  <v-card :loading="LOAD_DATATABLE" flat>
    <table>
      <thead>
      <tr>
        <td v-for="item in headers">{{item}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, i) in DATATABLE">
        <td>{{i+1}}</td>
        <td v-if="item.venta.tipo_venta === 1">Contado</td>
        <td v-else-if="item.venta.tipo_venta === 2">Crédito</td>
        <td>{{item.fecha}}</td>
        <td>{{item.venta.cod}}</td>
        <td>{{item.venta.cliente.nombres}} {{item.venta.cliente.apellidos}}</td>
        <td>L. {{int.format(item.sub_total)}}</td>
        <td>L. {{int.format(item.total)}}</td>
        <td>L. {{int.format(item.venta.total)}}</td>
        <td>{{item.venta.colaborador.nombres}} {{item.venta.colaborador.apellidos}}</td>
        <td>{{item.venta.facturas_contados[0].articulo.marca.nombre}} / {{item.venta.facturas_contados[0].articulo.modelo}}</td>
        <td>{{item.venta.facturas_contados[0].articulo.nombre_articulo}}</td>
        <td style="text-align: center">
          <v-badge v-if="item.venta.tipo_venta === 1" dot color="success"></v-badge>
          <v-badge v-else-if="item.venta.revision_documentos === 1" dot color="success"></v-badge>
          <v-badge v-else-if="item.venta.revision_documentos === 0" dot color="red"></v-badge>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALSINIMPUESTO)}}</td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALCONTADO)}}</td>
        <td style="border-top: 1px solid #000">L.{{int.format(TOTALFINAL)}}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </v-card>
</template>

<script>
export default {
  name: "tabla_ventas",
  data(){
    return{
      int: Intl.NumberFormat(),
      headers:[
        '#',
        'Tipo',
        'Fecha',
        'Cuenta',
        'Nombre Completo',
        'Precio S/I',
        'Precio Contado',
        'Precio Final',
        'Vendedor',
        'Marca/Modelo',
        'Artículo',
        'Estado'
      ]
    }
  },
  computed:{
    LOAD_DATATABLE(){
      return this.$store.state.reportes.ventas.global.LOAD_DATATABLE;
    },
    DATATABLE(){
      return this.$store.state.reportes.ventas.global.DATATABLE;
    },
    TOTALSINIMPUESTO(){
      if (this.DATATABLE.length > 0)
        return  this.DATATABLE.reduce((num1, num2)=> num1 + parseFloat(num2.sub_total),0)
      else return 0;
    },
    TOTALCONTADO(){
      if (this.DATATABLE.length > 0)
        return this.DATATABLE.reduce((num1, num2)=> num1 +  parseFloat(num2.total),0)
      else return 0;
    },
    TOTALFINAL(){
      if (this.DATATABLE.length > 0)
        return this.DATATABLE.reduce((num1, num2)=> num1 + parseFloat(num2.venta.total),0)
      else return 0;
    }
  }
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
</style>
