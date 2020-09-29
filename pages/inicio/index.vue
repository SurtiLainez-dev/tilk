<template>
  <div class="ml-2 mr-2">
    <v-row>
      <v-col lg="2" cols="6">
        <v-card>
          <v-card-title>
            Clientes
          </v-card-title>
        </v-card>
      </v-col>
      <v-col  lg="2" cols="6">
        <v-card>
          <v-card-title>
            Motocicletas
          </v-card-title>
        </v-card>
      </v-col>
      <v-col lg="2" cols="6">
        <v-card :disabled="true">
          <v-card-title>
            Tareas
          </v-card-title>
        </v-card>
      </v-col>
      <v-col lg="2" cols="6">
        <v-card :disabled="true">
          <v-card-title>
            Notificaciones
          </v-card-title>
        </v-card>
      </v-col>
      <v-col lg="2" cols="6">
        <v-card :disabled="true">
          <v-card-title>
            Reuniones
          </v-card-title>
        </v-card>
      </v-col>
      <v-col lg="2" cols="6">
        <v-card :disabled="true">
          <v-card-title>
            Referidos
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" cols="12">
        <view_transferencias/>
      </v-col>
      <v-col></v-col>
    </v-row>
  </div>
</template>

<script>
  import view_transferencias from "../../components/Inicio/view_transferencias";
  export default {
    components:{view_transferencias},
    name: "index"
  }
</script>

<style scoped>

</style>
