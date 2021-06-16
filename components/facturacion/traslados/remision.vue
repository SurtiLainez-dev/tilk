<template>
    <div class="pl-2 pr-2">
      <hr>
      <v-row>
        <v-col>
          <v-select v-model="datos[0].sucursal_id"
                    :item-value="'id'"
                    :item-text="'nombre'"
                    dense
                    disabled
                    label="Sucursal de Oriden"
                    :items="sucursales">
          </v-select>
        </v-col>
        <v-col>
          <v-select v-model="datos[0].sucursal_destino"
                    :item-value="'id'"
                    :item-text="'nombre'"
                    dense
                    label="Sucursal de Destino"
                    disabled
                    :items="sucursales">
          </v-select>
        </v-col>
        <v-col>
          <v-select v-model="datos[0].motivo_traslado_id"
                    :item-value="'id'"
                    dense
                    :item-text="'motivo'"
                    label="Motivo de Traslado"
                    disabled
                    :items="motivos">
          </v-select>
        </v-col>
        <v-col>
          <v-text-field disabled
                        label="Código de Transferencia"
                        :value="datos[0].codigo"
                        dense></v-text-field>
        </v-col>
      </v-row>
      <v-form ref="FormNuevaRemisionTraslado">
        <v-row>
          <v-col cols="3">
            <v-autocomplete :rules="rules"  v-model="Remision.colEnvio"
                            :item-value="'id'"
                            :item-text="'nombre'"
                            label="Colaborador Despachante"
                            :items="Colaboradores">
            </v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete :rules="rules" v-model="Remision.colRecibir"
                            :item-value="'id'"
                            :item-text="'nombre'"
                            label="Colaborador que Recibe"
                            :items="Colaboradores">
            </v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-autocomplete :rules="rules"  v-model="Remision.colTransporte"
                            :item-value="'id'"
                            :item-text="'nombre'"
                            label="Colaborador que Trasporta"
                            :items="Colaboradores">
            </v-autocomplete>
          </v-col>
          <v-col cols="3">
            <v-menu v-model="Remision.dialogo" :close-on-content-click="false"
                    :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field :rules="rules" v-model="Remision.fechaInicio" readonly label="Fecha de Traslado"
                              v-bind="attrs" v-on="on" ></v-text-field>
              </template>
              <v-date-picker v-model="Remision.fechaInicio"
                             @input="Remision.dialogo = false"></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
      <v-btn block small dark color="orange" @click="cargarPdf">Ver Transferencia</v-btn>
      <br>
      <v-divider></v-divider>
      <div class="d-flex justify-end">
        <v-btn color="success" dark @click="validarForm" small>Guardar</v-btn>
      </div>
    </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import Swal from 'sweetalert2'
  export default {
    name: "guia_remision",
    props: {sucursales: Array, motivos: Array},
    data(){
      return{
        rules:[
          v => !!v || 'Campo requerido',
        ],
        Remision:{
          colEnvio:     '',
          colRecibir:   '',
          colTransporte:'',
          fechaInicio:  '',
          dialogo:      false
        },
        Colaboradores: [],
        ColEnvio:      [],
        ColRecibir:    [],
        Transferencia: [],
        loadTrans:     true,
      }
    },
    computed:{
      datos(){
        return this.$store.state.remisionTraslados;
      }
    },
    methods:{
      validarForm(){
        if (this.$refs.FormNuevaRemisionTraslado.validate())
          this.registrarRemision()
      },
      registrarRemision(){
        this.$store.commit('activarOverlay', true);
        this.$store.commit('valorDialogo', false);
        this.$store.commit('valorDialogo2', false);
        this.$axios.post('remision_traslado', {
          transferencia:     this.datos[0].id,
          colaboradorEnvia:  this.Remision.colEnvio,
          colaboradorRecibe: this.Remision.colRecibir,
          trasnportista:     this.Remision.colTransporte,
          fechaEnvio:        this.Remision.fechaInicio
        },{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('valorDialogo', true);
          this.$store.commit('valorDialogo2', true);
          Swal.fire(
            'Creado Exitosamente',
            `Se ha creó exitosamente la remisión.`,
            'success'
          );
          this.$store.commit('asignarFile', [res.data.file, res.data.remision]);
          this.$store.commit('cambiarVista', 4);
        })
      },
      cargarColaboradores(){
        this.$axios.get('colaboradores',{
          headers:{
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }).then((res)=>{
          res.data.colaboradores.forEach( (i) => {
            this.Colaboradores.push({
              "id": i.col,
              "nombre": i.nombres+' '+i.apellidos
            })
          })
        })
      },
      cargarPdf(){
        this.$store.commit('activarOverlay', true);
        this.$store.commit('valorDialogo', false);
        this.$store.commit('valorDialogo2', false);
        this.$axios.post('leer_documento/',{
          ubicacion: this.datos[1]
        },{
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token
          }
        }).then((res)=>{
          if (res.status === 200){
            ipcRenderer.send('open-nav', res.data.url)
            this.$store.commit('activarOverlay', false);
            this.$store.commit('valorDialogo', true);
            this.$store.commit('valorDialogo2', true);
          }
        })
      }
    },
    created() {
      this.cargarColaboradores();
    }
  }
</script>

<style scoped>
  .bordes{
    border: solid #000 1px;
  }
</style>
