<template>
  <v-container class="ma-4">
    <div class="h1 text-center font-weight-bold font-italic">PROFILE</div>
    <v-divider></v-divider>
    <v-row align-content="stretch" justify="center">
      <v-col lg="4" sm="6" xs="12">
        
        <v-card
          id="profile"
          style="height: 100%"
          max-width="500px"
          class="pa-8"
        >
          <v-row justify="center">
            <v-avatar
              class="my-2 ml-8"
              size="100"
            >
            <v-img
              :src="`/api/images/${user.image}`"
            ></v-img>
            </v-avatar>
            <span class="image-upload">
              <label for="file-input">
                <v-icon>mdi-camera</v-icon>
              </label>

              <input id="file-input" type="file" @change="onFileSelected" />
            </span>
          </v-row>  
          <v-card-title class="my-0" style="justify-content: center" v-model="editedItem.username">User Name : {{
            user.username
          }}</v-card-title>
           <v-card-subtitle class="my-0" style="text-align: center" v-model="editedItem.lastName">Last Name :{{
            user.lastName
          }}</v-card-subtitle>
           <v-card-subtitle class="my-0" style="text-align: center" v-model="editedItem.phoneNumber
           ">Phone Number :{{
            user.phoneNumber
          }}</v-card-subtitle>
          <v-card-subtitle class="my-0" style="text-align: center">Email :{{
            user.email
          }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import axios from "axios";
export default {
  data: () => ({
     editedIndex: -1,
     editedItem: {
      username: "",
      lastName: "",
      phoneNumber: 0
    },
    defaultItem: {
     username: "",
      lastName: "",
      phoneNumber: 0
    }
  }),
  mounted() {
    this.initialize();
  },
  computed: {
    ...mapState(["user"]),
      formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    }
  },
  methods: {
    ...mapActions(["changeUser"]),
    editItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.user[this.editedIndex], this.editedItem);
        await this.$axios.$put(
          `/api/users/${this.editedItem._id}`,
          this.editedItem
        );
      
      }   this.close();
    },
    initialize(){console.log(this.user)},
    async onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      const fb = new FormData();
      fb.append("image", this.selectedFile, this.selectedFile.name);
      await axios.put("/api/users/image", fb, {
        onUploadProgress: (uploadEvent) => {
          console.log(
            "upload Progress" +
              Math.round((uploadEvent.loaded / uploadEvent.total) * 100) +
              "%"
          );
        },
      });
      const user = await this.$axios.$get("/api/user");
      if (user.username) {
        this.changeUser(user);
      } else {
        this.changeUser({ username: false });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.image-upload > input {
  display: none;
}
</style>