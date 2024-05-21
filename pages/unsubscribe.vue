<template>
  <div>
    <Header :h1="title" />
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h2>{{ title }}</h2>
          <p class="lead">Вы уверены, что хотите отписаться от рассылки?</p>
          <button @click="unsubscribeFromNewsletter" class="btn btn-danger">Отписаться</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  components: { Header },
  layout: "post_detail",
  name: "Unsubscribe",
  data() {
    return {
      title: "Отписка от рассылки"
    }
  },
  methods: {
    async unsubscribeFromNewsletter() {
      try {
        await this.$axios.post(`/api/unsubscribe/newsletter/${this.$auth.user.id}/`);
        // this.$store.commit('updateNewsletterSubscription', false); VUEX ГООООЛ
        alert("Вы успешно отписались от рассылки");
        this.$router.push("/");
      } catch (error) {
        console.error("Error unsubscribing from newsletter:", error);
      }
    }
  }
}
</script>

<style scoped></style>