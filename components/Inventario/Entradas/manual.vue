<template>
    <v-container>
      <strong>Entrada de Artículos Manual</strong>
      <v-divider></v-divider>
      <v-form ref="FormNuevaEntradaManual">
        <div class="pl-3 pr-3 bordes">
          <v-row>
          <v-col md="4">
            <v-autocomplete :items="Proveedores" :item-text="'nombre'" :rules="[rules.nombre.req]"
                            :item-value="'id'" v-model="Ingreso.proveedor"
                            label="Seleccionar Proveedor" @change="cargarInventario"></v-autocomplete>
          </v-col>
          <v-col md="4">
            <v-autocomplete :items="Sucursales" :item-text="'nombre'" :item-value="'id'" :rules="[rules.nombre.req]"
                            v-model="Ingreso.sucursal" label="Seleccionar Sucursal de Ingreso"></v-autocomplete>
          </v-col>
          <v-col md="4" class="d-flex justify-end align-center">
            <v-btn color="success" @click="verificarForm" small dark>Registrar Ingreso</v-btn>
          </v-col>
        </v-row>
        </div>
        <div class="bordes" >
          <v-simple-table fixed-header :height="400" dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Buscar</th>
                <th>Código</th>
                <th>Artículo</th>
                <th>Estado</th>
                <th>Cantidad</th>
                <td>Compue.</td>
                <th>Quitar</th>
                <th>OK</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item) in Ingreso.articulo">
                <td width="5%">
                  <v-btn  color="green" width="25px" height="25px"
                          @click="abrirModal(item.fila)" fab dark :disabled="cargaArticulo">
                    <v-icon size="15px">fa fa-search</v-icon>
                  </v-btn>
                </td>
                <td width="10%">
                  <v-text-field :rules="[rules.nombre.req]" dense v-model="item.codigo"></v-text-field>
                </td>
                <td width="50%"><v-text-field :rules="[rules.nombre.req]" dense v-model="item.descripcion"></v-text-field></td>
                <td width="10%"><v-select :items="Estados" :item-value="'id'" @change="verificarEstado(item)"
                                          :item-text="'nombre'" :rules="[rules.nombre.req]" dense v-model="item.estado"></v-select>
                </td>
                <td width="5%">
                  <v-text-field @keyup.enter="addFila" :rules="[rules.nombre.req]" dense v-model="item.cantidad"></v-text-field>
                </td>
                <td >
                  <v-btn @click="abrirModalCompuesto(item)" v-if="item.isCompuesto" width="25px" dark height="25px" fab color="orange" >
                    <v-icon>fa fa-plus</v-icon>
                  </v-btn>
                </td>
                <td >
                  <v-btn @click="removeFila(item.fila)" width="25px" dark height="25px" fab color="red" >
                    <v-icon>fa fa-times</v-icon>
                  </v-btn>
                </td>
                <td >
                  <v-checkbox :rules="[rules.nombre.verdad]" disabled dense v-model="item.revisionCompuesto"></v-checkbox>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-form>


      <v-dialog v-model="popupEstado" width="400px">
        <v-card class="pl-5 pr-5">
          <v-card-title>Dato no admitido</v-card-title>
          <v-card-text>El tipo de estado que has ingreaso no es admitido. Por favor seleccione otra opción.</v-card-text>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn dark small color="orange" @click="popupEstado = false">Aceptar</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalInventario" width="100%">
        <v-card class="pl-5 pr-5" >
          <v-card-title>Seleccionando Artículo para la fila {{modalId + 1}}</v-card-title>
          <h6><strong>Artículos</strong></h6>
          <v-divider></v-divider>
          <v-data-table v-if="!cargaArticulo" :headers="header" :items="Inventario.articulos">
            <template v-slot:item.id="{item}">
              <v-btn color="orange" fab x-small dark @click="registrarFila(item)">
                <v-icon>fa fa-arrow-right</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>
      <v-dialog v-model="modalCompuesto" width="50%">
        <v-card class="pl-5 pr-5" v-if="modalCompuesto">
          <v-card-title>Revisión de Artículos Compuestos</v-card-title>
          <v-simple-table dense fixed-header :height="450">
            <template v-slot:default >
              <thead>
              <tr>
                <th>Descripción</th>
                <th>Revisión</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="item in Ingreso.articulo[modalId].rCompuestos">
                  <td>{{item.descripcion}}</td>
                  <td>
                    <v-checkbox dense v-model="item.is"></v-checkbox>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-switch v-model="Ingreso.articulo[modalId].revisionCompuesto"
                    label="Revisión de los artículos compuestos"></v-switch>
          <v-row>
            <v-col class="d-flex justify-end">
              <v-btn color="orange" dark small @click="modalCompuesto = false">Registrar Revisión</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
  export default {
    props:{tipo: Number, Proveedores: Array, Sucursales: Array},
    name: "manual",
    created() {
      this.cargarEstados();
    },
    data(){
      return{
        rules: {
          nombre: {
            verdad: v => v === true || 'Falta Revisión',
            req: v => !!v || 'Campo requerido',
          },
        },
        compuestos: [],
        modalCompuesto: false,
        header:[
          {text:'Sub-familia', value:'sub_familia_articulo.nombre'},
          {text:'Marca', value:'marca.nombre'},
          {text:'Código', value:'codigo_sistema'},
          {text:'Artículo', value:'descripcion_corta'},
          {text:'Módelo', value:'modelo'},
          {text:'Cod. Fabricante', value:'referencia_fabricante'},
          {text:'Cod. Proveedor', value:'codigo_proveedor'},
          {text:'Cod. Barras', value:'codigo_barras'},
          {text:'Seleccionar', value:'id'},
        ],
        cargaArticulo: true,
        erroresServidor:{},
        Inventario: null,
        Estados: null,
        modalInventario: false,
        modalId: null,
        modalEnvio: false,
        popupVerificar: false,
        alerta:{
          compuesto: true,
          info: true,
          verificacion: true
        },
        popupEstado: false,
        Ingreso:{
          proveedor: null,
          tipoEntrada: this.tipo,
          sucursal: null,
          articulo:[
            {articulo: null, descripcion: null, serie:null, cantidad: 1, requiredS: false, isCompuesto: false, revisionCompuesto:false,
              estado: 1, required: false, fila:0, codigo: null, requiredC: false, lote: false, compuesto: null, rCompuestos: []}
          ]
        }
      }
    },
    methods:{
      abrirModal(fila){
        this.modalInventario = true
        this.modalId = fila
      },
      abrirModalCompuesto(item){
        this.compuestos = item.rCompuestos
        this.modalCompuesto = true
        this.modalId = item.fila
      },
      addFila(){
        let fila = this.Ingreso.articulo.length
        this.Ingreso.articulo.push({
          "fila":        fila ,
          "articulo":    null,
          "required":    false,
          "requiredC":   false,
          "cantidad":    1,
          "serie":       null,
          "requiredS":   false,
          "descripcion": null,
          "codigo":      null,
          "estado":      1,
          "lote":        false,
          "isCompuesto": false,
          "compuesto":   null,
          "rCompuestos": [],
          "revisionCompuesto": false
        })
      },
      cargarEstados(){
        this.$axios.get('estados_articulos',{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.Estados = res.data.estados
          }
        })
      },
      cargarInventario(){
        this.Ingreso.articulo = [
          {articulo: null, descripcion: null, serie:null, cantidad: 1, requiredS: false, isCompuesto: false, revisionCompuesto:false,
            estado: 1, required: false, fila:0, codigo: null, requiredC: false, lote: false, compuesto: null, rCompuestos: []}
        ]
        this.$axios.get('inventario/'+this.Ingreso.proveedor,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status == 200){
            this.Inventario = res.data.inventario
            this.cargaArticulo = false
          }
        })
      },
      registrarFila(tr){
        this.Ingreso.articulo[this.modalId].articulo = tr.id;
        this.Ingreso.articulo[this.modalId].descripcion = `${tr.descripcion_corta} ${tr.modelo}`;
        this.Ingreso.articulo[this.modalId].codigo = tr.codigo_sistema;
        if (tr.is_compuesto === 1){
          this.Ingreso.articulo[this.modalId].isCompuesto = true;
          for (let i in tr.articulo_compuestos){
            let detalle = null
            let detalleCant = 1+' unidad'
            if(tr.articulo_compuestos[i].detalle_cantidad){
              detalleCant = tr.articulo_compuestos[i].detalle_cantidad+' unidades'
            }
            detalle = `${tr.articulo_compuestos[i].cantidad} ${tr.articulo_compuestos[i].detalle} (${detalleCant})`
            this.Ingreso.articulo[this.modalId].rCompuestos.push({
              "articulo_id": tr.id,
              "compuesto_id": tr.articulo_compuestos[i].id,
              "descripcion": detalle,
              "required": false,
              "is": false
            })
          }
        }else{
          this.Ingreso.articulo[this.modalId].revisionCompuesto = true
          this.Ingreso.articulo[this.modalId].isCompuesto = false;
        }

        this.modalInventario = false
      },
      registrarOrden(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('ordenes_entrada', {
          proveedor: this.Ingreso.proveedor,
          sucursal:  this.Ingreso.sucursal,
          tipo:      this.Ingreso.tipoEntrada,
          articulos: this.Ingreso.articulo
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            this.$store.commit('activarOverlay', false);
            Swal.fire(
                'Registro Exitoso',
                `La orden de ingreso manual se ha creado exitosamente.`,
                'success'
            )
            this.$router.replace({path:'/inventario/'})
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
      verificarEstado(item){
        this.modalId = item.fila
        if (item.estado === 3 || item.estado === 1){
          this.popupEstado = false
        }else{
          this.popupEstado = true
        }
      },
      verificarForm(){
        if (this.$refs.FormNuevaEntradaManual.validate())
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
