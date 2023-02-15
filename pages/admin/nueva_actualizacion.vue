<template>
<v-card flat>
  <v-card flat color="grey lighten-5" height="100">
    <v-toolbar flat color="grey lighten-5"><v-toolbar-title>Registrar Actualización Nueva</v-toolbar-title></v-toolbar>

    <v-card-subtitle>Creando Nuevo Registro de Actualización</v-card-subtitle>
  </v-card>

  <v-container >
    <v-form ref="FormNuevaActualizacion">
      <v-row>
        <v-col cols="2">
          <v-text-field class="ma-2" label="Versión" dense v-model="version"></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field class="ma-2" label="Página" dense v-model="pagina"></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field class="ma-2" label="Dir. del Binario" dense v-model="archivo"></v-text-field>
        </v-col>
      </v-row>
      <table>
        <thead>
        <tr>
          <th class="text-center" style="width: 5%">#</th>
          <th style="width: 85%">Comentario</th>
          <th class="text-center" style="width: 10%">Eliminar</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in comentarios">
          <td class="text-center">{{item.id + 1}}</td>
          <td>
            <input type="text" v-model="item.comentario" @keyup.enter="addComentario"
                   style="background-color: #F3ECCF; border: #f3eccf; padding: 2px; width: 100%">
          </td>
          <td class="text-center">
            <v-btn fab width="25" height="25" text color="red" @click="deleteArchivo"
                   icon><v-icon x-small>fa fa-times</v-icon></v-btn>
          </td>
        </tr>
        </tbody>
      </table>
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="success" dark small tile @click="registrarActualizacion">Registrar Actualización</v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</v-card>
</template>

<script>
export default {
  name: "nueva_actualizacion",
  data(){
    return{
      version: '',
      pagina: '',
      archivo: '',
      comentarios: [
        {
          id: 0,
          comentario: ''
        }
      ]
    }
  },
  methods:{
    addComentario(){
      this.comentarios.push({
        id: this.comentarios.length,
        comentario: ''
      })
    },
    deleteArchivo(key){
      if (this.comentarios.length > 1){
        this.comentarios.splice(key, 1)
        this.comentarios.forEach( (i, item) => {
          i.id = item;
        });
      }else{
        this.$store.commit('notificacion',{color:'warning', texto:'Tiene que ir un comentario'})
      }
    },
    registrarActualizacion(){
      if (this.version.length > 2 && this.pagina.length > 10 && this.archivo.length > 10){
        this.$store.commit('activarOverlay', true);
        this.$axios.post('actualizaciones', {
          version:     this.version,
          pagina:      this.pagina,
          archivo:     this.archivo,
          comentarios: JSON.stringify(this.comentarios)
        }).then((res)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{color:'success', texto:res.data.msj});
          this.$router.replace({path:"/admin/actualizaciones"})
        }).catch((error)=>{
          this.$store.commit('activarOverlay', false);
          this.$store.commit('notificacion',{color:'red', texto:'Hubo un error en el servidor'});
        });
      }else{
        this.$store.commit('notificacion', {color:'warning', texto:'Los campos tienen que ir con información'})
      }
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
  border: solid #b2b0b0 1px;
}
table thead tr{
  border-bottom: solid #b2b0b0 1px;
  border-top: solid #b2b0b0 1px;
}
table thead tr th{
  padding: 5px;
  font-size: 14px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
table tbody tr td{
  padding: 5px;
  border-left: solid #b2b0b0 1px;
  font-size: 12px;
  cursor: pointer;
}
table thead tr th:hover{
  background-color: #f6f6f6;
}
table tbody tr td:hover{
  background-color: #f6f6f6;
}
</style>