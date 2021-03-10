<template>
<v-card>
  <v-card flat v-if="!isPeticion" class="pb-10">
    <v-toolbar flat>
      <v-btn tile fab color="warning" @click="$router.replace({path:'/ventas/ordenes_entrega/'})"
             x-small><v-icon>fa fa-arrow-left</v-icon></v-btn>
      <v-spacer></v-spacer>
      <h5>Orden de Entrega {{Orden.cod}}</h5>
      <v-spacer></v-spacer>
      <v-chip x-small color="success" dark v-if="Orden.estado">Entregado</v-chip>
      <v-chip x-small color="red" dark v-else>Pendiente Entrega</v-chip>
    </v-toolbar>
    <v-divider></v-divider>
    <v-card flat class="d-flex justify-center">
      <v-card width="40%">
        <v-card-title>Información de la Orden de Entrega</v-card-title>
        <v-divider></v-divider>

        <v-list class="rowsTable">
          <v-list-item two-line >
            <v-list-item-content>
              <v-list-item-title>Nombre del Cliente</v-list-item-title>
              <v-list-item-subtitle>{{Orden.venta.cliente.nombres}} {{Orden.venta.cliente.apellidos}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>


          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Sucursal de Salida</v-list-item-title>
              <v-list-item-subtitle>{{Orden.venta.colaborador.sucursal.nombre}}</v-list-item-subtitle>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Vendedor</v-list-item-title>
              <v-list-item-subtitle>{{Orden.venta.colaborador.nombres}} {{Orden.venta.colaborador.apellidos}}</v-list-item-subtitle>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Responsable de Entregar</v-list-item-title>
              <v-list-item-subtitle v-if="Orden.estado">{{Orden.encargado}}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>Pendiente Entrega</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Fecha de Entrega</v-list-item-title>
              <v-list-item-subtitle v-if="Orden.estado">{{Orden.fecha_finalizada}}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>Pendiente Entrega</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Comentarios</v-list-item-title>
              <v-list-item-subtitle v-if="Orden.estado">{{Orden.comentarios}}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>Pendiente Entrega</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-row no-gutters>
            <v-col>
              <v-btn tile color="red" small block dark @click="verDocumento(Orden.file_save)">
                <v-icon small>fa fa-file-pdf</v-icon>
                Descargar
              </v-btn>
            </v-col>

            <v-col>
              <v-btn v-if="Orden.estado" tile color="success" small block dark @click="verDocumento(Orden.file)">
                <v-icon small>fa fa-eye</v-icon>
                Ver Documento Firmado
              </v-btn>

              <v-btn v-else tile color="indigo" small block dark @click="abrirDialogoEnvio">
                <v-icon small>fa fa-upload</v-icon>
                Subir Orden de Entrega
              </v-btn>
            </v-col>
          </v-row>


        </v-list>

      </v-card>
    </v-card>

    <v-dialog v-model="dialogo" width="30%">
      <v-card class="pl-5 pr-5">
        <v-card-title>Datos de Orden Entregada</v-card-title>
        <v-divider></v-divider>
        <v-form ref="FormEnvioOrdenEntrega">
          <v-text-field label="Responsable del Envio"
                        dense counter
                        :rules="[rules.responsable.req, rules.responsable.min, rules.responsable.max]"
                        v-model="EnvioOrden.responsable"></v-text-field>
          <v-textarea label="Comentarios de la Entrega"
                      dense counter
                      :rules="[rules.responsable.req, rules.comentarios.min, rules.comentarios.max]"
                      v-model="EnvioOrden.comentarios"></v-textarea>
          <v-file-input label="Orden de Entrega Firmada"
                        counter dense
                        accept="application/pdf"
                        :rules="[rules.responsable.req]"
                        v-model="EnvioOrden.file"></v-file-input>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn tile color="warning" small dark @click="dialogo = false">Cerrar</v-btn>
          <v-btn tile color="success" small dark v-if="!Orden.estado" @click="validarFormulario">Enviar Datos</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>

  <v-overlay :value="isPeticion">
    <v-progress-circular
        indeterminate
        size="150"
    ></v-progress-circular>
  </v-overlay>
</v-card>
</template>

<script>
import {ipcRenderer} from "electron";
import Vue from "vue";

export default {
  name: "orden",
  data(){
    return{
      isPeticion: true,
      Orden:      null,
      dialogo:    false,
      EnvioOrden:{
        responsable: '',
        comentarios: 'Sin comentarios.',
        file:null
      },
      rules: {
        responsable: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
        comentarios:{
          min: v => (v && v.length >= 10) || 'Tiene que ser mayor a 10 carácteres.',
          max: v => (v && v.length <= 200) || 'Tiene que ser menor o igual a 200 carácteres.',
        }
      }
    }
  },
  watch: {
    isPeticion (val) {
      val && setTimeout(() => {
      }, 500)
    },
  },
  methods:{
    abrirDialogoEnvio(){
      if (this.Orden.venta.colaborador.sucursal_id == this.SUCURSAL_ID)
        this.dialogo = true;
      else
        this.notificacion('No puedes acceder a este formulario, porque no eres de la sucursal de venta','success')
    },
    cargarOrden(val){
      if (val === 1)
        this.isPeticion = true

      this.$axios.get('ordenes_entrega/venta/'+this.$route.params.orden).then((res)=>{
        this.Orden = res.data.orden;
        if (val === 1){
          this.isPeticion = false;
          this.$store.commit('guardarTitulo', 'Cuentas > Ordenes de Entrega > Venta > '+this.Orden.venta.cod);
        }
      })
    },
    EnviarOrden(){
      let data = new FormData();
      data.append('id',          this.Orden.id);
      data.append('comentarios', this.EnvioOrden.comentarios);
      data.append('encargado',   this.EnvioOrden.responsable);
      data.append('file',        this.EnvioOrden.file);

      this.$store.commit('activarOverlay', true);
      this.dialogo = false;
      this.$axios({
        method: 'post',
        url:    'ordenes_entrega/venta',
        data:   data,
        headers:{
          'Authorization': 'Bearer ' + this.$store.state.token,
          'Content-Type': "multipart/form-data"
        }
      }).then((res)=>{
        this.$store.commit('ordenes_entrega/cargar_DATA_ORDENES')
        this.notificacion(res.data.msj,'success');
        this.notificacion('Espera un momento a que se actualicen los datos.','success');

        this.cargarOrden(2);
        setTimeout(()=>{
          this.$store.commit('activarOverlay', false);
        }, 6000)
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    },
    notificacion(text, color){
      Vue.$toast.open({
        message: text,
        type: color,
        position: 'bottom-left',
        duration: 4000
      });
    },
    validarFormulario(){
      if (this.$refs.FormEnvioOrdenEntrega.validate())
        this.EnviarOrden();
      else
        this.notificacion('Te hacen falta datos en el formulario de envio','error');
    },
    verDocumento(URL){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('leer_documento/',
          {ubicacion: URL}).then((res)=>{
        if (res.status === 200){
          ipcRenderer.send('open-nav', res.data.url);
          this.$store.commit('activarOverlay', false);
        }
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
      })
    }
  },
  computed:{
    SUCURSAL_ID(){
      return this.$store.state.sucursal;
    }
  },
  async fetch (){
    this.cargarOrden(1);
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
