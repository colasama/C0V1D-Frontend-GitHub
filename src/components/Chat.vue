<template>
  <div class="chatBox">
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="this.$store.state.isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="showEmoji"
      :showFile="showFile"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" >
      <template v-slot:header>
        <div style="text-align: left; margin-top: 16px; margin-left: 8px">
          <b style="font-size: 22px">疫情政策问答小助手🤔</b>
          <p></p>
          <!--p>我们的小助手叫<b style="color: #54c219">小疫</b>哦😊️️<br/>请使用文明的语言和我们的小助手交流哦❤️</p-->
          <p></p>
        </div>
      </template>
      <template v-slot:text-message-body="{ message }">
        <div style="text-align: left"><b v-if="message.author === 'me'">{{message.data.text}}</b></div>
        <div style="text-align: left"><b style="color: #232323" v-if="message.author !== 'me'">{{message.data.text}}</b></div>
      </template>
    </beautiful-chat>
  </div>
</template>

<script>
import aliww from '../assets/xiaoyi.png'
import hide from '../assets/hide.png'
export default {
  name: 'Chat',
  components: {
  },
  data() {
    return {
      participants: [
        {
          id: 'user1',
          name: '疫情政策问答小助手',
          imageUrl: aliww
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
        { type: 'text', author: `user1`, data: { text: `您好，输入疫情政策相关的信息，小助手会为您解答哦😄` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      showEmoji: false,
      showFile: false,
      icons: {
        open: {img: aliww, name: 'default'},
        close: {img: hide, name:'default'},
      },
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  methods: {
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    handleSpecial(message) {
      if (message.data.text.indexOf('小疫') !== -1) {
        let tmp1 = {type: 'text', author: `user1`, data: {text: '我在🙋！'}}
        this.messageList = [...this.messageList, tmp1]
        return true;
      }
      return false;
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [ ...this.messageList, message];
      if (this.handleSpecial(message)) return;
      this.$http.post('https://dbettkk.xyz:8081/AnswerText', {'text': message.data.text}).then(res => {
        let tmp1 = { type: 'text', author: `user1`, data: { text: '猜您想问：' + res.data.generate_qa } }
        let tmp2 = { type: 'text', author: `user1`, data: { text: res.data.generate_text } }
        this.messageList = [ ...this.messageList, tmp1, tmp2 ]
      }).catch(() => {
        let tmp1 = { type: 'text', author: `user1`, data: { text: '抱歉，没有听懂您说的什么哦。' } }
        this.messageList = [ ...this.messageList, tmp1 ]
      });
      //let tmp = { type: 'text', author: `user1`, data: { text: `fuck you` } }
      //console.log(message);
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.$store.state.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.$store.state.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message) {
      // 如果已经存在了 则进行自动补全
      const m = this.messageList.find(m=>m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  },
};
</script>

<style scoped>
.chatBox {
  width: 320px;
  height: 640px;
}
</style>