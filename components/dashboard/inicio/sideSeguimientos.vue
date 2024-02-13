<template>
    <div>
        <v-list-group color="green" v-if="permisos.includes(121) || permisos.includes(122) || permisos.includes(123)">
            <template v-slot:activator value="true">
                <v-tooltip top>
                    <span>Seguimientos de Prospectos</span>
                    <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Seguimientos de Prospectos</v-list-item-title></template>
                </v-tooltip>
            </template>
            <v-list-item  v-if="permisos.includes(121)" class="itemOpciones" @click="go('/inicio/seguimientos/')">
                Todos los Seguimientos
            </v-list-item>
            <v-list-item v-if="permisos.includes(122)" class="itemOpciones" @click="go('/inicio/seguimientos/abiertos')">
                Seguimientos Abiertos
            </v-list-item>
            <v-list-item v-if="permisos.includes(123)" class="itemOpciones" @click="go('/inicio/seguimientos/cerrados')">
                Seguimientos Cerrados
            </v-list-item>
        </v-list-group>
        <v-list-group color="green">
            <template v-slot:activator value="true">
                <v-tooltip top>
                    <span>Otras gestiones</span>
                    <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Otras gestiones</v-list-item-title></template>
                </v-tooltip>
            </template>
            <v-list-item class="itemOpciones" @click="anadirPestana(25,'Solicitudes de Credito')">
                Solicitudes de crédito
            </v-list-item>
            <v-list-item class="itemOpciones" @click="anadirPestana(26,'Mis Ventas')">
              Ver ventas
            </v-list-item>
          <v-list-item v-if="permisos.includes(172)" class="itemOpciones" @click="anadirPestana(20,'Whatsapp')">
            Whatsapp
          </v-list-item>
          <v-list-item v-if="permisos.includes(171)" class="itemOpciones" @click="anadirPestana(21,'Gmail')">
            Gmail
          </v-list-item>
          <v-list-item v-if="permisos.includes(173)" class="itemOpciones" @click="anadirPestana(22,'Equifax')">
            Equifax
          </v-list-item>
        </v-list-group>
      <v-list-group color="green">
        <template v-slot:activator value="true">
          <v-tooltip top>
            <span>Herramientas de la Web</span>
            <template v-slot:activator="{on, attrs}"><v-list-item-title v-on="on" v-bind="attrs">Herramientas para la Web</v-list-item-title></template>
          </v-tooltip>
        </template>
        <v-list-item class="itemOpciones" @click="go('/web/web_familias')">
          Familias Visibles
        </v-list-item>
        <v-list-item class="itemOpciones" @click="go('/web/web_banners')">
          Nuevo Baner de Publicidad
        </v-list-item>
        <v-list-item class="itemOpciones" @click="go('/web/web_vista_articulos')">
          Vista de Articulos
        </v-list-item>
      </v-list-group>
    </div>
</template>

<script>
    export default {
        name: "sideSeguimientos",
        props:{permisos: Array},
      computed:{
        Pes(){
          return this.$store.state.pestana
        },
        PERMISOS(){
          let permisos = this.$store.state.permisosUser.split(',');
          let per = [];
          if (permisos.length > 1){
            permisos.forEach((item)=>{
              per.push(parseInt(item))
            })
            return per;
          }else
            return [];
        },
      },
        methods:{
          anadirPestana(key, titulo){
            let bandera = 0;
            this.Pes.forEach((item)=>{
              if (item.key === key)
                bandera++;
            });
            if (bandera === 0){
              this.$store.commit('anadirCaja', {titulo:titulo, key: key});
              this.$store.commit('cambiarTab', {val:key, tipo:false});
            }
          },
            go(url){
                this.$router.push(url)
            }
        }
    }
</script>

<style scoped>
    .itemOpciones{
        font-size: 10px !important;
        margin-left: 6px;
        cursor: pointer;
    }
    .itemOpciones:hover{
        background-color: #47494e;
        margin-left: 8px;
        font-size: 14px !important;
    }
</style>
