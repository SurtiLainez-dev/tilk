<template>
<v-card flat>
  <nueva :tipo="1"/>
</v-card>
</template>

<script>
import nueva from "../../../components/Ventas/contado/nueva";
export default {
  components:{nueva},
  name: "nueva_contado",
  created() {
    this.$store.commit('guardarTitulo','Venta > Nueva > Contado')
  }
}
</script>

<style scoped>

</style>
