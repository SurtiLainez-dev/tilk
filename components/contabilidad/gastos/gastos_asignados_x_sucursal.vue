<template>
<v-card flat>
  <v-card-title>Gastos Asignados a la sucursal {{sucursal.nombre}}</v-card-title>
  <v-divider></v-divider>
  <v-data-table :headers="headers" :loading="loadGastos" :items="Gastos"
                loading-text="Cargando gastos ..." @click:row="abrirInfoGasto"></v-data-table>

  <v-dialog v-model="dialogo" width="95%">
    <v-card>
      <v-toolbar tile flat color="grey lighten-3">
        <v-toolbar-title>Gasto: {{gasto.nombre}}</v-toolbar-title>
      </v-toolbar>
      <v-container v-if="dialogo">
        <table>
          <thead>
          <tr>
            <th>Nombre del Gasto</th>
            <th>Codigo del Gasto</th>
            <th>Total Gastodo en este año</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{gasto.nombre}}</td>
            <td>{{gasto.cod}}</td>
            <td>L. {{ int.format(totalGasto)}}</td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th>CC Enlazada</th>
            <th>Codigo CC</th>
            <th>Codigo Dep CC</th>
          </tr>
          </thead>
          <tbody>
          <tr>
              <td>{{gasto.cc.nombre}}</td>
              <td>{{gasto.cc.cod}}</td>
              <td>{{gasto.cc.cod_dep}}</td>
          </tr>
          </tbody>
          <thead>
          <tr>
            <th>CC Padre Enlazada</th>
            <th>Codigo CC Padre</th>
            <th>Codigo Dep CC Padre</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{gasto.cc.cod_d.nombre}}</td>
            <td>{{gasto.cc.cod_d.cod}}</td>
            <td>{{gasto.cc.cod_d.cod_dep}}</td>
          </tr>
          </tbody>
        </table>
        <br>
        <v-card-subtitle>Gastos</v-card-subtitle>
        <v-data-table dense :headers="headersGastos" :loading="loadGastos" :items="gastos"
                      loading-text="Cargando gastos ...">
          <template v-slot:item.total="{item}">L. {{int.format(item.total)}}</template>
          <template v-slot:item.fecha="{item}">{{item.fecha.split(' ')[0].split('-')[2]}}/{{item.fecha.split(' ')[0].split('-')[1]}}/{{item.fecha.split(' ')[0].split('-')[0]}}</template>
        </v-data-table>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" dark small tile text @click="dialogo = false">Cerrar</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  props:{
    sucursal: Object
  },
  name: "gastos_asignados_x_sucursal",
  data(){
    return{
      Gastos: [],
      loadGastos: true,
      headers:[
        {text:'Nombre del Gasto', value:'nombre'},
        {text:'Codigo', value:'cod'},
        {text:'Codigo CC', value:'cc.cod'},
        {text:'Codigo Dep. CC', value:'cc.cod_dep'},
        {text:'Nombre CC', value:'cc.nombre'},
        {text:'Nombre CC Dep.', value:'cc.cod_d.nombre'},
      ],
      headersGastos:[
        {text:'Nombre del Gasto', value:'gasto'},
        {text:'Detalle', value:'detalle'},
        {text:'Total', value:'total'},
        {text:'Fecha', value:'fecha'},
      ],
      int: Intl.NumberFormat(),
      gasto: {},
      gastos: [],
      dialogo: false,
      totalGasto: 0
    }
  },
  created() {
    this.$axios.get('contabilidad/gastos_asignados_x_sucursal='+this.sucursal.id).then((res)=>{
      this.Gastos     = res.data.gastos;
      this.loadGastos = false
    })
  },
  methods:{
    abrirInfoGasto(data){
      this.gasto = data;
      this.dialogo = true;
      this.loadGastos = true;
      let fecha = new Date();
      let fi    = fecha.getFullYear()+'-01-01';
      let ff    = fecha.getFullYear()+'-'+(fecha.getMonth() + 1)+'-'+fecha.getDate();
      this.$axios.get('contabilidad/gastos_x_tipo_gasto='+this.gasto.id+'/fi='+fi+'/ff='+ff).then((res)=>{
        this.gastos     = res.data.gastos;
        this.totalGasto = res.data.total;
        this.loadGastos = false;
      })
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}

table thead tr th{
  padding: 5px;
  font-size: 14px;
  border-left: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  border-bottom: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table tbody tr td table{
  width: 80%;
}
table tbody tr td table thead tr th{
  font-size: 10px;
  padding: 2px;
}
table tbody tr td table tbody tr td{
  font-size: 9px;
}
table caption{
  caption-side: top;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>