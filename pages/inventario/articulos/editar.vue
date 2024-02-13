<template>
  <v-card flat>
    <v-toolbar flat color="grey lighten-3">
      <v-card-title>Editando Articulo</v-card-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="indigo" tile small dark @click="dialogoBuscar = true">Buscar Artículo</v-btn>
    </v-toolbar>
    <v-card flat v-if="load">
      <v-form ref="FormEditArticulo" class="ma-2">
        <v-row>
          <v-col>
            <v-text-field dense disabled label="Familía" v-model="data.familia"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense disabled label="Sub-familía" v-model="data.fam"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense disabled label="Código del Sistema" v-model="data.codigo_sistema"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense disabled label="Marca" v-model="data.marca"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field :rules="[rules.art.req, rules.art.min]" dense label="Módelo" v-model="data.modelo"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field :rules="[rules.art.req, rules.art.min]" dense label="Código del Proveedor" v-model="data.codigo_proveedor"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense label="Código de Barras" v-model="data.codigo_barras"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field dense label="Referencia de Fabricante" v-model="data.referencia_fabricante"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field :rules="[rules.art.req, rules.art.min]" dense label="Nombre" v-model="data.nombre_articulo"></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field dense disabled label="Proveedor" v-model="data.proveedor"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-text-field :rules="[rules.art.req, rules.art.min]" dense label="Descripción de Artículo" v-model="data.descripcion_corta"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field :rules="[rules.art.req]" dense label="Stock Mínimo" v-model="data.stock_m"></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field :rules="[rules.art.req]" dense label="Stock Máximo" v-model="data.stock_max"></v-text-field>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-subtitle>Fotos</v-card-subtitle>
        <v-card :loading="loadFotos" flat>
          <v-row>
            <v-col cols="2" class="justify-center">
              <v-row justify="center" v-for="(n, item) in Fotos" no-gutters>
                <v-col class="d-flex justify-center rowsTable"
                       :key="item" :cols="5" v-if="item < 5">
                  <v-card flat class="ma-1 cardBorder" :class="{'opacidad': item !== imgSelect }" tile>
                    <v-img :src="n.url"
                           :lazy-src="n.url"
                           aspect-ratio="1"
                           class="grey lighten-2 ma-1"
                           max-width="150"
                           @click="seleccionarImagen(n.url, item)"
                           max-height="150">
                      <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                          <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" text width="30" color="grey lighten-3"
                             height="30" @click="dialgos.fotos = true"><v-icon>fa-solid fa-chevron-down</v-icon></v-btn>
                    </template>
                    <span>Ver todas las fotos</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" v-bind="attrs" text width="30" color="grey lighten-3"
                             height="30" @click="dialgos.editarImg = true"><v-icon>fa-solid fa-plus</v-icon></v-btn>
                    </template>
                    <span>Editar catálago</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row justify="center" >
                <v-col>
                  <v-card flat tile class="cardBorder">
                    <v-img
                        :src="urlFoto"
                        :lazy-src="urlFoto"
                        aspect-ratio="1"
                        class="grey lighten-2 ma-1"
                        max-width="1000"
                        max-height="1000">
                      <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                          <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-container>
                <v-card-title>{{data.nombre_articulo}}</v-card-title>
                <v-card-subtitle>{{data.descripcion_corta}}</v-card-subtitle>
                <v-divider></v-divider>
                <v-card-subtitle>Acciones</v-card-subtitle>
                <v-btn color="success" class="ma-2" block dark small tile @click="validarForm">Registrar Cambios</v-btn>
                <v-btn color="success" class="ma-2" block dark small tile>Enviar Artículo por Correo</v-btn>
                <v-btn color="success" class="ma-2" block dark small tile>Enviar Artículo por WhatsApp</v-btn>
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card flat :loading="loadDetalles">
                <v-toolbar dense flat color="grey lighten-5">
                  <v-card-subtitle>Componentes</v-card-subtitle>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn fab text x-small v-on="on" @click="dialgos.componenes = true"
                             v-bind="attrs"><v-icon>fa fa-plus</v-icon></v-btn>
                    </template>
                    <span>Editar componentes</span>
                  </v-tooltip>
                </v-toolbar>
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th>Código</th>
                      <th>Detalle</th>
                      <th>Cant.</th>
                      <th>Det. Cant</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in editarComponentes" :class="{'green lighten-5': item.accion === 1}">
                      <td>{{item.codigo}}</td>
                      <td>{{item.detalle}}</td>
                      <td>{{item.cantidad}}</td>
                      <td>{{item.detalle_cantidad}}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
            <v-col>
              <v-toolbar dense flat color="grey lighten-5">
                <v-card-subtitle>Detalles</v-card-subtitle>
                <v-spacer></v-spacer>
                <v-tooltip top>
                  <template v-slot:activator="{on, attrs}">
                    <v-btn @click="dialgos.detalles = true" fab text x-small v-on="on" v-bind="attrs"><v-icon>fa fa-plus</v-icon></v-btn>
                  </template>
                  <span>Editar detalles técnicos</span>
                </v-tooltip>
              </v-toolbar>
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                  <tr v-for="item in editarDetalles"
                  :class="{'green lighten-5': item.accion === 1 || item.accion === 2, 'red lighten-5':item.accion === 3}">
                    <td>{{item.detalle}}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card>
      </v-form>
      <v-divider></v-divider>
      <v-card-text>Fín de datos de {{data.nombre_articulo}}</v-card-text>
    </v-card>
    <v-card-subtitle v-else>No se ha seleccionado datos</v-card-subtitle>


    <v-dialog v-model="dialogoBuscar" width="100%">
      <v-card class="pa-5">
        <v-toolbar flat>
          <v-card-title>Inventario</v-card-title>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field label="Buscar ..." dense v-model="search"></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-data-table :loading="isPeticon" @click:row="seleccionarArticulo"
                      loading-text="Cargando artículos... por favor espere un momento"
                      :headers="header" :items="Inventario" :search="search" class="rowsTable">
        </v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialgos.fotos" width="100%">
      <v-card>
        <v-toolbar flat color="grey lighten-3">
          <v-card-title>Fotos de {{data.nombre_articulo}}</v-card-title>
          <v-spacer></v-spacer>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="red" x-small fab tile dark @click="dialgos.fotos = false"><v-icon>fa fa-times</v-icon></v-btn>
          </v-card-actions>
        </v-toolbar>
        <v-container>
          <v-row no-gutters>
            <v-col cols="8" class="justify-center">
              <v-row justify="center">
                <v-col class="d-flex justify-center">
                  <v-card flat class="cardBorder" height="500" width="500">
                    <v-img
                        :src="urlFoto2"
                        :lazy-src="urlFoto2"
                        aspect-ratio="1"
                        class="grey lighten-2 ma-1"
                        max-width="500"
                        max-height="500">
                      <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                          <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="center" no-gutters>
                <v-col v-for="(n, item) in Fotos" class="rowsTable" :key="item">
                  <v-card flat class="ma-1 cardBorder" height="100" width="100" :class="{'opacidad': item !== imgSelect2 }" tile>
                    <v-img :src="n.url"
                           :lazy-src="n.url"
                           aspect-ratio="1"
                           class="grey lighten-2 ma-1"
                           max-width="100"
                           @click="seleccionarImgGrande(n.url, item)"
                           max-height="100">
                      <template v-slot:placeholder>
                        <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                        >
                          <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialgos.editarImg" width="100%">
      <v-card >
        <v-toolbar dense color="grey lighten-3" flat>
          <v-card-title>Editando Fotos</v-card-title>
          <v-spacer></v-spacer>
          <v-row class="d-flex justify-end">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn dark text color="green" v-bind="attrs" class="ma-1" @click="anadirEdicionFotos"
                       x-small fab v-on="on"><v-icon>fa fa-plus</v-icon></v-btn>
              </template>
              <span>Añadir foto</span>
            </v-tooltip>
            <v-btn dark text color="red" x-small class="ma-1" fab @click="dialgos.editarImg = false"><v-icon>fa fa-times</v-icon></v-btn>
          </v-row>
        </v-toolbar>
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th>#</th>
                <th>Acciones</th>
                <th>Principal</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in editarFotos"
                    :class="{'green lighten-5': item.accion === 1 || item.accion === 3, 'red lighten-5': item.accion === 2}">
                  <td>{{i + 1}}</td>
                  <td v-if="item.url">
                    <v-tooltip right>
                      <template v-slot:activator="{on, attrs}">
                        <v-btn x-small fab color="indigo" dark v-on="on" v-bind="attrs"><v-icon>fa fa-eye</v-icon></v-btn>
                      </template>
                      <v-card height="300" width="300">
                        <v-img :src="item.url"
                               :lazy-src="item.url"
                               aspect-ratio="1"
                               class="grey lighten-2 ma-1"
                               max-width="300"
                               max-height="300">
                          <template v-slot:placeholder>
                            <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                            >
                              <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card>
                    </v-tooltip>
                  </td>
                  <td v-else>
                    <v-file-input dense label="Subir imagen" accept="image/*" v-model="item.url"></v-file-input>
                  </td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{on, atts}">
                        <v-btn v-on="on" v-bind="atts" x-small text fab dar v-if="item.isPrincipal === 1" ><v-icon color="green">fa fa-check</v-icon></v-btn>
                        <v-btn v-on="on" v-bind="atts" x-small @click="cambiarFotoPrincipal(item)" text fab dar v-else><v-icon color="red">fa fa-times</v-icon></v-btn>
                      </template>
                      <span v-if="item.isPrincipal === 1">Foto principal</span>
                      <span v-else>Presiona para convertir a principal</span>
                    </v-tooltip>
                  </td>
                  <td>
                    <v-btn fab dark x-small text color="red" @click="deleteImg(item)"><v-icon>fa fa-times</v-icon></v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-text>Las fotos agregadas a este artículo serán visibles para todos las asesores de ventas, redes sociales, pagina web
          y eventos. Por favor añadir fotos de excelente calidad y la foto principal es la foto de presentación.</v-card-text>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" tile small @click="dialgos.editarImg = false">Cerrar Edición</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialgos.componenes" width="50%">
      <v-card>
        <v-toolbar color="grey lighten-3" flat dense>
          <v-card-title>Agregando Componentes</v-card-title>
          <v-spacer></v-spacer>
          <v-row class="d-flex justify-end">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn fab text x-small color="green" v-on="on" v-bind="attrs"
                       dark class="ma-1" @click="anadirComponente"><v-icon>fa fa-plus</v-icon></v-btn>
              </template>
              <span>Añadir Componentes</span>
            </v-tooltip>
            <v-btn fab text x-small color="red" @click="dialgos.componenes = false"
                   dark class="ma-1"><v-icon>fa fa-times</v-icon></v-btn>
          </v-row>
        </v-toolbar>
        <v-container>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Detalle</th>
                  <th>Cantidad</th>
                  <th>Detalle Cantidad</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in editarComponentes" :class="{'green lighten-5': item.accion === 1}">
                  <td>{{i+1}}</td>
                  <td>
                    <v-text-field @keyup="editarComKeyup(item)" dense v-model="item.detalle"></v-text-field>
                  </td>
                  <td>
                    <v-text-field @keyup="editarComKeyup(item)" dense v-model="item.cantidad"></v-text-field>
                  </td>
                  <td>
                    <v-text-field @keyup="editarComKeyup(item)" dense v-model="item.detalle_cantidad"></v-text-field>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-text>*Los componentes son los piezas que complementan un artículo.</v-card-text>
          <v-card-text>*Detalles de cantidad es detallar cuantas piezas vienen. Por ejemplo si en detalle colocan un juego de patas,
          en cantidad tienen que colocar 1 y en detalle de cantidad 6 o la cantidad patas que vengan.</v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" dark small tile @click="dialgos.componenes = false">Terminar Edición</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog width="45%" v-model="dialgos.detalles">
      <v-card>
        <v-toolbar color="grey lighten-3" flat>
          <v-card-title>Editando detalles técnicos</v-card-title>
          <v-spacer></v-spacer>
          <v-row no-gutters class="d-flex justify-end">
            <v-tooltip top>
              <template v-slot:activator="{on, attrs}">
                <v-btn color="green" class="ma-1" v-on="on" v-bind="attrs" @click="editandoDetalles(null, 1)"
                       text x-small fab dark><v-icon>fa fa-plus</v-icon></v-btn>
              </template>
              <span>Añadir detalle</span>
            </v-tooltip>
            <v-btn class="ma-1" color="red" dark fab x-small text @click="dialgos.detalles = false"><v-icon>fa fa-times</v-icon></v-btn>
          </v-row>
        </v-toolbar>
        <v-container>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>#</th>
                <th>Detalle</th>
                <th>Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, i) in editarDetalles"
                  :class="{'green lighten-5': item.accion === 1 || item.accion === 2, 'red lighten-5':item.accion === 3}">
                <td>{{i+1}}</td>
                <td>
                  <v-text-field @keyup="editandoDetalles(item, 2)" dense v-model="item.detalle"></v-text-field>
                </td>
                <td>
                  <v-btn fab text color="red" @click="editandoDetalles(item, 3)"
                         dark x-small><v-icon>fa fa-times</v-icon></v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" tile small dark @click="dialgos.detalles = false">Cerrar Edición</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "editar",
  data(){
    return{
      rules: {
        art: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
        },
      },
      dialgos:{
        detalles: false,
        componenes: false,
        fotos: false,
        editarImg: false
      },
      urlFoto: '',
      urlFoto2: '',
      data: {},
      search: '',
      dialogoBuscar:  false,
      header:[
        {text:'Marcá',value:'marca'},
        {text:'Módelo',value:'modelo'},
        {text:'Código Sístema',value:'codigo_sistema'},
        {text:'Nombre del Artículo',value:'nombre_articulo'},
        {text:'Código Proveedor',value:'codigo_proveedor'},
        {text:'Sub-familia',value:'fam'},
      ],
      Detalles: [],
      Compuestos: [],
      loadFotos: false,
      Fotos: [],
      load: false,
      imgSelect: 0,
      imgSelect2: 0,
      editarFotos: [],
      editarComponentes: [],
      editarDetalles:    [],
      loadDetalles: false
    }
  },
  computed:{
    isPeticon(){
      return this.$store.state.LOAD_ARTICULOS_EDIT;
    },
    Inventario(){
      return this.$store.state.ARTICULOS_EDIT;
    },
  },
  methods:{
    anadirEdicionFotos(){
      let fila = this.editarFotos.length;
      this.editarFotos.push({
        id: null,
        url: null,
        isPrincipal: 0,
        key:         fila,
        accion:      1,
        accionAnt:   1
      });
    },
    anadirComponente(){
      let fila = this.editarComponentes.length;
      this.editarComponentes.push({
        id: null,
        key: fila,
        detalle: '',
        detalle_cantidad: 0,
        cantidad: 0,
        accion: 1,
        articulo_id: this.data.articulo
      })
    },
    cambiarFotoPrincipal(i){
      this.editarFotos.forEach((i)=>{
        if (i.isPrincipal === 1){
          i.isPrincipal = 0;
          i.accion = 3;
        }
      });
      i.isPrincipal = 1;
      i.accion      = 3;
    },
    cargarDetalles(){
      this.loadDetalles = true;
      this.$axios.get('detalles_sucursales/'+this.data.articulo,{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        this.Detalles          = res.data.detalles;
        this.Compuestos        = res.data.compuestos;
        this.Compuestos.forEach((item, i)=>{
          this.editarComponentes.push({
            id: item.id,
            key: i,
            detalle: item.detalle,
            detalle_cantidad: item.detalle_cantidad,
            cantidad: item.cantidad,
            accion: 0,
            articulo_id: item.articulo_id,
            codigo: item.codigo
          })
        })
        res.data.detalles.forEach((item, i)=>{
          this.editarDetalles.push({
            id: item.id,
            key: i,
            accion: 0,
            detalle: item.detalle,
            accionAnt: 0
          })
        })
        this.loadDetalles = false;
      })
    },
    cargarFotos(){
      this.loadFotos = true;
      this.$axios.get('fotos_articulos/'+this.data.articulo).then((res)=>{
        this.Fotos = res.data.fotos;
        this.loadFotos = false;
        this.Fotos.forEach((i, item)=>{
          if (i.isPrincipal === 1)
            this.urlFoto = i.url;

          this.editarFotos.push({
            key: item,
            id:  i.id,
            url: i.url,
            isPrincipal: i.isPrincipal,
            accion:      0,
            accionAnt:   0
          })
        })
      })
    },
    deleteImg(item){
      this.editarFotos.forEach((i)=>{
        if (i.key === item.key) {
          if (i.accionAnt === 0 && i.accion === 2)
            i.accion = 0;
          else{
            i.accionAnt = i.accion;
            i.accion = 2;
          }
        }
      })
    },
    editarComKeyup(i){
      i.accion = 1;
    },
    editandoDetalles(item, val){
      switch (val) {
        case 1:
          this.editarDetalles.push({
            id: null,
            detalle: '',
            key: this.editarDetalles.length,
            accion: 1,
            accionAnt: 1
          });
          break;
        case 2:
          if (item.accionAnt === 0){
            item.accionAnt = item.accion;
            item.accion    = 2;
          }
          break;
        case 3:
          item.accionAnt = item.accion;
          item.accion    = 3;
          break
      }
    },
    seleccionarArticulo(item){
      this.dialogoBuscar = false;
      this.data          = item;
      if (!data.colores){
        data.colores = JSON.stringify(['FFF']);
      }
      this.cargarDetalles();
      this.cargarFotos();
      this.load          = true;
      this.urlFoto       = '';
      this.urlFoto2      = '';
      this.editarComponentes = [];
      this.editarFotos       = [];
      this.Fotos             = [];
      this.editarDetalles    = [];
    },
    seleccionarImagen(url,key){
      this.urlFoto   = url;
      this.imgSelect = key;
    },
    seleccionarImgGrande(url, key){
      this.urlFoto2   = url;
      this.imgSelect2 = key;
    },
    saveEdicion(){
      this.$store.commit('activarOverlay', true);
      let data = new FormData();
      let fotos = [];

      let cont = 0;
      for (let i in this.editarFotos){
        if (this.editarFotos[i].accion === 1) {
          data.append(`file_cliente[${cont}]`, this.editarFotos[i].url);
          cont++;
        }
        if (this.editarFotos[i].accion !== 0)
          fotos.push(this.editarFotos[i])

      }


      data.append('componentes', JSON.stringify(this.editarComponentes));
      data.append('codigo_sistema', this.data.codigo_sistema);
      data.append('id',this.data.articulo);
      data.append('codigo_proveedor',this.data.codigo_proveedor);
      data.append('codigo_barras',this.data.codigo_barras);
      data.append('referencia_fabricante',this.data.referencia_fabricante);
      data.append('nombre_articulo',this.data.nombre_articulo);
      data.append('descripcion',this.data.descripcion_corta);
      data.append('stock_minimo',this.data.stock_m);
      data.append('stock_maximo',this.data.stock_max);
      data.append('imgs', JSON.stringify(fotos));
      data.append('modelo', this.data.modelo);
      data.append('detalles', JSON.stringify(this.editarDetalles));
      this.$axios({
        url: 'articulos/edit',
        method: 'post',
        data: data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.load = false;
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto: res.data.msg,color:'success'});
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor',color:'error'});
      })
    },
    validarForm(){
      if (this.$refs.FormEditArticulo.validate())
        this.saveEdicion();
    }
  },
  created() {
    this.$store.commit('cargar_ARTICULOS_EDIT');
    this.$store.commit('guardarTitulo', 'Inventario > Artículo > Editar');
    this.$store.commit('activarOverlay', false);
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
.cardBorder{
  border: 0.5px solid #000;
}
.opacidad{
  opacity: 0.3;
}
</style>
