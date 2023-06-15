<template>
<v-card flat>
  <br>
  <br>
  <v-row>
    <v-col></v-col>
    <v-col class="grey lighten-5" cols="10">
      <v-card-title>Datos de la Nueva Sección</v-card-title>
      <v-divider></v-divider>
      <v-form ref="FormNuevaSeccionManual">
        <v-row>
          <v-col cols="4">
            <v-text-field label="Titulo Corto" v-model="tituloCorto" :rules="[rule.required, rule.minTitulo, rule.maxTituloCorto]"
                          dense class="ma-2" counter></v-text-field>
          </v-col>
          <v-col cols="8">
            <v-text-field label="Titulo" v-model="titulo" :rules="[rule.required, rule.minTitulo, rule.maxTitulo]"
                          dense class="ma-2" counter></v-text-field>
          </v-col>
        </v-row>

        <v-textarea v-model="detalle" rows="4" :rules="[rule.required, rule.minDetalle, rule.maxDetalle]"
                    label="Detalle de la Sección" counter></v-textarea>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn small tile color="success" @click="validarForm">Registrar</v-btn>
        </v-card-actions>
      </v-form>
    </v-col>
    <v-col></v-col>
  </v-row>
</v-card>
</template>

<script>
export default {
  name: "NuevaSeccion",
  data(){
    return{
      titulo: '',
      tituloCorto: '',
      detalle: '',
      color: '',
      rule:{
        required:       value => !!value     || 'El campo es requerido',
        minTitulo:      v => v.length >= 3   || 'Debe ingresar mínimo 3 carácteres',
        minDetalle:     v => v.length >= 20  || 'Debe ingresar mínimo 20 carácteres',
        maxTituloCorto: v => v.length <= 30  || 'Maximo de carácteres es 30',
        maxTitulo:      v => v.length <= 100 || 'Maximo de carácteres es 100',
        maxDetalle:     v => v.length <= 400 || 'DMaximo de carácteres es 400',
      },
    }
  },
  methods:{
    registrarSeccion(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('manual_seccion',{
        titulo_corto: this.tituloCorto,
        titulo:       this.titulo,
        detalle:      this.detalle,
        color:        this.color
      }).then((res)=>{
        this.$store.commit('manual/manual/cambiarVISTA', 1);
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'})
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'})
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormNuevaSeccionManual.validate())
        this.registrarSeccion()
      else
        this.$store.commit('notificacion',{color:'warning', texto:'Datos incompletos'})
    }
  }
}
</script>

<style scoped>

</style>