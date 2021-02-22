<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>mdi-application</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
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
              <v-list-item-avatar>
                <img :src="`/api/images/${user.image}`" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ user.username }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-divider></v-divider>

          <v-list> </v-list>

          <v-card-actions>
            <v-btn color="primary" text to="/profil"> Profil </v-btn>
            <v-spacer></v-spacer>

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
    items() {
      console.log({ user: this.user });
      if (this.user.username === false) {
        return [
          {
            icon: "mdi-apps",
            title: "Register",
            to: "/register"
          }
        ]
        }
        else {
        return [
          {
            icon: "mdi-apps",
            title: "Profil",
            to: "/profil"
          }
        ]
        }
    }
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