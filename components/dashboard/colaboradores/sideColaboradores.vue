<template>
  <div>
    <v-list-group>
      <template v-slot:activator value="true">
        <v-list-item-title>Colaboradores</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/colaborador/')">
        Colaboradores
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/colaborador/contratos')">
        Contratos
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
    export default {
      name: "sideColaboradores",
      methods:{
        go(url){
          this.$router.push(url)
        }
      }
    }
</script>

<style scoped>
  .itemOpciones{
    font-size: 10px !important;
    margin-left: 6px;
    cursor: pointer;
  }
  .itemOpciones:hover{
    background-color: #47494e;
    margin-left: 8px;
    font-size: 14px !important;
  }
</style>
