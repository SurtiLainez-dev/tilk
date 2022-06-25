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
            let cc            = [];
            res.data.cuentas.forEach(i=>{
                if (i.cod > 10){
                    cc = res.data.cuentas.filter(item => item.cod === i.cod_dep);
                    if (cc.length > 0){
                        state.CC.push({
                            texto: i.cod+'-'+i.id+'-'+i.nombre+'-'+i.total,
                            text:  '['+cc[0].cod+' '+cc[0].nombre+'] - '+i.cod+' '+i.nombre+' L. '+state.INT.format(i.total),
                            value: cont
                        });
                        cont++;
                    }
                }
            });
        })
    }
}
