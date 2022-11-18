<template>
<v-card flat>
  <v-toolbar flat dense color="grey lighten-4">
    <v-card-title>Gastos de Matrícula</v-card-title>
  </v-toolbar>

  <v-container>
    <v-row no-gutters>
      <v-col cols="5">
        <v-card class="ma-2">
          <v-form ref="FormCobroMatricula">
            <v-card-subtitle>Formulario Para Gastos de Matrícula</v-card-subtitle>
            <v-card-text>Este cobro se le rebajará del precio final cuando se haga la venta de un vehículo.</v-card-text>
            <v-divider></v-divider>
            <v-text-field dense v-model="detalle" :rules="[rule.req, rule.min, rule.max]" :counter="100"
                          label="Detalle Del Cambio" class="ma-2"></v-text-field>
            <v-text-field dense v-model="monto" :rules="[rule.req]"
                          label="Monto del Cobro" prefix="L. " class="ma-2"></v-text-field>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" small tile dark @click="validarForm">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card class="ma-2">
          <v-data-table dense :headers="headers" :items="Cobros" loading-text="Cargando datos ..."
                        :loading="load">
            <template v-slot:item.cobro="{item}">L. {{int.format(item.cobro)}}</template>
            <template v-slot:item.estado="{item}">
              <v-chip x-small color="success" dark v-if="item.estado === 1">Activo</v-chip>
              <v-chip x-small color="red" dark v-else>Inactivo</v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</v-card>
</template>

<script>
export default {
  name: "precio_matricula",
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Gastos de Matrícula');
    this.cargarCobros();
  },
  data(){
    return{
      detalle: '',
      load: true,
      monto: 0,
      rule: {
        req: v => !!v || 'Campo requerido',
        min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 3 carácteres.',
        max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 100 carácteres.',
      },
      Cobros: [],
      int: Intl.NumberFormat(),
      headers:[
        {text:'Detalle', value:'detalle'},
        {text:'Monto', value:'cobro'},
        {text:'Usuario', value:'user.usuario'},
        {text:'Estado', value:'estado'},
      ]
    }
  },
  methods:{
    cargarCobros(){
      this.$axios.get('contabilidad/2.0/cobro_matricula').then((res)=>{
        this.Cobros = res.data.cobros;
        this.load = false;
      })
    },
    registrarCobro(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/2.0/cobro_matricula',{
        detalle: this.detalle,
        monto: this.monto
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.detalle = ''
        this.monto = 0;
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormCobroMatricula.validate())
        this.registrarCobro();
    }
  }
}
</script>

<style scoped>

</style>
