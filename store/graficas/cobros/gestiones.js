export const state = () => ({
    G_TOTALESSEGMENTOS: [],
    G_LOADTOTALESSEGMENTOS: false,
    G_SEGMENTOS: false
})

export const mutations = {
    cargar_TOTALES_SEGMENTOS(state, id){
        state.G_LOADTOTALESSEGMENTOS = true;
        let int = Intl.NumberFormat();
        this.$axios.get(`cobros/postafolio/${id}/calcular_valor_cuotas`).then((res)=>{
            state.G_TOTALESSEGMENTOS = [];
            state.G_SEGMENTOS = res.data.totales;
            if (res.data.totales){
                res.data.totales.forEach((i)=>{
                    if (i.id < 17 && i.id > 1){
                        state.G_TOTALESSEGMENTOS.push([
                            i.nombre, i.valor_cuotas_segmento.toFixed(2)
                        ]);
                    }
                });
            }
            state.G_LOADTOTALESSEGMENTOS = false;
        })
    }
}
