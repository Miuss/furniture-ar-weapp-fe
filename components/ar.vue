<template>
	<cover-view class="loading" v-if="loading < 100">
		<cover-image class="loading-image" src="https://miuss.icu/ar-furniture-assets/ar-bg.jpg" />
		<cover-view class="loading-text">场景载入中...</cover-view>
	</cover-view>
	<canvas class="furniture-canvas" id="webgl" type="webgl" :style="{width:cw+'px', height:ch+'px'}">
		<cover-view class="furniture-click-view" @touchend="onTouchEnd"></cover-view>
		<cover-view class="furniture-list" :class="hideList?'furniture-menu-active':''">
			<cover-view class="furniture-list-icon-text" @click="showFurnitureList()">家具</cover-view>
			<cover-view class="furniture-list-view">
				<cover-view class="furniture-list-item" v-for="(item, index) in furnitureList" :key="index" @click="selectFurniture(item)">
					<cover-image :src="item.coverUrl"></cover-image>
					<cover-view class="furniture-tip" v-if="activeItem != null" :class="item.id == activeItem.id?'active':''">
						<cover-view class="furniture-tip-selected"></cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</cover-view>
	</canvas>
</template>

<script setup>
	import {
		onMounted,
		onUnmounted,
		ref,
		getCurrentInstance
	} from 'vue'
	import Experience from '@/plane/planeExperience.js'
	import {
		useUserStore
	} from '@/store/userStore.js'
	import { getFurnitureList } from '../api/furniture.js'

	const instance = getCurrentInstance()

	const webgl = ref(null)

	const info = wx.getSystemInfoSync()
	const cw = info.windowWidth
	const ch = info.windowHeight
	const safeArea = info.safeArea
	const pixelRatio = info.pixelRatio
	const exprience = ref(null)
	const loading = ref(0)

	const userStore = useUserStore()
	
	const activeItem = ref(null)
	
	const hideList = ref(true)
	const furnitureList = ref([])
	
	const fetchData = async () => {
		const res = await getFurnitureList({
			pageIndex: 0,
			pageSize: 1000
		})
		
		res.data.rows.forEach((item) => {
			item.materials.rows.forEach((material) => {
				furnitureList.value.push(material)
			})
		})
		activeItem.value = furnitureList.value[0]
	}
	
	const selectFurniture = (item) => {
		activeItem.value = item
		hideList.value = true
	}
	
	const showFurnitureList = () => {
		hideList.value = false
	}

	onMounted(() => {
		fetchData()
		wx.createSelectorQuery().in(instance).select('#webgl').node().exec(res => {
			console.log(res);
			const canvas = res[0].node
			console.log(cw * pixelRatio, ch * pixelRatio)
			canvas.width = cw * pixelRatio / 2
			canvas.height = ch * pixelRatio / 2
			exprience.value = new Experience(canvas, loading)
			console.log(res, 'canvas123');
		})
	})

	const onTouchEnd = (e) => {
		console.log(e)
		const x = e.changedTouches[0].clientX;
		const y = e.changedTouches[0].clientY;
		const safeAreaBottom = ch - safeArea.bottom;
		
		console.log(x, y)
		console.log('点击啦')

		// 计算tabber位置 防止事件冒泡
		if (y <= (ch - safeAreaBottom) && y >= (ch - safeAreaBottom - 58) && x <= cw - 16 && x >= 16) {
			return
		}

		// three 点击触发
		
		const model = activeItem.value
		console.log(model)
		exprience.value.onTouchEnd(model.id, model.modelUrl, model.md5, model.modelArScale)
	}

	const say = () => {
		console.log(666)
	}

	onUnmounted(() => {
		exprience.value.removeVkSession()
		exprience.value.threeDestroy()
	})
</script>

<style lang="scss">
	page {
		background: #000;
	}

	.furniture-canvas {
		width: 100vw;
		height: 100vh;
	}
	
	.furniture-click-view {
		position: absolute;
		width: 100vw;
		height: calc(100vh - env(safe-area-inset-bottom) - 58px);
		z-index: 2;
	}

	.furniture-list {
		position: absolute;
		margin-bottom: 88px;
		bottom: env(safe-area-inset-bottom);
		right: 36rpx;
		background-color: #fff;
		border-radius: 8px;
		height: 160rpx;
		width: calc(100vw - 72rpx - 40rpx);
		padding: 20rpx;
		z-index: 5;
		
		&.furniture-menu-active {
			width: 64rpx;
			height: 64rpx;
			background: #000000;
			border-radius: 50em;
			display: flex;
			justify-content: center;
			align-items: center;
			box-shadow: 0 1px 5px rgba(34, 34, 34, 0.1);
			
			.furniture-list-view {
				display: none;
			}
		
			.furniture-list-icon-text {
				display: block;
				color: #ffffff;
			}
		}
		
		.furniture-list-icon-text {
			display: none;
		}
		
		.furniture-list-view {
			display: block;
			overflow: scroll;
			white-space: nowrap;

			.furniture-list-item {
				position: relative;
				display: inline-block;
				margin-right: 20rpx;
				background: #eee;
				width: 160rpx;
				height: 160rpx;
				border-radius: 8px;
				overflow: hidden;
				
				.furniture-tip {
					position: absolute;
					top: 8rpx;
					right: 8rpx;
					width: 28rpx;
					height: 28rpx;
					border-radius: 50em;
					border: 2px solid #fff;
					
					.furniture-tip-selected {
						display: none;
					}
					
					&.active {
						.furniture-tip-selected {
							position: absolute;
							left: 2px;
							top: 2px;
							display: block;
							content: '';
							width: calc(100% - 4px);
							height: calc(100% - 4px);
							background: #fff;
							border-radius: 50em;
						}
					}
				}
			}
		}
	}

	.furniture-list::-webkit-scrollbar {
		display: none;
	}

	.tabbar {
		position: fixed;
		left: 36rpx;
		right: 36rpx;
		width: calc(100% - 72rpx);
		height: 116rpx;
		bottom: env(safe-area-inset-bottom);
		border-radius: 50em;
		overflow: hidden;
		display: flex;
		background-color: #eee;
		z-index: 2;
	}

	.loading {
		text-align: center;

		.loading-image {
			margin: 0 auto;
			margin-top: 25vh;
			width: 90vw;
		}

		.loading-text {
			margin-top: 20vh;
			color: #fff;
			font-size: 32rpx;
		}
	}
</style>
