<template>
  <v-card flat>
    <v-card flat>
      <v-card v-if="$store.state.manual.manual.VISTA !== 2" flat height="100" color="grey lighten-4">
        <v-toolbar color="grey lighten-5" flat dense>
          <v-toolbar-title>Creando una Nueva Sub Succión</v-toolbar-title>
        </v-toolbar>
      </v-card>
      <br>
      <v-row>
        <v-col></v-col>
        <v-col class="grey lighten-5" cols="10">
          <v-row no-gutters>
            <v-col><v-card-title>Datos de la Sub Sección</v-card-title></v-col>
            <v-col class="d-flex justify-end" v-if="tipo === 2">
              <v-btn class="ma-2" :disabled="tipo === 1" small tile dark @click="resetearFormulario">Resetear Formulario</v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-form ref="FormNuevaSubSeccionManual">
            <v-row>
              <v-col :cols="tipo === 1? 4 : 3">
                <v-autocomplete dense label="Seccón" class="ma-2"  :rules="[rule.required]" :items="SECCIONES" :loading="LOADSECCIONES"
                                :item-text="'titulo_corto'" :item-value="'id'" v-model="seccion"></v-autocomplete>
              </v-col>
              <v-col :cols="tipo === 1? 8: 6">
                <v-text-field dense label="Titulo" v-model="titulo"
                              :rules="[rule.required, rule.minTitulo, rule.maxTitulo]" counter class="ma-2"></v-text-field>
              </v-col>
              <v-col v-if="tipo === 2" cols="3">
                <v-autocomplete dense label="Estado" class="ma-2" :items="estados"
                                v-model="estado"></v-autocomplete>
              </v-col>
            </v-row>
            <v-textarea rows="2" dense label="Detalle" v-model="detalle"
                        :rules="[rule.required, rule.minDetalle, rule.maxDetalle]" counter class="ma-2"></v-textarea>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small tile color="indigo" class="ma-2" dark @click="addPaso">Agregar Paso</v-btn>
                <v-btn small tile color="indigo" class="ma-2" dark @click="addPasoLink">Agregar Paso con Link</v-btn>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Detalle del Paso</th>
                  <th>Id del Link</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in pasos">
                  <td>{{index + 1}}</td>
                  <td>
                    <v-text-field :rules="[rule.required]" dense v-model="item.detalle"></v-text-field>
                  </td>
                  <td>
                    <v-text-field :disabled="item.tipo === 1" dense v-model="item.id"></v-text-field>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small tile color="indigo" class="ma-2" dark @click="addFoto">Agregar Foto</v-btn>
              </v-col>
            </v-row>
            <v-simple-table dense>
              <thead>
              <tr>
                <th>#</th>
                <th>Detalle</th>
                <th>Id</th>
                <th>documentos</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in fotos">
                <td>{{index + 1}}</td>
                <td>
                  <v-text-field :rules="[rule.required]" dense v-model="item.detalle"></v-text-field>
                </td>
                <td>
                  <v-text-field :rules="[rule.required]" dense v-model="item.id"></v-text-field>
                </td>
                <td>
                  <v-file-input dense v-model="item.file"></v-file-input>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small tile color="indigo" class="ma-2" dark @click="addDraws">Agregar Draw</v-btn>
              </v-col>
            </v-row>
            <v-simple-table dense>
              <thead>
              <tr>
                <th>#</th>
                <th>Detalle</th>
                <th>Url</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in draws">
                <td style="width: 4%">{{index + 1}}</td>
                <td style="width: 16%">
                  <v-text-field :rules="[rule.required]" dense v-model="item.detalle"></v-text-field>
                </td>
                <td style="width: 80%">
                  <v-text-field :rules="[rule.required]" dense v-model="item.url"></v-text-field>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
            <v-divider></v-divider>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn small tile color="indigo" class="ma-2" dark @click="addFile">Agregar Archivo</v-btn>
              </v-col>
            </v-row>
            <v-simple-table dense>
              <thead>
              <tr>
                <th>#</th>
                <th>Detalle</th>
                <th>Archivo</th>
                <th>Id</th>
                <th>Tipo</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in files">
                <td style="width: 4%">{{index + 1}}</td>
                <td>
                  <v-text-field :rules="[rule.required]" dense v-model="item.detalle"></v-text-field>
                </td>
                <td>
                  <v-file-input dense v-model="item.file"></v-file-input>
                </td>
                <td>
                  <v-text-field :rules="[rule.required]" dense v-model="item.id"></v-text-field>
                </td>
                <td>
                  <v-autocomplete dense v-model="item.tipo" :rules="[rule.required]" :items="tipoFile"></v-autocomplete>
                </td>
              </tr>
              </tbody>
            </v-simple-table>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" small tile dark class="ma-2" @click="validarForm">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "NuevaSubSeccion",
  data(){
    return{
      tipo: 1,
      estado: false,
      titulo: '',
      detalle: '',
      pasos: [],
      fotos: [],
      draws: [],
      seccion: '',
      files: [],
      estados:[
        {text:'Activo', value: 1},
        {text:'Esconder', value: 0},
      ],
      tipoFile:[
        {text:'Video', value:1},
        {text:'Pdf', value:2},
        {text:'Html', value:3},
      ],
      rule: {
        required: value => !!value || 'El campo es requerido',
        minTitulo:      v => v.length >= 3   || 'Debe ingresar mínimo 3 carácteres',
        minDetalle:     v => v.length >= 10  || 'Debe ingresar mínimo 10 carácteres',
        maxTitulo:      v => v.length <= 100 || 'Maximo de carácteres es 100',
        maxDetalle:     v => v.length <= 250 || 'DMaximo de carácteres es 250',
      }
    }
  },
  computed:{
    LOADSECCIONES(){
      return this.$store.state.manual.manual.LOADSECCIONES
    },
    SECCIONES(){
      return this.$store.state.manual.manual.SECCIONES
    },
    SECCION(){
      return this.$store.state.manual.manual.SECCION;
    }
  },
  created() {
    if (this.SECCION){
      this.titulo = this.SECCION.titulo;
      this.detalle = this.SECCION.detalle;
      this.pasos   = JSON.parse(this.SECCION.contenido);
      this.estado  = this.SECCION.estado;
      if (this.SECCION.fotos)
        this.fotos = JSON.parse(this.SECCION.fotos)
      if (this.SECCION.draws)
        this.draws = JSON.parse(this.SECCION.draws)
      if (this.SECCION.videos)
        this.files = JSON.parse(this.SECCION.videos);

      console.log(this.files)

      this.seccion = this.SECCION.manual_seccion.id;

      this.tipo = 2;
    }
    this.$store.commit('guardarTitulo','Administrador > Manual > Nueva Sub Sección')
    this.$store.commit('manual/manual/cargarSECCIONES');
  },
  methods:{
    addDraws(){
      this.draws.push({
        key: this.draws.length,
        detalle: '',
        url: ''
      })
    },
    addFile(){
      this.files.push({
        key: this.files.length,
        detalle: '',
        file: null,
        dir: '',
        id:  '',
        tipo: ''
      })
    },
    addFoto(){
      this.fotos.push({
        key: this.fotos.length,
        detalle: '',
        file: null,
        dir: '',
        id: ''
      })
    },
    addPaso(){
      this.pasos.push({
        key: this.pasos.length,
        detalle: '',
        tipo: 1,
        id: null
      })
    },
    addPasoLink(){
      this.pasos.push({
        key: this.pasos.length,
        detalle: '',
        tipo: 2,
        id: ''
      })
    },
    editarForm(){
      let data = new FormData();
      let fotos = [];
      let files = [];
      let contador = 0;
      if (this.fotos.length > 0){
        this.fotos.forEach((item, i) =>{
          if (item.file){
            data.append(`foto[${contador}]`, item.file);
            item.file = null;
            fotos.push(item);
            contador++;
          }
        })
      }
      contador = 0;
      if (this.files.length > 0){
        this.files.forEach((item, i) =>{
          if (item.file){
            data.append(`file[${contador}]`, item.file);
            item.file = null;
            files.push(item);
            contador++;
          }
        })
      }
      data.append('id', this.SECCION.id);
      data.append('titulo',  this.titulo);
      data.append('detalle', this.detalle);
      data.append('seccion', this.seccion);
      data.append('pasos',   JSON.stringify(this.pasos));
      data.append('fotos',   JSON.stringify(fotos));
      data.append('filesD',   JSON.stringify(files));
      data.append('draws',   JSON.stringify(this.draws));
      data.append('estado',  this.estado);
      data.append('seccionT', this.SECCION.manual_seccion.titulo_corto);
      this.$store.commit('activarOverlay', true);
      this.$axios({
        url: 'manual_sub_secciones/editar',
        method: "post",
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('guardarTitulo', 'Administrador > Manual > Sub Secciones');
        this.$store.commit('manual/manual/cargarSUBSECCIONES');
        this.$store.commit('manual/manual/cambiarVISTA', 1);
        this.$store.commit('manual/manual/asignarSECCION', null);
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto: res.data.msj, color:'success'})
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color:'error'})
      })
    },
    registrarForm(){
      let data = new FormData();
      if (this.fotos){
        this.fotos.forEach((item, i) =>{
          data.append(`foto[${i}]`, item.file);
          item.file = null;
        })
      }
      data.append('titulo',  this.titulo);
      data.append('detalle', this.detalle);
      data.append('seccion', this.seccion);
      data.append('pasos',   JSON.stringify(this.pasos));
      data.append('fotos',   JSON.stringify(this.fotos));
      this.$store.commit('activarOverlay', true);
      this.$axios({
        url: 'manual_sub_secciones',
        method: "post",
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto: res.data.msj, color:'success'})
        this.$router.push('/admin/manual/subsecciones')
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion', {texto: 'Hubo un error en el servidor', color:'error'})
      })
    },
    resetearFormulario(){
      this.tipo = 1;
      this.titulo = '';
      this.detalle = '';
      this.seccion = '';
      this.fotos   = [];
      this.files   = [];
      this.pasos   = [];
      this.draws   = [];
      this.$store.commit('manual/manual/cambiarVISTA', 1);
      this.$store.commit('manual/manual/asignarSECCION', null)
    },
    validarForm(){
      if (this.$refs.FormNuevaSubSeccionManual.validate()) {
        if (this.tipo === 1)
          this.registrarForm();
        else if (this.tipo === 2)
          this.editarForm();
      }else
        this.$store.commit('notificacion',{texto:'Datos incompletos', color:'warning'});
    }
  }
}
</script>

<style scoped>

</style>