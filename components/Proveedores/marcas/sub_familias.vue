<template>
    <v-container>
      <v-row>
        <v-col cols="8"><v-card-title>Sub-familias Existentes</v-card-title></v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn color="orange" class="text-white" small @click="nuevaSub" :disabled="!PERMISOS.includes(36)">Agregar Sub-familia</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
<!--      <v-progress-linear indeterminate color="green" v-if="$fetchState.pending"></v-progress-linear>-->
      <v-container>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header" :search="search" class="rowsTable"
                      :loading="$fetchState.pending" loading-text="Cargando sub-familias"
                      :items="SubFamilias">
          <template v-slot:item.id="{item}">
            <v-btn @click="editarSubFamilia(item)" x-small color="warning" fab>
              <v-icon>fa fa-pen</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-container>

      <v-dialog v-model="sideUso" width="500">
        <v-card class="pl-5 pr-5">
          <v-card-title>{{sideTitulo}}</v-card-title>
          <v-divider></v-divider>
          <v-form ref="FormSubFamilia">
            <v-select v-model="SubFamilia.familia" :disabled="sideSubFamilia" :items="Familias" :item-text="'nombre'"
                      :item-value="'id'" label="Familia" :rules="[rule.required]"></v-select>
            <v-text-field v-model="SubFamilia.nombre" :rules="[rule.required, rule.min, rule.max]"
                          label="Nombre de la Sub-familia" required :counter="60"></v-text-field>
            <v-card v-if="SubFamilia.img" flat tile class="d-flex justify-center">
              <v-img
                  :lazy-src="SubFamilia.img"
                  max-height="150"
                  max-width="250"
                  :src="SubFamilia.img"
              ></v-img>
            </v-card>
            <v-file-input v-model="img" dense label="Foto de Presentación"></v-file-input>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn class="ma-2" color="orange"  @click="sideUso = false" dark small>Cerrar </v-btn>
                <v-btn class="ma-2" v-if="sideSubFamilia" color="orange"  @click="editandoSubFamilia" dark small>Registrar Cambios </v-btn>
                <v-btn class="ma-2" v-else @click="registrarSubFamilia" color="orange" dark small>Crear Sub-familia</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    name: "sub-familias",
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
        search: '',
        rule:{
          required: value => !!value || 'Campo requerido',
          min: v => (v && v.length >= 2) || 'Debe ingresar mínimo 2 carácteres',
          max: v => (v && v.length <= 60) || 'Ingresar máximo 60 carácteres',
        },
        overlay: false,
        header:[
          {text:'Nombre de la Familia', value:'familia_articulo.nombre'},
          {text:'Código de la Familia', value:'familia_articulo.codigo', align:'center'},
          {text:'Nombre de Sub-familia', value:'nombre'},
          {text:'Código de la Sub-familia', value:'codigo', align: 'center'},
          {text:'Acciones', value:'id'},
        ],
        isPeticion: false,
        SubFamilias: [],
        sideSubFamilia : false,
        sideUso: false,
        sideTitulo: null,
        SubFamilia:{
          nombre: '',
          familia: null,
          sub: '',
          img: null
        },
        Familias: null,
        isPeticionSave: false,
        errorInput: false,
        img: null
      }
    },
    mounted() {
      this.cargarFamilias();
    },
    methods:{
      nuevaSub(){
        this.sideTitulo = 'Creando una nueva sub-familia'
        this.SubFamilia.familia = null
        this.SubFamilia.nombre = ''
        this.SubFamilia.sub = ''
        this.sideSubFamilia = false
        this.sideUso = true
      },
      registrarSubFamilia(){
        if (this.$refs.FormSubFamilia.validate()){
          this.overlay = true
          this.sideUso = false
          let data = new FormData();
          data.append('familia', this.SubFamilia.familia);
          data.append('nombre', this.SubFamilia.nombre);
          data.append('img', this.img);
          this.$axios({
            url: 'sub_familias',
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
                `La familia ${this.SubFamilia.nombre} se guardado exitosamente en la base de datos`,
                'success'
            )
            this.SubFamilia.nombre = ''
            this.SubFamilia.codigo = ''
          })
        }else {
          this.errorInput = true
        }
      },
      editandoSubFamilia(){
        if (this.$refs.FormSubFamilia.validate()){
          this.overlay = true;
          this.sideUso = false
          let data = new FormData();
          data.append('familia', this.SubFamilia.familia);
          data.append('nombre',  this.SubFamilia.nombre);
          data.append('img',     this.img);
          data.append('id',      this.SubFamilia.sub);
          this.$axios({
            url: 'sub_familias/edit',
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
                `La familia ${this.SubFamilia.nombre} se guardado exitosamente en la base de datos`,
                'success'
            )
            this.SubFamilia.nombre = ''
            this.SubFamilia.codigo = ''
          })

        }else {
          this.errorInput = true
        }
      },
      editarSubFamilia(item){
        this.sideTitulo = `Editando sub-familia ${item.nombre}`
        this.SubFamilia.familia = item.familia_articulo.id
        this.SubFamilia.nombre = item.nombre
        this.SubFamilia.sub = item.id
        this.sideSubFamilia = true
        this.SubFamilia.img = item.img
        this.sideUso = true
      },
      cargarFamilias(){
        this.isPeticion = true
        this.$axios.get('/familias',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Familias = res.data.familias
            this.isPeticion = false
          }
        })
      },
    },
    async fetch(){
      this.SubFamilias  =(await this.$axios.get('/sub_familias', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.Sfamilias
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
