<template>
  <v-card>
    <v-row no-gutters class="grey lighten-2">
      <v-col cols="9">
        <v-card-title>Notas de Crédito</v-card-title>
      </v-col>
      <v-col cols="3" class="d-flex align-center">
        <b-form-input size="sm" v-model="search" class="ma-2" placeholder="Buscar..."></b-form-input>
      </v-col>
    </v-row>
    <b-table :fields="fields"
             caption-top
             small
             hover
             :filter="search"
             class="rowsTable"
             :busy="load"
             bordered
             responsive
             :items="Notas">
      <template v-slot:table-caption>Notas de Crédito Registradas</template>
      <template v-slot:head(referencia)><div class="text-nowrap">Referencia de Nota de Crédito</div></template>
      <template v-slot:head(factura_proveedor.orden_entrada.proveedor.nombre)>Proveedor</template>
      <template v-slot:head(factura_proveedor.orden_entrada.sucursal.nombre)><div class="text-nowrap">Sucursal de Entrada</div></template>
      <template v-slot:head(fecha_creado)><div class="text-nowrap">Fecha de Creación</div></template>
      <template v-slot:head(total)><div class="text-nowrap">Total de NC</div></template>
      <template v-slot:head(concepto)><div class="text-nowrap">Concepto de la Nota de Crédito</div></template>
      <template v-slot:head(factura_proveedor.num_factura)><div class="text-nowrap"># de Factura</div></template>
      <template v-slot:head(factura_proveedor.codigo)><div class="text-nowrap">Código de la Factura</div></template>
      <template v-slot:head(factura_proveedor.total)><div class="text-nowrap">Total de la Factura</div></template>
      <template v-slot:head(factura_proveedor.orden_entrada.codigo)><div class="text-nowrap">Orden de Entrada</div></template>
      <template v-slot:head(nota_c_p_devolucions.devolucion_proveedor.razon)><div class="text-nowrap">Razón de la Devolución</div></template>
      <template v-slot:head(nota_c_p_devolucions.devolucion_proveedor.codigo)><div class="text-nowrap">Código de la Devolución</div></template>
      <template v-slot:head(file)><div class="text-nowrap">Documentos Necesarios</div></template>
      <template v-slot:cell(concepto)="scope">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">{{scope.item.concepto.substring(0, 22)}} ...</span>
          </template>
          <span>{{scope.item.concepto}}</span>
        </v-tooltip>
      </template>
      <template v-slot:cell(total)="scope">L {{int.format(scope.item.total)}}</template>
      <template v-slot:cell(factura_proveedor.total)="scope">L {{int.format(scope.item.factura_proveedor.total)}}</template>
      <template v-slot:cell(nota_c_p_devolucions.devolucion_proveedor.razon)="scope">
        <v-tooltip top v-if="scope.item.nota_c_p_devolucions">
          <template v-slot:activator="{on, attrs}">
            <span v-on="on" v-bind="attrs">{{scope.item.nota_c_p_devolucions.devolucion_proveedor.razon.substring(0, 15)}} ...</span>
          </template>
          <span>{{scope.item.nota_c_p_devolucions.devolucion_proveedor.razon}}</span>
        </v-tooltip>
      </template>
      <template v-slot:cell(factura_proveedor.orden_entrada.sucursal.nombre)="scope">
        <div class="text-nowrap">{{scope.item.factura_proveedor.orden_entrada.sucursal.nombre}}</div>
      </template>
      <template v-slot:cell(factura_proveedor.orden_entrada.proveedor.nombre)="scope">
        <div class="text-nowrap">{{scope.item.factura_proveedor.orden_entrada.proveedor.nombre}}</div>
      </template>
      <template v-slot:cell(factura_proveedor.num_factura)="scope">
        <div class="text-nowrap">{{scope.item.factura_proveedor.num_factura}}</div>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Cargando Notas de Crédito</strong>
        </div>
      </template>
      <template v-slot:cell(file)="scope">
        <v-tooltip top>
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(scope.item.file)"
                   width="25px" fab color="red">
              <v-icon size="18px">fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Ver Nota de Crédito</span>
        </v-tooltip>
        <v-tooltip top >
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(scope.item.factura_proveedor.file_subir)"
                   width="25px" fab color="success">
              <v-icon size="18px">fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Factura del Proveedor Súbida</span>
        </v-tooltip>
        <v-tooltip top >
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(scope.item.factura_proveedor.file_generado)"
                   width="25px" fab color="warning">
              <v-icon size="18px">fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Factura del Proveedor Generada</span>
        </v-tooltip>
        <v-tooltip top >
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(scope.item.factura_proveedor.orden_entrada.file)"
                   width="25px" fab color="indigo">
              <v-icon size="18px">fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Orden de Entrada Generado</span>
        </v-tooltip>
        <v-tooltip top v-if="scope.item.nota_c_p_devolucions">
          <template v-slot:activator="{on, attrs}">
            <v-btn v-on="on" v-bind="attrs" dark height="25px" @click="verDocumento(scope.item.nota_c_p_devolucions.devolucion_proveedor.file_subido)"
                   width="25px" fab color="grey">
              <v-icon size="18px">fa fa-file-pdf</v-icon>
            </v-btn>
          </template>
          <span>Devolución</span>
        </v-tooltip>
      </template>
    </b-table>
  </v-card>
</template>

<script>
  import {ipcRenderer} from "electron";
  export default {
    name: "index",
    created() {
      this.$store.commit('guardarTitulo', 'Contabilidad > Notas de Crédito > Proveedores ');
      this.cargarNotas();
    },
    data(){
      return{
        int: new Intl.NumberFormat(),
        load: true,
        search: '',
        Notas: [],
        fields:[
          { key: 'referencia', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'factura_proveedor.orden_entrada.proveedor.nombre',
          'factura_proveedor.orden_entrada.sucursal.nombre',
          'fecha_creado',
          'total',
          'concepto',
          'factura_proveedor.num_factura',
          'factura_proveedor.codigo',
          'factura_proveedor.total',
          'factura_proveedor.orden_entrada.codigo',
          'nota_c_p_devolucions.devolucion_proveedor.codigo',
          'nota_c_p_devolucions.devolucion_proveedor.razon',
          'file'
        ]
      }
    },
    methods:{
      verDocumento(dir){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: dir
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url);
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      },
      cargarNotas(){
        this.$axios.get('notas_credito', {
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Notas = res.data.notas;
          this.load = false;
        })
      }
    }
  }
</script>

<style scoped>
  .rowsTable{
    cursor: pointer;
  }
</style>
