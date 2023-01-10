<template>
  <v-card flat class="ma-5">
    <v-toolbar flat color="grey lighten-4"><v-card-title>Gestiones</v-card-title></v-toolbar>
    <v-card>
      <table>
        <thead>
        <tr>
          <th>Nombre del Cliente</th>
          <td>{{GESTION.cliente.nombres}} {{GESTION.cliente.apellidos}}</td>
          <th>Días de Mora</th>
          <td>{{VENTA.contrato_cliente.dias_mora}} días</td>
        </tr>
        <tr>
          <th>Descripción del Crédito</th>
          <td colspan="3">{{VENTA.contrato_cliente.remision_articulo.articulo.descripcion_corta}} - {{VENTA.contrato_cliente.remision_articulo.articulo.marca.nombre}}</td>
        </tr>
        <tr>
          <th>Intereses</th>
          <td>L {{int.format(mora)}}</td>
          <th>Saldo Atrasado</th>
          <td>L {{int.format(GESTION.pagando)}}</td>
        </tr>
        </thead>
      </table>
    </v-card>

    <v-row>
      <v-col>
        <v-card class="ma-2" height="100%">
          <v-card-subtitle>Telefonos del cliente</v-card-subtitle>
          <v-data-table dense :items="TELEFONOS" :items-per-page="3" :headers="headerTelefonos">
            <template v-slot:item.id="{item}">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" fab x-small text><v-icon>fa fa-sms</v-icon></v-btn>
                </template>
                <span>Enviar mensaje de texto</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <v-btn v-on="on" v-bind="attrs" fab x-small text><v-icon>fab fa-whatsapp</v-icon></v-btn>
                </template>
                <span>Enviar mensaje a whatsapp</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card height="100%" class="ma-2">
          <v-card-subtitle>Actividades del segmento</v-card-subtitle>
          <v-data-table dense  :items-per-page="3" :items="TAREAS" :headers="headerFunciones"></v-data-table>
        </v-card>
      </v-col>
      <v-col>
        <v-card height="100%" class="ma-2">
          <v-card-subtitle>Comentarios de la Gestión</v-card-subtitle>
          <v-data-table dense  :items-per-page="3" :items="COMENTARIOS" :headers="headerComentarios">
            <template v-slot:item.comentario="{item}">
              <v-tooltip top>
                <template v-slot:activator="{on, attrs}">
                  <span v-on="on" v-bind="attrs" v-if="item.comentario">{{item.comentario.substring(0,10)}} ...</span>
                </template>
                  <span>{{item.comentario}}</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="5">
        <v-card class="ma-2">
          <v-toolbar color="grey lighten-4" dense flat>Nueva Gestión</v-toolbar>
          <v-form ref="FormCobGestionNuevaGestion" class="ma-2" lazy-validation v-model="valid">
            <v-dialog ref="dialogoFechaGestion" :return-value.sync="gestion.fecha" persistent
                      width="290px" v-model="gestion.dialoFecha">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="gestion.fecha" label="Fecha de la Gestión" dense class="ma-2"
                              v-bind="attrs" v-on="on" :rules="[rule.req]">
                </v-text-field>
              </template>
              <v-date-picker v-model="gestion.fecha" scrollable>
                <v-spacer></v-spacer>
                <v-btn tile small dark color="orange" @click="gestion.dialoFecha = false">Cerrar</v-btn>
                <v-btn tile small color="indigo" class="text-white"
                       @click="$refs.dialogoFechaGestion.save(gestion.fecha)">Seleccionar</v-btn>
              </v-date-picker>

            </v-dialog>

            <v-autocomplete dense label="Seleccionar forma de contacto" class="ma-2" :items="contacto"
                            v-model="gestion.forma" :rules="[rule.req]"></v-autocomplete>
            <v-autocomplete dense label="Colaborador responsable" v-model="gestion.colaborador" class="ma-2" :rules="[rule.req]"
                            :items="COLABORADORES" :loading="loadColaboradores"></v-autocomplete>
            <v-btn @click="recomendar_recordatorio" small tile color="black"
                   block class="text-white" :disabled="LOAD_VENTA">Agregar recordatorio</v-btn>
            <v-text-field label="Proximo recordatorio" class="ma-2 pt-3" dense disabled :rules="[rule.req]"
                          v-model="gestion.recordatorio" placeholder="Fecha de proxima gestión"></v-text-field>
            <v-radio-group dense label="¿Gestión exitosa?" :rules="[rule.req]" v-model="gestion.exitoso" class="ma-2">
              <v-radio label="Sí" value="Sí"></v-radio>
              <v-radio label="No" value="No"></v-radio>
              <v-radio label="Promesa de pago" value="Promesa de pago"></v-radio>
            </v-radio-group>
            <v-textarea dense label="Comentario" counter v-model="gestion.comentario"
                        class="ma-2":rules="[rule.req, rule.min, rule.max]"></v-textarea>

            <v-card-actions class="d-flex justify-end">
              <v-btn color="success" tile small dark @click="validarForm">Registrar Gestión</v-btn>
            </v-card-actions>

          </v-form>

        </v-card>
      </v-col>
      <v-col cols="7">
        <v-card height="100%" class="ma-2">
          <v-toolbar dense flat color="grey lighten-3">Historial de Gestiones</v-toolbar>
          <v-row no-gutters>
            <v-col class="d-flex justify-end">
              <v-text-field v-model="buscarRcordatorio" class="ma-5" label="Buscar por nombre de colaborador o fecha" dense></v-text-field>
            </v-col>
          </v-row>
          <v-data-table dense :items="PROMESAS" :headers="headerRecordatorios" class="ma-2" :items-per-page="5"
                        :search="buscarRcordatorio" :height="200" @click:row="capturar_data_gestion"></v-data-table>
          <v-divider></v-divider>

          <v-card flat v-if="vista">
            <v-toolbar flat color="grey lighten-4">Datos de la Gestión</v-toolbar>

            <table>
              <thead>
              <tr>
                <th>Fecha</th>
                <td>{{dataGestion.fecha_gestionado}}</td>
                <th>Fecha Guardado</th>
                <td>{{dataGestion.fecha_guardado}}</td>
              </tr>
              <tr>
                <th colspan="2">Responsable de la Gestión</th>
                <td colspan="2">{{dataGestion.colaborador_responsable}}</td>
              </tr>
              <tr>
                <th colspan="2">Forma de Gestión</th>
                <td colspan="2">{{dataGestion.forma_contacto}}</td>
              </tr>
              <tr>
                <th colspan="2">Proxima Gestión</th>
                <td colspan="2">{{dataGestion.fecha_recordatorio}}</td>
              </tr>
              <tr>
                <th>Usuario</th>
                <td>{{dataGestion.user}}</td>
                <th>Resultado</th>
                <td>{{dataGestion.resultado_gestion}}</td>
              </tr>
              <tr>
                <th style="border-right: solid #b2b0b0 1px; border-bottom: #FFFFFF !important;" colspan="4">Comentario:</th>
              </tr>
              <tr>
                <td style="border-left: solid #b2b0b0 1px; padding: 5px; border-bottom: #FFFFFF !important;" colspan="4">{{dataGestion.comentario}}</td>
              </tr>
              </thead>
            </table>
          </v-card>


        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="gestion.modalRecordatorio" width="55%">
      <v-card>
        <v-toolbar color="grey lighten-3">Agregando recordatorio</v-toolbar>
        <v-card-text>El sistema te recomienda el siguiente recordatorio para <strong>{{gestion.recordatorio}}</strong>; pero sino de
          estas de acuerdo revisa la tabla de pagos atrasados para seleccionar una fecha. Recuerda que tambien tienes la
          opción de seleccionar la fecha manualmente mas abajo.</v-card-text>
        <v-card flat class="pa-2">
          <v-toolbar flat dense><h6 class="grey--text">Pagos Atrasados</h6></v-toolbar>
          <v-data-table dense :headers="header" :items="pagosAtrasados">
            <template v-slot:item.pago_inicial="{item}">L {{item.pago_inicial}}</template>
            <template v-slot:item.total_pago="{item}">L {{item.total_pago}}</template>
            <template v-slot:item.mora="{item}">L {{item.mora}}</template>
            <template v-slot:item.total_abonado="{item}">L {{item.total_abonado}}</template>
          </v-data-table>
        </v-card>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col>
            <v-dialog ref="dialogoFechaSiguienteRecordatorio" :return-value.sync="gestion.recordatorio" persistent
                      width="290px" v-model="gestion.dialogoRcordatorio">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="gestion.recordatorio" label="Fecha de la siguiente gestión" dense class="ma-2"
                              v-bind="attrs" v-on="on" >
                </v-text-field>
              </template>
              <v-date-picker v-model="gestion.recordatorio" scrollable>
                <v-spacer></v-spacer>
                <v-btn tile small dark color="orange" @click="gestion.dialogoRcordatorio = false">Cerrar</v-btn>
                <v-btn tile small color="indigo" class="text-white"
                       @click="$refs.dialogoFechaSiguienteRecordatorio.save(gestion.recordatorio)">Seleccionar</v-btn>
              </v-date-picker>

            </v-dialog>
          </v-col>
          <v-col>
            <v-card-actions class="d-flex justify-end">
              <v-btn dark color="orange" small tile @click="gestion.modalRecordatorio = false">Cerrar</v-btn>
              <v-btn dark color="success" small tile @click="gestion.modalRecordatorio = false">Confirmar fecha</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: "comentarios",
  data(){
    return{
      buscarRcordatorio: '',
      headerRecordatorios:[
        {text:'Fecha de la Gestión', value:'fecha_gestionado'},
        {text:'Colaborador Reponsable', value:'colaborador_responsable'}
      ],
      valid: true,
      header:[
        {text:'Detalle', value:'detalle'},
        {text:'Pago Inicial', value:'pago_inicial'},
        {text:'Total del Pago', value:'total_pago'},
        {text:'Mora', value:'mora'},
        {text:'Total Abonado', value:'total_abonado'},
        {text:'Fecha de Pago', value:'fecha_pago'},
      ],
      contacto:[
          'Visita formal por lider de piso',
          'Visita formal por cobrador',
          'Entrega de requerimiento',
          'Llamada',
          'Mensaje de texto',
          'Whatsapp',
          'Contacto por alguna red social',
          'Cliente se presentó al piso de venta',
          'Correo Eléctronico',
          'Cualquier contacto al aval',
          'Cualquier contacto a las referencias',
      ],
      gestion:{
        forma: '',
        exitoso: '',
        colaborador: '',
        comentario: '',
        contactado: '',
        fecha: '',
        dialoFecha: false,
        recordatorio: '',
        modalRecordatorio: false,
        dialogoRcordatorio: false
      },
      rule: {
        req: v => !!v || 'Campo requerido',
        max: v => v && v.length < 150 || 'No puede ser mayor a 150 carácteres',
        min: v => v && v.length > 10 || 'No puede ser menor a 10 carácteres'
      },
      int: Intl.NumberFormat(),
      headerTelefonos:[
        {text:'Detalle', value:'detalle'},
        {text:'Número', value:'num'},
        {text:'Acciones', value:'id'},
      ],
      headerFunciones:[
        {text:'Detalle', value:'nombre'},
        {text:'A los', value:'dias'},
      ],
      headerComentarios:[
        {text:'Comentario', value:'comentario'},
        {text:'Fecha', value:'fecha'}
      ],
      loadColaboradores: false,
      dataGestion: {},
      vista: false,
    }
  },
  computed:{
    pagosAtrasados(){
      if ( this.VENTA.pagos_contratos) {
        let pagos = this.VENTA.pagos_contratos.filter(item => item.estado === 2);
        return pagos;
      }else
        return []
    },
    LOAD_VENTA(){
      return this.$store.state.cuentas.LOADCUENTA;
    },
    mora(){
      console.log(this.pagosAtrasados)
      if ( this.pagosAtrasados.length > 0) {
        let mora = this.pagosAtrasados.reduce((total, val)=> total + parseFloat(val.mora), 0)
        return mora;
      }else
        return 0
    },
    COLABORADORES(){
      let colaboradores = [];
      if (this.$store.state.col.COLABORADORES) {
        this.loadColaboradores = true;
        this.$store.state.col.COLABORADORES.forEach((val) => {
          colaboradores.push({
            value: val.nombres + ' ' + val.apellidos,
            text: val.nombres + ' ' + val.apellidos
          })
        });
        this.loadColaboradores = false;
        return colaboradores
      }else{
        return  colaboradores;
      }
    },
    GESTION(){
      return this.$store.state.cobros.portafolios.GESTION;
    },
    VENTA(){
      return this.$store.state.cuentas.CUENTA;
    },
    LOADGESTION() {
      return this.$store.state.cobros.portafolios.LOADGESTION;
    },
    COMENTARIOS(){
      if (this.GESTION.comentarios)
        return JSON.parse(this.GESTION.comentarios);
      else
        return [];
    },
    TELEFONOS(){
      if(this.VENTA.cliente.telefonos)
        return JSON.parse(this.VENTA.cliente.telefonos);
      else
        [];
    },
    TAREAS(){
      if(this.GESTION.cob_segmento.funciones)
        return JSON.parse(this.GESTION.cob_segmento.funciones)
      else
        [];
    },
    PROMESAS(){
      if (this.GESTION.gestiones){
        return JSON.parse(this.GESTION.gestiones)
      }else{
        return [];
      }
    }
  },
  methods:{
    capturar_data_gestion(data){
      this.dataGestion = data;
      this.vista = true;
    },
    recomendar_recordatorio(){
      let fecha = new Date();
      let fecha_rec = '';
      let fecha1    = new Date(fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate())
      if (this.pagosAtrasados.length > 0){
        fecha_rec = this.pagosAtrasados[0].fecha_pago;
        fecha_rec = new Date(fecha_rec);
        if (fecha_rec.getTime() <= fecha1.getTime()){
          fecha_rec = fecha1.setDate(fecha1.getDate() + 2);
          let f = new Date(fecha_rec);
          this.gestion.recordatorio = f.getFullYear()+'-'+(f.getMonth()+1)+'-'+f.getDate();
        }else{
          this.gestion.recordatorio = fecha_rec.getFullYear()+'-'+(fecha_rec.getMonth()+1)+'-'+fecha.getDate();
        }
      }else{
        this.gestion.recordatorio = fecha1.getFullYear()+'-'+(fecha1.getMonth() +1)+'-'+fecha1.getDate();
      }
      this.gestion.modalRecordatorio = true;
    },
    registrarGestion(){
      this.$store.commit('activarOverlay', true);
      this.$axios.post('cobros/gestion/agregar_recordatorio',{
        venta_id: this.GESTION.id,
        colaborador: this.gestion.colaborador,
        fecha_gestion: this.gestion.fecha,
        forma:         this.gestion.forma,
        recordatorio:  this.gestion.recordatorio,
        resultado:     this.gestion.exitoso,
        comentario:    this.gestion.comentario,
      }).then((res)=>{
        this.$refs.FormCobGestionNuevaGestion.reset();
        this.$store.commit('cobros/portafolios/cargar_GESTIONES');
        this.$store.commit('cobros/portafolios/cargar_GESTION');
        this.$store.commit('cobros/portafolios/cargar_PORTAFOLIO');
        this.$store.commit('activarOverlay', false);
        this.$store.commit('notificacion',{texto:'Se ha registrado exitosamente la gestión', color:'success'});
      }).catch((error)=>{
        this.$store.commit('notificacion',{texto:'Hubo un error en el servidor', color:'error'});
        this.$store.commit('activarOverlay', false);
      })
    },
    validarForm(){
      if (this.$refs.FormCobGestionNuevaGestion.validate())
        this.registrarGestion();
      else
        this.$store.commit('notificacion',{texto:'Datos incompletos en el formulario', color:'error'});
    }
  }
}
</script>

<style scoped>
table{
  width: 100%;
}
table thead tr{
  border-bottom: solid #b2b0b0 1px;
}
table thead tr td{
  border-right: solid #b2b0b0 1px;
}
table thead tr th{
  border-left: solid #b2b0b0 1px;
}
</style>
