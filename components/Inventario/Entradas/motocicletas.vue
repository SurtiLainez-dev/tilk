<template>
    <v-container>
      <strong>Entrada de Motocicletas</strong>
      <v-divider></v-divider>
      <v-form ref="FormNuevaEntradaMotocicletas">
        <div class="pl-3 pr-3 bordes">
          <v-row>
            <v-col md="2">
              <v-select :items="tipoEntrada" label="Tipo de Entrada" :rules="[rules.nombre.cero]"
                        v-model="Ingreso.tipoConsignacion" @change="cambiarTipo"></v-select>
            </v-col>
            <v-col md="3">
              <v-autocomplete :items="Sucursales" :item-text="'nombre'" :rules="[rules.nombre.req]"
                              :item-value="'id'" @change="cargarColaborador"
                              v-model="Ingreso.sucursal" label="Sucursal de Ingreso"></v-autocomplete>
            </v-col>
            <v-col md="2">
              <v-autocomplete :items="Proveedores" :item-text="'nombre'" :rules="[rules.nombre.req]"
                              :item-value="'id'" v-model="Ingreso.proveedor"
                              label="Seleccionar Proveedor" @change="cargarModelos"></v-autocomplete>
            </v-col>
            <v-col md="3">
              <v-select v-model="Ingreso.colaborador" :disabled="!isLoadCol" :rules="[rules.nombre.req]"
                :items="Colaboradores" :item-text="'nombres'" :item-value="'id'" label="Seleccionar Colaborador">
                <template slot='item' slot-scope='{ item }'>
                  {{ item.nombres }} {{ item.apellidos }}
                </template>
              </v-select>
            </v-col>
            <v-col md="2">
              <v-text-field v-model="Ingreso.numero" :rules="[rules.nombre.req]" label="Número de Guía"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="9">
              <v-text-field v-model="Ingreso.observacion" label="Observación"></v-text-field>
            </v-col>
            <v-col md="3" class="d-flex justify-end align-center">
              <v-btn @click="verificarForm" color="success" small dark>Registrar Ingreso</v-btn>
            </v-col>
          </v-row>
        </div>
        <div class="bordes">
          <v-simple-table fixed-header :height="350" dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Módelo</th>
                <th>Chasis</th>
                <th>Motor</th>
                <th>CC</th>
                <th>Color</th>
                <th>Año</th>
                <th colspan="2">OK</th>
                <th >Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Ingreso.articulo">
                <td width="20%">
                  <v-autocomplete dense v-model="item.articulo" :items="Modelos" :item-text="'modelo'"
                                  @change="addCompuestos(item.articulo, item.fila)" :rules="[rules.nombre.req]"
                                  :item-value="'articulo'"></v-autocomplete>
                </td>
                <td><v-text-field dense v-model="item.chasis" :rules="[rules.nombre.req]"></v-text-field></td>
                <td><v-text-field dense v-model="item.motor" :rules="[rules.nombre.req]"></v-text-field></td>
                <td width="6%"><v-text-field dense v-model="item.cc" :rules="[rules.nombre.req]"></v-text-field></td>
                <td width="15%"><v-text-field dense v-model="item.color" :rules="[rules.nombre.req]"></v-text-field></td>
                <td width="7%">
                  <v-text-field @keyup.enter="addFila"  :rules="[rules.nombre.req, rules.anio.anio]" dense v-model="item.anio"></v-text-field>
                </td>
                <td>
                  <v-btn width="25px"  @click="abrirPopupVerificar(item)" height="25px" fab color="green" dark>
                    <v-icon size="15px">fa fa-plus</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-checkbox v-model="item.revisado" :rules="[rules.nombre.verdad]" disabled></v-checkbox>
                </td>
                <td>
                  <v-btn width="25px" @click="removeFila(item.fila)" height="25px" fab color="red" dark>
                    <v-icon size="15px">fa fa-times</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-form>
      <v-dialog v-model="popupVeri" width="50%">
        <v-card class="pl-5 pr-5" v-if="popupVeri">
          <v-card-title>Verificación de artículos compuestos</v-card-title>
          <v-divider></v-divider>
          <v-simple-table dense fixed-header :height="500">
            <template v-slot:default>
              <thead>
              <tr>
                <th>Cantidad</th>
                <th>Descripción</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="index in datosVerificacion.rCompuestos">
                <td width="10%">{{index.cantidad}}</td>
                <td width="80%" v-if="index.detalle_cantidad">{{index.detalle}} ({{index.detalle_cantidad}} unidades)</td>
                <td width="80%" v-else>{{index.detalle}}</td>
                <td width="10%">
                  <v-checkbox dense v-model="index.is"></v-checkbox>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider></v-divider>
          <v-switch v-model="datosVerificacion.revisado" label="¿Terminaste la revisión de este artículo?"></v-switch>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" small dark @click="popupVeri = false">Terminar Revisión</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="popupSuburFile" width="50%">
        <v-card class="pl-5 pr-5">
          <v-card-title>Registro Exitoso de la Orden</v-card-title>
          <v-card-text>La orden de ingreso se ha registrado exitosamente. Por favor subir la
          guía de remisión escaneada y luego presione registrar guía de remisión.</v-card-text>
          <v-form ref="FormSubirFileGuiaRemision">
            <v-file-input accept="application/pdf, image/*" v-model="file"
                          :rules="[rules.nombre.req]" label="Guía de Remisión"></v-file-input>
            <v-row>
              <v-col class="d-flex justify-end">
                <v-btn color="orange" dark small @click="subirFile">Registrar Guía de Remisión</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    props:{tipo: Number, Proveedores: Array, Sucursales: Array},
    name: "motocicletas",
    data(){
      return{
        rules: {
          nombre: {
            verdad: v => v === true || 'Falta Revisión',
            req: v => !!v || 'Campo requerido',
            cero: v => v >= 0 || 'Campo requerido'
          },
          anio:{
            anio: v => v > 2020 || 'Tiene que ser un año'
          }
        },
        isLoadCol: false,
        tipoEntrada:[
          {text:'CONSIGNADA', value:0},
          {text:'FACTURADA', value:1},
        ],
        popupSuburFile: false,
        popupVeri: false,
        datosVerificacion: null,
        popupAdd: false,
        Ingreso:{
          sucursal: '',
          proveedor: '',
          colaborador: '',
          numero: '',
          estado:'',
          tipoConsignacion: 0,
          observacion: 'Sin Observaciones',
          articulo:[]
        },
        Colaboradores: null,
        Marcas: null,
        Modelos: [],
        popupVerificar: false,
        Compuestos: [],
        file: null,
        idGuiaCreada: null,
        Guias: []
      }
    },
    methods:{
      abrirPopupVerificar(tr){
        this.popupVeri = true
        this.datosVerificacion = tr
      },
      addCompuestos(articulo, fila){
        this.Ingreso.articulo.forEach( (i) => {
          if (i.fila === fila){
            i.rCompuestos = []
            this.Compuestos.forEach((e)=>{
              if (i.articulo === e.articulo){
                i.isCompuesto = true
                i.rCompuestos.push({
                  "articulo": e.articulo,
                  "compuesto_id": e.compuesto,
                  "detalle": e.detalle,
                  "cantidad": e.cantidad,
                  "detalle_cantidad": e.detalle_cantidad,
                  "is": false
                })
              }
            })
          }
        })
      },
      addFila(){
        let fila = this.Ingreso.articulo.length;
        let estado = 0;
        if (this.Ingreso.tipoConsignacion === 0)
          estado = 2;
        else if (this.Ingreso.tipoConsignacion === 1)
          estado = 1;
        this.Ingreso.articulo.push({
          "is":       false,"revisado": false,
          "articulo": '', "requiredArticulo": false,
          "marca":    '', "requiredMarca":  false,
          "chasis":   '', "requiredChasis": false,
          "cantidad": 1,
          "motor":    '', "requiredMotor":  false,
          "estado":   estado,
          "cc":       '', "requiredCc":     false,
          "fila":     fila,
          "color":    '', "requiredColor":  false,
          "anio":     '', "requiredAnio":   false,
          "isCompuesto": false,
          "rCompuestos": [],
        })
      },
      cambiarTipo(){
        if (this.Ingreso.tipoConsignacion === 2)
          this.Ingreso.estado = true
        else if (this.Ingreso.tipoConsignacion === 1)
          this.Ingreso.estado = false
        this.Ingreso.articulo.forEach( (i) => {
          i.estado = this.Ingreso.tipoConsignacion
        })
      },
      cargarColaborador(){
        this.$axios.get('colaboradores_suc/'+this.Ingreso.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Colaboradores = res.data.col
            this.isLoadCol = true
          }
        })
      },
      cargarModelos(){
        this.Ingreso.articulo = [
          {
            is: false, revisado:false,
            articulo: null, requiredArticulo: false,
            marca:    null, requiredMarca: false,
            chasis:   null, requiredChasis:false,
            cantidad: 1,
            motor:    null, requiredMotor: false,
            estado:   1,
            cc:       null, requiredCc:false,
            fila:     0,
            color:    null, requiredColor: false,
            anio:     null, requiredAnio: false,
            isCompuesto: false, rCompuestos: []
          }
        ]
        this.$axios.get('cargar_modelos_motocicletas/'+this.Ingreso.proveedor,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Marcas = res.data.modelos
            this.Modelos = []
            this.Compuestos = []
            this.Marcas.forEach((i)=>{
              i.articulos.forEach((e)=>{
                this.Modelos.push({
                  "articulo": e.id,
                  "modelo":   i.nombre +' - '+ e.modelo,
                  "marca":    e.marca_id
                })
                e.articulo_compuestos.forEach((a)=>{
                  this.Compuestos.push({
                    "articulo": e.id,
                    "compuesto": a.id,
                    "detalle":   a.detalle,
                    "cantidad":  a.cantidad,
                    "detalle_cantidad": a.detalle_cantidad
                  })
                })
              })
            })
          }
        })
      },
      registrarOrden(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('ordenes_entrada', {
          proveedor:   this.Ingreso.proveedor,
          sucursal:    this.Ingreso.sucursal,
          tipo:        this.tipo,
          articulos:   this.Ingreso.articulo,
          observacion: this.Ingreso.observacion,
          tipoGuia:    this.Ingreso.tipoConsignacion,
          colaborador: this.Ingreso.colaborador,
          numero:      this.Ingreso.numero
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.$store.commit('activarOverlay', false);
            this.idGuiaCreada = res.data.orden
            this.popupSuburFile = true
          }
        })
      },
      removeFila(fila){
        if (this.Ingreso.articulo.length < 2){
          alert("No puedes eliminar esta fila")
        }else{
          this.Ingreso.articulo.splice(fila, 1)
          for (let item in this.Ingreso.articulo){
            this.Ingreso.articulo[item].fila = item
          }

        }
      },
      subirFile(){
        if (this.$refs.FormSubirFileGuiaRemision.validate()){
          this.popupSuburFile = false
          let data = new FormData()
          data.append('orden', this.idGuiaCreada);
          data.append('file', this.file);
          this.$store.commit('activarOverlay', true);
          this.$axios({
            method: 'post',
            url:    'guia_remision/file',
            data:   data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            if (res.status === 200){
              this.$store.commit('activarOverlay', false);
              Swal.fire(
                'Registro Exitoso',
                `Se registro exitosamente la orden de ingreso`,
                'success'
              )
              this.$router.replace({path:'/inventario/'})
            }
          })
        }else{
          this.notificacion('danger','Ingresa la guia escaneada','Sin Archivos', 4000)
        }
      },
      verificarForm(){
        if (this.$refs.FormNuevaEntradaMotocicletas.validate() && this.Ingreso.articulo.length > 0)
          this.registrarOrden()
      },
    }
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
</style>
