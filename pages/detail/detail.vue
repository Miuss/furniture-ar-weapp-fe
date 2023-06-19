<template>
	<div>
		<van-nav-bar :z-index="99" :custom-style="scrollTop < 140 ? 'background: #ffffff00' : 'background: #ffffff'"
			:fixed="false" :border="false">
			<div class="title" slot="left" @click="toBack"
				:style="scrollTop < 140 ? 'width: 100%;color: #fff;font-size: 20px;font-weight: 600;':'width: 100%;color: #000;font-size: 20px;font-weight: 600;'">
				<van-icon name="arrow-left" /> {{ data != null ? data.name : '星窝' }}
			</div>
		</van-nav-bar>
		<div class="model-render">
			<ModelRender v-if="material != null" :material="material" :modelUrl="material.modelUrl"
				:modelScale="material.modelScale" :modelY="material.modelY" />
		</div>
		<div class="materials" v-if="material != null">
			<div class="material-item" @click="changeMaterial(item)" v-for="(item, index) in data.materials.rows"
				:class="item.id == material.id ? 'is-active' : ''">{{item.name}}</div>
		</div>
		<div class="model-card" v-if="data != null">
			<div class="price" v-if="material != null">¥{{material.price}}</div>
			<div class="model-name">{{data.name}}</div>
			<div class="content-title">家具介绍</div>
			<div class="content">
				{{data.content}}
			</div>
			<div class="content-title">材质介绍</div>
			<div class="content" v-if="material != null">
				{{material.content}}
			</div>
		</div>
	</div>
</template>

<script setup>
	import {
		defineProps,
		onMounted,
		ref
	} from 'vue'
	import {
		getFurnitureDetail
	} from '../../api/furniture.js'
	import ModelRender from '../../components/ModelRender'

	const props = defineProps({
		id: {
			type: String,
			default: ''
		},
	})

	const material = ref(null)

	const data = ref(null)

	const fetchData = async () => {
		const res = await getFurnitureDetail({
			id: props.id
		})

		data.value = res.data
		material.value = res.data.materials.rows[0]
	}

	const toBack = () => {
		wx.navigateBack()
	}

	const changeMaterial = (item) => {
		material.value = null
		setTimeout(() => {
			material.value = item
		}, 1)
	}

	onMounted(() => {
		fetchData()
	})

	console.log(props)
</script>

<style lang="scss">
	page {
		overflow: hidden;
	}

	.model-render {
		z-index: 1;
		width: 100vw;
		height: 45vh;
		background-image: radial-gradient(#383a3a 0%, #000000 80%);
	}

	.model-card {
		position: relative;
		padding: 28rpx;

		.price {
			font-size: 48rpx;
			font-weight: 500;
			color: #ff8917;
			float: right;
		}

		.model-name {
			margin-bottom: 23px;
			font-size: 36rpx;
			font-weight: 600;
		}

		.tags {
			display: block;
			margin-bottom: 10px;

			.tag-item {
				display: inline-block;
				margin-right: 8px;
			}
		}

		.content {
			opacity: .6;
			font-size: 28rpx;
		}

		.content-title {
			margin-top: 24rpx;
			margin-bottom: 12rpx;
			font-weight: 600;
			font-size: 30rpx;
		}
	}

	.materials {
		position: relative;
		padding: 28rpx;
		display: flex;

		.material-item {
			margin-right: 10px;
			color: #333;
			border: 1px solid #333;
			min-width: 64rpx;
			height: 64rpx;
			font-size: 22rpx;
			border-radius: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 4px;

			&.is-active {
				background: #333;
				color: #fff;
			}
		}
	}
</style>
