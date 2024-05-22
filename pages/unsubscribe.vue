<template>
  <div>
    <Header :h1="title" />
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h2>{{ title }}</h2>
          <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
          <p v-if="unsubscribeSuccessful" class="text-success">Вы успешно отписались от рассылки</p>
          <p v-if="alreadyUnsubscribed && !unsubscribeSuccessful" class="text-warning">Вы уже отписались от рассылки.</p>
          <p v-if="!unsubscribeSuccessful && !alreadyUnsubscribed" class="lead">Вы уверены, что хотите отписаться от рассылки?</p>
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
      title: "Отписка от рассылки",
      unsubscribeSuccessful: false,
      alreadyUnsubscribed: false,
      errorMessage: ''
    };
  },
  methods: {
    async checkSubscriptionStatus() {
      try {
        const response = await this.$axios.get('/api/profile/');
        const user = response.data.user;
        if (!user.subscribed_to_newsletter) {
          this.alreadyUnsubscribed = true;
        }
      } catch (error) {
        this.errorMessage = "Ошибка при проверке статуса подписки";
        console.error("Error checking subscription status:", error);
      }
    },
    async unsubscribeFromNewsletter() {
      try {
        await this.$axios.post(`/api/unsubscribe/newsletter/${this.$route.params.userId}/`);
        this.unsubscribeSuccessful = true;
      } catch (error) {
        this.errorMessage = "Ошибка при отписке от рассылки";
        console.error("Error unsubscribing from newsletter:", error);
      }
    }
  },
  async mounted() {
    if (!this.alreadyUnsubscribed) {
      await this.checkSubscriptionStatus();
      if (!this.alreadyUnsubscribed) {
        await this.unsubscribeFromNewsletter();
      }
    }
  }
};
</script>

<style scoped></style>