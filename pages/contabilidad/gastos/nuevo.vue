<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <h6>Gasto Nuevo</h6>
    </v-toolbar>
    <br>
    <v-card class="d-flex justify-center" flat>
      <v-card color="grey lighten-4" flat width="50%">
        <v-card-title>Creando Nuevo Gasto</v-card-title>
        <v-divider></v-divider>
        <v-form class="ma-2" v-on:submit.prevent ref="FormNuevoGasto">
          <v-text-field label="Nombre de la Cuenta" :rules="rule" counter dense class="ma-2" v-model="gastos.nombre"></v-text-field>
          <v-autocomplete label="Seleccionar Sucursal" :items="sucursales.data" :item-text="'nombre'" :item-value="'id'"
                          :rules="req" dense class="ma-2" v-model="gastos.sucursal" :loading="sucursales.load"></v-autocomplete>
          <v-divider></v-divider>
          <v-card-text>Seleccionar una cuenta del catalogo</v-card-text>
          <v-progress-linear indeterminate v-if="LOAD"></v-progress-linear>
          <v-simple-table class="grey lighten-5" height="200px">
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
              <tr v-if="nivel === 0 && item.cod === 4" v-for="item in CUENTAS">
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

          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col cols="3">
              <v-text-field class="ma-2" label="Código del Gasto" :rules="req" disabled v-model="gastos.cod"></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-text-field class="ma-2" label="Nombre de la Cuenta Contable Asociada" :rules="rule" disabled v-model="gastos.cc_nombre"></v-text-field>
            </v-col>
          </v-row>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark small tile @click="validarForm">Registrar Gasto</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "nuevo",
  data(){
    return{
      int: new Intl.NumberFormat(),
      gastos:{
        nombre:      '',
        cc_id:       '',
        cod:         '',
        cc_nombre:   '',
        sucursal:    '',
        cc_sucursal: ''
      },
      sucursales: {
        data: [],
        load: true
      },
      ccs: [],
      nivel: 0,
      rule:[
        value => !!value || 'Campo requerido',
        value => (value.length <= 100) || 'No puede ser mayor a 100 letras'
      ],
      req:[
        value => !!value || 'Campo requerido',
      ]
    }
  },
  created() {
    this.$store.commit('guardarTitulo','Contabilidad > Gastos > Nuevo');
    this.cargarSucursales();
    this.$store.commit('contabilidad/catalogo/cargar_CUENTAS');
  },
  computed:{
    CUENTAS(){
      return this.$store.state.contabilidad.catalogo.CUENTAS;
    },
    LOAD(){
      return this.$store.state.contabilidad.catalogo.LOADCUENTAS;
    },
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
    capturarCC(data){
      this.gastos.cc_id       = data.id;
      this.gastos.cc_nombre   = data.nombre;
      this.gastos.cod         = data.cod;
      this.gastos.cc_sucursal = data.referencia_id;
    },
    cargarSucursales(){
      this.$axios.get('/sucursales').then((res)=>{
        this.sucursales.data = res.data.suc;
        this.sucursales.load = false;
      })
    },
    registrarGasto(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('contabilidad/gastos',{
        nombre:      this.gastos.nombre,
        cc_id:       this.gastos.cc_id,
        cod:         this.gastos.cod,
        sucursal_id: this.gastos.sucursal,
        sucursal_cc: this.gastos.cc_sucursal
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj,color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$router.replace({path:'/contabilidad/gastos/'});
      }).catch((error)=>{
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'error'});
        else
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});

        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoGasto.validate())
        this.validarSuc();
    },
    validarSuc(){
      if (parseInt(this.gastos.cc_sucursal) === parseInt(this.gastos.sucursal))
        this.registrarGasto();
      else
        this.$store.commit('notificacion',{texto:'La sucursal de la cuenta de catalogo, con la sucursal del gasto, no coinciden', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>
