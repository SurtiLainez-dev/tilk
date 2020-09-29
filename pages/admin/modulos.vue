import Swal from "sweetalert2";
<template>
    <v-container class="pr-2 pt-2 pl-2">
      <v-card>
        <v-progress-linear v-if="isPeticion" indeterminate color="success"></v-progress-linear>
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <strong>Módulos Existentes</strong>
            </v-col>
            <v-col cols="2" class="d-flex justify-end">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn @click="popupActivo = true" v-on="on" v-bind="attrs" color="orange" fab x-small dark>
                    <v-icon >fa fa-plus</v-icon>
                  </v-btn>
                </template>
                <span>Agregar un Nuevo Módulo</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-row class="pl-2 pr-2">
          <v-col md="3" cols="4" v-for="item in Modulos">
            <v-card class="pl-2 pr-2 d-flex align-center justify-center"
                    dark width="300px" height="50px" color="orange" hover>
              <v-row>
                <v-col cols="9" @click="mostrarModulo(item.id)"><strong>{{item.nombre}}</strong></v-col>
                <v-col cols="3" class="d-flex justify-center">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="popupSubModulo(item.id, item.nombre,item.num)"
                             v-on="on" v-bind="attrs" color="grey lighten-1" fab x-small dark>
                        <v-icon >fa fa-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Agregar sub-módulo a {{item.nombre}}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <v-card ref="CuerpoSubModulos" v-if="idModulo === item.id" v-for="item in Modulos">
          <v-card-title>{{item.nombre}}</v-card-title>
          <v-simple-table dense :fixed-header="true" height="400px">
            <thead>
              <tr>
                <th>Nombre del sub-módulo</th>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="i in item.sub_modulos_usuario" :key="i.nombre">
              <td>{{ i.nombre }}</td>
              <td>{{ i.num }}</td>
            </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-card>

      <v-dialog v-model="popupSub" width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Agregando sub-módulo a {{sub.modulo}}</span>
          </v-card-title>
          <v-container>
            <v-form ref="FormAddSubModulo">
              <v-text-field v-model="sub.nombre" :rules="sub.rules" label="Nombre del sub-módulo" required></v-text-field>
              <v-col class="d-flex flex-row-reverse">
                <v-btn @click="validate(1)" :disabled="isPeticion" color="warning" dark>Registrar</v-btn>
              </v-col>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog v-model="popupActivo" width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Agregando Módulo</span>
          </v-card-title>
          <v-container>
            <v-form ref="FormAddModulo">
              <v-text-field v-model="nombreModulo" :rules="sub.rules" label="Nombre del módulo" required></v-text-field>
              <v-row>
                <v-col class="d-flex flex-row-reverse">
                  <v-btn @click="validate(2)" :disabled="isPeticion" color="warning" dark>Registrar</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
  import Swal from 'sweetalert2'
    export default {
        name: "modulos",
      created() {
        this.$store.commit('guardarTitulo', 'Usuarios > Módulos')
        this.cargarModulos()
      },
      data(){
        return{
          idModulo: null,
          popupSub:     false,
          nombreModulo: null,
          popupActivo:  false,
          Modulos:      null,
          isPeticion:   false,
          sub:{
            id_modulo: null,
            modulo:    null,
            nombre:    null,
            num:       null,
            rules: [
              v => !!v || 'Campo requerido',
            ],
          }
        }
      },
      methods:{
        mostrarModulo(id){
          this.idModulo = id
        },
        validate(val){
          if (val === 1) {
            if (this.$refs.FormAddSubModulo.validate())
              this.registrarSub()
          }else {
            if (this.$refs.FormAddModulo.validate())
              this.registrarModulo()
          }
        },
        registrarSub: function(){
          this.isPeticion = true
          this.$axios.post('/save_submodulos',{
            id:     this.sub.id_modulo,
            nombre: this.sub.nombre,
            num:    this.sub.num
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.popupSub = false
              Swal.fire(
                'Registro Exitoso',
                `El sub-módulo ${this.sub.nombre} se ha registrado exitosamente.`,
                'success'
              )
              this.sub.nombre = null
              this.cargarModulos();
              this.isPeticion = false
            }
          })
        },
        popupSubModulo: function(id, modulo, num){
          this.sub.id_modulo = id;
          this.sub.modulo = modulo
          this.sub.num = num
          this.popupSub = true
        },
        registrarModulo:function () {
          this.isPeticion = true
          this.$axios.post('/save_modulos',{
            nombre: this.nombreModulo
          },{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            if (res.status === 200){
              this.popupActivo = false
              Swal.fire(
                'Registro Exitoso',
                `El módulo ${this.nombreModulo} se ha registrado exitosamente.`,
                'success'
              )
              this.nombreModulo = null
              this.cargarModulos();
            }
          })
        },
        cargarModulos: function () {
          this.isPeticion = true
          this.$axios.get('/modulos',{
            headers: {
              'Authorization': 'Bearer ' + this.$store.state.token
            }
          }).then((res)=>{
            this.isPeticion = false
            this.Modulos = res.data.modulos
          })
        },
      },
    }
</script>

<style scoped>

</style>
