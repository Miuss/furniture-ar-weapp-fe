<template>
	<img class="loading-icon" v-if="loading" :src="imgLoading" mode="widthFix">
	<canvas id="gl-model" class="webgl-model" type="webgl" @touchstart="onTX" @touchmove="onTX"
		@touchend="onTX"></canvas>
</template>

<script setup>
	import {
		defineProps,
		onMounted,
		onUnmounted,
		ref,
		reactive,
		getCurrentInstance
	} from 'vue'
	import {
		$cancelAnimationFrame,
		$requestAnimationFrame,
		$window,
		AmbientLight,
		DirectionalLight,
		PointLight,
		PerspectiveCamera,
		PLATFORM,
		Scene,
		sRGBEncoding,
		WebGL1Renderer,
		ShadowMaterial,
		Mesh,
		PlaneGeometry
	} from 'three-platformize'
	import {
		WechatPlatform
	} from 'three-platformize/src/WechatPlatform'
	import {
		GLTF,
		GLTFLoader
	} from 'three-platformize/examples/jsm/loaders/GLTFLoader'
	import {
		OrbitControls
	} from 'three-platformize/examples/jsm/controls/OrbitControls'
	import imgLoading from '@/assets/images/loading.svg'

	const props = defineProps({
		modelUrl: {
			type: String,
			default: ''
		},
		modelScale: {
			type: Number,
			default: 1
		},
		modelY: {
			type: Number,
			default: 1
		},
		material: {
			type: Object,
			default: null
		}
	})

	const instance = getCurrentInstance()

	const loading = ref(true)

	let platformInfo = reactive(null)
	const frameId = ref(null)
	const disposing = ref(null)
	const info = wx.getSystemInfoSync()
	const cw = info.windowWidth
	const ch = info.windowHeight

	onMounted(() => {
		wx.createSelectorQuery().in(instance).select('#gl-model').node().exec(async (res) => {
			console.log(res)
			const canvas = res[0].node

			platformInfo = new WechatPlatform(canvas)
			PLATFORM.set(platformInfo);

			const renderer = new WebGL1Renderer({
				canvas,
				antialias: true,
				alpha: true
			})
			const camera = new PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
			const scene = new Scene()
			const gltfLoader = new GLTFLoader()
			const controls = new OrbitControls(camera, canvas);
			controls.enableDamping = true
			controls.autoRotate = true
			//限制最大仰视角和俯视角
			controls.minPolarAngle = 0
			controls.maxPolarAngle = 1.5

			// wx.showLoading({
			// 	title: '模型载入中',
			// 	mask: true
			// })


			// 同步下载图像
			const downloadModel = (item) => {
				const fs = wx.getFileSystemManager()

				return new Promise((resolve) => {
					const filePath = `${uni.env.USER_DATA_PATH}/${item.md5}.glb`
					console.log(filePath)
					fs.getFileInfo({
						filePath,
						success: res => {
							const content = fs.readFileSync(filePath)
							console.log(content)
							resolve(content)
						},
						fail: e => {
							console.log(e)
							console.log(item.modelUrl)

							wx.downloadFile({
								url: item.modelUrl,
								success: res => {
									fs.saveFile({
										filePath,
										tempFilePath: res
											.tempFilePath,
										success: data => {
											const content =
												fs
												.readFileSync(
													filePath
													)
											console.log(
												content
												)
											resolve(
												content)
										}
									})
								}
							})
						}
					})
				})
			}

			/**
			 * @param {id: string, modelUrl: string, modelMd5: string} modelInfo
			 */
			const loadModel = async (modelInfo) => {
				const item = modelInfo
				const modelPath = await downloadModel(item)
				const gltfLoader = new GLTFLoader()
				return new Promise((resolve, reject) => {
					gltfLoader.parse(modelPath, `${item.modelMd5}.glb`, (gltf) => {
						const loadedModel = gltf
						loadedModel.scene.traverse(child => {
							if (child.material) {
								child.material.transparent = true
								child.castShadow = true
								child.material.depthTest = true
								// child.material.side = this.THREE.FrontSide
								// 设置贴图自发光，解决模型黢黑问题
								// child.material.emissive = child.material.color
								child.material.emissiveMap = child.material
									.map
							}
						})
						// 将加载完毕的模型及markerId的对应数据添加到loadedModels里
						resolve(loadedModel)
					}, (error) => {
						console.log(error)
						reject(error)
					})
				})
			}

			const model = await loadModel(props.material)

			loading.value = false
			model.parser = null;
			model.scene.scale.set(props.material.modelScale, props.material.modelScale, props.material.modelScale) //设置模型缩放大小
			model.scene.position.set(0, 0, 0)
			model.scene.position.y = props.material.modelY
			scene.add(model.scene);

			const planeMaterial = new ShadowMaterial()
			planeMaterial.opacity = 0.3
			const plane = new Mesh(new PlaneGeometry(1000, 1000), planeMaterial);
			plane.rotation.x = -Math.PI / 2
			plane.position.set(0, 0, 0)
			plane.receiveShadow = true
			scene.add(plane)

			camera.position.z = 10
			renderer.outputEncoding = sRGBEncoding
			scene.add(new AmbientLight(0xffffff, 0.2))
			scene.add(new DirectionalLight(0xffffff, 0.2))


			const pointLight = new PointLight(0xffffff, 0.9)
			pointLight.position.set(-8.272, 4.227, -2.468)
			scene.add(pointLight)

			renderer.setSize(canvas.width, canvas.height)
			renderer.setPixelRatio($window.devicePixelRatio)

			const render = () => {
				if (!disposing.value) frameId.value = $requestAnimationFrame(render)
				controls.update()
				renderer.render(scene, camera);
			}
			render()
		})
	})

	onUnmounted(() => {
		console.log('卸载场景')
		disposing.value = true
		$cancelAnimationFrame(frameId.value)
		PLATFORM.dispose()
	})

	const onTX = (e) => {
		platformInfo.dispatchTouchEvent(e)
	}
</script>

<style lang="scss">
	.loading-icon {
		margin: auto;
		z-index: 1111111;
		position: absolute;
		width: 48px;
		left: 0px;
		right: 0px;
		top: 30vh;
		height: 48px;
		opacity: .5;
		animation: t-spin 3s linear infinite;
	}

	@keyframes t-spin {
		0% {
			transform: rotate(0);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.webgl-model {
		position: relative;
		z-index: 1;
		width: 100vw;
		height: 45vh;
		background-image: radial-gradient(#383a3a 0%, #000000 80%);
	}
</style>
