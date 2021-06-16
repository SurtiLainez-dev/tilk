<template>
  <v-card flat class="ma-5">
    <v-row>
      <v-col>
        <v-row  no-gutters>
          <v-col>
            <v-card class="ma-2">
              <v-subheader>DATOS DE LA CUENTA</v-subheader>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Banco</v-list-item-title>
                  <v-list-item-subtitle>{{CUENTA.banco.nombre}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Cuenta</v-list-item-title>
                  <v-list-item-subtitle>{{CUENTA.num}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Tipo de Cuenta</v-list-item-title>
                  <v-list-item-subtitle>{{CUENTA.tipo_cuenta_banco.nombre}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <v-row  no-gutters>
          <v-col>
            <v-card class="ma-2">
              <v-subheader>ACCIONES PERMITIDAS</v-subheader>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Ver Archivo</v-list-item-title>
                  <v-list-item-subtitle>
                    <b-link v-if="CHEQUE.file" @click="verDocumento(CHEQUE.file)">Ver</b-link>
                    <span v-else>Sin Archivo</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Subir Archivo del Cheque</v-list-item-title>
                  <v-list-item-subtitle>
                    <b-link @click="cheque.dialogofile = true" v-if="!CHEQUE.file">Subir</b-link>
                    <span v-else>No se puede subir archivo.</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>Anulación de Cheque Entregado</v-list-item-title>
                  <v-list-item-subtitle>
                    <b-link @click="cheque.dialogoAnulacion = true" v-if="CHEQUE.estado === 2 && CHEQUE.partida">Anular</b-link>
                    <span v-else>No se puede anular, porque no está en estado de entregado.</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-card class="ma-2">
          <v-subheader>DATOS DEL CHEQUE</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>CORRELATIVO</v-list-item-title>
              <v-list-item-subtitle>{{CHEQUE.numeracion}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>ESTADO</v-list-item-title>
              <v-list-item-subtitle>
                <span  v-if="CHEQUE.estado === 1">DISPONIBLE</span>
                <span  v-else-if="CHEQUE.estado === 2">CREADO</span>
                <span  v-else-if="CHEQUE.estado === 3">ENTREGADO</span>
                <span  v-else-if="CHEQUE.estado === 4">ANULADO</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Detalle</v-list-item-title>
              <v-list-item-subtitle>{{CHEQUE.detalle}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Total del Cheque</v-list-item-title>
              <v-list-item-subtitle>L {{int.format(CHEQUE.total)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Partida</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="CHEQUE.partida">{{CHEQUE.partida.referencia}}</span>
                <span v-else>Sin uso de partida</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Observación</v-list-item-title>
              <v-list-item-subtitle>{{CHEQUE.observacion}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Fecha de Uso</v-list-item-title>
              <v-list-item-subtitle>
                {{CHEQUE.fecha_uso.split('-')[2]+'/'+CHEQUE.fecha_uso.split('-')[1]+'/'+CHEQUE.fecha_uso.split('-')[0]}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog v-model="cheque.dialogofile" width="30%">
      <v-card >
        <v-card-title>Subiendo Documento del Cheque</v-card-title>
        <v-divider></v-divider>
        <v-file-input class="ma-4" dense label="Archivo del cheque" accept=".pdf, image/*"
                      v-model="cheque.file"></v-file-input>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="orange" dark tile small @click="cheque.dialogofile = false">Cerrar</v-btn>
          <v-btn color="success" dark tile small @click="subirFile">Subir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="50%" v-model="cheque.dialogoAnulacion">
      <v-card class="pl-5 pr-5 pb-5 pt-5">
        <v-card-title>Datos del Cheque a Anular</v-card-title>
        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>CORRELATIVO</v-list-item-title>
                <v-list-item-subtitle>{{CHEQUE.numeracion}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>ESTADO</v-list-item-title>
                <v-list-item-subtitle>
                  <span  v-if="CHEQUE.estado === 1">DISPONIBLE</span>
                  <span  v-else-if="CHEQUE.estado === 2">CREADO</span>
                  <span  v-else-if="CHEQUE.estado === 3">ENTREGADO</span>
                  <span  v-else-if="CHEQUE.estado === 4">ANULADO</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Detalle</v-list-item-title>
                <v-list-item-subtitle>{{CHEQUE.detalle}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Total del Cheque</v-list-item-title>
                <v-list-item-subtitle>L {{int.format(CHEQUE.total)}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Partida</v-list-item-title>
                <v-list-item-subtitle>
                  <b-link @click="verPartida(CHEQUE.partida.referencia)" v-if="CHEQUE.partida">{{CHEQUE.partida.referencia}}</b-link>
                  <span v-else>Sin uso de partida</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Observación</v-list-item-title>
                <v-list-item-subtitle>{{CHEQUE.observacion}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Fecha de Uso</v-list-item-title>
                <v-list-item-subtitle>
                  {{CHEQUE.fecha_uso.split('-')[2]+'/'+CHEQUE.fecha_uso.split('-')[1]+'/'+CHEQUE.fecha_uso.split('-')[0]}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Acción a Realizar</v-list-item-title>
                <v-list-item-subtitle>
                  Anulación de Cheques
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>

        <v-text-field class="ma-2" v-model="cheque.observacion" label="Detalle sobre Anulación"></v-text-field>

        <v-checkbox v-model="cheque.check"
                    label="Aceptar Responsabilidad de Anulación de esta partida"></v-checkbox>

        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn dark small tile color="orange" @click="cheque.dialogoAnulacion = false">Cerrar</v-btn>
          <v-btn class="text--white" :disabled="!cheque.check" @click="anularCheque" small tile color="success">Anular</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "info",
  data(){
    return{
      int: new Intl.NumberFormat(),
      cheque:{
        file:        null,
        dialogofile: false,
        observacion: '',
        dialogoAnulacion: false,
        check: false
      }
    }
  },
  computed:{
    CHEQUE(){
      return this.$store.state.contabilidad.cheques.CHEQUE;
    },
    CUENTA(){
      return this.$store.state.contabilidad.cheques.CUENTA;
    }
  },
  methods:{
    anularCheque(){
      if (this.cheque.observacion.length > 10) {
        this.cheque.dialogoAnulacion = false;
        this.$store.commit('activarOverlay', true);
        this.$axios.post('contabilidad/2.0/cuenta/cheques/anulacion',{
          referencia:  this.CHEQUE.partida.referencia,
          observacion: this.cheque.observacion,
          id:          this.CHEQUE.id,
          cuentaBanco: this.CUENTA.id
        }).then((res)=>{
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', 1);
          this.$store.commit('contabilidad/cheques/cargar_CHEQUES', this.CUENTA);
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          }, 2500);
        }).catch((error)=>{
          if (error.response.status === 422)
            this.$store.commit('notificacion',{texto: error.response.data.msj, color:'error'});
          else if (error.response.status === 400)
            this.$store.commit('notificacion',{texto: error.response.data.msj, color:'error'});
          else
            this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor, contacta a soporte técnico', color:'error'});

          this.cheque.dialogoAnulacion = true;
          this.$store.commit('activarOverlay', false);
        })
      }else
        this.$store.commit('notificacion',{texto:'El detalle de la anulación debe ser mayor a 10 letras', color:'warning'});
    },
    subirFile(){
      if (this.cheque.file){
        let data = new FormData();
        this.cheque.dialogofile = false;
        data.append('id',   this.CHEQUE.id);
        data.append('file', this.cheque.file);
        this.$store.commit('activarOverlay', true);
        this.$axios({
          method: 'post',
          url:    'contabilidad/2.0/cuenta/cheques/upload/file/',
          data:   data,
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          this.cheque.file = null
          this.$store.commit('contabilidad/cheques/cambiar_VISTACHEQUE', 1);
          this.$store.commit('contabilidad/cheques/cargar_CHEQUES', this.CUENTA);
          this.$store.commit('notificacion',{texto:res.data.msj, color:'success'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          },2500);
        }).catch((error)=>{
          if (error.response.status === 422)
            this.$store.commit('notificacion',{texto:res.data.msj, color:'error'});
          else
            this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'success'});

          this.$store.commit('activarOverlay', false);
        });
      }else{
        !this.$store.commit('notificacion',{texto:'Tienes que cargar un archivo', color:'warning'});
      }
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('pint_navegador', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    verPartida(referencia){
      this.cheque.dialogoAnulacion = false;
      this.$store.commit('activarOverlay', true);
      this.$axios.get('contabilidad/2.0/cuenta/partida/'+referencia).then((res)=>{
        ipcRenderer.send('pint_navegador', res.data.url);
        this.$store.commit('activarOverlay', false);
        this.cheque.dialogoAnulacion = true;
      }).catch((error)=>{
        this.cheque.dialogoAnulacion = true;
        if (error.response.status === 422)
          this.$store.commit('notificacion',{texto:error.response.data.msj, color:'error'});
        else
        this.$store.commit('notificacion',{texto:'Hubo un error al cargar el documento', color:'error'});

        this.$store.commit('activarOverlay', false);
      })
    }
  }
}
</script>

<style scoped>

</style>
