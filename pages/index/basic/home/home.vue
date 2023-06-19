<template>
	<scroll-view @scroll="onPageScroll" :scroll-y="true" style="height: 100vh;">
		<van-nav-bar :z-index="99" :custom-style="scrollTop < 140 ? 'background: #ffffff00' : 'background: #ffffff'" :fixed="true" :border="false">
			<div class="title" slot="left" :style="scrollTop < 140 ? 'width: 100%;color: #fff;font-size: 20px;font-weight: 600;':'width: 100%;color: #000;font-size: 20px;font-weight: 600;'">
				星窝
			</div>
		</van-nav-bar>
		<div class="navbar-bg-cover">
			<swiper class="navbar-bg-swiper" :indicator-dots="false" :autoplay="true">
				<swiper-item v-for="(item, index) in covers" :key="index">
					<img class="cover-item" :src="item.url" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</div>
		<div class="furniture-list-card">
			<div class="list-card-title">家具列表</div>
			<div class="list-card-subtitle">多元家具风格任你选</div>
			<van-row gutter="12">
				<van-col span="12" v-for="(item, index) in list" :key="index">
					<div class="list-card" @click="toDetailPage(item)">
						<div class="cover">
							<img :src="item.coverUrl" mode="aspectFill" />
						</div>
						<div class="name">{{item.name}}</div>
						<div class="tags">
							<van-tag class="tag-item" v-for="(tag) in item.materials.rows">
								{{tag.name}}
							</van-tag>
						</div>
					</div>
				</van-col>
				<div class="list-card-loading" v-if="loading">
					<van-loading type="spinner" />
				</div>
				<van-col span="24">
					<div class="list-banner">
						<div class="list-title">现货家具，方便省心</div>
						<div class="list-subtitle">现货家具，安全环保，无需漫长等待</div>
					</div>
				</van-col>
			</van-row>
		</div>
	</scroll-view>
</template>

<script setup>
	import { getFurnitureList } from '../../../../api/furniture.js'
	import {
		ref,
		onMounted
	} from 'vue'
	
	const loading = ref(true)

	const covers = ref([{
		id: 1,
		url: 'https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-1.jpg'
	}, {
		id: 2,
		url: 'https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-2.jpg'
	}, {
		id: 3,
		url: 'https://mp-content.store-companion.ikea.cn/static/design-wrd-banner-pc-3.jpg'
	}]);

	const scrollTop = ref(0)
	
	const list = ref([])
	
	const fetchData = async () => {
		loading.value = true
		try {
			const res = await getFurnitureList({
				pageIndex: 0,
				pageSize: 100
			})
			list.value = res.data.rows
		} catch (e) {
			console.error(e)
		} finally {
			loading.value = false
		}
	}
	
	onMounted(() => {
		fetchData()
	})
	
	const toDetailPage = (item) => {
		wx.vibrateShort()
		wx.navigateTo({
			url: '/pages/detail/detail?id='+item.id
		})
	}

	const onPageScroll = (e) => {
		scrollTop.value = e.detail.scrollTop
	}
</script>

<style lang="scss">
	page {
		background-color: #ffffff;
	}
	
	.navbar-bg-cover {
		position: relative;
		width: 100vw;
		height: 400rpx;
		background: #000000;
		
		.navbar-bg-swiper {
			height: 400rpx;
		}

		.cover-item {
			width: 100%;
			height: 400rpx;
		}

		&:before {
			position: absolute;
			content: '';
			bottom: 0;
			left: 0;
			right: 0;
			height: 60rpx;
			background: repeating-linear-gradient(#00000000, #000);
			z-index: 1;
		}
	}

	.furniture-list-card {
		padding: 48rpx 36rpx;
		background: #fff;

		.list-card-title {
			font-size: 18px;
			font-weight: 500;
		}

		.list-card-subtitle {
			opacity: .5;
			font-size: 13px;
			margin-bottom: 36rpx;
		}

		.list-cover {
			margin-bottom: 18rpx;
			width: 100%;
			height: 400rpx;
		}
		
		.list-card-loading {
			text-align: center;
		}

		.list-banner {
			padding: 48rpx 36rpx;
			border-radius: 12rpx;
			background: rgb(206, 202, 176);
			color: #000;

			.list-title {
				margin-bottom: 8rpx;
				font-size: 36rpx;
				font-weight: 600;
			}

			.list-subtitle {
				font-size: 24rpx;
				opacity: .5;
			}
		}
		
		.list-card {
			margin-bottom: 24rpx;
			width: 100%;
			background-color: #f9f9f9;
			border-radius: 12rpx;
			overflow: hidden;
			
			.cover {
				width: 100%;
				image {
					width: 100%;
					opacity: .8;
				}
			}
			
			.name {
				padding: 0 12rpx;
				margin: 12rpx 0;
				font-size: 30rpx;
				font-weight: 500;
				opacity: .8;
				color: #000;
			}
			
			.tags {
				padding: 0 12rpx;
				margin-bottom: 12rpx;
				
				.tag-item {
					margin-right: 12rpx;
				}
			}
		}
	}
</style>
