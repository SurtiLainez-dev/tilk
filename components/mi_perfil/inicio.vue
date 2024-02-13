<template>
  <v-card >
    <v-row no-gutters>
      <v-col cols="3">
        <v-row no-gutters>
          <v-col>
            <v-img
                :lazy-src="url"
                max-height="250"
                max-width="350"
                :src="!USER || (USER.colaborador && USER.colaborador.foto_perfil) ? USER.colaborador.foto_perfil : url"
            ></v-img>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Nombres</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.nombres}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Apellidos</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.apellidos}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Correo Personal</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Teléfono Personal</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.sucursal.telefono}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Identidad</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.identidad}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Código</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.codigo}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="9">
        <v-row no-gutters>
          <v-col>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Sucursal Asignada</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.sucursal.nombre}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Puesto</v-list-item-title>
                <v-list-item-subtitle v-if="!USER || USER.colaborador">{{USER.colaborador.puesto_colaborador.nombre}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col>

          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "inicio",
  data(){
    return{
      url: 'https://ign-surti.nyc3.digitaloceanspaces.com/colaboradores/foto-pefil/1591910215-perfil.jpg',
    }
  },
  computed:{
    USER(){
      return this.$store.state.perfil.USER;
    },
    LOAD_USER(){
      return this.$store.state.perfil.LOAD_USER;
    },
    VISTA:{
      get: function (){
        return this.$store.state.perfil.VISTA;
      },
      set: function (val){
        this.$store.commit('perfil/asigna_VISTA', val)
      }
    }
  },
}
</script>

<style scoped>

</style>
