<template>
<v-card flat>
  <table>
    <thead>
    <tr>
      <th>Articulos Incluidos</th>
      <th>Marca</th>
      <th>Modelo</th>
      <th>Sub Familia</th>
    </tr>
    </thead>
  </table>
<pre>{{combo}}</pre>
</v-card>
</template>

<script>
export default {
  name: "combo_vista_venta",
  data(){
    return{
      loadCombo: true,
      Combo: {}
    }
  },
  props:{
    combo: Object
  },
  created() {
    this.$store.commit('guardarTitulo','Inventario > Combos > '+this.combo.nombre_articulo);
    this.cargarCombo();
  },
  methods:{
    cargarCombo(){
      this.$axios.get('/2.0/combos/'+this.combo.articulo+'/consulta').then((res)=>{
        this.Combo = res.data.combo;
        this.loadCombo = false;
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