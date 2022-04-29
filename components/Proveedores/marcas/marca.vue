<template>
    <v-container>
      <v-row>
        <v-col cols="8"><v-card-title>Marcas Existentes</v-card-title></v-col>
        <v-col cols="4" class="d-flex align-center justify-end">
          <v-btn color="orange" @click="nuevaMarca" class="text-white" small :disabled="!PERMISOS.includes(35)">Agregar Marca</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-progress-linear indeterminate color="green" v-if="$fetchState.pending"></v-progress-linear>
      <v-container v-else>
        <v-row>
          <v-col cols="4">
            <v-text-field v-model="search" append-icon="mdi-magnify"
                          label="Buscar marca" single-line hide-details></v-text-field>
          </v-col>
        </v-row>
        <v-data-table :headers="header" :items="Marcas" :search="search"
                      class="rowsTable" :items-per-page="10">
          <template v-slot:item.proveedor.nombre="{item}">
            <v-avatar v-if="item.proveedor.logo" size="25"><img :src="item.proveedor.logo" alt="John"></v-avatar>
            <v-avatar size="25" v-else><v-icon>fa fa-user</v-icon></v-avatar>
            {{item.proveedor.nombre}}
          </template>
          <template v-slot:item.id="{item}">
            <v-btn @click="editarMarca(item)" x-small color="warning" fab>
              <v-icon>fa fa-pen</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="sideModelo" width="500">
          <v-card class="pl-5 pr-5">
            <v-card-title>{{tituloSide}}</v-card-title>
            <v-divider></v-divider>
            <v-form ref="FormMarca">
              <v-select v-model="marca.proveedor" :items="Proveedores" :item-text="'nombre'"
                        :item-value="'id'" label="Proveedores" :rules="[rule.required]"></v-select>
              <v-text-field v-model="marca.nombre" :rules="[rule.required, rule.min, rule.max]"
                            label="Nombre de la Marca" required :counter="60"></v-text-field>
              <v-row>
                <v-col class="d-flex justify-end">
                  <v-btn v-if="usoSide === 1" :disabled="disbaleSubmit" color="orange" @click="registrarMarca" class="text-white" small>Crear Marca</v-btn>
                  <v-btn v-if="usoSide === 2" :disabled="disbaleSubmit" @click="editandoMarca" color="orange" class="text-white" small>Registrar Cambios </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-dialog>

        <v-overlay :value="overlay">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
      </v-container>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    name: "marcas",
    watch: {
      overlay (val) {
        val && setTimeout(() => {
        }, 500)
      },
    },
    data(){
      return{
        rule:{
          required: value => !!value || 'Campo requerido',
          min: v => (v && v.length >= 2) || 'Debe ingresar mínimo 2 carácteres',
          max: v => (v && v.length <= 60) || 'Ingresar máximo 60 carácteres',
        },
        disbaleSubmit: false,
        overlay: false,
        search: '',
        header:[
          {text:'Proveedor', value:'proveedor.nombre'},
          {text:'Marca', value:'nombre'},
          {text:'Acciones', value:'id'},
        ],
        Marcas: [],
        sideModelo:false,
        tituloSide: null,
        isPeticion: false,
        marca:{
          proveedor: null,
          nombre: null,
          marca: null
        },
        Proveedores: null,
        isPeticionPrin: false,
        usoSide: null,
        errorEnvio: false
      }
    },
    methods:{
      editandoMarca(){
        if (this.$refs.FormMarca.validate()){
          this.overlay = true
          this.sideModelo = false
          this.disbaleSubmit = true;
          this.$axios.put('marcas_proveedor/'+this.marca.marca,{
            nombre: this.marca.nombre,
            proveedor: this.marca.proveedor
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.disbaleSubmit = false;
            if (res.status === 200){
              this.$fetch()
              this.overlay = false
              this.marca.proveedor = null
              this.marca.marca = null
              Swal.fire(
                'Cambios Registrados',
                `Se registraron los cambios en la marca ${this.marca.nombre}`,
                'success'
              )
            }
          })
        }
      },
      editarMarca(marca){
        this.tituloSide = 'Editando marca '+marca.nombre;
        this.usoSide = 2
        this.sideModelo = true
        this.marca.nombre = marca.nombre
        this.marca.proveedor = marca.proveedor.id
        this.marca.marca = marca.id
      },
      nuevaMarca(){
        this.tituloSide = 'Creando Marca Nueva';
        this.usoSide = 1
        this.sideModelo = true
      },
      registrarMarca(){
        if (this.$refs.FormMarca.validate()){
          this.sideModelo = false
          this.overlay = true
          this.disbaleSubmit = true;
          this.$axios.post('marcas_proveedor',{
            nombre: this.marca.nombre,
            proveedor: this.marca.proveedor
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.disbaleSubmit = false;
            if (res.status === 200){
              this.$fetch()
              this.marca.proveedor = null
              this.overlay = false
              Swal.fire(
                'Registro Exitoso',
                `Se ha registrado la marca ${this.marca.nombre} correctamente`,
                'success'
              )
              this.marca.nombre = null
            }
          })
        }
      },
      cargarProveedores(){
        this.isPeticionPrin = true
        this.$axios.get('proveedores',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Proveedores = res.data.proveedores
          }
        })
      },
    },
    mounted() {
      this.cargarProveedores()
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
    async fetch (){
      this.Marcas  =(await this.$axios.get('marcas_proveedor', {
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.marcas
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
