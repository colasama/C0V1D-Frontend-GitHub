<template>
  <div class="home">
      <Post/>
      <Question/>
      <Content/>
  </div>
</template>

<script>
// @ is an alias to /src
import Post from "../components/forum/Post.vue";
import Question from "../components/forum/Question.vue";
import Content from "../components/forum/Content.vue";


export default {
  name: 'Home',
  components: {
    Post,
    Question,
      Content,
  }
}
</script>
