<template>
  <v-card flat tile>
    <v-toolbar dense flat tile color="grey lighten-3">
      <v-toolbar-title>Creando Banner de Publicidad</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-card-actions class="d-flex justify-end">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn fab color="pink" v-on="on" v-bind="attrs"
                   @click="vistaImg = !vistaImg"
                   small icon dark><v-icon v-if="vistaImg">fa fa-arrow-left</v-icon><v-icon small v-else>fa fa-image</v-icon></v-btn>
          </template>
          <span v-if="vistaImg">Volver al Formulario</span>
          <span v-else>Ver banner de ejemplo</span>
        </v-tooltip>
      </v-card-actions>
    </v-toolbar>

    <v-card style="height: 90vh;" class="d-flex justify-center align-center" flat tile v-if="vistaImg">
      <v-card flat tile width="90%">
        <v-card-title>Ejemplo de Banner</v-card-title>
        <v-img contain src="https://ign-surti.nyc3.digitaloceanspaces.com/web/imagen%20de%20ejemplo.png"/>
      </v-card>
    </v-card>

    <v-card flat tile>
      <v-form class="ma-2" ref="FormNuevoBanner">
        <v-row>
          <v-col cols="8">
            <v-text-field label="*Pre Titulo" :rules="[rules.req, rules.min]" v-model="data.preTitulo" dense class="ma-2"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Precio Titulo"  v-model="data.precioPretitulo"dense suffix="lps" class="ma-2"></v-text-field>
          </v-col>
        </v-row>
        <v-text-field label="*Detalle" dense v-model="data.detalle" :rules="[rules.req, rules.min]" class="ma-2"></v-text-field>
        <v-row>
          <v-col cols="5">
            <v-text-field label="Sub-titulo" v-model="data.subtitulo" dense class="ma-2"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Precio Sub-titulo" v-model="data.precioSubtitulo" dense suffix="lps" class="ma-2"></v-text-field>
          </v-col>
          <v-col cols="5">
            <v-text-field label="Sub-titulo 2" dense class="ma-2" v-model="data.subtitulo2"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select :items="btnOptions" class="ma-2" v-model="data.isBtn" dense label="Boton en en el Banner"></v-select>
          </v-col>
          <v-col>
            <v-text-field label="Titulo del Boton" dense class="ma-2" v-model="data.tituloBtn"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Ruta" hint="La ruta te la tiene que proporcionar el desarrollador" persistent-hint
                          dense class="ma-2" v-model="data.ruta"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-file-input label="*Imagen de Publicidad" :rules="[rules.req]" v-model="data.img"></v-file-input>
          </v-col>
          <v-col>
            <v-card height="100%" flat tile class="d-flex align-center justify-end">
              <div style="height: 50px; width: 150px;" :style="'background-color: #'+data.color.substring(1,7)" class="d-flex align-center justify-center">
                <span style="color: #FFFFFF">{{data.color.substring(0,7)}}</span>
              </div>
              <v-btn class="ma-2" tile small @click="dialogoColor = true" dark color="indigo">*Seleccionar Color</v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" tile small dark class="ma-2" @click="validarForm">Registrar Banner</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialogoColor" width="25%">
      <v-card>
        <v-card-title>Seleccionando Color</v-card-title>
        <v-color-picker
            v-model="data.color"
            swatches-max-height="200"
            hide-canvas hide-sliders show-swatches hide-mode-switch hide-inputs dot-size="15"
        ></v-color-picker>

        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" tile small dark @click="dialogoColor = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-card>
</template>

<script>
export default {
  name: "web_banners",
  created() {
    this.$store.commit('guardarTitulo','Creando Banner de Publicidad');
  },
  data(){
    return{
      rules:{
        req: v => !!v || 'Campo requerido',
        min:v => (v && v.length >= 5) || 'Tiene que ser mayor a 3 carácteres.',
      },
      data:{
        color:'',
        img: null,
        subtitulo: '',
        subtitulo2: '',
        precioSubtitulo: 0,
        isBtn: 0,
        tituloBtn: null,
        detalle: '',
        preTitulo: '',
        precioPretitulo: 0,
        ruta: null
      },
      dialogoColor: false,
      vistaImg: false,
      btnOptions:[
        {text:'Si', value: 1},
        {text:'No', value: 0},
      ]
    }
  },
  methods:{
    registrarBanner(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      let d = this.data
      data.append('preTitulo', d.preTitulo);
      data.append('precioPre', d.precioPretitulo);
      data.append('detalle', d.detalle);
      data.append('sub1', d.subtitulo);
      data.append('sub2', d.subtitulo2);
      data.append('precioSub', d.precioSubtitulo);
      data.append('btn', d.isBtn);
      data.append('btnTitulo', d.tituloBtn);
      data.append('img', d.img);
      data.append('ruta', d.ruta);
      data.append('color', d.color.substring(1,7));

      this.$axios({
        url: 'web/banner',
        method: 'post',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
        this.$store.commit('activarOverlay', false);
        this.$router.push('/inicio/');
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormNuevoBanner.validate()){
        if (this.data.color.length > 0){
          this.registrarBanner()
        }else{
          this.$store.commit('notificacion',{texto:'Tienes que seleccionar un color', color:'warning'});
        }
      }else{
        this.$store.commit('notificacion',{texto:'Tienes que llenar los campos obligatorios', color:'error'});
      }
    }
  }
}
</script>

<style scoped>

</style>
