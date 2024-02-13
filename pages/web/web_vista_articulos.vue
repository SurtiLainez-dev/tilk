<template>
  <v-card flat tile>
    <v-toolbar dense tile flat color="grey lighten-3"><v-card-title>Vista de Articulos para la Web</v-card-title></v-toolbar>

    <v-card flat tile class="ma-2">
      <v-row>
        <v-col>
          <v-card-subtitle>Todos los Articulos</v-card-subtitle>
          <v-card flat tile class="d-flex justify-end">
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field dense label="Buscar" placeholder="buscar ..." v-model="search" class="ma-2"></v-text-field>
          </v-card>
          <v-divider></v-divider>
          <v-data-table dense :headers="headers"  class="grey lighten-5" :items="Articulos"
                        :loading="load" loading-text="Cargando ..." :search="search">
            <template v-slot:item.id="{item}">
              <v-card style="background-color: #FFFFFF" flat tile color="transparent" class="d-flex align-center">
                <v-checkbox v-model="item.is_online" dense disabled></v-checkbox>
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn dark small fab icon v-on="on" v-bind="attrs" :disabled="load"  @click="cambiarVista(item)">
                      <v-icon color="red" dark small v-if="item.is_online === 0">fa fa-times</v-icon>
                      <v-icon   color="green" dark small v-else>fa fa-check</v-icon>
                    </v-btn>
                  </template>
                  <span v-if="item.is_online === 0">Cambiar a visible</span>
                  <span v-else>Quitar de la Web</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn dark small fab icon v-on="on" v-bind="attrs" :disabled="load" @click="addTop(item)">
                      <v-icon small color="orange">fa fa-arrow-right</v-icon>
                    </v-btn>
                  </template>
                  <span>Agregar al Top 20</span>
                </v-tooltip>
              </v-card>
            </template>
          </v-data-table>
        </v-col>
        <v-col>
          <v-card-subtitle>Articulos en el Top 20</v-card-subtitle>
          <v-card flat tile class="d-flex justify-end">
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field dense label="Buscar" placeholder="buscar ..." v-model="searchTop" class="ma-2"></v-text-field>
          </v-card>
          <v-divider></v-divider>
          <v-data-table dense :headers="headersTop" class="grey lighten-5" :items="Top"
                        :loading="load" loading-text="Cargando ..." :search="searchTop">
            <template v-slot:item.id="{item}">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn dark small fab icon v-on="on" v-bind="attrs" :disabled="load" @click="removeTop20(item)">
                    <v-icon small color="red">fa fa-times</v-icon>
                  </v-btn>
                </template>
                <span>Remover del Top 20</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "web_vista_articulos",
  created() {
    this.$store.commit('guardarTitulo','Web > Vista de Articulos');
    this.cargarArticulos();
    this.cargarTop();
  },
  data(){
    return{
      search: '',
      searchTop: '',
      load: false,
      Top: [],
      Articulos: [],
      headers:[
        {text:'Articulo', value:'nombre_articulo'},
        {text:'Modelo', value:'modelo'},
        {text:'Marca', value:'marca'},
        {text:'Proveedor', value:'proveedor'},
        {text:'Acciones', value:'id'},
      ],
      headersTop:[
        {text:'Articulo', value:'articulo.nombre_articulo'},
        {text:'Modelo', value:'articulo.modelo'},
        {text:'Marca', value:'articulo.marca.nombre'},
        {text:'Proveedor', value:'articulo.marca.proveedor.nombre'},
        {text:'Acciones', value:'id'},
      ]
    }
  },
  methods:{
    addTop(item){
      if (this.Top.length <= 20){
        let existe = this.Top.filter(i=>item.id === i.articulo_id);
        if (existe.length === 0){
          this.load = true;
          this.$axios.post('web/add_top20',{id: item.id}).then((res)=>{
            this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
            this.cargarTop();
            this.cargarArticulos();
          }).catch((error)=>{
            this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
            this.load = false;
          })
        }else{
          this.$store.commit('notificacion',{texto:"Ya existe este articulo en el top 20", color:'warning'});
        }
      }else{
        this.$store.commit('notificacion',{texto:"Tienes que eliminar un articulo del top, porque hay mas de 20", color:'warning'});
      }
    },
    cambiarVista(item){
      let val = 0;
      if (item.is_online === 0)
        val = 1
      this.load = true;
      this.$axios.post('web/cambiar_vista_articulo',{
        id: item.id,
        val
      }).then((res)=>{
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.cargarArticulos();
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        this.load = false;
      })
    },
    cargarArticulos(){
      this.load = true;
      this.$axios.get('web/vista_articulos').then((res)=>{
        this.Articulos = res.data.articulos;
        this.load = false
      })
    },
    cargarTop() {
      this.$axios.get('web/top20').then((res)=>{
        this.Top = res.data.top;
        this.load = false;
      })
    },
    removeTop20(item){
      this.load = true;
      this.$axios.post('web/remove_top20',{id:item.id}).then((res)=>{
        this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
        this.cargarTop();
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
        this.load = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
