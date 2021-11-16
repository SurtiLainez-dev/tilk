<template>
<v-card flat class="d-flex justify-center">
  <v-card class="ma-5" width="40%">
    <v-card-title>Nuevo Portafolio</v-card-title>
    <v-divider></v-divider>

    <v-form ref="FormNuevoPortafolio">
      <v-autocomplete dense class="ma-3" label="Seleccionar sucursal" v-model="portafolio.cartera" :loading="isPeticion"
                      :items="sucursales" :item-value="'id'" :item-text="'nombre'" :rules="[rule.req]"></v-autocomplete>
      <v-autocomplete dense class="ma-3" label="Seleccionar usuario responsanble" v-model="portafolio.usuario"
                      :items="usuarios" :loading="load" :rules="[rule.req]"></v-autocomplete>
      <v-text-field dense label="Nombre del portafolio de cuentas" class="ma-3"
                    :rules="[rule.req]" v-model="portafolio.nombre"></v-text-field>
      <v-checkbox class="ma-3" dense label="Es portafalolio gerencial" v-model="portafolio.gerencial"></v-checkbox>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" small dark tile @click="validarForm">Registrar Portafolio</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-card>
</template>

<script>

export default {
  name: "portafilio",
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
        usuario: '',
        gerencial:  false,
        cartera: '',
        nombre: ''
      },
      isPeticion: false,
      sucursales: []
    }
  },
  created() {
    this.cargarSucursales();
  },
  computed:{
    VISTA:{
      get: function (){
        return this.$store.state.cobros.cartera.VISTA;
      },
      set: function (val){
        this.$store.commit('cobros/cartera/cambiar_VISTA', val);
      }
    },
  },
  methods:{
    cambiarVista(vista){
      this.cargarUsuarios();
      if (vista === 3)
        this.titulo = 'Creando Portafolio de Trabajo';
      else
        this.titulo = 'Editando Portafolio'

      this.VISTA = vista;
    },
    cargarSucursales(){
      this.isPeticion = true
      this.$axios.get('/sucursales').then((res)=>{
        this.isPeticion = false
        this.sucursales = res.data.suc
      })
    },
    registrarPortafolio(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/portafolio',{
        sucursal_id: this.portafolio.cartera,
        user_id:    this.portafolio.usuario,
        nombre:     this.portafolio.nombre,
        gerencial:  this.portafolio.gerencial
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('cobros/cartera/cambiar_VISTA', 1);
        this.$store.commit('activarOverlay', false);
        this.$store.commit('cobros/cartera/cargar_PORTAFOLIOS');
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'error'});
        else {
          this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color: 'error'});
        }
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoPortafolio.validate())
        this.registrarPortafolio();
    }
  }
}
</script>

<style scoped>

</style>
