<template>
	<div>
		<div class="login-bg">
			<image
				style="background-image: url('https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-1.jpg');">
			</image>
		</div>
		<div class="login-box">
			<div class="logo">
				<image :src="logo"></image>
			</div>
			<div class="title">星窝</div>
			<div class="sub-title">AR识别家具小程序</div>
		</div>
		<div class="login-action" style="bottom: 20px;">
			<van-button type="primary" color="#000000" @click="userStore.userLogin()" size="large" round block :loading="userStore.loginLoading" loading-text="微信登录中..." plain>微信账号快速登录</van-button>
			<!-- <div class="login-tips">提示：等</div> -->
		</div>
	</div>
</template>

<script setup>
	import {
		useUserStore
	} from '../../store/userStore'

	const userStore = useUserStore()
</script>


<style scoped>
	.login-bg {
		position: fixed;
		height: 100vh;
		width: 100vw;
		z-index: -1;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}

	.login-bg image {
		z-index: -1;
		width: 140vw;
		height: 140vh;
		left: -20px;
		right: -20px;
		top: -20px;
		bottom: -20px;
		position: absolute;
		background-size: cover;
	}

	.login-bg::after {
		background-color: rgba(17, 17, 17, 0.6);
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: "";
	}

	.login-box {
		padding: 3em;
	}

	.login-box .logo image {
		margin-top: 3em;
		width: 128rpx;
		height: 128rpx;
		border-radius: 5em;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 2%), 0 16px 32px 0 rgb(0 0 0 / 7%);
		-webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
		box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
	}

	.login-box .title {
		margin-top: 20px;
		margin-bottom: 8px;
		font-size: 54rpx;
		font-weight: 600;
		color: #fff;
	}

	.login-box .sub-title {
		margin-top: 6px;
		font-size: 36rpx;
		opacity: .8;
		color: #fff;
	}

	.login-action {
		position: fixed;
		left: 3em;
		right: 3em;
		text-align: center;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.login-action .login-button {
		margin: 0 auto;
		width: 80%;
		padding: .8em 1.5em;
		color: #ffffff;
		font-weight: 500;
		font-size: 15px;
		border-radius: 8rpx;
		text-align: center;
	}

	.login-action .login-button:active {
		transform: scale(.98);
		transition: .2s;
	}

	.login-action .login-tips {
		margin-top: 8px;
		font-size: 13px;
		opacity: .6;
		color: #fff;
	}
</style>
