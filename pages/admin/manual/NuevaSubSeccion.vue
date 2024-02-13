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
        <v-col class="grey lighten-5">
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

            <client-only>
              <v-card flat tile>
                <VueEditor @change="containerManual" v-model="contenido" id="editorManual"
                           useCustomImageHandler @image-added="cargarFoto"/>
              </v-card>
            </client-only>

            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" small tile dark class="ma-2" @click="validarForm">Registrar</v-btn>
            </v-card-actions>
          </v-form>
        </v-col>

<!--        <v-col cols="6" >-->
<!--          <div id="vistaHtml" v-html="contenido"></div>-->
<!--        </v-col>-->
      </v-row>
    </v-card>
  </v-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
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
      },
      contenido: '',
      cargandoFoto: false,
      vistaVivo: false
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
      let contenido = JSON.parse(this.SECCION.contenido);

      this.contenido = contenido[0]
      this.estado  = this.SECCION.estado;
      if (this.SECCION.fotos)
        this.fotos = JSON.parse(this.SECCION.fotos)
      if (this.SECCION.draws)
        this.draws = JSON.parse(this.SECCION.draws)
      if (this.SECCION.videos)
        this.files = JSON.parse(this.SECCION.videos);


      this.seccion = this.SECCION.manual_seccion.id;

      this.tipo = 2;
      // this.containerManual();
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
    cargarFoto(file, Editor, cursorLocation, resetUploader){
      this.cargandoFoto = true;
      let formData = new FormData();
      formData.append("foto", file);
      this.$axios({
        url: "cargar_imagen",
        method: "POST",
        data: formData
      }).then(result => {
        const url = result.data.url; // Get url from response
        Editor.insertEmbed(cursorLocation, "image", url);
        resetUploader();
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.cargandoFoto = false;
      }).catch(err => {
        console.log(err);
      });
    },
    containerManual(){
      setTimeout(()=>{
        let images = document.querySelector("#vistaHtml");
        images.style.font = "bold 90% monospace";
        let imagesChil = images.querySelectorAll(":scope > ol > li > img");
        let olChil     = images.querySelectorAll(":scope > ol > li");
        olChil.forEach(item=>{
          item.style.fontSize = '11px';
          item.style.font = "bold 90% monospace";
          item.width = '50px';
        })
        imagesChil.forEach(item=>{
          item.style.width = '100%';
          item.style.margin = '5px';
          item.style.padding = '5px';
        });
      },500)
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
      data.append('pasos',   this.contenido);
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
      data.append('pasos',   this.contenido);
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
#vistaHtml{
  border-left: solid 3px #aaaaaa;
  padding: 10px;
  background-color: #fffbfb;
}
</style>
