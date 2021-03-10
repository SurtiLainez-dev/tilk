<template>
<v-card flat class="d-flex justify-center">
  <v-card flat width="80%">
    <v-toolbar flat color="grey lighten-5">
      <h6>Marcas Existentes de Proveedores de Mobiliarios</h6>
      <v-spacer></v-spacer>
      <v-btn tile color="indigo" small dark @click="dialogoNuevo = true">Marca Nueva</v-btn>
    </v-toolbar>

    <v-data-table dense
                  :headers="header"
                  :items="MARCAS"
                  :loading="LOAD"
                  loading-text="Cargando Marcas"
                  class="rowsTable">
      <template v-slot:item.nombre="{item}">
        <b-form-input size="sm" v-model="item.nombre" :disabled="!item.is_modificar"></b-form-input>
      </template>
      <template v-slot:item.id="{item}">
        <v-btn x-small color="indigo" dark v-if="!item.is_modificar" @click="item.is_modificar = true">Habilitar Edición</v-btn>
        <v-btn x-small color="indigo" dark v-else  @click="item.is_modificar = false">Deshabilitar Edición</v-btn>
        <v-btn x-small color="success" class="text--white"
               :disabled="!item.is_modificar" @click="editar(item.nombre,item.id)">Editar</v-btn>
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialogoNuevo" width="30%">
    <v-card>
      <v-toolbar color="grey lighten-5">
        <h6>Creando Marca Nueva</h6>
      </v-toolbar>
      <v-form class="ma-5" ref="FormMobMarcaNueva">
        <v-text-field class="ma-1" :rules="rules" v-model="nombre_marca"
                      label="Nombre de la Marca" dense></v-text-field>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="warning" tile dark small @click="dialogoNuevo = false">Cerrar</v-btn>
        <v-btn color="success" tile dark small @click="validarForm">Registrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
export default {
  name: "marcas",
  data(){
    return{
      dialogoNuevo: false,
      nombre_marca: '',
      header:[
        {text:'Nombre de la Marca',value:'nombre'},
        {text:'Acciones',value:'id'},
      ],
      rules: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres',
      ],
    }
  },
  computed:{
    LOAD(){
      return this.$store.state.mob.familias.LOADMARCAS;
    },
    MARCAS(){
      let marcas = [];
      if (this.$store.state.mob.familias.MARCAS){
        this.$store.state.mob.familias.MARCAS.forEach((i)=>{
          marcas.push({
            nombre:       i.nombre,
            id:           i.id,
            is_modificar: false
          })
        })
      }
      return marcas;
    }
  },
  created() {
    this.$store.commit('mob/familias/cargar_MARCAS');
  },
  methods:{
    editar(nombre, id){
      this.$store.commit('activarOverlay', true);
      this.$axios.put('mob/marcas/'+id,{
        nombre: nombre,
        id:     id
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_MARCAS');
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },4500);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    registrar(){
      this.$store.commit('activarOverlay', true);
      this.dialogoNuevo = false;
      this.$axios.post('mob/marcas',{
        nombre: this.nombre_marca
      }).then((res)=>{
        this.$store.commit('mob/familias/cargar_MARCAS');
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.nombre_marca = '';
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        },4500);
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormMobMarcaNueva.validate())
        this.registrar();
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
