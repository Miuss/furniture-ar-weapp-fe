<template>
	<div>
		<div class="main-container">
			<home v-if="active=='home'" />
			<ar v-if="active=='ar'" />
			<me v-if="active=='me'" />
		</div>
		<div class="main-tabbar">
			<van-tabbar :z-index="1000" :active="active" @change="onChange" active-color="#ffffff" inactive-color="#8a8a8a">
				<van-tabbar-item v-for="(item, index) in icons" :key="index" :name="item.name">
					<img slot="icon" :src="item.default" :style="'width:'+ iconWidth + ';height:'+ iconHeight + ';'" />
					<img slot="icon-active" :src="item.active"
						:style="'width:'+ iconWidth + ';height:'+ iconHeight + ';'" />
					<p>{{ item.text }}</p>
				</van-tabbar-item>
			</van-tabbar>
		</div>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	import home from './basic/home/home.vue'
	import me from './basic/me/me.vue'
	import ar from './basic/ar/ar.vue'

	import svg_home from '../../assets/images/explore.svg'
	import svg_home_a from '../../assets/images/explore_active.svg'
	import svg_mine from '../../assets/images/me.svg'
	import svg_mine_a from '../../assets/images/me_active.svg'
	import svg_ar from '../../assets/images/cube-outline.svg'
	import svg_ar_a from '../../assets/images/cube-outline_active.svg'

	const active = ref('home')
	const iconWidth = '34px'
	const iconHeight = '25px'
	const icons = ref([{
		name: 'home',
		default: svg_home,
		active: svg_home_a,
		text: '首页'
	}, {
		name: 'ar',
		default: svg_ar,
		active: svg_ar_a,
		text: 'AR探索'
	}, {
		name: 'me',
		default: svg_mine,
		active: svg_mine_a,
		text: '我的'
	}])

	const onChange = (event) => {
		active.value = event.detail
	}
	
	const onClick = (event) => {
		console.log(event)
	}
</script>

<style lang="scss">
	.main-container {
		width: 100%;
	}
	
	.main-tabbar p {
		font-size: 8px;
	}

	.main-tabbar .van-tabbar {
		height: unset;
		padding: 14rpx 0;
		margin: 36rpx;
		margin-bottom: env(safe-area-inset-bottom);
		width: calc(100% - 72rpx);
		background-color: rgba(0, 0, 0, 0.85);
		-webkit-backdrop-filter: blur(20px);
		backdrop-filter: blur(20px);
		border-radius: 50em;
		box-sizing: border-box;
		box-shadow: 0 1px 5px rgba(34,34,34,.1);
		&:after {
			border-radius: 50em;
			border-color: #333333;
		}
	}
</style>
