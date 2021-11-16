<template>
    <v-card class="pl-2 pr-2">
      <v-card-title class="grey lighten-3">Creando Transferencia Externa</v-card-title>
      <v-row>
        <v-col cols="4">
          <v-card>
            <v-row class="pl-2 pr-2">
              <v-col>
                <v-card-title >Formulario de Salida</v-card-title>
                <v-divider></v-divider>
              </v-col>
            </v-row>
            <v-form ref="FormRegistroTrasladoExterno" class="pl-3 pr-3">
              <v-text-field dense
                            disabled
                            :rules="[rule.suc.req]"
                            v-model="suc"
                            label="Sucursal de Salida">
              </v-text-field>
              <v-text-field label="Remitente"
                            counter
                            v-model="Traslado.remitente"
                            :rules="[rule.suc.req, rule.remitente.max, rule.remitente.min]"
                            dense>
              </v-text-field>
              <v-text-field label="Referencia de Remisión"
                            counter
                            v-model="Traslado.referencia"
                            :rules="[rule.suc.req, rule.remision.max, rule.remision.min]"
                            dense>
              </v-text-field>
              <v-textarea dense
                          counter
                          rows="4"
                          v-model="Traslado.observacion"
                          :rules="[rule.suc.req, rule.observacion.max, rule.observacion.min]"
                          placeholder="Describir observaciones y dirección del remitente. departamento/ciudad."
                          label="Observación">
              </v-textarea>
              <v-file-input accept="image/*, application/pdf"
                            v-model="Traslado.fileReferencia"
                            :rules="[rule.suc.req]"
                            label="Documento de Referencia"></v-file-input>
              <hr>
              <v-card-actions class="d-flex justify-end">
                <v-btn small color="success" @click="validarForm" dark>Registrar Salida</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-col>
        <v-col cols="8" class="pr-3 pl-3 con">
          <v-row class="pr-2">
            <v-col cols="8"></v-col>
            <v-col class="d-flex justify-end" cols="4">
              <b-form-input
                v-model="search"
                type="search"
                id="filterInput"
                placeholder="Buscar">
              </b-form-input>
            </v-col>
          </v-row>
          <b-table
            :busy="load"
            :filter="search"
            bordered
            selected-variant="success"
            class="rowsTable"
            small
            @row-selected="onRowSelected"
            :sticky-header="stickyHeader"
            :no-border-collapse="noCollapse"
            responsive
            hover
            selectable
            caption-top
            :items="Traslado.Motocicletas"
            :fields="fields">
            <template v-slot:table-caption>Motocicletas en piso</template>
            <template v-slot:head(chasis)="scope"><div class="text-nowrap">Chasis de Motocicleta</div></template>
            <template v-slot:head(modelo)="scope"><div class="text-nowrap">Módelo de Motocicleta</div></template>
            <template v-slot:head(estado_articulo.nombre)="scope"><div class="text-nowrap">Estado Artículo</div></template>
            <template v-slot:head(guia_remision)="scope"><div class="text-nowrap">Referencia de Guía de Remisión</div></template>
            <template v-slot:head(serie_sistema)="scope"><div class="text-nowrap">Seríe del Sístema</div></template>
            <template v-slot:head(fecha_entrada)="scope"><div class="text-nowrap">Fecha de Entrada</div></template>
            <template v-slot:cell(sucursal_actual)="scope">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <span v-on="on" v-bind="attrs">{{scope.item.sucursal_actual}}</span>
                </template>
                <span>{{scope.item.sucursal_actual_nombre}}</span>
              </v-tooltip>
            </template>
            <template v-slot:cell(sucursal_entrada)="scope">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <span v-on="on" v-bind="attrs">{{scope.item.sucursal_entrada}}</span>
                </template>
                <span>{{scope.item.sucursal_entrada_nombre}}</span>
              </v-tooltip>
            </template>
            <template v-slot:table-busy>
              <div class="text-center text-success my-2">
                <b-spinner small class="align-middle"></b-spinner>
                <strong>Cargando...</strong>
              </div>
            </template>
          </b-table>

          <div style="height: 300px; overflow-y: auto">
            <b-table-simple sticky-header class="tableSize rowsTable" small v-for="item in Traslado.select">
              <b-thead >
                <b-tr >
                  <b-td colspan="4">Motocicleta {{item.chasis}}/{{item.motor}}/{{item.modelo}}/{{item.marca}}/{{item.color}}</b-td>
                  <td class="d-flex justify-end"><b-checkbox v-model="item.revisado"></b-checkbox></td>
                </b-tr>
              </b-thead>
              <b-thead>
                <b-tr>
                  <b-th>Cantidad</b-th>
                  <b-th>Nombre del Componente</b-th>
                  <b-th>Sucursal</b-th>
                  <b-th>Stock Actual</b-th>
                  <b-th>Cant. Salida</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <tr v-for="i in item.componentes" >
                  <td>{{i.cantidad_componente}}</td>
                  <td>{{i.nombre_componente}}</td>
                  <td>{{item.sucursal_actual_nombre}}</td>
                  <td>{{i.inventario.stock_nuevo}}</td>
                  <td width="10%">
                    <b-input v-model="i.cantidad_salida"
                             @change="verificarCantidad(i.inventario.stock_nuevo, i.cantidad_salida, i)"
                             @keyup="verificarCantidad(i.inventario.stock_nuevo, i.cantidad_salida, i)"
                             max="1" size="sm" type="number"></b-input>
                  </td>
                </tr>
              </b-tbody>
            </b-table-simple>
          </div>
        </v-col>
      </v-row>

      <v-dialog v-model="Traslado.dialogoArchivo" width="50%">
        <v-card>
          <v-card-title class="grey lighten-3">Registro de Documento Firmado</v-card-title>
          <v-container>
            <v-card-text>El Traslado se ha registrado exitosamente. Por favor imprima el documento de traslado,
            lo firman y luego lo vuelve a cargar para que se registre.</v-card-text>
            <v-divider></v-divider>
            <v-form ref="FormCargarDocumentoTrasladoFirmado">
              <v-row>
                <v-col cols="11">
                  <v-file-input accept="image/*, application/pdf"
                                v-model="Traslado.fileFirmado"
                                :rules="[rule.suc.req]"
                                label="Documento de Traslado Firmado"></v-file-input>
                </v-col>
                <v-col cols="1" class="d-flex align-center justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn v-on="on" @click="verDocumento" v-bind="attrs" color="red" fab x-small dark>
                        <v-icon>fa fa-download</v-icon>
                      </v-btn>
                    </template>
                    <span>Descargar Documento de Traslado</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <hr>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="success" @click="registrarFileFirmado" dark small>Registrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
  import Swal from "sweetalert2";
  import {ipcRenderer} from "electron";
  export default {
    name: "externas",
    created() {
      this.$store.commit('guardarTitulo', 'Transferencias > Transferencias Externas > Nuevo');
      this.cargarMotocicletas();
    },
    data(){
      return{
        stickyHeader: true,
        noCollapse: false,
        rule: {
          suc: {
            req:  v => !!v          || 'Campo requerido',
          },
          observacion:{
            min: v => (v && v.length >= 20) || 'Tiene que ser mayor a 20 carácteres.',
            max: v => (v && v.length <= 250) || 'Tiene que ser menor o igual a 250 carácteres.',
          },
          remitente:{
            min: v => (v && v.length >= 2) || 'Tiene que ser mayor a 2 carácteres.',
            max: v => (v && v.length <= 60) || 'Tiene que ser menor o igual a 60 carácteres.',
          },
          remision:{
            min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
            max: v => (v && v.length <= 19) || 'Tiene que ser menor o igual a 19 carácteres.',
          }
        },
        fields: [
          { key: 'chasis', stickyColumn: true, isRowHeader: true, variant: 'light'},
          'color',
          'motor',
          'marca',
          'modelo',
          'sucursal',
          'estado',
          'guia_remision',
          'entrada',
          'serie_sistema',
          'cc',
          'fecha_entrada',
          'año'
        ],
        Traslado:{
          remitente:      '',
          observacion:    '',
          fileReferencia: null,
          fileFirmado:    null,
          referencia:     '',
          select:         [],
          Motocicletas:   [],
          idMoto:         null,
          dialogoArchivo: false,
          Traslado_id:    null,
          direccion_file: null,
        },
        search: '',
        load:true,
      }
    },
    computed:{
      sucursal(){
        return this.$store.state.sucursal;
      },
      suc(){
        return this.$store.state.sucursal_id;
      }
    },
    methods:{
      cargarMotocicletas(){
        this.$axios.get('traslados_externos/'+this.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          let componentes = [];
          let inventario  = [];
          res.data.motocicletas.forEach((i)=>{
            componentes = [];
            i.articulo.articulo_compuestos.forEach( (item) => {
              inventario = [];
              if (item.inventario_compuestos.length > 0){
                inventario = item.inventario_compuestos[0];
                componentes.push({
                  "moto_id":                     i.motocicleta.id,
                  "componente_id":               item.id,
                  "nombre_componente":           item.detalle,
                  "cantidad_componente":         item.cantidad,
                  "detalle_cantidad_componente": item.detalle_cantidad,
                  "inventario":                  inventario,
                  "cantidad_salida":             0
                })
              }
            });
            this.Traslado.Motocicletas.push({
              "remision_id":             i.id,
              "id":                      i.motocicleta.id,
              "chasis":                  i.motocicleta.chasis,
              "motor":                   i.motocicleta.motor,
              "marca":                   i.articulo.marca.nombre,
              "articulo_id":             i.articulo.id,
              "color":                   i.color,
              "modelo":                  i.articulo.modelo,
              "sucursal":                i.sucursal.abreviatura,
              "sucursal_actual_nombre":  i.sucursal.nombre,
              "estado":                  i.estado_articulo.nombre,
              "guia_remision":           i.motocicleta.guia_remision.num_guia,
              "entrada":                 i.motocicleta.guia_remision.orden_entrada.sucursal.abreviatura,
              "sucursal_entrada_nombre": i.motocicleta.guia_remision.orden_entrada.sucursal.nombre,
              "serie_sistema":           i.serie_sistema,
              "cc":                      i.motocicleta.cilindraje,
              "fecha_entrada":           i.motocicleta.guia_remision.orden_entrada.fecha_creacion,
              "año":                     i.motocicleta.anio,
              "componentes":             componentes,
              "revisado":                false
            })
          });
          this.load = false
        })
      },
      onRowSelected(items){
        this.Traslado.select = items;
      },
      registrarFileFirmado(){
        if (this.$refs.FormCargarDocumentoTrasladoFirmado.validate()){
          this.$store.commit('activarOverlay', true);
          this.Traslado.dialogoArchivo = false;
          let data = new FormData();
          data.append('file_referencia', this.Traslado.fileFirmado);
          data.append('traslado', this.Traslado.Traslado_id)
          this.$axios({
            method: 'post',
            url: 'traslados_externos/file',
            data:data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            this.$router.replace({path:'/inventario/traslados/traslados_externos'});
            this.$store.commit('activarOverlay', false);
            Swal.fire(
              'Registro Exitoso',
              `El traslado externo a ${this.Traslado.remitente} se ha realizado correctamente. Verífique su inventario
              y si ve datos incorrectos en el stock reportarlo de inmediato.`,
              'success'
            );
          }).catch((error)=>{
            this.$store.commit('activarOverlay', false);
          })
        }
      },
      registrarTraslado(){
        let data = new FormData();
        this.$store.commit('activarOverlay', true);
        let cuerpo = JSON.stringify(this.Traslado.select);
        data.append('detalle', this.Traslado.observacion);
        data.append('sucursal', this.sucursal);
        data.append('referencia', this.Traslado.referencia);
        data.append('remitente', this.Traslado.remitente);
        data.append('cuerpo', cuerpo);
        data.append('file_referencia', this.Traslado.fileReferencia);
        this.$axios({
          method: 'post',
          url: 'traslados_externos',
          data:data,
          headers:{
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.Traslado.Traslado_id    = res.data.traslado;
          this.Traslado.direccion_file = res.data.direccion;
          this.Traslado.dialogoArchivo = true;
          this.$store.commit('activarOverlay', false);
        })
      },
      validarForm(){
        let bandera = this.Traslado.select.length, contador = 0;
        if (bandera > 0) {
          this.Traslado.select.forEach( (i) => {
            if (i.revisado)
              contador++
          });
          if (bandera === contador){
            if (this.$refs.FormRegistroTrasladoExterno.validate()) {
              this.registrarTraslado();
            }
          }else{
            Swal.fire(
                'Error en el Revisado',
                `Falta la revisión de componentes de las motocicletas que estan en lista de salida.`,
                'warning'
            );
          }
        }else{
          Swal.fire(
              'Sin datos',
              `No se ha seleccionado ninguna motocicleta.`,
              'warning'
          );
        }
      },
      verDocumento(){
        this.$store.commit('activarOverlay', true);
        this.Traslado.dialogoArchivo = false;
        this.$axios.post('leer_documento/',{
          ubicacion: this.Traslado.direccion_file
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Traslado.dialogoArchivo = true;
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
          }
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
        })
      },
      verificarCantidad(cant, salida,item){
        if (salida > cant){
          Swal.fire(
            'Cantidad Excedida',
            `La cantidad de salida es mayor a la cantidad en piso.`,
            'warning'
          );
          item.cantidad_salida = 0;
        }
        if (salida > 1){
          Swal.fire(
            'Cantidad Excedida',
            `La cantidad máxima de salida de este componente es 1.`,
            'warning'
          );
          item.cantidad_salida = 1;
        }
      }
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
  .tableSize{
    font-size: 12px;
  }
</style>
