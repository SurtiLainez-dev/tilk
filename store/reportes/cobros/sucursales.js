export const state = () => ({
    LOADINDEX: false,
    ANIOS:     [],
    VISTA:     1,
    DATOS:     [],
    LOADDATOS: false,
    RGBA:      '',
    GRBABORDER: ''
});

export const mutations = {
    cargar_ANIOS(state){
        state.LOADINDEX = true;
        this.$axios.get('reportes/cobros/sucursales/cargando_anios').then((res)=>{
            state.ANIOS     = res.data.anios;
            state.LOADINDEX = false;
        })
    },
    cargar_DATOS(state,data){
        state.LOADDATOS = true;
        this.$axios.get(`reportes/cobros/sucursales/datos/sucursal/${data.sucursal}/anio/${data.anio}`).then((res)=>{
            if (res.data.datos.length > 0)
                state.DATOS     = res.data.datos;
            else
                state.DATOS = [];

            state.LOADDATOS = false;
        })
    },
    carlular_RGBA(state){
        let num  = Math.floor(Math.random()*18);
        let color1  = [
            '#CD6155',
            '#EC7063',
            '#AF7AC5',
            '#A569BD',
            '#5499C7',
            '#5DADE2',
            '#48C9B0',
            '#45B39D',
            '#52BE80',
            '#58D68D',
            '#F4D03F',
            '#F5B041',
            '#EB984E',
            '#DC7633',
            '#CACFD2',
            '#AAB7B8',
            '#99A3A4',
            '#5D6D7E',
            '#566573',
        ];

        state.RGBA =  color1[num];
    }
}
