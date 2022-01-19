<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <v-btn color="orange" x-small fab dark @click="$router.replace({path:'/inicio/otras_gestiones/ordenes_genericas'})"><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-card-title>Creando Orden de Entrega Genérica</v-card-title>
    </v-toolbar>

    <v-form ref="FormOrdenEntregaGenerica">
      <v-row>
        <v-col class="d-flex justify-end">
          <v-tooltip top>
            <template v-slot:activator="{on, attrs}">
              <v-btn dark color="success" small tile class="ma-2" v-on="on" v-bind="attrs" @click="addItem"><v-icon small>fa fa-plus</v-icon></v-btn>
            </template>
            <span>Agregar Item</span>
          </v-tooltip>
          <v-btn dark color="indigo" small tile @click="dialogoCol = true" class="ma-2">Enlazar entrega con un usuario</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field class="ma-2" dense label="Orden para" placeholder="Para" counter
                        :rules="[rules.titulo.req, rules.titulo.min, rules.titulo.max]" v-model="orden.destino"></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-text-field class="ma-2" dense label="Título de la orden" placeholder="Título" counter
                        v-model="orden.titulo" :rules="[rules.titulo.req, rules.titulo.min, rules.titulo.max]"></v-text-field>
        </v-col>
      </v-row>

      <v-text-field class="ma-2" dense label="Descripción de la orden" counter :rules="[rules.titulo.req, rules.titulo.min, rules.titulo.max]"
                    placeholder="Descripción" v-model="orden.detalle"></v-text-field>

      <v-simple-table fixed-header dense height="300px">
        <template v-slot:default>
          <thead>
          <tr>
            <th>#</th>
            <th>Cant.</th>
            <th>Detalle del item</th>
            <th>Eliminar</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, i) in orden.items">
            <td width="5%">{{i+1}}</td>
            <td width="10%">
              <b-input size="sm" placeholder="Cant." type="number" v-model="item.cant"></b-input>
            </td>
            <td width="80%">
              <b-input size="sm" placeholder="Detalle del item" v-model="item.detalle" @keyup.enter="addItem"></b-input>
            </td>
            <td width="5%">
              <v-btn width="25" height="25" dark color="red" fab @click="removeFila(item.key)"><v-icon x-small>fa fa-times</v-icon></v-btn>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider></v-divider>
      <v-text-field class="ma-2" dense label="Observación" v-model="orden.observacion"></v-text-field>
    </v-form>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="success" dark small tile @click="validarForm">Crear orden</v-btn>
    </v-card-actions>

    <v-dialog v-model="dialogoCol" width="40%">
      <v-card >
        <v-toolbar color="grey lighten-4">
          <v-card-title>Colaboradores</v-card-title>
          <v-spacer></v-spacer>
          <v-text-field dense label="Buscar ..." v-model="search"></v-text-field>
        </v-toolbar>
        <v-data-table dense :headers="header" :items="COLABORADORES" loading-text="Cargando datos ..."
                      :search="search" :loading="LOAD_COLABORADORES" @click:row="selectColaborador">
          <template v-slot:item.nombres="{item}">{{item.nombres}} {{item.apellidos}}</template>
        </v-data-table>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="dialogoCol = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "nueva_orden_generica",
  created() {
    this.$store.commit('guardarTitulo', 'Inicio > Otras Gestiones > Creando Orden de Entrega Genérica');
    this.$store.commit('col/cargar_COLABORADORES');
  },
  data(){
    return{
      dialogoCol: false,
      header:[
        {text: 'Nombre completo', value:'nombres'},
        {text: 'Identidad', value:'identidad'},
      ],
      search: '',
      orden:{
        detalle: '',
        titulo: '',
        destino: '',
        user:    null,
        observacion: '',
        items: [
          {
            cant: 1,
            detalle: '',
            key: 0
          }
        ]
      },
      rules: {
        titulo: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 2 carácteres.',
          max: v => (v && v.length <= 150) || 'Tiene que ser menor o igual a 100 carácteres.',
        },
      }
    }
  },
  computed:{
    COLABORADORES() {
      return this.$store.state.col.COLABORADORES;
    },
    LOAD_COLABORADORES(){
      return this.$store.state.col.LOADCOLABORADORES;
    }
  },
  methods:{
    addItem(){
      this.orden.items.push({
        cant: 1,
        detalle: '',
        key: this.orden.items.length,
      });
    },
    registrarOrden(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('ordenes_entrega_genericas',{
        items: JSON.stringify(this.orden.items),
        destino: this.orden.destino,
        observacion: this.orden.observacion,
        titulo:      this.orden.titulo,
        detalle:     this.orden.detalle,
        usuario_enlace: this.orden.user
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$router.replace({path:'/inicio/otras_gestiones/ordenes_genericas'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    removeFila(fila){
      if (this.orden.items.length < 2){
        this.$store.commit('notificacion',{texto:'No se puede eliminar el último item', color:'warning'})
      }else{
        this.orden.items.splice(fila, 1)
        this.orden.items.forEach((item, i)=>{
          item.key = i
        })
      }
    },
    selectColaborador(item){
      this.orden.destino = item.nombres+' '+item.apellidos;
      this.orden.user    = item.usuarios.id;
      this.dialogoCol    = false;
    },
    validarForm(){
      if (this.$refs.FormOrdenEntregaGenerica.validate())
        this.registrarOrden();
      else
        this.$store.commit('notificacion',{texto:'Hay datos incompletos', color:'warning'})
    }
  }
  }
</script>

<style scoped>

</style>
