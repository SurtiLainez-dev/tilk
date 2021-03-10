<template>
  <v-card flat height="300" class="d-flex align-center">
    <v-container class="d-flex justify-center">
      <v-card width="40%">
        <v-toolbar color="grey lighten-5">
          <h6>Nueva Familia de Mobiliarios</h6>
        </v-toolbar>
        <v-form ref="FormMobNuevaFamilia" class="ma-5" v-on:submit.prevent>
          <v-text-field dense label="Nombre de la familía" counter
                        :rules="rules" v-model="nombre">
          </v-text-field>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" small @click="validarForm" tile dark>Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "nuevaFamilia",
  data(){
    return{
      nombre: '',
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
    }
  },
  methods:{
    registrar(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('mob/familia',{
        nombre: this.nombre
      }).then((res)=>{
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('mob/familias/cambiar_VISTA', 1);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto: 'Se ha producido un error en el servidor', color:'error'})
      })
    },
    validarForm(){
      if (this.$refs.FormMobNuevaFamilia.validate())
        this.registrar();
    }
  }
}
</script>

<style scoped>

</style>
