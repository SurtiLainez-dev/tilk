<template>
  <div>
    <v-list-group color="green" >
      <template v-slot:activator value="true">
        <v-list-item-title>Sucursales</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/admin/sucursales/nuevo')">
        Crear Sucursal
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/admin/sucursales/')">
        Ver Sucursales
      </v-list-item>

    </v-list-group>

    <v-list-group color="green"  v-if="PERMISOS.includes(9)">
      <template v-slot:activator value="true">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-list-item-title v-on="on" v-bind="attrs">Otras Gestiones</v-list-item-title>
          </template>
          <span>Otras Gestiones</span>
        </v-tooltip>
      </template>
      <v-list-item class="itemOpciones" @click="go('/admin/passwords')" v-if="PERMISOS.includes(91)">
        Contraseñas Administradas
      </v-list-item>

    </v-list-group>
  </div>
</template>

<script>
    export default {
        name: "sideSucursal",
      methods:{
        go(url){
          this.$router.push(url)
        }
      },
      computed:{
        PERMISOS(){
          let permisos = this.$store.state.permisosUser.split(',');
          let per = [];
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
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
