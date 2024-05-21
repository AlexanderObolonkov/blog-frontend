<template>
  <footer>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-8">
          <span class="text-muted">
            Агентство по разработке потрясных сайтов на [[...]]. А это просто наш блог.
          </span>
        </div>
        <div class="col-md-4 text-right">
          <a href="#" class="btn btn-link">Наверх</a>
          <button @click="toggleSubscription" class="btn btn-link" :class="isSubscribed ? 'text-muted' : ''">
            {{ isSubscribed ? 'Отписаться от новых постов' : 'Подписаться на новые посты' }}
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      isAuthenticated: false,
      isSubscribed: false,
      userId: null
    };
  },
  async mounted() {
    await this.checkAuthentication();
    if (this.isAuthenticated) {
      await this.checkSubscriptionStatus();
    }
  },
  methods: {
    async checkAuthentication() {
      this.isAuthenticated = this.$auth.loggedIn;
      if (this.isAuthenticated) {
        const response = await this.$axios.get("/api/profile/");
        this.userId = response.data.user.id;
      }
    },
    async checkSubscriptionStatus() {
      try {
        const response = await this.$axios.get("/api/profile/");
        this.isSubscribed = response.data.user.subscribed_to_newsletter;
      } catch (error) {
        console.error("Error checking subscription status:", error);
      }
    },
    async toggleSubscription() {
      if (this.isSubscribed) {
        await this.unsubscribe();
        alert("Вы успешно отписались");
      } else {
        await this.subscribe();
        alert("Вы успешно подписались");
      }
    },
    async subscribe() {
      try {
        await this.$axios.post(`/api/subscribe/newsletter/${this.userId}/`);
        this.isSubscribed = true;
      } catch (error) {
        console.error("Error subscribing:", error);
      }
    },
    async unsubscribe() {
      try {
        await this.$axios.post(`/api/unsubscribe/newsletter/${this.userId}/`);
        this.isSubscribed = false;
      } catch (error) {
        console.error("Error unsubscribing:", error);
      }
    }
  }
};
</script>

<style scoped>
footer {
  width: 100%;
}
</style>