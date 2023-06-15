<template>
  <v-card flat>
    <v-row no-gutters>
      <v-col cols="9">
        <v-toolbar flat dense>
          <v-card-title>Clientes</v-card-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field dense class="ma-2" label="Buscar ..." v-model="search"></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table class="rowsTable"
                      :search="search"
                      v-model="cuenta"
                      :loading="LOAD"
                      show-select
                      :single-select="true"
                      dense
                      :headers="header"
                      :items="CUENTAS">
        </v-data-table>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-toolbar dense flat><v-card-title>Datos del depósito</v-card-title></v-toolbar>
        <v-divider></v-divider>
        <v-form ref="FormDepositoCliente">
          <v-text-field v-if="cuenta.length > 0" class="ma-2" dense :value="cuenta[0].nombres+' '+cuenta[0].apellidos" label="Nombre Completo" disabled></v-text-field>
          <v-text-field v-else class="ma-2" dense  label="Nombre Completo" disabled></v-text-field>
          <v-text-field v-if="cuenta.length > 0" class="ma-2" dense :value="cuenta[0].cod" label="# de Cuenta" disabled></v-text-field>
          <v-text-field v-else class="ma-2" dense label="# de Cuenta" disabled></v-text-field>

          <v-dialog ref="dialogFechaPago" v-model="deposito.dialogoFecha" persistent width="290px"
                    :return-value.sync="deposito.fecha">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :rules="[rules.deposito.req]" v-model="deposito.fecha" label="Fecha del Depósito" dense
                            v-bind="attrs" class="ma-2" v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="deposito.fecha" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="deposito.dialogoFecha = false">Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.dialogFechaPago.save(deposito.fecha)">OK</v-btn>
            </v-date-picker>
          </v-dialog>

          <v-text-field :rules="[rules.deposito.req]" class="ma-2" label="Monto Depósitado"
                        v-model="deposito.monto" dense suffix="lps"></v-text-field>
          <v-text-field :rules="[rules.deposito.req, rules.deposito.min, rules.deposito.max]"
                        class="ma-2" label="Referencia" v-model="deposito.referencia" dense ></v-text-field>
          <v-file-input :rules="[rules.deposito.req]" class="ma-2" label="Documento" accept="image/*, application/pdf"
                        v-model="deposito.file" dense></v-file-input>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="validarForm" color="indigo" small tile dark>Registrar Depósito</v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "deposito",
  data(){
    return{
      search: '',
      cuenta: [],
      deposito:{
        fecha: '',
        referencia: '',
        monto: 0,
        file: null,
        dialogoFecha: false
      },
      rules:{
        deposito:{
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        }
      },
      header:[
        {text:'Cuenta', value:'cod'},
        {text:'Nombres', value:'nombres'},
        {text:'Apellidos', value:'apellidos'},
        {text:'Identidad', value:'identidad'},
      ]
    }
  },
  created() {
    this.$store.commit('caja/cargar_CUENTAS')
  },
  computed:{
    CUENTAS(){
      return this.$store.state.caja.CUENTAS;
    },
    LOAD(){
      return this.$store.state.caja.LOAD_CUENTAS;
    },
    CAJA(){
      return this.$store.state.caja.CAJA;
    },
  },
  methods:{
    registrarForm(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      data.append('file', this.deposito.file);
      data.append('venta_id', this.cuenta[0].id);
      data.append('caja_id', this.CAJA.id);
      data.append('fecha', this.deposito.fecha);
      data.append('monto', this.deposito.monto);
      data.append('referencia', this.deposito.referencia);
      this.$axios({
        url: 'caja/deposito_cliente',
        method: 'post',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('caja/cambiar_VISTA', 1);
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false)
      })
    },
    validarForm(){
      if (this.$refs.FormDepositoCliente.validate() && this.cuenta)
        this.registrarForm()
    }
  }
}
</script>

<style scoped>
.bordes{
  border: solid 1px #000000 ;
}
</style>
