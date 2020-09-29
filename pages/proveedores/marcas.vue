<template>
    <v-container class="pl-2 pr-2">
      <v-card>
        <v-tabs>
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#TabMarcas" :key="1">Marcas</v-tab>
        <v-tab href="#TabFamilias" :key="2">Familias</v-tab>
        <v-tab href="#TabSubFamilias" :key="3">Sub-familias</v-tab>

        <v-tab-item :key="1" value="TabMarcas">
          <marca/>
        </v-tab-item>
        <v-tab-item :key="2" value="TabFamilias">
          <familias/>
        </v-tab-item>
          <v-tab-item :key="3" value="TabSubFamilias">
            <sub_familias/>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-container>
</template>

<script>
  import marca from "../../components/Proveedores/marcas/marca";
  import familias from "../../components/Proveedores/marcas/familias";
  import sub_familias from "../../components/Proveedores/marcas/sub_familias";
  export default {
    components:{marca, familias, sub_familias},
    created() {
      this.$store.commit('guardarTitulo', 'Proveedores > Marcas / Familias');
    },
    name: "marcas"
  }
</script>

<style scoped>

</style>
