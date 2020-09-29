<template>
    <v-container>
      <v-row>
        <v-col cols="8"><v-card-title>Familias Existentes</v-card-title></v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn color="orange" @click="nuevaFamilia" dark small>Agregar Familia</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-progress-linear indeterminate color="green" v-if="$fetchState.pending"></v-progress-linear>
      <v-container v-else>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar familia" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header" :items="Familias" :search="search" class="rowsTable">
          <template v-slot:item.id="{item}">
            <v-btn @click="editarFamilia(item)" x-small color="warning" fab>
              <v-icon>fa fa-pen</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>

      <v-dialog v-model="usoSide" width="500px">
        <v-card class="pl-5 pr-5">
          <v-card-title>{{tituloSide}}</v-card-title>
          <v-divider></v-divider>
          <v-form ref="FormFamilia">
            <v-text-field v-model="Familia.nombre" :rules="[rule.required, rule.min, rule.max]"
                          label="Nombre de la Familia" required :counter="60"></v-text-field>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="orange" small @click="editandoFamilia" v-if="sideFamilia" dark>Registrar Cambios</v-btn>
                <v-btn color="orange" small  @click="registrarFamilia" v-else dark>Registrar Familia</v-btn>
              </v-col>
            </v-row>
            <Errores422 v-if="erroresServidor" :errores="erroresServidor"/>
          </v-form>
        </v-card>
      </v-dialog>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import Errores422 from "../../Errores422";
  import Swal from 'sweetalert2'
  export default {
    name: "familias",
    components:{
      Errores422
    },
    data(){
      return{
        rule:{
          required: value => !!value || 'Campo requerido',
          min: v => (v && v.length >= 2) || 'Debe ingresar mínimo 2 carácteres',
          max: v => (v && v.length <= 60) || 'Ingresar máximo 60 carácteres',
        },
        search: '',
        overlay: false,
        header:[
          {text:'Nombre', value:'nombre'},
          {text:'Código', value:'codigo'},
          {text:'Estado', value:'id'},
        ],
        isPeticion: false,
        isPeticionSave: false,
        Familias: [],
        tituloSide: null,
        usoSide: false,
        Familia:{
          nombre: '',
          codigo: '',
          familia: null
        },
        errorInput: false,
        sideFamilia: false,
        erroresServidor:{}
      }
    },
    methods:{
      editarFamilia(item){
        this.tituloSide = 'Editando familia '+item.nombre;
        this.usoSide = true
        this.Familia.nombre = item.nombre
        this.Familia.codigo = item.codigo
        this.Familia.familia = item.id
        this.sideFamilia = true
      },
      editandoFamilia(){
        if (this.$refs.FormFamilia.validate()) {
          this.overlay = true
          this.usoSide = false
          this.$axios.put('familia/'+this.Familia.familia,{
            nombre: this.Familia.nombre
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$fetch()
              this.overlay = false
              Swal.fire(
                'Registro de Cambios Exitoso',
                `El cambio de la familia ${this.Familia.nombre} se registro exitosamente en la base de datos`,
                'success'
              )
              this.Familia.nombre = ''
              this.Familia.codigo = ''
              this.Familia.familia = ''
            }
          })
        }
      },
      nuevaFamilia(){
        this.tituloSide = 'Creando una nueva familia';
        this.Familia.codigo = ''
        this.Familia.nombre = ''
        this.sideFamilia = false
        this.usoSide = true
      },
      registrarFamilia(){
        if (this.$refs.FormFamilia.validate()){
          this.usoSide = false
          this.overlay = true
          this.$axios.post('familias',{
            nombre: this.Familia.nombre,
            codigo: this.Familia.codigo
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$fetch()
              this.overlay = false
              Swal.fire(
                'Registro Exitoso',
                `La familia ${this.Familia.nombre} se guardado exitosamente en la base de datos`,
                'success'
              )
              this.Familia.nombre = ''
              this.Familia.codigo = ''
            }
          }).catch((error)=>{
            this.usoSide = true
            this.overlay = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
            }
          })
        }else{
          this.errorInput = true
        }
      },
    },
    async fetch (){
      this.Familias  =(await this.$axios.get('/familias', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.familias
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>

