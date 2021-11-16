<template>
<v-card flat class="d-flex justify-center">
  <v-card width="40%" class="ma-5">
    <v-card-title>Editando Portafolio</v-card-title>
    <v-divider></v-divider>
    <v-form ref="FormEditarPortafolio">
      <v-autocomplete dense label="Seleccionar portafolio" class="ma-3" @change="capturarDatos"
                      v-model="portafolio.portafolio" :items="PORTAFOLIOS" :rules="[rule.req]"></v-autocomplete>
      <v-text-field dense label="Cartera" class="ma-3" disabled v-model="portafolio.cartera" :rules="[rule.req]"></v-text-field>
      <v-text-field dense label="Usuario Encargado" class="ma-3" disabled v-model="portafolio.usuario" :rules="[rule.req]"></v-text-field>
      <v-text-field dense label="Nombre" class="ma-3" :rules="[rule.req]" v-model="portafolio.nombre"></v-text-field>
      <v-autocomplete dense label="Nuevo usuario encargado" class="ma-3" :loading="load"
                      :items="usuarios" v-model="portafolio.user" :rules="[rule.req]"></v-autocomplete>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile dark small @click="validarForm">Registrar Edición</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "editar_portafolio",
  props:{
    usuarios: Array,
    load:     Boolean
  },
  data(){
    return{
      rule: {
        req: v => !!v || 'Campo requerido',
      },
      portafolio:{
        user: '',
        portafolio: '',
        nombre:   '',
        usuario:  '',
        cartera: '',
        id:      ''
      }
    }
  },
  created() {
    this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
  },
  computed:{
    LOADPORTAFOLIOS(){
      return this.$store.state.cobros.cartera.LOADPORTAFOLIOS;
    },
    PORTAFOLIOS(){
      let portafolios = [];
      this.$store.state.cobros.cartera.PORTAFOLIOS.forEach((item)=>{
        portafolios.push({
          text: item.nombre+'-'+item.cob_cartera.nombre,
          value: item.id+'-'+item.nombre+'-'+item.cob_cartera.nombre+'-'+item.user.usuario+'-'+item.user_id
        })
      })
      return portafolios;
    }
  },
  methods:{
    capturarDatos(){
      let datos               = this.portafolio.portafolio;
      this.portafolio.id      = datos.split('-')[0];
      this.portafolio.nombre  = datos.split('-')[1];
      this.portafolio.cartera = datos.split('-')[2];
      this.portafolio.usuario = datos.split('-')[3];
      this.portafolio.user    = parseInt(datos.split('-')[4]);
    },
    registrarEdicion(){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('cobros/carteras/portafolio/'+this.portafolio.id,{
        nombre: this.portafolio.nombre,
        user:   this.portafolio.user
      }).then((res)=>{
        this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('cobros/cartera/cambiar_VISTA', 1);
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormEditarPortafolio.validate())
        this.registrarEdicion();
    }
  }
}
</script>

<style scoped>

</style>
