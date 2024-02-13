<template>
  <div>
    <v-list-group color="green" >
      <template v-slot:activator value="true">
        <v-list-item-title>Planillas</v-list-item-title>
      </template>
      <v-list-item v-if="PERMISOS.includes(11)" class="itemOpciones" @click="go('/colaborador/planillas/nueva')">
        Crear Planilla
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(12)" class="itemOpciones" @click="go('/colaborador/planillas/')">
        Ver Planillas
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(13)" class="itemOpciones" @click="anadirPestana(29,'Colaboradores - Planillas Pendientes')">
        Planillas Pendientes
      </v-list-item>
    </v-list-group>

    <v-list-group color="green"  v-if="PERMISOS.includes(133) || PERMISOS.includes(134)">
      <template v-slot:activator value="true">
        <v-list-item-title>Notificaciones</v-list-item-title>
      </template>
      <v-list-item class="itemOpciones" @click="go('/colaborador/notificaciones/nuevo')">
        Crear Notificación
      </v-list-item>
      <v-list-item class="itemOpciones" @click="go('/colaborador/notificaciones/')">
        Notificaciones Creadas
      </v-list-item>
      <v-list-item v-if="PERMISOS.includes(134)" class="itemOpciones" @click="go('/colaborador/notificaciones/all_norificaciones')">
        Notificaciones
      </v-list-item>
    </v-list-group>
  </div>
</template>

<script>
    export default {
      name: "sidePlanilla",
      methods:{
        anadirPestana(key, titulo){
          let bandera = 0;
          this.Pes.forEach((item)=>{
            if (item.key === key)
              bandera++;
          });
          if (bandera === 0){
            this.$store.commit('anadirCaja', {titulo:titulo, key: key});
            this.$store.commit('cambiarTab', {val:key, tipo:false});
          }
        },
        go(url){
          this.$router.push(url)
        }
      },
      computed:{
        Pes(){
          return this.$store.state.pestana
        },
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
