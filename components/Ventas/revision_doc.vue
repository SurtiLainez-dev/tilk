<template>
  <v-card flat>
    <v-tabs v-model="view" fixed-tabs background-color="gray lighten-3">
      <v-tab :key="0">Revisión de Documentos</v-tab>
      <v-tab :key="1"  :disabled="LOAD_VENTA">Información de la Cuenta</v-tab>
      <v-tab :key="2"  >Perfil del Cliente</v-tab>
    </v-tabs>

    <v-tabs-items v-model="view">
      <v-tab-item :key="0"><revision_docs_vista/></v-tab-item>
      <v-tab-item :key="1"><cuenta/></v-tab-item>
      <v-tab-item :key="2"><cliente/></v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import revision_docs_vista from "@/components/Ventas/revision_docs_vista";
import cuenta from "@/components/Ventas/cuenta";
import _cliente from "@/pages/clientes/_cliente";
export default {
  components:{
    revision_docs_vista, cuenta, cliente:_cliente
  },
  computed:{
    LOAD_VENTA(){
      return this.$store.state.cuentas.LOADCUENTA;
    },
    VENTA(){
      return this.$store.state.cuentas.VENTA_REV_DOC;
    },
    VENTA_O(){
      return this.$store.state.cuentas.CUENTA
    }
  },
  created() {
    this.$axios.get('cuentas/ventas/'+this.VENTA_O.id).then((res)=>{
      this.$store.commit('cuentas/agregar_CUENTA', res.data.venta);
    });
    this.$route.params.cliente = this.VENTA_O.cliente;
  },
  name: "revision_doc",
  data(){
    return{
      viewBtn: true,
      view: 0
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
  font-size: 12px;
}
table tbody tr td{
  font-size: 11px;
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
