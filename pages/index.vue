<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to My authentication app
        </v-card-title>
        <v-card-text>
          <p>by GHOFRANE MESSAOUDI FROM C7  </p>
          
            
         
          
        </v-card-text>
        <v-card-actions>
     
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
export default {
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>