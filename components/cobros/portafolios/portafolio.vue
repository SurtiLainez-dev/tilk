<template>
<v-card flat>
  <v-form ref="FormEditarPortafolio">
    <v-row no-gutters>
      <v-col>
        <v-text-field class="ma-3" label="Nombre del portafolio" v-model="PORTAFOLIO.nombre"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field class="ma-3" disabled label="Usuario responsable" v-model="PORTAFOLIO.user.usuario"></v-text-field>
      </v-col>
    </v-row>
    <v-select disabled class="ma-4" dense label="Segmentos pertenecientes" :item-text="'nombre'" :loading="LOADSEGMENTOS"
              :items="SEGMENTOS" :item-value="'id'" attach chips multiple v-model="segmentos"></v-select>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark tile small @click="validarForm">Registrar Cambios</v-btn>
    </v-card-actions>
  </v-form>
  <v-divider></v-divider>

</v-card>
</template>

<script>
import segmentos from "@/pages/ventas/cobros/segmentos";

export default {
  name: "portafolio",
  data(){
    return{
      segmentos: [],
    }
  },
  computed:{
    PORTAFOLIO(){
      return this.$store.state.cobros.portafolios.PORTAFOLIO;
    },
    SEGMENTOS(){
      return this.$store.state.cobros.segmentos.SEGMENTOS;
    },
    LOADSEGMENTOS() {
      return this.$store.state.cobros.segmentos.LOADSEGMENTOS;
    }
  },
  created() {
    this.$store.commit('cobros/segmentos/cargar_SEGMENTOS');
    if (this.PORTAFOLIO.segmentos)
      this.segmentos = JSON.parse(this.PORTAFOLIO.segmentos);
  },
  methods:{
    editarPortafolio(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('cobros/carteras/portafolio/'+this.PORTAFOLIO.id,{
        segmentos: JSON.stringify(this.segmentos),
        nombre:    this.PORTAFOLIO.nombre
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.PORTAFOLIO.nombre.length > 3 && this.segmentos.length > 0)
        this.editarPortafolio();
      else
        this.$store.commit('notificacion',{texto:'Tienes que llenar los campos', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
