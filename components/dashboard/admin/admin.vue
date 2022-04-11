<template>
    <div>
      <v-list-group>
        <template v-slot:activator value="true">
          <v-list-item-title>Usuarios</v-list-item-title>
        </template>
        <v-list-item class="itemOpciones" @click="go('/admin/user/nuevo')">
          Crear Usuario
        </v-list-item>
        <v-list-item class="itemOpciones" @click="go('/admin/user/')">
          Ver Usuarios
        </v-list-item>
        <v-list-item class="itemOpciones" @click="go('/admin/modulos')">
          Módulos del Sístema
        </v-list-item>

      </v-list-group>
    </div>
</template>

<script>
    export default {
      name: "admin",
      props:{permisos: Array},
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
