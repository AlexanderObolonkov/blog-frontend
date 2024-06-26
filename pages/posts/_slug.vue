<template>
  <div>
    <Header :h1=post.h1 />
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <nav aria-label="breadcrumb" class="mt-4">
            <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
              <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <nuxt-link to="/" itemid="/" itemtype="https://schema.org/Thing" itemscope itemprop="item">
                  <span itemprop="name">Главная</span>
                </nuxt-link>
                <meta itemprop="position" content="1">
              </li>
              <li class="breadcrumb-item active" aria-current="page" itemprop="itemListElement" itemscope
                itemtype="https://schema.org/ListItem">
                <span itemprop="name">{{ post.h1 }}</span>
                <meta itemprop="position" content="2">
              </li>
            </ol>
          </nav>
          <img class="img-fluid rounded " :src="post.image" alt="">
          <hr>
          <div class="mb-2 d-flex justify-content-end">
            <button @click="toggleSpeak" class="btn btn-light btn-sm">{{ isSpeaking ? "Отменить прослушивание" :
              "Прослушать статью" }}</button>
            <button v-if="isSpeaking" @click="togglePause" class="btn btn-secondary ml-2 btn-sm">{{ isPaused ?
              "Возобновить" : "Пауза" }}</button>
          </div>
          <hr>
          <p v-html="post.content" v-highlightjs>
          </p>
          <div class="d-flex justify-content-end">
            <span v-for="tag in post.tags">
              <nuxt-link :to="`/tags/${tag.slug}`" class="mr-1 badge badge-info">#{{ tag.name }}</nuxt-link>
            </span>
          </div>
          <hr>
          <div class="d-flex">
            <div class="mr-auto p-2 lead">Автор: {{ post.author }}</div>
            <div class="p-2">Опубликовано: {{ post.created_at }}</div>
          </div>
          <hr>
          <Comments :comments="comments" :post="post" />
        </div>
        <Aside :tags=tags :aside=aside />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import post_detail from "@/layouts/post_detail";
import Header from "~/components/Header";
import Aside from "@/components/Aside";
import Comments from "@/components/Comments";

export default {
  components: {
    Aside,
    Header,
    Comments
  },
  layout: "post_detail",
  async asyncData({ params }) {
    console.log(params)
    const post = await axios.get(`http://127.0.0.1:8000/api/posts/${params.slug}`);
    const tags = await axios.get(`http://127.0.0.1:8000/api/tags/`);
    const aside = await axios.get(`http://127.0.0.1:8000/api/aside/`);
    const comments = await axios.get(`http://127.0.0.1:8000/api/comments/${params.slug}`);
    return {
      post: post.data,
      tags: tags.data,
      aside: aside.data,
      comments: comments.data
    }
  },
  data() {
    return {
      isSpeaking: false,
      isPaused: false,
      utterance: null
    };
  },
  methods: {
    toggleSpeak() {
      if (this.isSpeaking) {
        this.stopSpeaking();
      } else {
        this.startSpeaking();
      }
    },
    startSpeaking() {
      if ('speechSynthesis' in window) {
        this.utterance = new SpeechSynthesisUtterance(this.post.content.replace(/(<([^>]+)>)/gi, ""));
        this.utterance.onend = this.speechEnded;
        window.speechSynthesis.speak(this.utterance);
        this.isSpeaking = true;
        this.isPaused = false;
      } else {
        alert('Извините, ваш браузер не поддерживает преобразование текста в речь!');
      }
    },
    stopSpeaking() {
      if (this.utterance) {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
        this.isPaused = false;
        this.utterance = null;
      }
    },
    togglePause() {
      if (this.isPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
      this.isPaused = !this.isPaused;
    },
    speechEnded() {
      this.isSpeaking = false;
      this.isPaused = false;
      this.utterance = null;
    }
  },
  head() {
    return {
      title: this.post.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.post.description
        },
        {
          property: "og:url",
          content: `http://localhost:3000${this.$route.path}`
        },
        {
          property: "og:type",
          content: "website"
        },
        {
          property: "og:title",
          content: `${this.post.title}`
        },
        {
          property: "og:description",
          content: `${this.post.description}`
        },
        {
          property: "og:site_name", content: "Мой супер-пупер блог"
        },
        {
          property: "og:locale", content: "ru_RU"
        },
        {
          property: "og:image",
          content: "ссылка на картинку"
        },
        {
          property: "og:image:alt",
          content: "Описание картинки"
        },
        {
          property: "fb:app_id", content: "23456789"
        },
        {
          name: "twitter:card", content: "summary_large_image"
        },
        {
          name: "twitter:site", content: "http://localhost:3000"
        },
        {
          name: "twitter.title",
          content: `${this.post.title}`
        },
        {
          name: "twitter:description",
          content: `${this.post.description}`
        },
        {
          name: "twitter:image:src",
          content: "http://localhost:3000/img"
        }
      ]
    };
  },
}
</script>

<style scoped></style>