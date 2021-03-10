<template>
    <v-card>
      <v-card-title>Remisiones por Aceptar</v-card-title>
      <v-data-table :headers="header"
                    :loading="load"
                    dense
                    @click:row="abrirDialogoVerificacion"
                    class="rowsTable"
                    loading-text="Cargando datos ..."
                    :items="Transferencias">
      </v-data-table>

      <v-dialog v-model="dialogoVerificacion">
        <v-card class="pr-5 pl-5" v-if="selected">
          <v-card-title>Verificación de Remisión de Traslado {{selected.codigo}}</v-card-title>
          <v-row>
            <v-col><strong>Responsable de Recibir: </strong> {{selected.remision_transferencia.recibe.nombres}} {{selected.remision_transferencia.recibe.apellidos}}</v-col>
            <v-col><strong>Responsable de Transportar:</strong> {{selected.remision_transferencia.traslado.nombres}} {{selected.remision_transferencia.traslado.apellidos}}</v-col>
            <v-col><strong>Documento: <v-btn fab x-small color="red" dark @click="ver_file_remision">
              <v-icon>fa fa-file-pdf</v-icon>
            </v-btn></strong></v-col>
          </v-row>
          <hr>
          <v-row>
            <v-col cols="6">Detalle</v-col>
            <v-col cols="1" >Cant.</v-col>
            <v-col cols="1" >Recibida</v-col>
            <v-col cols="1" >Estado</v-col>
            <v-col cols="1" >Remisión</v-col>
            <v-col cols="1" >Compue.</v-col>
            <v-col cols="1" >Vehículo</v-col>
          </v-row>
          <v-form ref="FormDecisionRemision">
            <v-expansion-panels>
              <v-expansion-panel  :class="{'grey  lighten-2': i%2 === 0,'grey lighten-4': i%2 !== 0}"
                                  v-for="(item,i) in selected.cuerpo_transferencias" :key="i" class="rowsTable">
                <v-expansion-panel-header>
                  <v-row>
                    <v-col cols="6">
                      <h5>{{item.articulo.nombre_articulo}}</h5> <small>[cod:{{item.articulo.codigo_sistema}}]</small>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <h5>{{item.cantidad}}</h5>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-text-field :rules="[rule.num.req, rule.num.num]" v-model="item.cantidad_recibida" dense></v-text-field>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <h5>{{item.estado_articulo}}</h5>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-icon v-if="item.is_remision === 1" dark x-small color="success">fa fa-check</v-icon>
                      <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-icon v-if="item.is_componente === 1" dark x-small color="success">fa fa-check</v-icon>
                      <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
                    </v-col>
                    <v-col cols="1" class="text-center">
                      <v-icon v-if="item.articulo.is_motocicleta === 1" dark x-small color="success">fa fa-check</v-icon>
                      <v-icon v-else dark x-small color="error">fa fa-times</v-icon>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <hr>
                  <v-row>
                    <v-col v-if="item.is_componente === 1">
                      <v-card class="pl-2">
                        <small>*Componentes solicitados para enviar:</small>
                        <v-simple-table dense fixed-header height="180px">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Detalle</th>
                              <th>Cant.</th>
                              <td>Recibido</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="componente in item.componentes_transferencias">
                              <td width="80%">{{componente.articulo_compuesto.cantidad}} {{componente.articulo_compuesto.detalle}} <small v-if="componente.articulo_compuesto.detalle_cantidad">({{componente.articulo_compuesto.detalle_cantidad}} unidades)</small></td>
                              <td width="10%" class="text-center">
                                {{componente.cantidad}}
                              </td>
                              <td width="10%" >
                                <v-text-field :rules="[rule.num.req, rule.num.num]" dense v-model="componente.cantidad_recibida"></v-text-field>
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                    <v-col v-if="item.is_remision === 1">
                      <v-card class="pl-2">
                        <small>*Artículos en remisión a enviar:</small>
                        <v-simple-table dense fixed-header height="180px">
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Cód. Sístema</th>
                              <th>Seríe</th>
                              <th>Color</th>
                              <th>Chequeo</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="remision in item.remision_art_traslado">
                              <td>{{remision.remision_articulo.serie_sistema}}</td>
                              <td>{{remision.remision_articulo.serie_fabricante}}</td>
                              <td>{{remision.remision_articulo.color}}</td>
                              <td>
                                <v-checkbox v-model="remision.recibida"></v-checkbox>
                              </td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                    <v-col v-if="item.articulo.is_motocicleta === 1">
                      <v-card class="pl-2">
                        <small>*Motocicletas:</small>
                        <v-simple-table fixed-header height="180px" dense>
                          <template v-slot:default>
                            <thead>
                            <tr>
                              <th>Chasís</th>
                              <th>Motor</th>
                              <th>Año</th>
                              <th>CC</th>
                              <th>Placa</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="moto in item.remision_art_traslado">
                              <td>{{moto.remision_articulo.motocicleta.chasis}}</td>
                              <td>{{moto.remision_articulo.motocicleta.motor}}</td>
                              <td>{{moto.remision_articulo.motocicleta.anio}}</td>
                              <td>{{moto.remision_articulo.motocicleta.cilindraje}}</td>
                              <td>{{moto.remision_articulo.motocicleta.placa}}</td>
                            </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-form>

          <v-card-actions class="d-flex justify-end">
            <v-btn color="orange" dark small @click="dialogoVerificacion = false">Cerrar</v-btn>
            <v-btn color="success" dark small @click="dialogoAbrirFile">Aceptar Remisión de Transferencia</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogoFile" width="30%">
        <v-card class="pl-5 pr-5">
          <v-card-title>Subir Documento Firmado</v-card-title>
          <hr>
          <v-form ref="FormValidarFileRemision">
            <v-file-input accept="image/*, application/pdf" v-model="file"
                          :rules="[rule.num.req]" label="Remisión Fírmada">
            </v-file-input>
            <v-textarea v-model="observacion" :rules="[rule.num.req]"
                        rows="2" label="Observación"></v-textarea>
            <v-menu v-model="dialogoFecha" :close-on-content-click="false"
                    :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="fecha_recibido" :rules="[rule.num.req]"
                              readonly label="Fecha de Recibido"
                              v-bind="attrs" v-on="on" ></v-text-field>
              </template>
              <v-date-picker v-model="fecha_recibido"
                             @input="dialogoFecha = false"></v-date-picker>
            </v-menu>
          </v-form>
          <v-card-actions class="d-flex justify-end">
            <v-btn dark small color="red" @click="dialogoFile = false">Cerrar</v-btn>
            <v-btn dark small color="success" @click="validarFile">Registrar Aceptación de Remisión</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
</template>

<script>
  import Swal from "sweetalert2";
  import {ipcRenderer} from "electron";
  export default {
    name: "view_transferencias",
    data(){
      return{
        dialogoFecha: false,
        rule: {
          num: {
            req: v => !!v || 'Campo requerido',
            num: v => /^([0-9])*$/.test(v) || 'Dato Invalido',
            file: v => v.length > 0 || 'Tiene que Subir Documento Firmado'
          },
          obs:{
            max: v => v.length < 400 || 'No puede ser mayor a 400 carácteres',
            min: v => v.length > 5  || 'Tiene que ser mayor a 5 carácteres'
          }
        },
        file: null,
        dialogoFile:false,
        selected: null,
        header:[
          {text:'Sucursal de Origen', value:'sucursal.nombre'},
          {text:'Cod. Transferencia', value:'codigo'},
          {text: 'Cod. Remisión', value:'remision_transferencia.codigo_remision'}
        ],
        Transferencias: [],
        dialogoVerificacion: false,
        load: true,
        observacion: 'Todo bien',
        fecha_recibido: ''
      }
    },
    computed:{
      sucursal(){
        return this.$store.state.sucursal
      }
    },
    methods:{
      abrirDialogoVerificacion(data){
        this.selected = data;
        this.dialogoVerificacion = true;
      },
      ver_remisiones(){
        this.$axios.get('view_traslados/'+this.sucursal,{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.Transferencias = res.data.remisiones
          this.load = false
        })
      },
      ver_file_remision(){
        this.dialogoVerificacion = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('leer_documento/',{
          ubicacion: this.selected.remision_transferencia.file_generado
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
            this.dialogoVerificacion = true
          }
        })
      },
      dialogoAbrirFile(){
        if (this.$refs.FormDecisionRemision.validate())
          this.dialogoFile = true;
      },
      validarFile(){
        if (this.$refs.FormValidarFileRemision.validate())
          this.guardarRemision()
      },
      guardarRemision(){
        let data = new FormData();
        this.dialogoFile = false;
        this.dialogoVerificacion = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('guardar_remision',{
          id:             this.selected.id,
          cuerpo:         this.selected.cuerpo_transferencias,
          remision:       this.selected.remision_transferencia.id,
          origen:         this.selected.sucursal_id,
          destino:        this.selected.sucursal_destino,
          observacion:    this.observacion,
          fecha_recibido: this.fecha_recibido
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          this.ver_remisiones();
          data.append('file', this.file);
          data.append('id', this.selected.remision_transferencia.id);
          this.$axios({
            method: 'post',
            url:    'subir_remision_firmada',
            data: data,
            headers:{
              'Authorization': 'Bearer ' + this.$store.state.token,
              'Content-Type': "multipart/form-data"
            }
          }).then((res)=>{
            this.$store.commit('activarOverlay', false);
            Swal.fire(
              'Registro Exitoso del Stock',
              `Haz aceptado exitosamente la guía de remisión ${this.selected.remision_transferencia.numeracion}.
              El stock del piso ${this.selected.destino.nombre} ya se actualizó, verífique el inventario. Si detexta alguna
              alteración de inventario incorrecta por favor notificarlo de inmediato.`,
              'success'
            );
          })
        })
      }
    },
    async fetch (){
      this.Transferencias = (await this.$axios.get('view_traslados/'+this.sucursal,{
        headers: {
          'Authorization': 'Bearer ' + this.$store.state.token
        }
      })).data.remisiones;
      this.load = false
    }
  }
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
