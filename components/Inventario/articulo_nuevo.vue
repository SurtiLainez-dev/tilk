<template>
  <v-container class="pl-2 pr-2">
    <v-card >
      <v-row>
        <v-col cols="6"><v-card-title>Artículo Nuevo</v-card-title></v-col>
        <v-col cols="6" class="d-flex justify-end align-center">
          <v-btn small dark tile color="orange" class="ma-2" @click="abrirSide(1)">Crear Familia</v-btn>
          <v-btn small dark tile color="pink" class="ma-2" @click="abrirSide(2)">Crear Sub-familia</v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-form class="pl-2 pr-2 d-flex justify-center" ref="FormNuevoArticulo">
        <v-row class="d-flex justify-center">
          <v-col>
            <v-row>
              <v-col>
                <v-autocomplete dense v-model="Articulo.subfamilia" label="Seleccionar Sub-familia"
                                :item-value="'id'" :loading="isPeticionPrincipal" :items="SubFamilias"
                                :item-text="'nombre'" :rules="[rules.nombre.req]" @change="cargarDetallesTecnicos">
                </v-autocomplete>
              </v-col>
              <v-col>
                <v-autocomplete dense v-model="Articulo.marca" :items="Marcas" :item-value="'id'"
                                label="Seleccionar Marca/Proveedor" :rules="[rules.nombre.req]"
                                :item-text="'nombre'"></v-autocomplete>
              </v-col>
              <v-col>
                <v-text-field dense v-model="Articulo.modelo" label="Módelo" :counter="50"
                              :rules="[rules.nombre.req, rules.modelo.min, rules.modelo.max]">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field dense v-model="Articulo.codigoProveedor" label="Código del Proveedor">
                  :counter="50" :rules="[rules.pro.max]"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense v-model="Articulo.fabricante" label="Referencia del Fabricante"
                              :counter="50" :rules="[rules.pro.max]"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field dense label="Código de Barras" v-model="Articulo.barras"
                              :counter="13" :rules="[rules.barras.max]"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field dense label="Nombre del Artículo" v-model="Articulo.nombre"
                              :rules="[rules.nombre.req, rules.nombre.min, rules.nombre.max]"
                              :counter="50" @keyup="agregarModelo"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field suffix="lps" dense label="Precio de Costo" v-model="Articulo.precio"
                              :rules="[rules.nombre.req]"></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-file-input dense accept="image/*" v-model="Articulo.file" :rules="[rules.nombre.req]"
                              label="Foto del Principal del Artículo"></v-file-input>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="8">
                <v-text-field dense :rules="[rules.desc.max, rules.desc.min, rules.nombre.req]"
                              label="Descripción del Artículo" v-model="Articulo.descripcion" :counter="100"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field type="number" v-model="Articulo.stockMinimo"
                              :rules="[rules.nombre.req, rules.stockM.min]" dense
                              min="1" label="Stock Mínimo por sucursal"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field type="number" :min="1 + Articulo.stockMinimo" v-model="Articulo.stockMaximo"
                              :rules="[rules.nombre.req, rules.stockM.minMax]" dense
                              label="Stock Máximo por sucursal"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-checkbox v-model="Articulo.isCompuesto" label="Artículo compuesto"></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox v-model="Articulo.isMotocicleta" label="El artículo es un vehículo"></v-checkbox>
              </v-col>
              <v-col>
                <v-checkbox v-model="Articulo.isDetalles" label="Detalles técnicos"></v-checkbox>
              </v-col>
            </v-row>

            <v-divider></v-divider>
            <v-row no-gutters>
              <v-col cols="4">
                <v-card class="pa-2" flat :disabled="!Articulo.isCompuesto">
                  <v-row no-gutters>
                    <v-col>
                      <v-card-subtitle>Agregar Componentes</v-card-subtitle>
                    </v-col>
                    <v-col class="d-flex justify-end">
                      <v-btn x-small fab color="success" @click="addFilaCompuesto"><v-icon>fa fa-plus</v-icon></v-btn>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-simple-table :height="380" dense>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th>Cant.</th>
                        <th>Des. Componente</th>
                        <th>Cant. Det.</th>
                        <th>Quitar</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in Articulo.componentes">
                        <td>
                          <v-text-field :rules="[rules.nombre.req, rules.stockM.min]"
                                        dense type="number" min="1" v-model="item.cantidad"></v-text-field>
                        </td>
                        <td width="85%">
                          <v-text-field :rules="[rules.nombre.req, rules.modelo.min, rules.nombre.maxDet]" dense
                                        v-model="item.detalle"></v-text-field>
                        </td>
                        <td>
                          <v-tooltip top max-width="300px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field dense type="number"  v-on="on" v-bind="attrs" min="0"
                                            v-model="item.cantidad_detalle"></v-text-field>
                            </template>
                            <span>Este campo es opcional, se usa cuando en cantidad va referido a detalle
                              como un juego. Por ejemplo 1 juego de patas,
                              entonces en este campo va la cantidad de patas.</span>
                          </v-tooltip>
                        </td>
                        <td>
                          <v-btn color="red" @click="removeFilaCompuestos(item.fila)" dark width="25px" height="25px" fab>
                            <v-icon size="15px">fa fa-times</v-icon></v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-card class="pa-2" flat :disabled="!Articulo.isDetalles">
                  <v-card-subtitle>Detalles Técnicos de {{Articulo.nombre}}</v-card-subtitle>
                  <v-row no-gutters>
                    <v-col >
                      <v-row no-gutters>
                        <v-col cols="8"><v-card-subtitle>Detalles técnicos</v-card-subtitle></v-col>
                        <v-col class="d-flex justify-end">
                          <v-btn x-small dark @click="addFilaDetalles" color="success" class="ma-2" fab>
                            <v-icon>fa fa-plus</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-card flat>
                        <v-simple-table dense :height="380">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Detalle</th>
                              <th>Quitar</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item, index) in Articulo.detalles">
                              <td width="90%">
                                <v-text-field :rules="[rules.nombre.req, rules.modelo.min, rules.nombre.maxDet]"
                                              v-model="item.detalle" dense :counter="250"></v-text-field>
                              </td>
                              <td>
                                <v-btn color="red" @click="removeFilaDetalles(item.fila)" fab width="25px" height="25px" dark>
                                  <v-icon size="15px">fa fa-times</v-icon>
                                </v-btn>
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col >
                      <v-card flat :loading="loadDetallesTecnicos">
                        <v-card-subtitle>Detalles técnicos similares</v-card-subtitle>
                        <v-simple-table dense :height="380">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>#</th>
                              <th>Detalle</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(i, item) in detallesTecnicos" @click="addDetalleTecnico(i.detalle)">
                              <td>{{item+1}}</td>
                              <td>{{i.detalle}}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-end">
              <v-btn small dark color="success" class="ma-2" @click="verificarForm" tile>Registrar Artículo</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-navigation-drawer v-model="side" right absolute width="450px" id="side">
      <v-card class="pl-2 pr-2" height="100%" color="black" dark>
        <v-row>
          <v-col class="d-flex justify-start" cols="2">
            <v-btn color="red"  x-small dark @click="side = false">x</v-btn>
          </v-col>
          <v-col cols="10">
            <small v-if="cuerpoForm === 1"><strong>Creando Familia</strong></small>
            <small v-else-if="cuerpoForm === 2"><strong>Creando Sub-familia</strong></small>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-form v-if="cuerpoForm === 1" ref="FormFamiliaArticuloNuevoArticulo">
          <v-text-field label="Nombre de la Familia" :rules="[rules.nombre.req]"
                        v-model="Familia.nombre" :counter="60"></v-text-field>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn @click="registrarFamilia" color="orange" small dark>Registrar Familia</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-form v-else-if="cuerpoForm === 2" ref="FormSubfamiliaArticuloNuevoArticulo">
          <v-select label="Seleccionar Familia" :items="Familias" v-model="SubFamilia.familia"
                    :item-text="'nombre'" :item-value="'id'" :rules="[rules.nombre.req]"></v-select>
          <v-text-field label="Nombre de la Sub-familia" :rules="[rules.nombre.req]"
                        v-model="SubFamilia.nombre" :counter="60"></v-text-field>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" small dark @click="registrarSubFamilia">Registrar Sub-familia</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-navigation-drawer>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: "articulo_nuevo",
  watch: {
    overlay (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  created() {
    this.$store.commit('guardarTitulo', 'Inventario > Artículo > Nuevo');
    this.cargarProveedor();
    this.cargarFamilias();
  },
  data(){
    return{
      loadDetallesTecnicos: false,
      detallesTecnicos: [],
      overlay: false,
      rules: {
        nombre: {
          req: v => !!v || 'Campo requerido',
          min: v => v.length >= 3 || 'Tiene que ser mayor a 3 carácteres.',
          max: v => v.length <= 50 || 'Tiene que ser menor o igual a 50 carácteres.',
          maxDet: v => v.length <= 250 || 'Tiene que ser menor o igual a 250 carácteres.',
        },
        modelo:{
          min: v => v.length >= 2 || 'Tiene que ser mayor a 2 carácteres.',
          max: v => v.length <= 50 || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        pro:{
          max: v => (v.length === 0 || v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        barras:{
          max: v => (v.length === 0 || v.length <= 13) || 'Tiene que ser menor o igual a 13 carácteres.',
        },
        desc:{
          min: v => v.length >= 9 || 'Tiene que ser mayor a 9 carácteres.',
          max: v => v.length <= 100 || 'Tiene que ser menor o igual a 100 carácteres.',
        },
        stockM:{
          min: v => v > 0 || 'Tiene que ser mayor a 0.',
          minMax: v =>  v > this.Articulo.stockMinimo || 'Tiene que ser mayor al stock mínimo'
        }
      },
      side: false,
      cuerpoForm: 1,
      selectSubFamilia: true,
      SubFamilia:{
        nombre: '',
        familia: null,
        sub: ''
      },
      Familia:{
        nombre: '',
        codigo: '',
        familia: null
      },
      sideSubFamilia: false,
      sideFamilia: false,
      erroresServidor:{},
      Proveedores: null,
      errorRequired: 'Este campo no puede quedar vacio',
      Marcas:[],
      Modelos:[],
      Familias:[],
      SubFamilias: [],
      isPeticon: false,
      Articulo:{
        nombre:'',
        descripcion: '',
        proveedor: '',
        marca: '',
        nombreMarca: '',
        modelo: '',
        barras: '',
        precio: '',
        codigoProveedor: '',
        fabricante: '',
        nombreModelo: '',
        familia: '',
        subfamilia: '',
        nombreSubFamilia: '',
        isCompuesto: false,
        isMotocicleta: false,
        componentes:[],
        detalles:[],
        isDetalles:false,
        file: null,
        filePath: '',
        stockMinimo: 1,
        stockMaximo: 2
      },
      isPeticionPrincipal: true,
      isPeticionSave: false,
    }
  },
  methods:{
    abrirSide(val){
      if (val === 1)
        this.cuerpoForm = 1;
      else if (val === 2)
        this.cuerpoForm = 2;
      this.side = true;
    },
    addDetalleTecnico(item){
      let fila = this.Articulo.detalles.length
      this.Articulo.detalles.push({
        "fila": fila,
        "detalle": item,
        "required": false
      })
    },
    addFilaCompuesto(){
      let fila = this.Articulo.componentes.length
      this.Articulo.componentes.push({
        "fila": fila ,
        "cantidad": 1,
        "detalle": '',
        "cantidad_detalle": null,
        "required": false
      })
    },
    addFilaDetalles(){
      let fila = this.Articulo.detalles.length
      this.Articulo.detalles.push({
        "fila": fila,
        "detalle": '',
        "required": false
      })
    },
    agregarModelo(){
      this.Articulo.descripcion = this.Articulo.nombre
    },
    cargarDetallesTecnicos(){
      if (this.Articulo.subfamilia > 0){
        this.loadDetallesTecnicos = true;
        this.$axios.get('detalles_tecnicos/'+this.Articulo.subfamilia).then((res)=>{
          this.detallesTecnicos = res.data.detalles;
          this.loadDetallesTecnicos = false;
        }).catch((error)=>{
          this.loadDetallesTecnicos = false;
        })
      }
    },
    cargarFamilias(){
      this.$axios.get('familias',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status === 200){
          this.Familias = res.data.familias
          this.cargarSubFamilias()
        }
      })
    },
    cargarMarcasP(){
      for (let i in this.Proveedores){
        for (let e in this.Proveedores[i].marcas){
          this.Marcas.push({
            "proveedor_id" : this.Proveedores[i].id,
            "nombre": this.Proveedores[i].nombre + ' - '+this.Proveedores[i].marcas[e].nombre,
            "id": this.Proveedores[i].marcas[e].id,
          })
        }
      }
    },
    cargarProveedor(){
      this.isPeticon = true
      this.$axios.get('proveedores',{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      }).then((res)=>{
        if (res.status == 200){
          this.Proveedores = res.data.proveedores
          this.cargarMarcasP()
          this.isPeticon = false
        }
      })
    },
    cargarSubFamilias(){
      this.SubFamilias = []
      for (let i in this.Familias){
        for (let e in this.Familias[i].sub_familia_articulos){
          this.SubFamilias.push({
            "familia_id": this.Familias[i].id,
            "nombre": this.Familias[i].nombre + ' - '+this.Familias[i].sub_familia_articulos[e].nombre,
            "id": this.Familias[i].sub_familia_articulos[e].id
          })
        }
      }
      this.isPeticionPrincipal = false
    },
    registrarArticulo(){
      let componentes = this.Articulo.componentes.length
      let longitudComponentes = 0;
      let longitudDetalles = 0;
      let detalles = this.Articulo.detalles.length
      for (let i in this.Articulo.componentes){
        if (this.Articulo.componentes[i].detalle){
          this.Articulo.componentes[i].required = false
          longitudComponentes++;
        }else{
          this.Articulo.componentes[i].required = true
        }
      }
      for (let i in this.Articulo.detalles){
        if (this.Articulo.detalles[i].detalle){
          this.Articulo.detalles[i].required = false
          longitudDetalles++
        }else{
          this.Articulo.detalles[i].required = true
        }
      }
      if (componentes === longitudComponentes && longitudDetalles === detalles && this.Articulo.nombre){
        let data = new FormData();
        this.isPeticon = true
        if (this.Articulo.componentes.length < 1){
          this.Articulo.isCompuesto = false
        }
        if (this.Articulo.detalles.length < 1){
          this.Articulo.isDetalles = false
        }
        this.overlay = true
        let detalles = JSON.stringify(this.Articulo.detalles)
        let compuestos = JSON.stringify(this.Articulo.componentes)
        data.append('modelo',              this.Articulo.modelo);
        data.append('marca',               this.Articulo.marca);
        data.append('ferencia_fabricante', this.Articulo.fabricante);
        data.append('codigo_barras',       this.Articulo.barras);
        data.append('codigo_proveedor',    this.Articulo.codigoProveedor);
        data.append('nombre',              this.Articulo.nombre);
        data.append('descripcion',         this.Articulo.descripcion);
        data.append('subfamilia',          this.Articulo.subfamilia);
        data.append('isDetalles',          this.Articulo.isDetalles);
        data.append('isCompuesto',         this.Articulo.isCompuesto);
        data.append('isMotocicleta',       this.Articulo.isMotocicleta);
        data.append('Compuesto',           compuestos);
        data.append('detalles',            detalles);
        data.append('precio',              this.Articulo.precio);
        data.append('Foto',                this.Articulo.file);
        data.append('sMinimo',             this.Articulo.stockMinimo);
        data.append('sMaximo',             this.Articulo.stockMaximo);
        this.$axios({
          method: 'post',
          url:    'articulos',
          data:   data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.$store.commit('inventario/cargarInventario');
          if (res.status === 200){
            this.overlay = false
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente el artículo ${this.Articulo.nombre}.`,
                'success'
            )
          this.$store.commit('quitarPestanaKey',8)
            // this.$router.replace({path:'/inventario/'})
            // this.$store.commit('quitar_pestania', 8)
          }
        })
      }
    },
    registrarFamilia(){
      if (this.$refs.FormFamiliaArticuloNuevoArticulo.validate()){
        this.overlay = true
        this.$axios.post('familias',{
          nombre: this.Familia.nombre,
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.cargarFamilias()
            this.overlay = false
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente la familia ${this.Familia.nombre}.`,
                'success'
            )
            this.side = false
            this.Familia.nombre = ''
          }
        })
      }
    },
    registrarSubFamilia(){
      if (this.$refs.FormSubfamiliaArticuloNuevoArticulo.validate()){
        this.overlay = true
        this.$axios.post('sub_familias',{
          familia: this.SubFamilia.familia,
          nombre: this.SubFamilia.nombre
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.cargarFamilias()
            this.overlay = false
            this.side = false
            Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente la sub-familia ${this.SubFamilia.nombre}.`,
                'success'
            )
            this.SubFamilia.nombre = ''
            this.SubFamilia.familia = null
          }
        })
      }
    },
    removeFilaCompuestos(fila){
      this.Articulo.componentes.splice(fila, 1)
      for (let item in this.Articulo.componentes){
        this.Articulo.componentes[item].fila = item
      }
    },
    removeFilaDetalles(fila){
      this.Articulo.detalles.splice(fila, 1)
      for (let item in this.Articulo.detalles){
        this.Articulo.detalles[item].fila = item
      }
    },
    verificarForm(){
      this.erroresServidor = {};
      if (this.$refs.FormNuevoArticulo.validate())
        this.registrarArticulo()
    }
  },
}
</script>

<style scoped>

</style>
