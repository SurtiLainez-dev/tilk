<template>
    <div>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Bienvenida</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 2" step="2">Configuración del Servidor</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Iniciar Sesión</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container class="contenedores">
              <h3 class="text-center">Bienvenido a TILK de Surtidora Laínez</h3>
              <v-divider></v-divider>
              <p>Este un sístema de gestión de negocios desarrollado para el
                control y facilitar los procesos de
                contabilidad, inventario, planillas, proveedores,
                ventas, cobros y mucho más en un mismo lugar.</p>
              <v-row>
                <v-col class="d-flex justify-center">
                  <v-tooltip top v-for="i in iconos">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="ma-2"  v-on="on" v-bind="attrs" :color="i.color" fab x-small dark>
                        <v-icon>fa fa-{{i.icono}}</v-icon>
                      </v-btn>
                    </template>
                    <span>{{i.titulo}}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <p>Para soporte técnico puede comunicarse al siguiente correo: </p>
              <p><strong>williams_santos@grupolainez.com</strong></p>
            </v-container>

            <v-card-actions class="d-flex justify-end">
              <v-btn class="mt-3" color="primary" @click="e1 = 2">Continuar</v-btn>
            </v-card-actions>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-container class="contenedores">
              <p>Configurando la dirección del servidor al que conectará la aplicación.</p>
              <v-form>
                <v-text-field label="Nombre del Servidor" required v-model="nombreServidor"></v-text-field>
                <v-text-field label="Dirección del Servidor" required v-model="servidor"></v-text-field>
                <v-row>
                  <v-col class="d-flex justify-end">
                    <v-btn class="mt-3" color="primary" @click="goLogin">Agregar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
            <v-divider></v-divider>
            <v-btn class="mt-3" :disabled="nextLogin" @click="e1 = 3" color="primary">Continue</v-btn>
            <v-btn class="mt-3" color="dark" @click="e1 = 1">Atrás</v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            <v-container class="contenedores">
              <login/>
            </v-container>

            <v-btn text @click="e1 = 2">Atras</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import qs from 'qs';
  import login from "../Login/login";
    export default {
      components:{login},
        name: "inicio",
        data(){
            return{
                servidor: 'http://',
                nombreServidor: '',
                e1: 1,
                iconos:[
                    {'titulo': 'Contabilidad', 'icono':'file-invoice-dollar', 'color':'green'},
                    {'titulo': 'Inventario', 'icono':'table', 'color':'indigo'},
                    {'titulo': 'Planillas', 'icono':'user-friends', 'color':'red'},
                    {'titulo': 'Proveedores', 'icono':'file-invoice-dollar', 'color':'purple'},
                    {'titulo': 'Ventas', 'icono':'money-check-alt', 'color':'orange'},
                    {'titulo': 'Cobros', 'icono':'user-shield','color':'pink'},
                ],
                nextLogin: true,
                isPeticion: false
            }
        },
        created() {
            ipcRenderer.on('recuperar-conexion', (e, arg) => {
                localStorage.setItem('guardarConexion', arg.conexion);
                this.$store.commit('guardarConexion', localStorage.getItem('guardarConexion'))
                this.$axios.defaults.baseURL = arg.conexion
                this.nextLogin = false
            })
        },
        methods:{
            goLogin(){
                if (this.servidor.length > 20 && this.nombreServidor.length > 4){
                    let data = {
                      servidor: this.servidor,
                      alias:   this.nombreServidor
                    }
                    ipcRenderer.send('add_conexion', data);
                }else{
                    this.nextLogin = true
                }
            },

        }
    }
</script>

<style scoped>
    .contenedores{
        width: 450px;
        height: 350px;
    }
</style>
