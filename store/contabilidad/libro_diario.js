export const state = () => ({
    LOADFECHAS:     false,
    ANIOS:          [],
    MESES:          [],
    DIAS:           []
})

export const mutations = {
    cargar_FECHAS(state){
        state.LOADFECHAS = true;
        this.$axios.get('contabilidad/2.0/revision_fechas/libro_diario').then((res)=>{
            state.ANIOS = res.data.fechas;
            state.MESES = [];
            state.DIAS  = [];
            state.ANIOS.forEach((i)=>{
                i.mes.forEach((mes)=>{
                    state.MESES.push({
                        anio: i.anio,
                        mes:  mes.mes
                    });
                    mes.fechas.forEach((dia)=>{
                        state.DIAS.push({
                            mes:   mes.mes,
                            anio:  i.anio,
                            dia:   dia.fecha
                        })
                    })
                });
            });
            state.LOADFECHAS = false;
        })
    }
}
