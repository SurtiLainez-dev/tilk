<template>
<v-card flat>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card height="400" width="256" class="mx-auto">
          <v-navigation-drawer permanent>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">
                  Títulos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense nav>
              <v-list-item v-for="item in Notas" :key="item.titulo" link @click="infoNota(item)">
                <v-list-item-content>
                  <v-list-item-title>{{ item.titulo }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col >
        <v-card height="100%" v-if="seleted">
          <v-toolbar flat >
            <v-row no-gutters>
              <v-col>
                <strong class="grey--text">{{Nota.titulo}}</strong>
              </v-col>
              <v-col cols="3">
                <small class="grey--text"><strong>{{Nota.fecha}} {{Nota.hora}}</strong></small>
              </v-col>
            </v-row>
          </v-toolbar>
          <v-divider></v-divider>
          <v-container>
            <v-textarea v-model="Nota.detalle" filled disabled label="Detalle de la nota"></v-textarea>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <small class="grey--text"><strong>Autor: {{Nota.usuario}}</strong></small>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
export default {
  name: "notas_cliente",
  computed:{
    CLIENTE(){
      return this.$store.state.cliente.CLIENTE;
    },
  },
  created() {
    this.Notas = JSON.parse(this.CLIENTE.notas)
  },
  data(){
    return{
      Notas: [],
      seleted: false,
      Nota:{
        titulo:  '',
        hora:    '',
        usuario: '',
        detalle: '',
        fecha:   ''
      }
    }
  },
  methods:{
    infoNota(data){
      this.Nota.titulo  = data.titulo;
      this.Nota.hora    = data.hora;
      this.Nota.fecha   = data.fecha;
      this.Nota.usuario = data.usuario;
      this.Nota.detalle = data.detalle;
      this.seleted      = true;
    }
  }
}
</script>

<style scoped>

</style>
