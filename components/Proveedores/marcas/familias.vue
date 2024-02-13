<template>
    <v-container>
      <v-row>
        <v-col cols="8"><v-card-title>Familias Existentes</v-card-title></v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn color="orange" @click="nuevaFamilia" class="text-white" small :disabled="!PERMISOS.includes(36)">Agregar Familia</v-btn>
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
                          label="Nombre de la Familia" dense required :counter="60"></v-text-field>
            <v-card v-if="Familia.img" flat tile class="d-flex justify-center">
              <v-img
                     :lazy-src="Familia.img"
                     max-height="150"
                     max-width="250"
                     :src="Familia.img"
              ></v-img>
            </v-card>
            <v-divider></v-divider>
            <v-file-input v-model="img" dense label="Foto de Presentación"></v-file-input>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="orange" text small @click="usoSide = false" tile dark class="ma-2">Cerrar</v-btn>
                <v-btn color="orange" small @click="editandoFamilia" v-if="sideFamilia" tile dark class="ma-2">Registrar Cambios</v-btn>
                <v-btn color="orange" small  @click="registrarFamilia" v-else dark tile class="ma-2">Registrar Familia</v-btn>
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
    computed:{
      PERMISOS(){
        let permisos = this.$store.state.permisosUser.split(',');
        let per = [];
        if (permisos.length > 1){
          permisos.forEach((item)=>{
            per.push(parseInt(item))
          })
          return per;
        }else
          return [];
      },
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
          familia: null,
          img: null
        },
        errorInput: false,
        sideFamilia: false,
        erroresServidor:{},
        img: null
      }
    },
    methods:{
      editarFamilia(item){
        this.tituloSide = 'Editando familia '+item.nombre;
        this.usoSide = true
        this.Familia.nombre  = item.nombre
        this.Familia.codigo  = item.codigo
        this.Familia.familia = item.id
        this.Familia.img     = item.img;
        this.sideFamilia = true
      },
      editandoFamilia(){
        if (this.$refs.FormFamilia.validate()) {
          this.overlay = true
          this.usoSide = false
          let data = new FormData();
          data.append('nombre', this.Familia.nombre);
          data.append('img', this.img);
          data.append('id', this.Familia.familia)

          this.$axios({
            url: 'familia/edit',
            method: 'post',
            data: data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            this.$fetch()
            this.overlay = false
            Swal.fire(
                'Registro Exitoso',
                `La familia ${this.Familia.nombre} se guardado exitosamente en la base de datos`,
                'success'
            )
            this.Familia.nombre = ''
            this.Familia.codigo = ''
            this.Familia.familia = ''
          }).catch((error)=>{
            this.usoSide = true
            this.overlay = false
            if (error.response.status === 422){
              this.erroresServidor = error.response.data.errors
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
          let data = new FormData();
          data.append('nombre', this.Familia.nombre);
          data.append('codigo', this.Familia.codigo);
          data.append('img', this.img);
          this.$axios({
            url: 'familias',
            method: 'post',
            data: data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            this.$fetch()
            this.overlay = false
            Swal.fire(
                'Registro Exitoso',
                `La familia ${this.Familia.nombre} se guardado exitosamente en la base de datos`,
                'success'
            )
            this.Familia.nombre = ''
            this.Familia.codigo = ''
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
      this.Familias  =(await this.$axios.get('/familias')).data.familias
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>

