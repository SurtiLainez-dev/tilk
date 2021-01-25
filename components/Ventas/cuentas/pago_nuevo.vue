<template>
<v-card flat>
  <v-container class="d-flex justify-center">
    <v-card width="50%" class="pa-2">
      <v-card-title>Pago Nuevo</v-card-title>
      <v-divider></v-divider>
      <formulario_pago_nuevo :accion="1"/>
    </v-card>
  </v-container>
</v-card>
</template>

<script>
import formulario_pago_nuevo from "./formulario_pago_nuevo";
export default {
  components:{formulario_pago_nuevo},
  name: "pago_nuevo",
  computed:{
    CUENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
  }
}
</script>

<style scoped>

</style>
