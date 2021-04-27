<template>
  <v-container class="pl-2 pr-2 d-flex justify-center">
    <v-card :height="CUENTAS.length > 4? '100%':'500px'" width="1000px" class="pl-2">
      <v-row>
        <v-col cols="7"><v-card-title>Bancos Afiliados</v-card-title></v-col>
        <v-col cols="5" class="d-flex justify-end">
          <v-btn class="ma-2" small outlined tile color="indigo" dark @click="abrirSideCuenta(2)">Crear Banco</v-btn>
          <v-btn class="ma-2" tile outlined small color="orange" dark @click="abrirSideCuenta(1)">Crear Cuenta</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="4">
          <v-text-field v-model="search" append-icon="mdi-magnify"
                        label="Buscar cuenta" single-line hide-details></v-text-field>
        </v-col>
      </v-row>
      <v-data-table :items-per-page="10" :items="CUENTAS" :search="search" @click:row="irCuenta"
                    :headers="header" :loading="LOAD_CUENTAS" class="rowsTable"
                    loading-text="Cargando cuentas... por favor espere un momento">
        <template v-slot:item.total="{item}">
          L. {{int.format(item.total)}}
        </template>
      </v-data-table>
    </v-card>


    <v-navigation-drawer v-model="side" right absolute height="98%" width="450px" id="side">
      <v-card class="pl-2 pr-2" height="100%" color="black" dark>
        <v-row>
          <v-col class="d-flex justify-start" cols="2">
            <v-btn color="red"  x-small dark @click="cerrarSide">x</v-btn>
          </v-col>
          <v-col cols="10">
            <small v-if="bancoNuevo"><strong>Creando Banco Nuevo</strong></small>
            <small v-else-if="cuentaNueva"><strong>Creando Cuenta Nueva</strong></small>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div class="pl-5 pr-5" v-if="bancoNuevo">
          <v-form ref="FormNuevoBanco">
            <v-text-field v-model="nombreBanco" :rules="[rule.required, rule.min, rule.max]"
                          label="Nombre del Banco" required :counter="50">
            </v-text-field>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="deep-orange" small @click="guardarBanco" dark>Registrar Banco</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>
        <div class="pl-5 pr-5" v-if="cuentaNueva">
          <v-form ref="FormNuevaCuentaBanco">
            <v-select v-model="cuenta.banco" :items="Bancos" :item-text="'nombre'"
                      :item-value="'id'" label="Banco" :rules="[rule.required]"></v-select>
            <v-select v-model="cuenta.tipo" :items="opcionesTipo" :item-text="'nombre'"
                      :item-value="'id'" label="Tipo de Cuenta" :rules="[rule.required]" ></v-select>
            <v-text-field v-model="cuenta.num" :rules="[rule.required, rule.min, rule.maxB]"
                          label="Número de Cuenta" required :counter="30">
            </v-text-field>
            <v-text-field v-model="cuenta.descr" :rules="[rule.required, rule.min]"
                          hint="No escriba el número de cuenta"
                          label="Descripción de la Cuenta en el Catalogo Contable" required :counter="30">
            </v-text-field>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="deep-orange" small @click="registrarBanco" dark>Registrar Banco</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </div>

        <Errores422 v-if="erroresSer.length > 0" :errores="erroresSer"/>
      </v-card>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
  import Errores422 from "../../components/Errores422";
  import Swal from 'sweetalert2'
  export default {
    components:{Errores422},
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    name: "bancos",
    computed:{
      CUENTAS(){
        return this.$store.state.contabilidad.bancos.CUENTAS;
      },
      LOAD_CUENTAS(){
        return this.$store.state.contabilidad.bancos.LOADCUENTAS;
      }
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        overlay: false,
        opcionesTipo:[
          {'id':1, 'nombre': 'Ahorro'},
          {'id':2, 'nombre': 'Cheques'},
        ],
        side: false,
        rule:{
          required: value => !!value || 'Campo requerido',
          min: v => (v && v.length >= 3) || 'Debe ingresar mínimo 3 carácteres',
          max: v => (v && v.length <= 50) || 'Ingresar máximo 50 carácteres',
          maxB: v => (v && v.length <= 30) || 'Ingresar máximo 30 carácteres',
        },
        bancoNuevo: false,
        cuentaNueva: false,
        search: '',
        header:[
          {text:'Nombre del Banco', value:'banco.nombre'},
          {text:'Tipo de Cuenta', value:'tipo.nombre'},
          {text:'Número de Cuenta', value:'num'},
          {text:'Total', value:'total'},
        ],
        tiposCuenta: null,
        Bancos:      null,
        nombreBanco: '',
        cuenta:      {
          tipo:  '',
          num:   '',
          banco: '',
          descr: ''
        },
        erroresSer:  []
      }
    },
    created() {
      this.$store.commit('activarOverlay', false)
      this.$store.commit('guardarTitulo', 'Contabilidad > Bancos')
      this.$store.commit('contabilidad/bancos/cargar_CUENTAS');
      this.tipoCuenta();
      this.cargarBancos();
    },
    methods:{
      irCuenta(val){
        this.$store.commit('activarOverlay', true);
        this.$router.replace({path:'/contabilidad/bancos/cuentas/sl/'+val.id})
      },
      cerrarSide(){
        this.side = false
        this.bancoNuevo = false;
        this.cuentaNueva = false
      },
      abrirSideCuenta(val){
        this.side = true;
        if (val === 1)
          this.cuentaNueva = true
        else if (val === 2)
          this.bancoNuevo = true
      },
      registrarBanco(){
        if (this.$refs.FormNuevaCuentaBanco.validate()){
          this.side = false
          this.erroresSer = []
          this.overlay = true
          this.$axios.post('cuentas',{
            tipo:        this.cuenta.tipo,
            banco:       this.cuenta.banco,
            num:         this.cuenta.num,
            descripcion: this.cuenta.descr
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.overlay = false
              Swal.fire(
                'Cuenta Registrada',
                `La cuenta ${this.cuenta.num} se ha registrado exitosamente.`,
                'success'
              )
              this.$store.commit('contabilidad/bancos/cargar_CUENTAS');
              this.cuenta.tipo = '';
              this.cuenta.banco ='';
              this.cuenta.num = ''
            }
          }).catch((error)=>{
            this.overlay = false
            if (error.response.status === 422){
              this.erroresSer = error.response.data.errors
            }
          })
        }
      },
      guardarBanco(){
        if (this.$refs.FormNuevoBanco.validate()){
          this.side = false
          this.overlay = true
          this.$axios.post('bancos',{
            nombre: this.nombreBanco
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.overlay = false
              Swal.fire(
                'Banco Registrado',
                `El banco ${this.nombreBanco} se ha registrado exitosamente.`,
                'success'
              )
              this.nombreBanco = null;
              this.cargarBancos()
            }
          })
        }
      },
      cargarBancos(){
        this.$axios.get('bancos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Bancos = res.data.bancos
          }
        })
      },
      tipoCuenta(){
        this.isPeticion = true
        this.$axios.get('tipo_cuenta',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.isPeticion = false
          if (res.status === 200){
            this.tiposCuenta = res.data.tipos
          }
        })
      }
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
  #side{
    opacity: 0.8;
  }
</style>
