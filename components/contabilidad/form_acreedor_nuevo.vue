<template>
  <v-dialog v-model="DIALOGO" width="40%">
    <v-card>
      <v-card-title>{{titulo}}</v-card-title>
      <v-divider></v-divider>
      <v-form ref="FormNuevoAcreedor" class="ma-2 pa-2">
        <v-row>
          <v-col>
            <v-text-field label="Nombre Completo" :rules="[rule.req, rule.nombre.min, rule.nombre.max]"
                          v-model="NOMBRE" class="ma-2" counter dense :disabled="TIPO === 2"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Identificacion" persistent-hint height="Puede ser numero de telefono, rtn o identidad"
                          :rules="[rule.req, rule.nombre.min, rule.nombre.maxI]" :disabled="TIPO === 2"
                          v-model="IDENTIFICACION" class="ma-2" dense counter></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-autocomplete label="Banco" :items="Bancos" :item-value="'id'" :item-text="'nombre'"
                            class="ma-2" dense v-model="banco_id" :loading="loadBancos"></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field label="Numero de cuenta" counter
                          v-model="numero" class="ma-2" dense></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" small tile text dark @click="cerrarDialogo">Cerrar</v-btn>
        <v-btn color="success" small tile dark @click="validarForm">Registrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "form_acreedor_nuevo",
  created() {
    this.titulo = this.TIPO === 1 ? 'Creando Nuevo Acreedor' : 'Agregando Cuenta al Acreedor';
    this.cargarBancos();
  },
  props:{
    edicion: Boolean,
    id: Number
  },
  computed:{
    DIALOGO:{
      get: function (){
        return this.$store.state.contabilidad.acreedores.DIALOGO;
      },
      set: function (val){
        return this.$store.commit('contabilidad/acreedores/setDIALOGO', val);
      }
    },
    NOMBRE:{
      get: function (){
        return this.$store.state.contabilidad.acreedores.NOMBRE;
      },
      set: function (val){
        return this.$store.commit('contabilidad/acreedores/setNOMBRE', val);
      }
    },
    IDENTIFICACION:{
      get: function (){
        return this.$store.state.contabilidad.acreedores.IDENTIFICACION;
      },
      set: function (val){
        return this.$store.commit('contabilidad/acreedores/setIDENTIFICACION', val);
      }
    },
    TIPO:{
      get: function (){
        return this.$store.state.contabilidad.acreedores.TIPO;
      },
      set: function (val){
        return this.$store.commit('contabilidad/acreedores/aetTipo', val);
      }
    },
  },
  data(){
    return{
      titulo: '',
      rule: {
        req: v => !!v || 'Campo requerido',
        nombre: {
          min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
          max: v => (v && v.length <= 100) || 'Tiene que ser menor o igual a 100 carácteres.',
          maxI: v => (v && v.length <= 15) || 'Tiene que ser menor o igual a 15 carácteres.',
        },
      },
      banco_id: 0,
      numero: '',
      Bancos: [],
      loadBancos: true
    }
  },
  methods:{
    cargarBancos(){
      this.$axios.get('bancos').then((res)=>{
        this.Bancos     = res.data.bancos;
        this.loadBancos = false;
      })
    },
    cerrarDialogo(){
      this.banco_id       = 0;
      this.numero         = 0;
      this.DIALOGO        = false;
      this.NOMBRE         = '';
      this.IDENTIFICACION = '';
      this.TIPO           = 1;
    },
    crearCuenta(){

    },
    registrarAcreedor(){
      this.$store.commit('activarOverlay', true);
      this.DIALOGO = false;
      this.$axios.post('contabilidad/acreedor',{
        nombre:         this.NOMBRE,
        identificacion: this.IDENTIFICACION,
        banco_id:       this.banco_id,
        num:            this.numero
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('contabilidad/acreedores/cargarACREEDORES');
        this.banco_id       = 0;
        this.numero         = 0;
        this.NOMBRE         = '';
        this.IDENTIFICACION = '';
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.DIALOGO = true;
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoAcreedor.validate()) {
        if (this.banco_id > 0){
          if (this.numero.length > 4 && this.numero.length <= 30) {
            if (this.TIPO === 1) {
              this.registrarAcreedor();
            }
          }else this.$store.commit('notificacion',{texto:'Como seleccionates un banco, tienes que colocar un numero de cuenta enrtre 4 y 30 carácteres', color:'warning'})
        }else if (this.TIPO === 1) this.registrarAcreedor();
      }
      else this.$store.commit('notificacion',{texto:'Tienes datos incompletos', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
