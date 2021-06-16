export const state = () => ({
    CUENTAS:        [],
    LOADCUENTAS:    false,
    VISTA:          1,
    CUENTA:         {},
    CHEQUESACTIVOS: [],
    CHEQUESUSADOS:  [],
    CHEQUES:        [],
    VISTACHEQUE:    1,
    CHEQUE:         {},
    LOADCHEQUES:    false
})

export const mutations = {
    cargar_CUENTAS(state){
        state.LOADCUENTAS = true;
        this.$axios.get('contabilidad/2.0/cheques').then((res)=>{
            state.CUENTAS     = res.data.cuentas;
            state.LOADCUENTAS = false;
        })
    },
    cambiar_VISTA(state,val){
        state.VISTA = val
    },
    cargar_CHEQUES(state, cuenta){
        state.LOADCHEQUES = true;
        this.$axios.get('contabilidad/2.0/cheques/cuenta/'+cuenta.id).then((res)=>{
            state.CHEQUESACTIVOS = [];
            state.CHEQUESUSADOS  = [];
            res.data.cheques.forEach((i)=>{
                   if (i.estado === 1){
                       state.CHEQUESACTIVOS.push(i)
                }else if(i.estado > 1){
                       state.CHEQUESUSADOS.push(i)
                }
            });
           state.CHEQUES     = res.data.cheques;
           state.VISTA       = 2;
           state.LOADCHEQUES = false;
        });
    },
    asignar_CUENTA(state, cuenta){
        state.CUENTA = cuenta;
    },
    cambiar_VISTACHEQUE(state, val){
        state.VISTACHEQUE = val;
    },
    capturar_CHEQUE(state, data){
        state.CHEQUE      = data;
        state.VISTACHEQUE = 2;
    }

}
