<template>
  <div>
    <Header :h1="title" />
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <nav aria-label="breadcrumb" class="mt-4">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><nuxt-link to="/">Главная</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">Чат</li>
            </ol>
          </nav>

          <div class="chat-container mt-4 mb-4" v-if="loggedIn">
            <div class="chat-log-wrapper" ref="chatLog">
              <div class="chat-log">
                <div v-for="entry in chatLogEntries" :key="entry.timestamp"
                  :class="['chat-entry', { 'own-message': entry.user === user.username }]">
                  <span class="chat-timestamp">{{ entry.timestamp }}</span>
                  <span class="chat-user">{{ entry.user }}:</span>
                  <br/>
                  <span class="chat-message" v-html="formatMessage(entry.message)"></span>
                </div>
              </div>
            </div>
            <div class="input-wrapper">
              <textarea id="chat-message-input" class="form-control" rows="3" v-model="message" @keydown="handleKeyDown"
                placeholder="Введите ваше сообщение"></textarea>
              <button id="chat-message-submit" class="btn btn-primary mt-2" @click="sendMessage"
                :disabled="!isComplete" title="Отправить - Enter, перенос строки - Shift+Enter">Отправить</button>
            </div>
          </div>
          <div v-else>
            <h6 class="card-header"><nuxt-link to="/signin">Авторизуйтесь</nuxt-link> или <nuxt-link
                to="/signup">зарегистрируйтесь</nuxt-link> чтобы воспользоваться чатом</h6>
          </div>
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
  data() {
    return {
      title: "Главный чат блога",
      websocket: null,
      chatLogEntries: [],
      message: ""
    };
  },
  methods: {
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, '<br>');
    },
    formatMessage(message) {
      return this.escapeHtml(message);
    },
    connectWebSocket() {
      if (this.loggedIn) {
        const token = this.$auth.strategy.token.get().split(' ')[1];
        this.websocket = new WebSocket(`ws://127.0.0.1:8000/?token=${token}`);
        this.websocket.onopen = this.onWebSocketOpen;
        this.websocket.onmessage = this.onWebSocketMessage;
        this.websocket.onclose = this.onWebSocketClose;
      }
    },
    onWebSocketOpen(event) {
      console.log("WebSocket connection opened");
    },
    onWebSocketMessage(event) {
      const data = JSON.parse(event.data);
      this.chatLogEntries.push({
        timestamp: data.timestamp,
        user: data.user,
        message: data.message
      });
      this.scrollToBottom();
    },
    onWebSocketClose(event) {
      console.log("WebSocket connection closed");
    },
    sendMessage() {
      if (this.message.trim() !== "") {
        const messageData = {
          message: this.message
        };
        this.websocket.send(JSON.stringify(messageData));
        this.message = "";
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatLog = this.$refs.chatLog;
        if (chatLog) {
          chatLog.scrollTop = chatLog.scrollHeight;
        }
      });
    },
    handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    }
  },
  computed: {
    loggedIn() {
      return this.$auth.loggedIn;
    },
    user() {
      return this.$auth.user;
    },
    isComplete() {
      return this.message;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.connectWebSocket();
    }
  },
  beforeDestroy() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
};
</script>

<style scoped>
.chat-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
}

.chat-log-wrapper {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #fff;
  margin-bottom: 15px;
}

.chat-log {
  display: flex;
  flex-direction: column;
}

.chat-entry {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

.own-message {
  align-self: flex-end;
  background-color: #f0f0f0;
  color: #333;
}

.other-message {
  background-color: #e9ecef;
  color: #333;
}

.chat-timestamp {
  color: #888;
  font-size: 0.9em;
  margin-right: 5px;
}

.chat-user {
  font-weight: bold;
  margin-right: 5px;
}

.chat-message {
  word-wrap: break-word;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
}

#chat-message-input {
  flex-grow: 1;
  resize: none;
}

#chat-message-submit {
  align-self: flex-end;
}
</style>