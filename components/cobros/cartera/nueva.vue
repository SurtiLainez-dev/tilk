<template>
<v-card flat class="d-flex justify-center">
  <v-card class="ma-5" width="55%">
    <v-card-title>Nueva Cartera</v-card-title>
    <v-divider></v-divider>
    <v-form ref="FormNuevaCartera">
      <v-autocomplete class="ma-3" v-model="cartera.sucursal" :loading="sucursales.load"
                      :items="sucursales.data" :item-text="'nombre'" :item-value="'id'"
                      label="Seleccionar sucursal" dense :rules="[rule.nombre.req]"></v-autocomplete>
      <v-text-field label="Nombre de la cartera" v-model="cartera.nombre"
                    :rules="[rule.nombre.req, rule.nombre.min, rule.nombre.max]"
                    class="ma-3" dense counter></v-text-field>

      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile small dark class="ma-3" @click="validarForm">Registrar Cartera</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</v-card>
</template>

<script>
export default {
  name: "nueva",
  props:{
    usuarios: Array,
    load:     Boolean
  },
  data(){
    return{
      items: [1, 2, 3, 4, 5, 6],
      cartera:{
        nombre: '',
        alias:  '',
        sucursal: '',
        user:     '',
        importancia: []
      },
      sucursales: {
        data: [],
        load:   true
      },
      rule: {
        nombre: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        alias:{
          max: v => (v && v.length <= 25) || 'Tiene que ser menor o igual a 25 carácteres.',
        },
        importancia:{
          req: v => v.length > 0 || 'Tienes que seleccionar al menos una importancia'
        }
      }
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Cobros > Cartera > Nueva');
    this.cargarSucursales();
  },
  methods:{
    cargarSucursales(){
      this.$axios.get('/sucursales').then((res)=>{
        this.sucursales.data = res.data.suc;
        this.sucursales.load = false;
      })
    },
    registrarCartera(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/carteras',{
        sucursal_id: this.cartera.sucursal,
        nombre:      this.cartera.nombre,
        usuario:     this.cartera.user
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$store.commit('cobros/cartera/cargar_CARTERAS');
        this.$store.commit('cobros/cartera/cambiar_VISTA', 1);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.error, color:'error'});
        else
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormNuevaCartera.validate())
        this.registrarCartera();
    }
  }
}
</script>

<style scoped>

</style>
