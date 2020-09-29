<template>
   <v-card class="pl-2 pr-2 pb-2">
     <v-row class="fill-height">
       <v-col>
         <v-sheet height="64">
           <v-toolbar flat color="white">
             <h3>Pagos a Proveedores Pendientes</h3>
             <v-spacer></v-spacer>
             <v-btn fab text small color="grey darken-2" @click="prev">
               <v-icon small>mdi-chevron-left</v-icon>
             </v-btn>
             <v-btn fab text small color="grey darken-2" @click="next">
               <v-icon small>mdi-chevron-right</v-icon>
             </v-btn>
             <v-toolbar-title v-if="$refs.calendar">
               {{ $refs.calendar.title }}
             </v-toolbar-title>
           </v-toolbar>
         </v-sheet>
         <v-sheet height="600">
           <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
             :type="type" @click:event="showEvent" @click:more="viewDay" @click:date="viewDay"
           ></v-calendar>
           <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement">
             <v-card color="grey lighten-4" min-width="350px" flat>
               <v-toolbar :color="selectedEvent.color" dark>
                 <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                 <v-spacer></v-spacer>
                 <v-btn fab x-small dark color="red" @click="selectedOpen = false">
                   <v-icon>fa fa-times</v-icon>
                 </v-btn>
               </v-toolbar>
               <div class="pl-2 pr-2 pb-5">
                 <tabla-pago-pendiente-calendario :info="selectedEvent"></tabla-pago-pendiente-calendario>
               </div>
             </v-card>
           </v-menu>
         </v-sheet>
       </v-col>
     </v-row>
   </v-card>
</template>

<script>
  import TablaPagoPendienteCalendario from "../../../components/contabilidad/TablaPagoPendienteCalendario";
  export default {
    components:{TablaPagoPendienteCalendario},
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    created() {
      this.$store.commit('guardarTitulo', 'Calendarios > Contabilidad > Pagos a Proveedores Pendientes');
      this.updateRange()
    },
    methods: {
      viewDay ({ date }) {
        //para cambiar vista de mes a vista de dia y viceversa
        this.focus = date
        this.type = this.type === 'month' ? 'day':'month';
      },
      getEventColor (event) {
        //lee el color que se le asigna a cada evento, si le borra esta funcion tendra el color por defult
        return event.color
      },
      prev () {
        this.$refs.calendar.prev()
        //esta funcion le da al siguiente mes
      },
      next () {
        this.$refs.calendar.next()
        //esta funcion regresa un mes en el calendario
      },
      showEvent ({ nativeEvent, event }) {
        //esta funcion muestra un informacion de cada evento que se selecciona
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange () {
        //en esta funcion se creen los eventos
        const events = [];
        let inicio = null
        this.Pagos.forEach( (i) => {
          inicio = new Date(
            i.fecha_pago.split('-')[0],
            parseInt(i.fecha_pago.split('-')[1]) - parseInt(1),
            i.fecha_pago.split('-')[2]
          );
          events.push({
            name:  i.descripcion,
            start: inicio,
            end:   inicio,
            color: 'red',
            info: i,
            pagos: this.Pagos
          })
        })
        this.events = events
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    name: "pagos_proveedores",
    asyncData({store, $axios}){
      return $axios.get('pagos_facturas_proveedor/pendientes',{
        headers:{
          'Authorization': 'Bearer '+ store.state.token
        }
      }).then((res)=>{
        return{
          Pagos: res.data.pagos
        }
      })
    }
  }
</script>

<style scoped>

</style>
