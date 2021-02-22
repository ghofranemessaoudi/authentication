<template>
  <v-card class="pa-6">
    <v-card-title>Login Form</v-card-title>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :counter="50"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Login
      </v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      <v-btn href="/api/auth/google" >signin with google</v-btn>
    </v-form>
   
  </v-card>
</template>
<script>
  import { mapActions } from "vuex";
export default {

  data: () => ({
    valid: true,
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [
      v => !!v || "password is required",
      v => (v && v.length > 6) || "password must be more than 6 characters"
    ]
  }),
  methods: {
    ...mapActions(["changeUser"]),
    async validate() {
      if (this.$refs.form.validate()) {
        let userAuth = {
          email: this.email,
          password: this.password
        };
        let rtn = await this.$axios.$post("/api/login", userAuth);
        console.log({ rtn });
        const user = await this.$axios.$get("/api/user");
        if (user.username) {
          this.changeUser(user);
        } else {
          this.changeUser({ username: false });
        }
        this.$router.push("/profil");
      }
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>