<template>
    <div>
      <v-list-group>
        <template v-slot:activator value="true">
          <v-list-item-title>Inventario</v-list-item-title>
        </template>
        <v-list-item v-if="PERMISOS.includes(413)" dense class="itemOpciones" @click="go('/contabilidad/articulos/precio')">
          Asignación de Precios
        </v-list-item>
        <v-list-item v-if="PERMISOS.includes(413)" dense class="itemOpciones" @click="go('/contabilidad/articulos/combos')">
          Combos
        </v-list-item>
        <v-list-item v-if="PERMISOS.includes(414)" dense class="itemOpciones" @click="go('/contabilidad/articulos/reingreso')">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <span v-bind="attrs" v-on="on">Asig. Precio a Reingreso</span>
            </template>
            <span>Asignación de Precios a Artículos de Reingreso</span>
          </v-tooltip>
        </v-list-item>
        <v-list-item v-if="PERMISOS.includes(415)" dense class="itemOpciones" @click="go('/contabilidad/articulos/devoluciones/devolucion')">
          Anulación de Cuenta
        </v-list-item>
      </v-list-group>
    </div>
</template>

<script>
  export default {
    name: "articulosConta",
    methods:{
      go(url){
        this.$router.push(url)
      }
    },
    computed:{
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
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
