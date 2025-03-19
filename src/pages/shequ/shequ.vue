<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationBarTitleText: '社区',
    navigationStyle: 'default',
  },
}
</route>
<template>
  <view class="container">
    <!-- 发布动态区域 -->
    <view class="publish-area">
      <view class="member-avatar">
        <image :src="getAvatar('男')" mode="aspectFit"></image>
      </view>
      <view class="publish-input">
        <wd-textarea v-model="postContent" placeholder="说点什么吧..."></wd-textarea>
        <wd-upload
          :file-list="fileList"
          image-mode="aspectFill"
          :action="action"
          @change="handleChange"
        ></wd-upload>
        <wd-button @click="publishPost">发布</wd-button>
      </view>
    </view>

    <!-- 动态列表 -->
    <view class="post-list">
      <view v-for="(post, index) in posts" :key="index" class="post-item">
        <view class="member-avatar">
          <image :src="getAvatar('男')" mode="aspectFit"></image>
        </view>
        <view class="post-content">
          <view class="post-text">{{ post.content }}</view>
          <view class="post-images">
            <wd-img
              v-for="(image, i) in post.images"
              :key="i"
              :src="image"
              mode="aspectFit"
            ></wd-img>
          </view>
          <view class="post-actions">
            <wd-button @click="likePost(index)">点赞 {{ post.likes }}</wd-button>
            <wd-button @click="commentPost(index)">评论</wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
// 发布内容
const postContent = ref('')
// 发布的图片列表
const postImages = ref([])
// 动态列表
const posts = ref([
  {
    avatar: '../../static/avatar.png',
    content: '这是一条测试动态',
    images: ['../../static/test-image.jpg'],
    likes: 0,
    comments: [],
  },
])
const fileList = ref([
  {
    url: 'https://img12.360buyimg.com//n0/jfs/t1/29118/6/4823/55969/5c35c16bE7c262192/c9fdecec4b419355.jpg',
  },
])
const action = 'https://mockapi.eolink.com/zhTuw2P8c29bc981a741931bdd86eb04dc1e8fd64865cb5/upload'
function handleChange({ fileList: files }) {
  fileList.value = files
}
const getAvatar = (gender) => {
  return gender === '男'
    ? '../../static/saishi/male_avatar.png'
    : '../../static/saishi/female_avatar.png'
}
// 发布动态
const publishPost = () => {
  if (postContent.value || postImages.value.length > 0) {
    posts.value.push({
      avatar: '../../static/avatar.png',
      content: postContent.value,
      images: [...postImages.value],
      likes: 0,
      comments: [],
    })
    postContent.value = ''
    postImages.value = []
  }
}

// 点赞动态
const likePost = (index) => {
  posts.value[index].likes++
}

// 评论动态
const commentPost = (index) => {
  // 这里可以实现评论功能，例如弹出评论框等
  console.log('点击评论', index)
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.publish-area {
  display: flex;
  margin-bottom: 20px;
}

.publish-input {
  flex: 1;
  margin-left: 10px;
}

.wd-textarea {
  margin-bottom: 10px;
}

.image-upload {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.uploaded-image {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.member-avatar image {
  width: 100%;
  height: 100%;
}

.delete-image {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}

.post-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  display: flex;
  margin-bottom: 20px;
}

.post-content {
  flex: 1;
  margin-left: 10px;
}

.post-text {
  margin-bottom: 10px;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
}

.post-images .wd-img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.post-actions {
  display: flex;
}

.post-actions .wd-button {
  margin-right: 10px;
}
</style>
