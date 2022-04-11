<template>
  <v-card flat>
    <v-form ref="FormDatosPersonalescliente">
      <v-simple-table dense  class="rowsTable">
        <template v-slot:default>
          <tbody>
          <tr>
            <th>Nombres</th>
            <td>
              <v-text-field :rules="[rules.nombre.req, rules.nombre.min, rules.nombre.max]"
                            dense v-model="Datos.nombres"></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Apellidos</th>
            <td>
              <v-text-field :rules="[rules.nombre.req, rules.nombre.min, rules.nombre.max]"
                            dense v-model="Datos.apellidos"></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Identidad</th>
            <td>
              <v-text-field dense v-model="Datos.identidad" disabled></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Rtn</th>
            <td>
              <v-text-field v-model="Datos.rtn" dense></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Nacionalidad</th>
            <td>
              <v-text-field dense v-model="Datos.nacionalidad"></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Sexo</th>
            <td>
              <v-text-field dense value="Masculino" v-if="Datos.sexo === 1" disabled></v-text-field>
              <v-text-field dense v-else value="Femenino" disabled></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Correo Eléctronico</th>
            <td>
              <v-text-field v-model="Datos.email" dense></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Trabaja</th>
            <td>
              <v-select v-model="Datos.is_trabaja" dense :item-value="'val'" :items="SelectTrabajo"></v-select>
            </td>
          </tr>
          <tr>
            <th>Lugar de Trabajo</th>
            <td>
              <v-text-field v-model="Datos.lugar_trabajo" dense></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Salario</th>
            <td>
              <v-text-field v-model="Datos.salario" dense prefix="L. "></v-text-field>
            </td>
          </tr>
          <tr>
            <th>Casa Propia</th>
            <td>
              <v-select v-model="Datos.is_casa" dense :item-value="'val'" :items="SelectTrabajo"></v-select>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn small color="success" @click="validarDatos" tile class="text-white" :disabled="!PERMISOS.includes(142)">Guardar Edición</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "datos_personales",
  computed:{
    CLIENTE: function (){
      get:{
        return this.$store.state.cliente.CLIENTE;
      }
    },
    PERMISOS(){
      let permisos = this.$store.state.permisosUser.split(',');
      let per = [];
      if (permisos.length > 1){
        permisos.forEach((item)=>{
          per.push(parseInt(item))
        })
        return per;
      }else
        return [];
    },
  },

  data(){
    return{
      Datos:{
        nombres: '',
        apellidos: '',
        identidad: '',
        rtn: '',
        nacionalidad: '',
        sexo: 0,
        email: '',
        is_trabaja: 0,
        lugar_trabajo: '',
        salario: '',
        is_casa: 0
      },
      SelectTrabajo:[
        {text:'Sí', val:1},
        {text:'No', val:0}
      ],
      rules: {
        nombre: {
          req: v => !!v || 'Campo requerido',
          min: v => (v && v.length >= 3) || 'Tiene que ser mayor a 3 carácteres.',
          max: v => (v && v.length <= 50) || 'Tiene que ser menor o igual a 50 carácteres.',
        },
      }
    }
  },
  created() {
    let cl = this.CLIENTE, dt = this.Datos;
    dt.nombres       = cl.nombres;
    dt.apellidos     = cl.apellidos;
    dt.identidad     = cl.identidad;
    dt.rtn           = cl.rtn;
    dt.nacionalidad  = cl.nacionalidad
    dt.sexo          = cl.sexo;
    dt.email         = cl.email;
    dt.is_trabaja    = cl.is_trabaja;
    dt.lugar_trabajo = cl.empresa_trabaja;
    dt.salario       = cl.salario;
    dt.is_casa       = cl.is_casa;
  },
  methods:{
    enviarDatos(){
      let cl = this.CLIENTE, dt = this.Datos;
      this.$store.commit('activarOverlay', true);
      this.$axios.post('perfil_cliente/edit/datos_personales',{
        nombres:         dt.nombres,
        apellidos:       dt.apellidos,
        rtn:             dt.rtn,
        nacionalidad:    dt.nacionalidad,
        sexo:            dt.sexo,
        email:           dt.email,
        is_trabaja:      dt.is_trabaja,
        is_casa:         dt.is_casa,
        empresa_trabaja: dt.lugar_trabajo,
        salario:         dt.salario,
        id:              cl.id
      }).then((res)=>{
        cl.nombres         = dt.nombres;
        cl.apellidos       = dt.apellidos;
        cl.rtn             = dt.rtn;
        cl.nacionalidad    = dt.nacionalidad;
        cl.sexo            = dt.sexo;
        cl.email           = dt.email;
        cl.is_trabaja      = dt.is_trabaja;
        cl.is_casa         = dt.is_casa;
        cl.empresa_trabaja = dt.lugar_trabajo;
        cl.salario         = dt.salario;
        this.notificacion(res.data.msj,'success');
        this.$store.commit('activarOverlay', false);
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
    validarDatos(){
      if (this.$refs.FormDatosPersonalescliente.validate())
        this.enviarDatos();
      else
        this.notificacion('Hay errores en los campos Nombres o Aepllidos','error');
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
