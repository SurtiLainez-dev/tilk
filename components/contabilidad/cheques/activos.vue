<template>
<v-card flat>
  <v-card v-if="VISTACHEQUE === 1">
    <v-toolbar flat>
      <h6>Cheques Disponibles</h6>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-text-field dense label="Buscar" v-model="search"></v-text-field>
    </v-toolbar>
    <v-data-table :headers="header" :items="CHEQUESACTIVOS"
                  :items-per-page="10" :search="search">
      <template v-slot:item.estado="{item}">
        <v-chip dark x-small color="success" v-if="item.estado === 1">DISPONIBLE</v-chip>
        <v-chip dark x-small color="success" v-else-if="item.estado === 2">CREADO</v-chip>
        <v-chip dark x-small color="success" v-else-if="item.estado === 3">ENTREGADO</v-chip>
        <v-chip dark x-small color="success" v-else-if="item.estado === 4">ANULADO</v-chip>
      </template>
      <template v-slot:item.id="{item}">
        <v-tooltip top>
          <template v-slot:activator="{on, attr}">
            <v-btn v-on="on" v-bind="attr" @click="capturarNulo(item)" color="orange" x-small fab tile dark>
              <v-icon>fa fa-times</v-icon>
            </v-btn>
          </template>
          <span>Marcar como Nulo</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{on, attr}">
            <v-btn v-on="on" v-bind="attr" color="success" @click="capturarCheque(item)" x-small fab tile dark>
              <v-icon>fa fa-file-invoice</v-icon>
            </v-btn>
          </template>
          <span>Crear una Partida con el cheque {{  item.numeracion}}</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-card>

  <v-card flat v-else-if="VISTACHEQUE === 2">
    <cheque/>
  </v-card>


  <v-dialog v-model="dialogoNulo" width="35%">
    <v-card>
      <v-toolbar color="grey lighten-3" ><v-card-title>Anulando Cheque {{Nulo.num}}</v-card-title></v-toolbar>
      <br>
      <v-form>
        <v-textarea class="ma-2" v-model="Nulo.observacion" dense label="Observación sobre anulación"></v-textarea>
        <v-file-input class="ma-2" v-model="Nulo.file" accept=".pdf,image/*" dense label="Archivo"></v-file-input>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn small tile color="orange" @click="dialogoNulo = false" dark>Cerrar</v-btn>
        <v-btn small tile color="success" @click="registrarNulo" dark>Registrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
import cheque from "./cheque";
export default {
  components:{
    cheque
  },
  name: "activos",
  data(){
    return{
      dialogoNulo:  false,
      search: '',
      header:[
        {text:'Correlativo', value:'numeracion'},
        {text:'Estado', value:'estado'},
        {text:'#', value:'contador'},
        {text:'Acciones', value:'id'},
      ],
      Nulo:{
        id: '',
        observacion: '',
        file: null,
        num:  ''
      }
    }
  },
  computed:{
    CHEQUESACTIVOS(){
      return this.$store.state.contabilidad.cheques.CHEQUESACTIVOS;
    },
    CUENTA(){
      return this.$store.state.contabilidad.cheques.CUENTA;
    },
    VISTACHEQUE(){
      return this.$store.state.contabilidad.cheques.VISTACHEQUE;
    }
  },
  created() {
    this.$store.commit('guardarTitulo', 'Contabilidad > Cuenta > '+this.CUENTA.banco.nombre+ ' - '+this.CUENTA.num)
  },
  methods:{
    capturarCheque(item){
      this.$store.commit('contabilidad/cheques/capturar_CHEQUE', item);
    },
    capturarNulo(item){
      this.Nulo.id     = item.id;
      this.Nulo.num    = item.numeracion
      this.dialogoNulo = true;
    },
    registrarNulo(){
      if (this.Nulo.observacion.length > 10){
        let data = new FormData();
        data.append('id', this.Nulo.id);
        data.append('observacion', this.Nulo.observacion);
        data.append('file', this.Nulo.file);
        this.dialogoNulo = false;
        this.$store.commit('activarOverlay', true);
        this.$axios({
          method: 'post',
          data:    data,
          url:     'contabilidad/2.0/cheques/nulo/',
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.token,
            'Content-Type': "multipart/form-data"
          }
        }).then((res)=>{
          console.log(this.CUENTA)
          this.$store.commit('contabilidad/cheques/cargar_CHEQUES', this.CUENTA);
          this.Nulo.observacion = '';
          this.Nulo.file        = null;
          this.$store.commit('notificacion',{texto: res.data.msj, color:'success'});
          setTimeout(()=>{
            this.$store.commit('activarOverlay', false);
          }, 3000);
        }).catch((error)=>{
          this.$store.commit('notificacion',{texto: 'Hubo un error en el servidor', color:'error'});
          this.$store.commit('activarOverlay', false);
          this.dialogoNulo = true;

        })
      }else{
        this.$store.commit('notificacion', {
          texto:'Tu observación para anular el cheque debe ser mayor a 10 letras',
          color:'warning'
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
