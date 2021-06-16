<template>
  <v-card flat class="ma-1">
    <v-row no-gutters>
      <v-col cols="3">
        <v-card class="ma-5" >
          <v-subheader>INFORMACIÓN DEL CHEQUE</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Correlativo</v-list-item-title>
              <v-list-item-subtitle>{{CHEQUE.numeracion}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Estado</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="CHEQUE.estado === 1 ">Disponible</span>
                <span v-else-if="CHEQUE.estado === 2 ">Usado</span>
                <span v-else-if="CHEQUE.estado === 3 ">Entregado</span>
                <span v-else-if="CHEQUE.estado === 4 ">Nulo</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader>INFORMACIÓN DE LA CUENTA CONTABLE</v-subheader>
          <v-progress-linear indeterminate v-if="loadccCuentaBanco"></v-progress-linear>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Cuenta Contable</v-list-item-title>
              <v-list-item-subtitle>{{ccCuentaBanco.nombre}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Código de la Cuenta Contable</v-list-item-title>
              <v-list-item-subtitle>{{ccCuentaBanco.cod}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Total de la Cuenta Contable</v-list-item-title>
              <v-list-item-subtitle v-if="ccCuentaBanco">L {{int.format(ccCuentaBanco.total)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-subheader>INFORMACIÓN DE LA CUENTA DEL BANCO</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Total de la Cuenta</v-list-item-title>
              <v-list-item-subtitle v-if="ccCuentaBanco">L {{int.format(CUENTA.total)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Banco</v-list-item-title>
              <v-list-item-subtitle v-if="ccCuentaBanco">{{CUENTA.banco.nombre}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="9">
        <v-row>
          <v-col>
            <v-card class="ma-2">
              <v-simple-table height="250px">
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th>Cod.</th>
                    <th>Nombre</th>
                    <th>Cod. Dep.</th>
                    <th>Sub-CCS</th>
                    <th>Seleccionar</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-if="nivel === 0 && (item.cod === 21 || item.cod === 22)" v-for="item in CUENTAS">
                    <td>{{item.cod}}</td>
                    <td>{{item.nombre}} [<strong>L {{int.format(item.total)}}</strong>]</td>
                    <td><b-link @click="acomodarCuentas(item.cod_dep, 0)">{{item.cod_dep}}</b-link></td>
                    <td><b-link @click="acomodarCuentas(item.cod, 1)">Ver</b-link></td>
                  </tr>
                  <tr v-if="nivel > 0" v-for="item in ccs">
                    <td>{{item.cod}}</td>
                    <td>{{item.nombre}} [<strong>L {{int.format(item.total)}}</strong>]</td>
                    <td><b-link @click="acomodarCuentas(item.cod_dep, 0)">{{item.cod_dep}}</b-link></td>
                    <td><b-link @click="acomodarCuentas(item.cod, 1)">Ver</b-link></td>
                    <td><b-link @click="capturarCC(item)">Seleccionar</b-link></td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="ma-2">
              <v-form ref="FormRegistroChequePartida">
                <v-subheader>INFORMACIÓN DE LA CUENTA A ACRÉDITAR</v-subheader>
                <v-row>
                  <v-col cols="3">
                    <v-text-field class="ma-2" label="Código de la Cuenta" :rules="[rules.req]"
                                  dense disabled v-model="Cheque.cc_cod"></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field class="ma-2" label="Nombre de la Cuenta" :rules="[rules.req]"
                                  dense disabled v-model="Cheque.cc_nombre"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field class="ma-2" label="Total de la Cuenta"
                                  dense disabled suffix="lps" v-model="Cheque.cc_total"></v-text-field>
                  </v-col>
                </v-row>
                <v-subheader>INFORMACIÓN DEL CHEQUE</v-subheader>
                <v-row>
                  <v-col cols="9">
                    <v-text-field dense class="ma-2" label="Detalle del Cheque"
                                  :rules="[rules.req, rules.max]"
                                  v-model="Cheque.detalle"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field dense class="ma-2" label="Total del Cheque"
                                  :rules="[rules.req]"
                                  v-model="Cheque.total" suffix="lps"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="9">
                    <v-text-field dense class="ma-2" label="Comentario de la Partida"
                                  :rules="[rules.req, rules.max]"
                                  v-model="Cheque.comentario"></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-dialog ref="dialogFechaUsoCheque" v-model="Cheque.dialogoFecha" persistent width="290px"
                              :return-value.sync="Cheque.fecha">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="Cheque.fecha" label="Fecha de Uso del Cheque"
                                      :rules="[rules.req]" dense class="ma-2" v-bind="attrs" v-on="on"></v-text-field>
                      </template>
                      <v-date-picker v-model="Cheque.fecha" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="Cheque.dialogoFecha = false">Cancelar</v-btn>
                        <v-btn text color="primary" @click="$refs.dialogFechaUsoCheque.save(Cheque.fecha)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <v-card-actions class="d-flex justify-end">
                  <v-btn small dark tile color="success" @click="validarForm">Registrar Partida</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog width="25%" v-model="dialogoVerificar">
      <v-card>
        <v-card-title>Verificación de Partida</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          Estas a punto de crear una partida con una cantidad de {{Cheque.total}} lps;
          si estás de acuerdo con el monto antes mencionado preciona el botón de proceder y aceptas toda las
          responsabilidad de crear esta partida; sí quiere volver a revisar los datos presiona el botón de cerrar.
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn tile dark color="orange" @click="dialogoVerificar = false" small>Cerrar</v-btn>
          <v-btn tile dark color="success" @click="registrarPartida" small>Proceder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "cheque",
  computed:{
    CHEQUE(){
      return this.$store.state.contabilidad.cheques.CHEQUE;
    },
    CUENTA(){
      return this.$store.state.contabilidad.cheques.CUENTA;
    },
    CUENTAS(){
      return this.$store.state.contabilidad.catalogo.CUENTAS;
    },
    LOAD(){
      return this.$store.state.contabilidad.catalogo.LOADCUENTAS;
    },
  },
  data(){
    return{
      dialogoVerificar:   false,
      int: new Intl.NumberFormat(),
      loadccCuentaBanco:  false,
      ccCuentaBanco:      {},
      loadccDependientes: false,
      ccs:                [],
      nivel:              0,
      Cheque:             {
        detalle:      '',
        total:        0,
        fecha:        '',
        observacion:  '',
        comentario:   '',
        cc_id:        '',
        cc_nombre:    '',
        cc_cod:       '',
        cc_total:     '',
        dialogoFecha: false
      },
      rules:               {
        req: v => !!v || 'Campo requerido',
        max: v => v.length <= 75 || 'Tiene que ser menor a 60 letras'
      },
    }
  },
  created() {
    this.$store.commit('activarOverlay', false);
    this.cargarCCCuentaBanco();
    this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
    this.$store.commit('guardarTitulo', 'Contabilidad > Cuenta de Cheque > '+this.CUENTA.num+' > CHEQUE > '+this.CHEQUE.numeracion)
  },
  methods:{
    acomodarCuentas(cod, tipo){
      if (tipo === 1){
        let cuentas = this.CUENTAS.filter(i=>i.cod_dep === cod);
        if (cuentas.length > 0)
          this.ccs = cuentas;

        this.nivel++;
      }else if (tipo === 0){
        if (this.nivel > 0){
          let cc = this.CUENTAS.filter(i=>i.cod === cod);
          this.ccs = this.CUENTAS.filter(i=>i.cod_dep === cc[0].cod_dep);
          this.nivel--;
        }
      }
    },
    cargarCCCuentaBanco(){
      this.loadccCuentaBanco = true;
      this.$axios.get(`contabilidad/2.0/cargar_cuenta/cod_dep/1113/tabla/cuenta_bancos/id/${this.CUENTA.id}`).then((res)=>{
        this.ccCuentaBanco     = res.data.cc;
        this.loadccCuentaBanco = false;
      })
    },
    capturarCC(data){
      this.Cheque.cc_id     = data.id;
      this.Cheque.cc_nombre = data.nombre;
      this.Cheque.cc_cod    = data.cod;
      this.Cheque.cc_total  = data.total;
      this.Cheque.total     = data.total;
    },
    registrarPartida(){
      this.dialogoVerificar = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/2.0/cuenta/cheques/uso/partida/',{
        cuentaBanco_id: this.CUENTA.id,
        total:          this.Cheque.total,
        comentario:     this.Cheque.comentario,
        cheque_id:      this.CHEQUE.id,
        detalle:        this.Cheque.detalle,
        fecha_uso:      this.Cheque.fecha,
        ccCuentaBanco:  this.ccCuentaBanco.id,
        ccCuenta:       this.Cheque.cc_id
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('contabilidad/cheques/cargar_CHEQUES', this.CUENTA);
        this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', 1);
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        if (error.response.status === 422) {
          this.$store.commit('notificacion', {texto: error.response.data.msj, color: 'error'});
          this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', 1);
        }else {
          this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color: 'error'});
        }
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormRegistroChequePartida.validate())
        this.dialogoVerificar = true;
      else
        this.$store.commit('notificacion',{texto:'Tienes datos pendientes en el formulario', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
