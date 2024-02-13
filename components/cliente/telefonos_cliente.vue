<template>
  <v-card flat>
    <v-simple-table class="rowsTable">
      <template v-slot:default>
        <tbody>
          <tr v-for="item in Telefonos">
            <v-form ref="FormTelefonosCliente">
              <td width="10%">
                <v-text-field v-model="item.key + 1" disabled></v-text-field>
              </td>
              <td>
                <v-text-field v-model="item.detalle" label="Detalle del Número" class="ma-2" counter
                              :rules="[rules.num.req, rules.detalle.min, rules.detalle.max]"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="item.area" label="Cod. Área" class="ma-2" counter
                              :rules="[rules.num.req]"></v-text-field>
              </td>
              <td>
                <v-text-field v-model="item.num" label="Número de Telefono" class="ma-2"
                              :rules="[rules.num.req, rules.num.min, rules.num.tel, rules.num.max]"></v-text-field>
              </td>
              <td>
                <v-btn fab tile color="red" x-small class="text-white" @click="removeTelefono(item.key)"
                       :disabled="item.key < longTelefonos">
                  <v-icon>fa fa-times</v-icon>
                </v-btn>
              </td>
            </v-form>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-divider></v-divider>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="indigo" small dark x-small tile @click="addTelefono">
        <v-icon small left>fa fa-plus</v-icon>
        Agregar Telefono</v-btn>
      <v-btn color="success" class="text-white"
              @click="validarTelefonos"
             small tile>Guardar Telefonos</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  name: "telefonos_cliente",
  computed:{
    CLIENTE: function (){
      get: {
        return this.$store.state.cliente.CLIENTE;
      }
    },
  },
  data(){
    return{
      longTelefonos: 0,
      Telefonos: [],
      habilitarBtnEnvio: false,
      rules: {
        num: {
          req: v => !!v || 'Campo requerido',
          min:v => (v && v.length >= 8) || 'Tiene que ser mayor O igual a 8 números.',
          max:v => (v && v.length <= 20) || 'Tiene que ser menor o igual a 20 números.',
          tel: v => (v.length === 0 || /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(v)) || 'Campo no válido, tienes datos diferentes a números'
        },
        detalle:{
          min: v => (v && v.length >= 5) || 'Tiene que ser mayor a 5 carácteres.',
          max: v => (v && v.length <= 100) || 'Tiene que ser menor o igual a 25 carácteres.',
        }
      }
    }
  },
  created() {
    if (JSON.parse(this.CLIENTE.telefonos)) {
      this.longTelefonos = JSON.parse(this.CLIENTE.telefonos).length;
      this.Telefonos = JSON.parse(this.CLIENTE.telefonos);
    }else {
      this.longTelefonos = 0;
    }

  },
  methods:{
    addTelefono(){
      this.Telefonos.push({
        num:     '',
        detalle: 'Telefono '+(parseInt(this.Telefonos.length) + parseInt(1)),
        area:    '504',
        key:     this.Telefonos.length
      });
      this.habilitarBtnEnvio = true;
    },
    enviarTelefonos(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('perfil_cliente/edit/telefonos',{
        id:        this.CLIENTE.id,
        telefonos: JSON.stringify(this.Telefonos)
      }).then((res)=>{
        this.CLIENTE.telefonos = JSON.stringify(this.Telefonos);
        this.longTelefonos     = this.Telefonos.length;
        this.habilitarBtnEnvio = false;
        this.notificacion(res.data.msj,'success');
        this.$store.commit('activarOverlay', false);
      }).catch((error)=>{
        this.$store.commit('activarOverlay', false);
        this.notificacion('Hubo un error', 'error')
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
    removeTelefono(key){
      let item = 0;
      this.Telefonos.splice(key, 1);
      this.Telefonos.forEach( (i) => {
        i.key = item;
        i.detalle = 'Telefono '+(parseInt(item) + parseInt(1));
        item++;
      });
      if (this.longTelefonos >= this.Telefonos.length)
        this.habilitarBtnEnvio = false;
    },
    validarTelefonos(){
      let bandera = 0;
      this.Telefonos.forEach((i, cont)=>{
        if (!this.$refs.FormTelefonosCliente[cont].validate())
          bandera++;
      });

      if (bandera === 0)
        this.enviarTelefonos();
      else
        this.notificacion('Hacen falta datos en los telefonos','error');
    }
  }
}
</script>

<style scoped>
.rowsTable{
  cursor: pointer;
}
</style>
