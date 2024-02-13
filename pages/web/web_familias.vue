<template>
  <v-card flat tile>
    <v-toolbar flat tile color="grey lighten-3">
      <v-toolbar-title>Editando Familias Visibles para la Web</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field label="Buscar..." v-model="search" dense></v-text-field>
    </v-toolbar>

    <v-data-table dense :headers="headers" :search="search" item-key="sub"
                  :items="Familias" :items-per-page="10" :loading="load" loading-text="Cargando familias ...">
      <template v-slot:item.is_online="{item}">
        <v-icon small color="success" dark v-if="item.is_online">fa fa-check</v-icon>
        <v-icon small color="red" dark v-else>fa fa-times</v-icon>
      </template>
      <template v-slot:item.online_sf="{item}">
        <v-checkbox dense v-model="item.online_sf"></v-checkbox>
      </template>
      <template v-slot:item.id="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn x-small fab color="pink" text v-on="on" v-bind="attrs" icon @click="addTop(item.sub)"><v-icon>fa fa-arrow-right</v-icon></v-btn>
          </template>
          <span>Agregar al Top 5</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="pink" small tile dark v-if="!load" class="ma-2" @click="dialogoTop = true">Ver Top 5</v-btn>
      <v-btn color="success" small tile dark v-if="!load" @click="editVisibilidadFamilias" class="ma-2">Actualizar Visibilidad de Familias</v-btn>
    </v-card-actions>

    <v-dialog width="40%" v-model="dialogoTop">
      <v-card>
        <v-card-title>Seleccionando Categorias Top</v-card-title>
        <v-divider></v-divider>
        <v-data-table dense :headers="headersTop" :items="Top" :loading="load">
          <template v-slot:item.id="{item}">
            <v-btn fab text color="red" x-small icon @click="removeTop(item.id)"><v-icon>fa fa-times</v-icon></v-btn>
          </template>
        </v-data-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" text small tile dark class="ma-2" @click="dialogoTop = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "web_familias",
  created() {
    this.$store.commit('guardarTitulo','Familias Visibles');
    this.cargarFamilias();
  },
  data(){
    return{
      dialogoTop: false,
      search: '',
      load: false,
      Familias: [],
      headers:[
        {text:'Familia', value:'familia'},
        {text:'Familia Online', value:'is_online'},
        {text:'Sub Familia', value:'sub_familia'},
        {text:'Sub Familia Online', value:'online_sf'},
        {text:'Top', value:'id'},
      ],
      headersTop:[
        {text:'Categoria', value:'sub_familia_articulo.nombre'},
        {text:'Quitar', value:'id'},
      ],
      Top: []
    }
  },
  methods:{
    addTop(id){
      this.load = true;
      this.$axios.post('web/add_top',{id:id}).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.cargarTop();
      })
    },
    cargarFamilias(){
      this.load = true;
      this.$axios.get('web/familias').then((res)=>{
        this.Familias = res.data.familias;
        this.cargarTop();
      })
    },
    cargarTop(){
      this.$axios.get('web/top').then((res)=>{
        this.Top = res.data.top;
        this.load = false;
      })
    },
    editVisibilidadFamilias(){
      this.load = true;
      this.$axios.post('web/edit_visibilidad_familias',{familias:this.Familias}).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.cargarFamilias();
      }).catch(error=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.load = false;
      })
    },
    removeTop(id){
      this.dialogoTop = false;
      this.load = true;
      this.$axios.post('web/remove_top',{id}).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.cargarTop();
        this.dialogoTop = true;
      }).catch(()=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.load = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
