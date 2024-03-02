<template>
    <v-card flat>
        
        
      <v-container>
      <v-row justify="end">
        <v-btn color="primary" @click="createNewPayment">
          <v-icon left>mdi-plus</v-icon>
          Agregar Nuevo Pago
        </v-btn>
      </v-row>
      <div class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Pago inicial</th>
              <th>Total a pagar</th>
              <th>Total abonado</th>
              <th>Saldo actual</th>
              <th>Detalle del pago</th>
              <th>Is Mora</th>
              <th>Mora</th>
              <th>Interes</th>
              <th>Fecha de pago</th>
              <th>Is cobro de mora</th>
              <th>Estado</th>
              <th>Dias de mora</th>
              <th>Dias de gracia</th>
              <th>Saldo cap</th>
            </tr>
          </thead>
          <tbody>
          
            <tr v-for="(item, index) in items" :key="item.id" :class="{ 'table-row-new': item.isNew, 'new-payment': item.isNew, 'inactive-payment': item.isInactive }" @click="openModal(item)">



              <td>L.{{ item.pago_inicial }}</td>
              <td>L.{{ item.total_pago }}</td>
              <td>L.{{ item.total_abonado }}</td>
              <td>L.{{ item.saldo_actual }}</td>
              <td>{{ item.detalle }}</td>
              <td>
                <select v-model="item.is_mora">
                  <option :value="1">Sí</option>
                  <option :value="0">No</option>
                </select>
              </td>
             <td>{{ item.mora.toFixed(2) }}</td>

              <td>{{ item.interes }}</td>
              <td>{{ item.fecha_pago }}</td>
              <td>
                <select v-model="item.is_cobro_mora">
                  <option :value="0">No</option>
                  <option :value="1">Si</option>
                </select>
              </td>
              <td>
                <select v-model="item.estado">
                  <option :value="1">Al dia</option>
                  <option :value="2">Mora</option>
                  <option :value="3">Cancelado</option>
                </select>
              </td>
              <td>{{ item.dias_mora }}</td>
              <td>{{ item.dias_gracia }}</td>
              <td>{{ item.saldo_cap }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-container>
      
         <!-- Modal para la edición -->
    <v-dialog v-model="modalOpen" max-width="1000px">
      <v-card>
        <v-card-title>Editar</v-card-title>
        <v-card-text>
            
            <v-form ref="editForm">
                <v-row no-gutters>
            <v-col>
            <v-text-field label="Pago inicial" v-model="editedItem.pago_inicial" disabled dense class="ma-2"></v-text-field>
            </v-col>
            <v-col>
            <v-text-field label="Total a pagar" v-model="editedItem.total_pago" disabled dense class="ma-2"></v-text-field>
            </v-col>
            <v-col>
            <v-text-field label="Total abonado" v-model="editedItem.total_abonado"  dense class="ma-2"></v-text-field>
            </v-col>
            </v-row>
            <v-row no-gutters>
            <v-col>
            <v-text-field label="Saldo actual" v-model="editedItem.saldo_actual" disabled dense class="ma-2"></v-text-field>
             </v-col>
             <v-col>
            <v-text-field label="Detalle del pago" v-model="editedItem.detalle" disabled dense class="ma-2"></v-text-field>
             </v-col>
             <v-col>
            <v-select label="Is Mora" v-model="editedItem.is_mora" :items="[ { value: 1, text: 'Sí' }, { value: 0, text: 'No' } ]" dense class="ma-2"></v-select>
        </v-col>
             </v-row>
    <v-row no-gutters>
        <v-col>
            <v-text-field label="Mora" v-model="editedItem.mora" disabled dense class="ma-2">%</v-text-field>
        </v-col>
        <v-col>
            <v-text-field label="Interés" v-model="editedItem.interes"  dense class="ma-2"></v-text-field>
        </v-col>
        <v-col>
            <v-text-field label="Fecha de pago" v-model="editedItem.fecha_pago" disabled dense class="ma-2"></v-text-field>
        </v-col>
    </v-row>
    <v-row no-gutters>
        <v-col>
            <v-select label="Is cobro de mora" v-model="editedItem.is_cobro_mora" :items="[ { value: 0, text: 'No' }, { value: 1, text: 'Sí' } ]" dense class="ma-2"></v-select>
        </v-col>
        <v-col>
            <v-select label="Estado" v-model="editedItem.estado" :items="[ { value: 1, text: 'Al día' }, { value: 2, text: 'Mora' }, { value: 3, text: 'Cancelado' } ]" dense class="ma-2"></v-select>
        </v-col>
        <v-col>
            <v-text-field label="Días de mora" v-model="editedItem.dias_mora" dense class="ma-2"></v-text-field>
        </v-col>
    </v-row>
    <v-row no-gutters>
       
        
            <v-col>
            <v-text-field label="Días de gracia" v-model="editedItem.dias_gracia" disabled dense class="ma-2"></v-text-field>
        </v-col>
        <v-col>
            <v-text-field label="Saldo cap" v-model="editedItem.saldo_cap" disabled dense class="ma-2"></v-text-field>
        </v-col>
    </v-row>
   
               
</v-form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="success" tile class="ma-2" @click="saveEdit">Guardar</v-btn>
          <v-btn color="error" tile class="ma-2" @click="deleteItem">Eliminar</v-btn>
          <v-btn color="cancel" tile class="ma-2" @click="cancelEdit">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "tabla_de_pagos",
  
  data() {
    return {
      items: [],
      editedItem: {},
      modalOpen: false
    };
  },
  computed: {
    ...mapState({
      cuentas: state => state.cuentas.CUENTA,
    }),
  },
  methods: {
    fillFormData() {
      this.items = this.cuentas.pagos_contratos;
    },
    openModal(item) {
      this.editedItem = { ...item }; // Clona el item seleccionado para evitar mutaciones inesperadas
      this.editedItem.isNew = item.isNew || false;
      this.modalOpen = true;
    },calculateTotalDebt() {
  return this.items.reduce((totalDeuda, item) => {
    if (item.estado === 2) { // Verifica si el pago está en mora
      totalDeuda += parseFloat(item.saldo_cap); // Suma el saldo capital en lugar del saldo actual
    }
    return totalDeuda;
  }, 0);
}
,countMoraPayments() {
      return this.items.filter(item => item.estado === 2).length;
    },
    createNewPayment() {
  // Paso 1: Calcular el monto del nuevo pago
  const totalDeuda = this.calculateTotalDebt();
  const cantidadPagosEnMora = this.countMoraPayments();
  const nuevoPagoInicial = totalDeuda / (cantidadPagosEnMora + 1);
  const nuevoTotalAPagar = nuevoPagoInicial;

  // Paso 2: Guardar el estado actual de los pagos antes de agregar el nuevo pago
  const estadoAnterior = JSON.parse(JSON.stringify(this.items));

  // Paso 3: Ajustar el saldo actual y el saldo capital de todos los pagos en mora al monto del nuevo pago
  this.items.forEach(pago => {
    if (!pago.isInactive && pago.estado === 2) {
      pago.saldo_cap = nuevoPagoInicial.toFixed(2);
      pago.saldo_actual = (nuevoPagoInicial + parseFloat(pago.mora)).toFixed(2);
    }
  });

  // Paso 4: Obtener la fecha actual formateada
  const fechaPago = this.getFormattedDate();

  // Paso 5: Insertar el nuevo pago en la posición correspondiente
  const nuevoPago = {
    venta_id: '',
    pago_inicial: nuevoPagoInicial.toFixed(2),
    total_pago: nuevoTotalAPagar.toFixed(2),
    total_abonado: 0,
    saldo_actual: (nuevoPagoInicial + parseFloat(this.items[0].mora)).toFixed(2),
    detalle: `Pago nuevo - Cuota #${this.items.length + 1}`,
    is_mora: 0,
    mora: 0,
    interes: 0,
    fecha_pago: fechaPago, // Asignar la fecha formateada al nuevo pago
    is_cobro_mora: 1,
    estado: 2,
    dias_mora: this.items[0].dias_mora,
    dias_gracia: this.items[0].dias_gracia,
    saldo_cap: nuevoPagoInicial.toFixed(2), // Saldo capital del nuevo pago
    isNew: true,
    estadoAnterior: estadoAnterior // Guardar el estado anterior para revertir los cambios al eliminar el pago
  };

  this.items.push(nuevoPago);
},

deleteItem() {
  if (this.editedItem.isNew) { // Verificar si el pago a eliminar es nuevo
    // Restaurar el estado anterior de los pagos
    const estadoAnterior = this.editedItem.estadoAnterior;
    this.items.splice(0, this.items.length, ...estadoAnterior);
    console.log('Elemento eliminado:', this.editedItem);
  }else if (this.editedItem.estado === 2) {
  if (this.editedItem.total_abonado === 0) {
    // Encontrar el índice del pago a inactivar
    const index = this.items.findIndex(item => item.id === this.editedItem.id);
    if (index !== -1) {
      // Guardar el saldo actual y la mora del pago antes de marcarlo como inactivo
      const saldoActualAntes = parseFloat(this.editedItem.saldo_actual);
      const moraAntes = parseFloat(this.editedItem.mora);
      
      // Marcar el pago como inactivo
      this.editedItem.detalle = 'Pago inactivo';
      this.editedItem.isInactive = true;
      this.editedItem.estado = 3;
      this.editedItem.saldo_actual = 0;
      this.editedItem.saldo_cap = 0;
      // Actualizar el pago correspondiente en la lista this.items
      this.$set(this.items, index, this.editedItem); 
      // Sumar la mora del pago eliminado al pago anterior en mora
      if (index > 0) {
        const ultimoPagoEnMora = this.items[index - 1];
        ultimoPagoEnMora.saldo_actual += saldoActualAntes;
        ultimoPagoEnMora.saldo_cap = (parseFloat(ultimoPagoEnMora.saldo_cap) + saldoActualAntes).toFixed(1);
        const nuevaMora = parseFloat(ultimoPagoEnMora.mora) + moraAntes;
    ultimoPagoEnMora.mora = Math.round(nuevaMora * 100) / 100
      }

      console.log('Pago inactivo:', this.editedItem);
    } else {
      console.error('No se encontró el elemento a inactivar.');
    }
  } else {
    console.error('No se puede inactivar un pago con abonos.');
  }
} else {
  // Mostrar una alerta porque el pago no está en mora (estado 1 o 3)
  alert('Este tipo de pago no se puede eliminar. Solo se pueden eliminar los pagos en mora.');
}

this.$forceUpdate();
this.modalOpen = false;
}
,

getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  month = month < 10 ? '0' + month : month;  // Add leading zero if month is single digit
  let day = today.getDate();
  day = day < 10 ? '0' + day : day;  // Add leading zero if day is single digit
  return `${year}-${month}-${day}`;
}
,saveEdit() {
  // Buscar el índice del pago editado en el arreglo items
  const index = this.items.findIndex(item => item.id === this.editedItem.id);
  
  // Verificar si se encontró el pago editado en el arreglo items
  if (index !== -1) {
    // Actualizar solo los campos específicos que deseas editar
    this.items[index].total_abonado = this.editedItem.total_abonado;
    this.items[index].dias_mora = this.editedItem.dias_mora;
    this.items[index].estado = this.editedItem.estado;

    // Calcular el saldo actual como total a pagar menos total abonado
    this.items[index].saldo_actual = this.items[index].total_pago - this.editedItem.total_abonado;
     // Calcular el saldo capital
     const saldoCapInicial = this.items[index].pago_inicial;
    const totalAbonado = this.editedItem.total_abonado;
    this.items[index].saldo_cap = Math.max(saldoCapInicial - totalAbonado, 0);
    // Si el saldo actual es 0, cambiar el estado a 3
    if (this.items[index].saldo_actual === 0) {
      this.items[index].estado = 3;
      
    }

    /*
    // Enviar el pago editado al servidor utilizando Axios
    axios.put(`/ruta/para/actualizar/pago/${this.editedItem.id}`, this.editedItem)
      .then(response => {
        console.log('Pago editado guardado en el servidor:', response.data);
      })
      .catch(error => {
        console.error('Error al guardar el pago editado en el servidor:', error);
      });*/
  } else {
    console.error('No se encontró el elemento a editar.');
  }

  // Cerrar el modal de edición después de guardar los cambios
  this.modalOpen = false;
},

    cancelEdit() {
      this.modalOpen = false;
    },
  },
  created() {
    this.fillFormData();
  },
};
</script>


<style scoped>
    .table-container {
        overflow-x: auto;
    }

    .custom-table,
    .styled-table {
        font-family: 'Open Sans', sans-serif;
        width: 100%;
        padding: 2px;
        border-collapse: collapse;
    }

    .custom-table thead,
    .styled-table thead {
        background: #e8e5e5;
    }

    .custom-table thead tr th,
    .styled-table thead tr th {
        font-size: 12px;
    }

    .custom-table tbody tr td,
.styled-table tbody tr td {
    font-size: 11px;
    text-align: center; /* Añadir esta línea */
}


    .custom-table tbody tr:nth-child(even),
    .styled-table tbody tr:nth-of-type(even) {
        background-color: #f2f2f2;
    }

    .custom-table tbody tr:hover,
    .styled-table tbody tr:hover {
        background: #f2f2f2;
        cursor: pointer;
    }
    .new-payment {
  background-color: #b7f7d0; 
}
.inactive-payment {
        background-color: #c20808; 
    }

</style>



