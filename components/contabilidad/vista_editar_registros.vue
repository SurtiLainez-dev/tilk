<template>
  <v-card flat class="d-flex justify-center">
    <v-card width="40%" class="ma-2">
      <v-card-title>Creando Registro Manual</v-card-title>
      <v-divider></v-divider>
      <v-form ref="FormNuevoRegistro">
        <v-row >
          <v-col>
            <v-text-field label="Total de la Cuenta" dense suffix="lps" disabled :value="data.total" class="ma-2"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Total" v-model="registro.total" :rules="[rule.req,rule.may]" type="number" dense suffix="lps" class="ma-2"></v-text-field>
          </v-col>
          <v-col>
            <v-select label="Tipo de Transacción" :items="tipos" :rules="rukeSelec"  dense class="ma-2" v-model="registro.tipo"></v-select>
          </v-col>
        </v-row>
        <v-textarea label="Detalle del Registro" dense class="ma-2" :rules="[rule.req]"  v-model="registro.detalle"></v-textarea>
        <v-divider></v-divider>
        <v-card-text>Esta acción va afectar todas las cuentas padres y sub-cuentas de la cuenta {{data.nombre}}.</v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" dark tile small @click="validarForm">Crear Registro</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-overlay :value="overlay">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: "vista_editar_registros",
  props: {data: Object},
  data(){
    return{
      overlay: false,
      registro:{
        total: 0,
        detalle: '',
        tipo: ''
      },
      rukeSelec:[
        v => (v === 0 || v === 1) || 'Campo requerido'
      ],
      rule:{
        req: v => !!v || 'Campo requerido',
        may: v => v > 0 || 'Tiene que ser mayor a 0'
      },
      int: new Intl.NumberFormat(),
      tipos:[
        {text:'Crédito  +', value: 0},
        {text:'Débito - ', value: 1},
      ]
    }
  },
  methods:{
    registrarRegistro(){
      this.overlay = true;
      this.$axios.post('contabilidad/2.0/registro_nuevo',{
        cc: this.data.id,
        tipo: this.registro.tipo,
        detalle: this.registro.detalle,
        total: this.registro.total
      }).then((res)=>{
        this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
        this.registro.detalle = '';
        this.registro.tipo    = 2;
        this.registro.total   = 0;
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'})
        this.$store.commit('notificacion',{texto:'Para ver la actualización tienes que cerrar la cuenta.', color:'success'})
        this.overlay = false;
        this.$store.commit('notificacion',{texto:'Cargando Catálogo', color:'success'})
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoRegistro.validate())
        this.registrarRegistro();
    }
  }
}
</script>

<style scoped>

</style>
