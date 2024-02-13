<template>
  <v-card flat tile>
    <v-toolbar dense color="grey lighten-4" flat>
      <v-card-title>Creando Firma de Correo</v-card-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

    </v-toolbar>
    <br>
    <small>-Seleccionar logo</small>
    <v-row no-gutters>
      <v-col>
        <v-chip
            pill
            @click="logo = 'https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20%20PNG.png'"
        >
          <v-avatar left>
            <img style="width: 25px; height: 14px"
                 src="https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20%20PNG.png"
                 alt="Logo Normal"/>
          </v-avatar>
          Normal
        </v-chip>
        <v-chip
            pill
            @click="logo = 'https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20NEGRO%20PNG.png'"
        >
          <v-avatar left>
            <img style="width: 25px; height: 14px"
                 src="https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20NEGRO%20PNG.png"
                 alt="Logo Normal"/>
          </v-avatar>
          Negro
        </v-chip>
        <v-chip
            pill
            @click="selectLogoBlanco"
        >
          <v-avatar left>
            <img style="width: 25px; height: 14px"
                 src="https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20%20BLANCO%20PNG.png"
                 alt="Logo Normal"/>
          </v-avatar>
          Blanco
        </v-chip>
      </v-col>
    </v-row>
    <small>-Colores</small>
    <br>
    <small>El color #1 siempre será el color principal. Los demás colores se usan para un diseño con gradiente</small>
    <v-row no-gutters>
      <v-col>
        <v-tooltip top>
          <template v-slot:activator="{on, attr}">
            <v-btn v-on="on" v-bind="attr" dark color="indigo" @click="dialogoColorSecLogo = true" small fab><v-icon>mdi-brush</v-icon></v-btn>
          </template>
          <span>Color Sección del Logo</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{on, attr}">
            <v-btn v-on="on" v-bind="attr" dark color="indigo" @click="addColor" icon small fab><v-icon>fa fa-plus</v-icon></v-btn>
          </template>
          <span>Agregar Color</span>
        </v-tooltip>
        <v-chip
            v-for="(item, i) in colors"
            class="ma-2"
            close
            :color="item"
            dark
            @click="abrirModalColor(i)"
            :text-color="item === '#FFFFFF'?'#000000':item === '#000000'?'#FFFFFF':'white'"
        >
          Color {{i + 1}}
        </v-chip>
      </v-col>
    </v-row>
    <small>-Nombre de la firma</small>
    <br>
    <span class="nameImput">Detalle del Nombre Completo. Si quieres puede agregar tu profesión, por ejmplo Abo, Lic, Ing, etc...</span>
    <div class="cajaInput">
      <input type="text" v-model="nombre">
    </div>
    <small>-Cargo</small>
    <br>
    <span class="nameImput">Cargo</span>
    <div class="cajaInput">
      <input type="text" v-model="cargo" disabled>
    </div>
    <br>
    <small>El siguiente cuadro es la plantiila terminada</small>
    <br>
    <br>
    <br>
    <v-card flat tile class="d-flex justify-center">
      <v-card height="100" width="650" :style="'background-color:'+ colors[0]">
        <div :style="'background-color:'+colorTriangulo+'; position: fixed; transform: rotate(45deg); height: 100px; width: 100px; margin-left: 440px; margin-top: -1px'"></div>

        <v-row no-gutters>
          <v-col cols="8">
            <v-row no-gutters>
              <v-col>
                <v-row no-gutters><v-col>
                  <v-card flat tile color="transparent" class="pa-1">
                    <div><small style="color: #FFFFFF; font-size: 14px"><strong>{{nombre}}</strong></small></div>
                    <div style="margin-top: -10px !important;"><small style="color: #FFFFFF; font-size: 12px;">{{cargo}}</small></div>
                  </v-card>
                </v-col></v-row>
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row no-gutters><v-col>
              <v-card flat tile style="padding: 10px" color="transparent" class="d-flex justify-center">
                <v-card flat tile color="transparent" class="align-self-start">
                  <v-img :src="logo" style="width: 130px;" height="55"></v-img>
                </v-card>
              </v-card>
            </v-col></v-row>
            <v-row>
              <v-col>
                <v-card style="margin-top: -14px" class="align-self-end" height="20" color="transparent" flat tile width="100%">
                  <v-row no-gutters>
                    <v-col cols="2"><small style="font-size: 8px; color:#FFFFFF;">Siguenos en: </small></v-col>
                    <v-col>
                      <v-row no-gutters><v-col cols="2">
                        <v-icon size="12" color="white">mdi-facebook</v-icon></v-col><v-col><small style="font-size: 8px; color:#FFFFFF;">Surtidora Lainez</small></v-col></v-row>
                    </v-col>
                    <v-col>
                      <v-row no-gutters><v-col cols="2">
                        <v-icon size="12" color="white">mdi-instagram</v-icon></v-col><v-col><small style="font-size: 8px; color:#FFFFFF;">@surtidoralainezhn</small></v-col></v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-card>

    <v-dialog width="30%" v-model="modalColor">
      <v-card>
        <v-card-title>Seleccionando color #{{colorSelect + 1}}</v-card-title>
        <v-divider></v-divider>
        <v-card flat tile class="d-flex justify-center">
          <v-color-picker
              dot-size="25"
              v-model="color"
              swatches-max-height="200"
          ></v-color-picker>
        </v-card>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" text dark small tile @click="modalColor = false">Cerrar</v-btn>
          <v-btn color="success" dark small tile @click="selectColor">Seleccionar Color</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="30%" v-model="dialogoColorSecLogo">
      <v-card>
        <v-card-title>Seleccionando el Color del Efecto del Logo</v-card-title>
        <v-divider></v-divider>
        <v-card flat tile class="d-flex justify-center">
          <v-color-picker
              dot-size="25"
              v-model="color"
              swatches-max-height="200"
          ></v-color-picker>
        </v-card>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="warning" text dark small tile @click="dialogoColorSecLogo = false">Cerrar</v-btn>
          <v-btn color="success" dark small tile @click="selectColorTriangulo">Seleccionar Color</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "firma_correo",
  data(){
    return{
      dialogoColorSecLogo: false,
      modalColor: false,
      colorSelect: 0,
      colors: ['#000000'],
      logo: 'https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20%20PNG.png',
      color: '',
      nombre: '',
      cargo: '',
      colorTriangulo: '#FFFFFF'
    }
  },
  created() {
    this.nombre = this.COLABORADOR;
    this.cargo  =  this.USER.colaborador.puesto_colaborador.nombre;
  },
  computed:{
    COLABORADOR(){
      return this.$store.state.colaborador
    },
    USER(){
      return this.$store.state.perfil.USER;
    }
  },
  methods:{
    abrirModalColor(val){
      this.colorSelect = val;
      this.modalColor  = true;
    },
    addColor(){
      this.colors.push('#000000');
    },
    selectColor(){
      this.colors[this.colorSelect] = this.color.substr(0,7);
      this.modalColor = false;
      this.color = '';
    },
    selectColorTriangulo(){
      this.colorTriangulo = this.color.substr(0,7);
      this.dialogoColorSecLogo = false;
      this.color = '';
    },
    selectLogoBlanco(){
      if (this.colors[0] !== '#FFFFFF'){
        this.logo = 'https://ign-surti.nyc3.digitaloceanspaces.com/logos/LAINEZ%20%20BLANCO%20PNG.png'
      }else{
        this.$store.commit('notificacion',{texto:'Para seleccionar el logo blanco, tienes que seleccionar una color de fondo diferente', color:'warning'})
      }
    }
  }
}
</script>

<style scoped>
.nameImput{
  font-size: 11px;
  color: #b2b0b0;
}
.cajaInput {
  border:1px solid #d9d9d9;
  height:30px;
  overflow: hidden;
  width: 50%;
  position:relative;
}
input{
  background-color: transparent;
  border: none;
  font-size: 10px;
  height: 30px;
  padding: 5px;
  width: 100%
}
</style>
