<template>
<v-card flat>
  <v-card flat height="100" color="grey lighten-5">
    <v-toolbar color="grey lighten-4" flat dense>
      <v-toolbar-title>Creando una Nueva Notificación</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn @click="tipo.dialogo = true" small text color="indigo">Crear un Tipo de Documento</v-btn>
    </v-toolbar>
  </v-card>

  <v-card flat class="ma-2">
    <v-form ref="FormNuevaNotificacion">
      <v-row>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-textarea rows="2" outlined dense label="Asunto" :rules="[rule.nombres.req, rule.nombres.min, rule.exp.max]"
                          counter v-model="not.asunto" class="ma-2" :counter="200"></v-textarea>
              <v-autocomplete dense label="Tipo de Docuento" v-model="not.tipo"
                              class="ma-2" :loading="tipo.load" :rules="[rule.nombres.req]"
                              :items="tipos" :item-text="'nombre'" :item-value="'id'"></v-autocomplete>
              <v-radio-group class="ma-2" v-model="not.grupal" col>
                <v-radio label="Firma Individual" :value="0"></v-radio>
                <v-radio label="Firma Grupal" :value="1"></v-radio>
              </v-radio-group>
              <v-switch label="Agregar links externos" class="ma-2" v-model="not.docs"></v-switch>
              <v-card flat tile v-if="not.docs">
                <v-simple-table dense>
                  <template>
                    <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Link</th>
                      <th>Quitar</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in not.links">
                      <td>
                        <v-text-field :rules="[rule.nombres.req, rule.nombres.min]" dense v-model="item.nombre"></v-text-field>
                      </td>
                      <td>
                        <v-text-field :rules="[rule.nombres.req, rule.nombres.min]" @keyup.enter="agregarLink" dense v-model="item.link"></v-text-field>
                      </td>
                      <td>
                        <v-btn icon fab x-small color="red" @click="deleteLink(item.key)" text dark><v-icon small>fa fa-times</v-icon></v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>

              <v-card flat tile :loading="loadUsers" class="mx-auto">
                <v-toolbar flat color="grey lighten-4">
                  <v-toolbar-title>Usuarios</v-toolbar-title>
                </v-toolbar>

                <v-container class="py-0">
                  <v-row align="center" justify="start">
                    <v-col v-for="(selection, i) in selectedUsers" :key="i" class="shrink">
                      <v-chip x-small :disabled="loading" close @click:close="deleteUser(selection.key)">
                        {{ selection.nombres }}
                      </v-chip>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field ref="search" v-model="search" full-width dense class="ma-2"
                          hide-details label="Escribe el nombre para buscar" single-line></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider v-if="!allSelected"></v-divider>
                <v-list dense height="200">
                  <template v-for="(item, i) in Users">
                    <v-list-item :key="i" :disabled="loading"
                        @click="selectedUsers.push(item)" v-if="!selectedUsers.includes(item) && i < 5">
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>

              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col >
          <v-row>
            <v-col>
              <v-textarea outlined rows="25" dense class="ma-2" label="Contenido" :rules="[rule.nombres.req, rule.nombres.min, rule.not.max]"
                          v-model="not.contenido" :counter="2000"></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-card>

  <v-divider></v-divider>
  <v-card-actions class="d-flex justify-end">
    <v-btn color="success" class="ma-2" dark tile @click="validarFormNuevoDoc" small>Crear Documento</v-btn>
  </v-card-actions>

  <v-dialog v-model="tipo.dialogo" width="40%">
    <v-card>
      <v-toolbar flat dense tile >
        <v-toolbar-title>Creando Tipo de Documentos</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>

      <v-container>
        <v-form ref="FormTipoDocumento">
          <v-text-field dense class="ma-2" :rules="[rule.nombres.req, rule.nombres.min, rule.nombres.max]"
                        label="Nombre" v-model="tipo.nombre" counter></v-text-field>
          <v-text-field dense class="ma-2" :rules="[rule.nombres.req, rule.cod.some]"
                        label="Codigo" v-model="tipo.cod" counter></v-text-field>
          <v-textarea   dense class="ma-2" :rules="[rule.nombres.req, rule.nombres.min, rule.exp.max]"
                        label="Explicación" v-model="tipo.explica" counter></v-textarea>
        </v-form>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="orange" dark tile small @click="tipo.dialogo = false" class="ma-2">Cerrar</v-btn>
        <v-btn color="success" dark tile small class="ma-2" @click="validarForm">Registrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "nuevo",
  created() {
    this.$store.commit('guardarTitulo','Colaboradores > Notificaciones > Nueva');
    this.cargarTipos();
    this.cargarUsuarios();
  },
  data(){
    return{
      loading: false,
      search: '',
      header:[
        {text:'Usuario', value:'text'}
      ],
      rule:{
        nombres:{
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max:v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        cod:{
          some:v => (v && v.length === 3) || 'Tiene que ser igual a 3 carácteres.',
        },
        exp:{
          max:v => (v && v.length <= 200) || 'Tiene que ser menor o igual a 200 carácteres.',
        },
        not:{
          max:v => (v && v.length <= 2000) || 'Tiene que ser menor o igual a 2000 carácteres.',
        },
      },
      tipo:{
        load: true,
        dialogo: false,
        nombre: '',
        cod:    '',
        explica:''
      },
      tipos: [],
      not:{
        asunto: '',
        tipo:   '',
        usuarios: [],
        contenido: '',
        grupal: 0,
        docs: false,
        links: [
          {
            key: 0,
            nombre: '',
            link:   ''
          }
        ]
      },
      selectedUsers: [],
      loadUsers: true,
      usuarios: []
    }
  },
  computed:{
    allSelected () {
      return this.usuarios.length === this.selectedUsers.length
    },
    Users(){
      let search = this.search.toLowerCase();

      if (search.length > 2){
        return this.usuarios.filter(item=>{
          let text = item.text.toLowerCase()
          return text.indexOf(search) > - 1
        })
      }else return []
    },
  },
  watch: {
    selectedUsers () {
      this.search = ''
    },
  },
  methods:{
    agregarLink(){
      let long = this.not.links;
      this.not.links.push({
        key: long,
        nombre: '',
        link:   ''
      })
    },
    cargarTipos(){
      this.tipo.load = true;
      this.$axios.get('memo/tipo_documento').then((res)=>{
        this.tipos     = res.data.tipos;
        this.tipo.load = false;
      })
    },
    cargarUsuarios(){
      this.$axios.get('/usuarios').then((res)=>{
        this.usuarios = [];
        res.data.usuarios.forEach((item, i)=>{
          this.usuarios.push({
            text: item.nombres+' '+item.apellidos+' - '+item.suc,
            nombres: item.nombres+' '+item.apellidos,
            value: item.user,
            key: i
          })
        })
        this.loadUsers = false;
      })
    },
    deleteLink(key){
      if (this.not.links.length > 1){
        this.not.links.splice(key, 1)
        this.not.links.forEach( (i, item) => {
          i.key = item;
        });
      }else{
        this.$store.commit('notificacion',{color:'warning', texto:'No se puede eliminar'})
      }
    },
    deleteUser(key){
      this.selectedUsers.splice(key, 1);
      this.selectedUsers.forEach((i, item)=>{
        i.key = item
      })
    },
    registrarDocumento() {
      if (this.selectedUsers.length > 0){
        let users = []
        let files = [];
        if (this.not.grupal === 0){
          this.selectedUsers.forEach(item=>{
            files.push({
              key: item.value,
              nombre: item.nombres,
              file:  ''
            })
            users.push(item.value)
          })
        }else {
          files.push({
            key: 0,
            nombre: 'Un solo documento para todos',
            file:  ''
          })
        }
        this.$store.commit('activarOverlay', true);
        this.$axios.post('memo/documento',{
          usuarios:  JSON.stringify(this.usuarios),
          asunto:    this.not.asunto,
          contenido: this.not.contenido,
          urls:      JSON.stringify(files),
          grupal:    this.not.grupal,
          docs:      this.not.docs,
          links:     this.not.links,
          tipo_doc:  this.not.tipo
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$router.replace({path:'/colaborador/notificaciones'})
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        })
      }else
        this.$store.commit('notificacion',{color:'warning', texto:'Tienes que agregar minimo un usuario'})
    },
    registrarTipo(){
      this.tipo.dialogo = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('memo/tipo_documento',{
        nombre:      this.tipo.nombre,
        cod:         this.tipo.cod,
        explicacion: this.tipo.explica
      }).then((res)=>{
        this.tipo.explica = '';
        this.tipo.cod     = '';
        this.tipo.nombre  = '';
        this.$store.commit('activarOverlay', false);
        this.cargarTipos();
      }).catch((error)=>{
        this.tipo.dialogo = true;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormTipoDocumento.validate())
        this.registrarTipo()
    },
    validarFormNuevoDoc(){
      if (this.$refs.FormNuevaNotificacion.validate())
        this.registrarDocumento()
    }
  }
}
</script>

<style scoped>

</style>