<template>
  <v-card flat :loading="LOAD_USER">
    <v-toolbar flat color="grey lighten-4">
      <h5 v-if="!USER || USER.colaborador">{{USER.colaborador.nombres}} {{USER.colaborador.apellidos}}</h5>
      <v-spacer></v-spacer>
      <h6>{{this.$store.state.usuario}}</h6>
    </v-toolbar>

    <v-card flat class="ma-1">
      <v-row>
        <v-col cols="3">
          <v-card class="mx-auto" tile width="256">
            <v-navigation-drawer permanent>
              <v-list nav dense>
                <v-subheader>MENÚ</v-subheader>
                <v-list-item-group color="primary">

                  <v-list-item @click="VISTA = 1">
                    <v-list-item-icon>
                      <v-icon >fa fa-user</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Inicio'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item :disabled="LOAD_USER" @click="VISTA = 2">
                    <v-list-item-icon>
                      <v-icon >fa fa-file-alt</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Contratos'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item :disabled="LOAD_USER" @click="VISTA = 3">
                    <v-list-item-icon>
                      <v-icon >fa fa-file-contract</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Planillas'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item :disabled="LOAD_USER" @click="VISTA = 4">
                    <v-list-item-icon>
                      <v-icon >fa fa-folder-open</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Expediente'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item :disabled="LOAD_USER" @click="VISTA = 5">
                    <v-list-item-icon>
                      <v-icon >fa fa-file-invoice</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Llamados de Atención'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item :disabled="LOAD_USER" @click="VISTA = 6">
                    <v-list-item-icon>
                      <v-icon >fa fa-unlock-alt</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="'Cambio de Contraseña'"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                </v-list-item-group>
              </v-list>
            </v-navigation-drawer>
          </v-card>
        </v-col>
        <v-col>
          <inicio     v-if="VISTA === 1" />
          <contratos  v-if="VISTA === 2" />
          <planillas  v-if="VISTA === 3" />
          <contrasena v-if="VISTA === 6" />
        </v-col>
      </v-row>
    </v-card>

  </v-card>
</template>

<script>
import inicio from "../../../components/mi_perfil/inicio";
import contratos from "../../../components/mi_perfil/contratos";
import planillas from "../../../components/mi_perfil/planillas";
import contrasena from "../../../components/mi_perfil/contrasena";
export default {
  name: "mi_perfil",
  components:{
    inicio,
    contratos,
    planillas,
    contrasena
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
        this.$store.commit('perfil/asignar_VISTA', val)
      }
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Mi Perfil')
    this.$store.commit('perfil/cargar_USER');
  }
}
</script>

<style scoped>

</style>
