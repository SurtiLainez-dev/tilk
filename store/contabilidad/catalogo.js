export const state = () => ({
    CUENTAS:     [],
    LOADCUENTAS: false,
    CC:          [],
    INT:         new Intl.NumberFormat(),
})

export const mutations = {
    cargar_CUENTAS(state){
        state.LOADCUENTAS = true;
        state.CC          = [];
        this.$axios.get('contabilidad/2.0/catalogo').then((res)=>{
            state.CUENTAS     = res.data.cuentas;
            state.LOADCUENTAS = false;
            let cont          = 0;
            res.data.cuentas.forEach(i=>{
                if (i.cod_d){
                    state.CC.push({
                        texto: i.cod+'-'+i.id+'-'+i.nombre+'-'+i.total,
                        text:  '['+i.cod_d.cod+' '+i.cod_d.nombre+'] - '+i.cod+' '+i.nombre+' L. '+state.INT.format(i.total),
                        value: cont
                    });
                    cont++;
                }
            });
        })
    }
}
