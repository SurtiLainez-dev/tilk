<template>
    <v-container>
      <strong>Entrada de Artículos por Factura</strong>
      <v-divider></v-divider>
      <v-form ref="FormNuevoIngresoFacturado">
        <div class="pl-3 pr-3 bordes">
          <v-row>
            <v-col cols="3">
              <v-autocomplete :items="Sucursales" :item-text="'nombre'" :rules="[rules.nombre.req]"
                              :item-value="'id'" @change="cargarColaborador"
                              v-model="Ingreso.sucursal" label="Sucursal de Ingreso"></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-autocomplete :items="Proveedores" :item-text="'nombre'" :rules="[rules.nombre.req]"
                              :item-value="'id'" v-model="Ingreso.proveedor"
                              label="Seleccionar Proveedor" @change="cargarInventario"></v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-autocomplete v-model="Ingreso.colaborador" :disabled="!isLoadCol" :rules="[rules.nombre.req]"
                              :items="Colaboradores" :item-text="'nombres'" :item-value="'id'" label="Seleccionar Colaborador">
                <template slot='item' slot-scope='{ item }'>
                  {{ item.nombres }} {{ item.apellidos }}
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="Ingreso.numero" :rules="[rules.nombre.req]" label="Número de Referencia"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="9">
              <v-text-field v-model="Ingreso.observacion" label="Observación"></v-text-field>
            </v-col>
            <v-col md="3" class="d-flex justify-end align-center">
              <v-btn @click="validate" color="success" small dark>Registrar Ingreso</v-btn>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-simple-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th colspan="2">Artículo</th>
                <th >Cant.</th>
                <th >Estado</th>
                <th colspan="2">Revisado</th>
                <th >Quitar</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in Ingreso.articulo">
                <td width="5%">
                  <v-btn @click="abrirModalIncentario(item)" color="green" width="25px" height="25px" fab dark>
                    <v-icon size="15px">fa fa-search</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-text-field v-model="item.descripcion" :rules="[rules.nombre.req]" dense></v-text-field>
                </td>
                <td width="8%">
                  <v-text-field v-model="item.cantidad" type="number" min="1" @keyup.enter="addFila"
                                :rules="[rules.nombre.req]" dense></v-text-field>
                </td>
                <td width="10%">
                  <v-select dense :items="Estados" :item-text="'nombre'" v-model="item.estado"
                            :item-value="'id'" disabled></v-select>
                </td>
                <td width="5%">
                  <v-btn v-if="item.isCompuesto" @click="abrirModalCompuesto(item)"
                         color="indigo" width="25px" height="25px" fab dark>
                    <v-icon size="15px">fa fa-plus</v-icon>
                  </v-btn>
                </td>
                <td width="5%">
                  <v-checkbox disabled :rules="[rules.nombre.verdad]" v-model="item.revisionCompuesto"></v-checkbox>
                </td>
                <td width="5%">
                  <v-btn @click="removeFila(item.fila)" color="red" width="25px" height="25px" fab dark>
                    <v-icon size="15px">fa fa-times</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-form>

      <v-dialog v-model="modalIventario" width="100%">
        <v-card class="pl-5 pr-5">
          <v-card-title>Seleccionando Artículo para la fila {{modalId + 1}}</v-card-title>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="6" class="d-flex align-center"><h6><strong>Artículos</strong></h6></v-col>
            <v-col cols="6">
              <v-text-field v-model="search" append-icon="mdi-magnify"
                            label="Buscar orden de ingreso" single-line hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-data-table v-if="cargarArticulo" :headers="header" :items="Inventario.articulos" :search="search">
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
    data(){
      return{
        search: '',
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
        modalId: null,
        modalIventario: false,
        rules: {
          nombre: {
            verdad: v => v === true || 'Falta Revisión',
            req: v => !!v || 'Campo requerido',
          },
        },
        isLoadCol: false,
        modalCompuesto: false,
        Estados: null,
        Ingreso:{
          sucursal: '',
          proveedor: '',
          colaborador: '',
          numero: '',
          estado:'',
          tipoConsignacion: '',
          observacion: 'Sin Observaciones',
          articulo:[
            {
              is: false, revisado:false,
              articulo: '',
              cantidad: 1,
              descripcion:'',
              estado:   1,
              fila: 0,
              isCompuesto: false,
              rCompuestos: []
            }
          ]
        },
        Colaboradores: [],
        cargarArticulo: false,
        Inventario: null,
        compuestos:[]
      }
    },
    name: "facturadas",
    created() {
      this.cargarEstados()
    },
    methods:{
      addFila(){
        let fila = this.Ingreso.articulo.length
        this.Ingreso.articulo.push({
          "is":       false,"revisado": false,
          "articulo": '',
          "cantidad": 1,
          "estado":   1,
          "fila":     fila,
          "isCompuesto": false,
          "rCompuestos": [],
          "descripcion": '',
        })
      },
      abrirModalCompuesto(item){
        this.compuestos = item.rCompuestos
        this.modalCompuesto = true
        this.modalId = item.fila
      },
      abrirModalIncentario(item){
        this.modalIventario = true;
        this.modalId = item.fila
      },
      cargarColaborador(){
        this.$axios.get('colaboradores_suc/'+this.Ingreso.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            if (res.data.col.length > 0)
              this.Colaboradores = res.data.col;

            this.isLoadCol     = true
          }
        })
      },
      cargarInventario(){
        this.Ingreso.articulo = [
          {
            is: false, revisado:false,
            articulo: '',
            cantidad: 1,
            descripcion:'',
            estado:   1,
            fila: 0,
            isCompuesto: false,
            rCompuestos: []
          }
        ]
        this.$axios.get('inventario/'+this.Ingreso.proveedor,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status == 200){
            this.Inventario = res.data.inventario
            this.cargarArticulo = true
          }
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
        this.modalIventario = false
      },
      registrarOrden(){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('ordenes_entrada', {
          proveedor: this.Ingreso.proveedor,
          sucursal:  this.Ingreso.sucursal,
          tipo:      this.tipo,
          articulos: this.Ingreso.articulo,
          observacion: this.Ingreso.observacion
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
      validate(){
        if (this.$refs.FormNuevoIngresoFacturado.validate())
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
