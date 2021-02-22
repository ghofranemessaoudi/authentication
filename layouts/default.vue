<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
  
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn text to="/register" v-if="user.username === false"> Signup </v-btn>
      <v-btn text to="login" v-if="user.username === false"> Login </v-btn>
      <v-menu
        v-if="user.username !== false"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark v-bind="attrs" v-on="on">
            <i class="fas fa-sign-out-alt"></i>
            {{ user.username }}
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list> </v-list>

          <v-card-actions>
            <v-btn color="primary" text @click="logout"> Logout </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <v-main class="main">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      menu: false,

      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "AUTHENTICATION"
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    ...mapActions(["changeUser"]),
    async initialize() {
      const user = await this.$axios.$get("/api/user");
      if (user.username) {
        this.changeUser(user);
      } else {
        this.changeUser({ username: false });
      }
    },
    async logout() {
      console.log("logout");
      await this.$axios.$delete(`/api/logout`);
      await this.initialize();
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
.main {
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>