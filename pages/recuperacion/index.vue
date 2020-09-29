<template>
    <div class="pt-10">
      <div class="pt-5 container">
        <v-stepper v-model="stepper">
          <v-stepper-header>
            <v-stepper-step :complete="stepper > 1" step="1">Envío de Información</v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step :complete="stepper > 2" step="2">Comprobar Código</v-stepper-step>
            <v-divider></v-divider>
          </v-stepper-header>

          <v-stepper-content step="1">
            <v-card>
              <v-card-title>
                Recuperación de contraseña
              </v-card-title>
              <v-card-text>
                Ingresa el correo eléctronico con el que inicias sesión al sistema, se te
                enviará un código al correo que luego tienes que ingresar cuando se te pida.
              </v-card-text>
              <v-form ref="formRecuperacion" class="form">
                <v-row class="pl-2 pr-2">
                  <v-col cols="6">
                    <v-text-field v-model="email" :rules="rulesEmail" label="E-mail" required>
                    </v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="identidad"
                      :counter="13"
                      :rules="rulesIdentidad"
                      label="Identidad o Número de Ingreso"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-card-actions class="d-flex justify-end">
                  <v-btn class="mt-3" color="orange" :disabled="isPeticion"
                         dark @click="validate(1)">Solicitar Código</v-btn>
                </v-card-actions>
                <v-row v-if="error">
                  <v-col>
                    <v-alert dense outlined type="error">
                      {{error}}
                    </v-alert>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
            <v-divider></v-divider>
            <v-btn class="mt-3" @click="backInicio" dark color="dark">Regresar</v-btn>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-card>
              <v-card-title>
                Ingresar Código de Validación
              </v-card-title>
              <v-card-text>
                Por favor ingresa el código de seguridad que se te envió al correo
              </v-card-text>
              <v-form class="form pl-2 pr-2" ref="FormCodigoRecuperacion">
                <v-text-field v-model="codigo" :counter="6" :rules="ruleCodigo"
                  label="Código de seguridad" required></v-text-field>
                <v-card-actions class="d-flex justify-end">
                  <v-btn class="mt-3" color="orange" :disabled="isValidacion"
                         dark @click="validate(2)">Enviar Código</v-btn>
                </v-card-actions>
              </v-form>
              <v-row v-if="errorV">
                <v-col>
                  <v-alert dense outlined type="error">
                    {{errorV}}
                  </v-alert>
                </v-col>
              </v-row>
            </v-card>
            <v-btn class="mt-3" @click="stepper = 1" dark color="dark">Regresar</v-btn>
          </v-stepper-content>
        </v-stepper>

      </div>
    </div>
</template>

<script>
  import Swal from 'sweetalert2'
    export default {
      name: "index",
      layout:'recuperacion',
      data(){
        return{
          stepper: 1,
          isPeticion: false,
          isValidacion: false,
          email:'',
          error: null,
          errorV: null,
          codigo: '',
          ruleCodigo: [
            v => !!v || 'El código de seguridad es requerido',
            v => v.length <= 6 || 'Este campo solo puede aceptar un máximo de 6 carácteres',
          ],
          identidad: '',
          rulesIdentidad: [
            v => !!v || 'Identidad o número de ingreso es requerido',
            v => v.length <= 13 || 'Máximo 13 carácteres',
          ],
          rulesEmail: [
            v => !!v || 'E-mail requerido',
            v => /.+@.+\..+/.test(v) || 'E-mail no valido',
          ],
          isCodigo: false,
        }
      },
      methods:{
        validate(val){
          if (val === 1){
            if (this.$refs.formRecuperacion.validate())
              this.enviarCodigo()
          }else if (val === 2){
            if (this.$refs.FormCodigoRecuperacion.validate())
              this.validarCodigo()
          }
        },
        enviarCodigo: function () {
          this.isPeticion = true
          this.isValidacion = true
          this.$axios.post('recuperacion_password',{
            correo:    this.email,
            identidad: this.identidad
          }).then((res)=>{
            if (res.status === 200){
              this.isPeticion = false
              this.error = null
              this.isValidacion = false
              Swal.fire(
                'Código enviado',
                'Se te ha enviado un código de confirmación al correo eléctronico.',
                'success'
              )
              this.isCodigo = true
              this.stepper = 2
            }
          }).catch((error)=>{
            this.isPeticion = false
            this.error = error.response.data
          })
        },
        validarCodigo: function(){
          this.isPeticion = true
          this.$axios.post('validar_codigo',{
            correo:    this.email,
            codigo: this.codigo
          }).then((res)=>{
            this.error = null
            this.isPeticion = false
            if (res.status === 200){
              this.$router.replace({path:'/recuperacion/'+res.data.cod})
            }
          }).catch((error)=>{
            this.isPeticion = false
            this.errorV = error.response.data
          })
        },
        backInicio(){
          this.$router.replace({path:'/'})
        }
      }
    }
</script>

<style scoped>
.container{
  width: 50%;
}
</style>
