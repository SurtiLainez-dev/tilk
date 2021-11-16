<template>
<v-card flat>
  <v-form class="ma-2" ref="FormAnticipoNuevo">
    <v-card-title>Creando Anticipo Nuevo</v-card-title>
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="5">
        <v-text-field class="ma-3" label="Identidad o rtn del cliente" dense v-model="anticipo.id"
                      @keyup.enter="buscarCliente" :loading="loadCliente" loader-height="3"
                      persistent-hint hint="Presione enter para empezar la busqueda"></v-text-field>
      </v-col>
      <v-col>
        <v-text-field dense class="ma-3" v-model="anticipo.nombre_cliente" :rules="[rules.motivo.req]"
                      label="Nombre completo del cliente" disabled></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="9">
        <v-text-field dense class="ma-3" label="Motivo del anticipo" :rules="[rules.motivo.req, rules.motivo.min]"
                      v-model="anticipo.motivo" counter></v-text-field>
      </v-col>
      <v-col>
        <v-text-field dense class="ma-3" label="Total" suffix="lps"
                      v-model="anticipo.monto" :rules="[rules.efectivo.min]"></v-text-field>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-autocomplete dense label="Forma de pago" v-model="anticipo.forma_pago" :loading="loadFormaPago"
                        @change="cargarCcCuentasBancos" :rules="[rules.motivo.req]"
                        :items="formas_pagos" class="ma-3" :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
      </v-col>
      <v-col>
        <v-autocomplete class="ma-3" dense label="Seleccionar cuenta" :items="ccCuentasB"
                        :loading="loadbancos" v-model="anticipo.banco_id"
                        :disabled="!isDeposito" :item-value="'id'" :item-text="'nombre'"></v-autocomplete>
      </v-col>
    </v-row>
    <v-file-input dense label="Comprobante" class="ma-3" v-model="anticipo.file"></v-file-input>
    <v-divider></v-divider>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" small tile dark @click="validarForm">Crear Anticipo</v-btn>
    </v-card-actions>
  </v-form>
</v-card>
</template>

<script>
export default {
  name: "anticipos",
  created() {
    this.cargarFormaPago();
  },
  data(){
    return{
      isDeposito: false,
      search: '',
      rules:{
        motivo: {
          req: v => !!v || 'Campo requerido',
          min:  v => v.length > 10|| 'El motivo tiene que ser mayor a 10 carácteres'
        },
        efectivo:{
          min: v => v > 0 || 'No puede ser menor que el total que se distribuyó',
        }
      },
      anticipo:{
        cliente_id: '',
        motivo:     '',
        file:       null,
        monto:      0,
        forma_pago: 0,
        nombre_cliente: '',
        id: '',
        banco_id: '',
        identidad_cliente: null
      },
      formas_pagos:  [],
      loadCliente:   false,
      loadFormaPago: true,
      loadbancos:    false,
      ccCuentasB:    []
    }
  },
  computed:{
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
    SUCURSAL_ID(){
      return this.$store.state.sucursal;
    },
  },
  methods:{
    cargarCcCuentasBancos(){
      if (this.ccCuentasB.length === 0){
        if (this.anticipo.forma_pago === 2 || this.anticipo.forma_pago === 4){
          this.isDeposito = true;
          this.loadbancos = true;
          this.$axios.get('contabilidad/2.0/cargando_cuentas/1113').then((res)=>{
            this.ccCuentasB   = res.data.cuentas;
            this.loadbancos = false
          });
        }else{
          this.isDeposito = false;
          this.anticipo.banco_id = ''
        }
      }else{
        this.isDeposito        = this.anticipo.forma_pago === 2 || this.anticipo.forma_pago === 4;
        this.anticipo.banco_id = '';
      }
    },
    buscarCliente(){
      this.loadCliente = true;
      this.$axios.get('cliente_segumiento/'+this.anticipo.id).then((res)=>{
        if (res.data.cliente){
          this.anticipo.nombre_cliente = res.data.cliente.nombres+' '+res.data.cliente.apellidos;
          this.anticipo.cliente_id     = res.data.cliente.id;
          this.$store.commit('notificacion',{texto:'Datos cargados exitasamente',color:'success'});
          this.anticipo.identidad_cliente = res.data.cliente.identidad;
        }else{
          this.anticipo.nombre_cliente = '';
          this.anticipo.cliente_id     = '';
          this.$store.commit('notificacion',{texto:'El cliente no existe. Tienes que crear el cliente',color:'warning'});
          this.anticipo.identidad_cliente = null;
        }
        this.loadCliente = false;
      });
    },
    cargarFormaPago(){
      this.$axios.get('forma_pagos').then((res)=>{
        this.formas_pagos  = res.data.formas;
        this.loadFormaPago = false;
      })
    },
    registrarAnticipo(){
      let data = new FormData();
      this.$store.commit('activarOverlay', true);
      data.append('cliente_id',  this.anticipo.cliente_id);
      data.append('motivo',      this.anticipo.motivo);
      data.append('total',       this.anticipo.monto);
      data.append('sucursal_id', this.SUCURSAL_ID);
      data.append('caja_id',     this.CAJA.id);
      data.append('forma_pago',  this.anticipo.forma_pago);
      data.append('archivo',     this.anticipo.file);
      data.append('ccBanco',     this.anticipo.banco_id);

      this.$axios({
        method: 'post',
        url:    'caja/anticipo',
        data:    data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto:res.data.msj, color:'success'});
        this.$store.commit('caja/cambiar_VISTA', 1);
        this.solicitarClave(res.data.recibo);
      }).catch((error)=>{
        this.$store.commit('notificacion', {texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    solicitarClave(recibo){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('solicitar_clave_doucmento').then((res)=>{
        // this.print_DXC(res.data.clave, recibo);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      });
    },
    validarForm(){
      if (this.$refs.FormAnticipoNuevo.validate() && this.anticipo.identidad_cliente) {
        if (this.isDeposito) {
          if (this.anticipo.banco_id && this.anticipo.file) {
            this.registrarAnticipo();
          }else{
            this.$store.commit('notificacion',{texto:'No haz seleccionado una cuenta de banco, o te falta adjuntar un comprobante', color:'warning'});
          }
        }else{
          this.registrarAnticipo();
        }
      }else
        this.$store.commit('notificacion',{texto:'Hay datos incompletos', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
