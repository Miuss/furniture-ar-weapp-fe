<template>
	<scroll-view :scroll-y="true" style="height: 100vh;">
		<div class="page-bg"></div>

		<van-nav-bar :z-index="99" :fixed="true" :border="false" :placeholder="true">
			<div class="title" slot="left">
				星窝
			</div>
		</van-nav-bar>
		<div class="mine-container" v-if="userStore.user.userInfo != null">
			<div class="user-avatar-card">
				<div class="avatar">
					<img :src="userStore.user.userInfo.avatarUrl ?? 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'" />
				</div>
				<div class="info">
					<div class="title">
						<div class="name">
							{{userStore.user.userInfo.username}}
							<span v-if="userStore.user.userInfo.roles == 'admin'">管理员</span>
						</div>
					</div>
					<div class="addtime">
						{{ userStore.user.userInfo.createdAt }}
					</div>
				</div>
			</div>
		</div>
		<van-cell-group class="user-cell-group" inset>
			<van-cell size="large" @click="toAdminLogin()" is-link>
				<img slot="icon" class="icon" :src="infoIcon" />
				<div slot="title">
					<div class="van-cell-text">扫描二维码登录后台</div>
				</div>
			</van-cell>
			<van-cell size="large" @click="toAbout()" is-link>
				<img slot="icon" class="icon" :src="infoIcon" />
				<div slot="title">
					<div class="van-cell-text">关于我们</div>
				</div>
			</van-cell>
			<button open-type="feedback">
				<van-cell size="large" is-link>
					<img slot="icon" class="icon" :src="feedbackIcon" />
					<div slot="title">
						<div class="van-cell-text">意见反馈</div>
					</div>
				</van-cell>
			</button>
			<button open-type="share">
				<van-cell size="large" is-link>
					<img slot="icon" class="icon" :src="shareOutlineIcon" />
					<div slot="title">
						<div class="van-cell-text">分享小程序</div>
					</div>
				</van-cell>
			</button>
			<van-cell size="large" @click="userLogout()" is-link>
				<img slot="icon" class="icon" :src="logoutIcon" />
				<div slot="title">
					<div class="van-cell-text">退出登录</div>
				</div>
			</van-cell>
		</van-cell-group>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		useUserStore
	} from '../../../../store/userStore'
	import {
		loginAdmin
	} from '@/api/user.js'
	import infoIcon from '../../../../assets/images/info.svg'
	import feedbackIcon from '../../../../assets/images/feedback.svg'
	import shareOutlineIcon from '../../../../assets/images/share-outline.svg'
	import logoutIcon from '../../../../assets/images/logout.svg'

	const userStore = useUserStore()
	
	const toAbout = () => {
		
	}
	
	const toAdminLogin = () => {
		wx.scanCode({
		  onlyFromCamera: true,
		  success(res) {
			  console.log(res.result)
			  loginAdmin({token: res.result})
		  }
		})
	}
	
	const userLogout = () => {
		userStore.Restore()
		wx.redirectTo({
			url: '/pages/login/login'
		})
	}
	
</script>

<style lang="scss">
	page {
		overflow: hidden;
		background-color: #ffffff;
	}

	.page-bg {
		background-color: #f7f8fa;
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -1;
	}

	.user-avatar-card {
		background-color: #ffffff;
		position: relative;
		display: block;
		padding: 16px 16px;
		height: 64px;
		border-bottom: 1px solid #eeeeee;
		margin-bottom: 16px;
	}

	.user-avatar-card .avatar {
		z-index: 1;
		position: absolute;
		left: 16px;
	}

	.user-avatar-card .avatar image {
		border-radius: 5px;
		width: 64px;
		height: 64px;
	}

	.user-avatar-card .info {
		margin-left: 84px;
	}

	.user-avatar-card .name {
		font-size: 20px;
		margin-top: 6px;
		font-weight: 600;
	}

	.user-avatar-card .name span {
		margin-left: 8px;
		font-size: 13px;
		background-color: #000000;
		color: #FFFFFF;
		padding: 0 4px;
		border-radius: 3px;
	}

	.user-avatar-card .addtime {
		margin-top: 5px;
		opacity: .6;
		font-size: 16px;
	}

	.user-avatar-card .department {
		position: absolute;
		z-index: 0;
		opacity: .05;
		right: 2px;
		bottom: -6px;
		font-weight: 600;
		font-size: 34px;
	}

	.user-info-card {
		margin: 0 16px;
		margin-bottom: 16px;
		background-color: #ffffff;
		border-radius: 5px;
		padding: 24px 16px;
		text-align: center;
	}

	.user-info-card .title {
		opacity: .6;
		font-size: 13px;
	}

	.user-info-card .value {
		font-weight: 600;
		font-size: 16px;
		margin-bottom: 3px;
	}

	.user-cell-group .icon {
		margin-right: 10px;
		width: 25px;
		height: 25px;
	}

	.user-cell-group button {
		padding: 0;
		background-color: transparent;
		text-align: unset;
		font-size: unset;
	}

	.user-cell-group button::after {
		content: unset;
	}
</style>
