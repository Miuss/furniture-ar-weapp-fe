import {
	useThree
} from '@/composables/useThree'
import {
	GLTFLoader
} from 'three-platformize/examples/jsm/loaders/GLTFLoader'
import {
	DRACOLoader
} from 'three-platformize/examples/jsm/loaders/DRACOLoader'
import GL from '@/gl'


const NEAR = 0.1
const FAR = 1000

export default class PlaneExperience {

	constructor(canvas, loading, callback, errorCallback) {
		this.canvas = canvas
		this.loading = loading
		this.errorCallback = errorCallback
		// 加载完的模型数据
		this.loadedModels = []
		this.reticle = null
		this.initTHREE()
		// 初始化VKSession
		this.initVKSession()
		this.callback = callback
	}

	/**
	 * 初始化Three
	 */
	initTHREE() {
		const {
			camera,
			scene,
			renderer,
			THREE,
			destroy
		} = useThree(this.canvas)

		this.THREE = THREE
		this.camera = camera
		this.scene = scene
		this.GL = new GL(renderer)
		this.renderer = renderer
		this.renderer.shadowMap.enabled = true
		this.renderer.shadowMap.type = this.THREE.PCFSoftShadowMap
		this.renderer.setClearAlpha(0.0)
		this.threeDestroy = function() {
			if (this.renderer) {
			  this.renderer.dispose()
			  this.renderer = null
			}
			if (this.scene) {
			  this.scene.dispose()
			  this.scene = null
			}
			if (this.mixers) {
			  this.mixers.forEach(mixer => mixer.uncacheRoot(mixer.getRoot()))
			  this.mixers = null
			}
			if (this.THREE) this.THREE = null
			if (this.camera) this.camera = null
			if (this.clock) this.clock = null
			if (this.canvas) this.canvas = null
			if (this.GL) this.GL = null
			if (this.session) this.session = null
		}
	}

	// 同步下载图像
	downloadModel(item) {
		const fs = wx.getFileSystemManager()

		return new Promise((resolve) => {
			const filePath = `${uni.env.USER_DATA_PATH}/${item.modelMd5}.glb`
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
								tempFilePath: res.tempFilePath,
								success: data => {
									const content = fs.readFileSync(
										filePath)
									console.log(content)
									resolve(content)
								}
							})
						}
					})
				}
			})
		})
	}

	async initReticleAssetFiles() {
		const item = {
			id: 'reticle',
			modelUrl: 'https://miuss.icu/ar-furniture-assets/models/reticle.glb',
			modelMd5: '1111'
		}
		const modelPath = await this.downloadModel(item)
		const gltfLoader = new GLTFLoader()
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
					child.material.emissiveMap = child.material.map
				}
			})
			this.reticle = loadedModel.scene
			this.reticle.visible = false
			this.scene.add(this.reticle)
		}, (error) => {
			console.log(error)
		})
	}

	/**
	 * @param {id: string, modelUrl: string, modelMd5: string} modelInfo
	 */
	async loadModel(modelInfo) {
		const item = modelInfo
		const modelPath = await this.downloadModel(item)
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
						child.material.emissiveMap = child.material.map
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


	/**
	 * 初始化VKSession
	 * 具体的config配置项请查阅微信官方文档
	 * https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/wx.createVKSession.html
	 * @param {Object} config
	 */
	initVKSession(config) {
		// 获取设备是否支持V2
		const isSupportV2 = wx.isVKSupport("v2")
		this.session = wx.createVKSession({
			track: {
				plane: {
					mode: 3
				},
			},
			version: isSupportV2 ? 'v2' : 'v1',
			gl: this.GL.gl
		})

		// 初始化地面识别标志资源
		this.initReticleAssetFiles()

		// 初始化加载资源文件
		// this.initAssetFiles(this.session)

		/**
		 * 开始VkSession检测
		 */
		this.session.start((error) => {
			if (error)
				return console.error('VK error: ', error)
			console.log('VKSession.version', this.session.version)
			
			
			this.loading.value = 100

			// 更新模型在标记物上的偏移角度
			const updateMatrix = (object, m) => {
				object.matrixAutoUpdate = false
				object.matrix.fromArray(m)
			}

			// 初始化灯光
			this.initLights()

			this.session.on('addAnchors', anchors => {
				anchors.forEach(anchor => {
					let object, size = anchor.size
				})
			})

			// 渲染时钟
			this.clock = new this.THREE.Clock()

			// VkSession 帧检测
			const onFrame = timestamp => {
				const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height)
				if (frame) {
					this.render(frame)
				}
				this.session.requestAnimationFrame(onFrame)
			}
			this.session.requestAnimationFrame(onFrame)
		})
	}

	/**
	 * 渲染场景
	 * @param {Object} frame
	 */
	render(frame) {
		this.GL.render(frame)
		const camera = frame.camera
		this.GL.gl.enable(this.GL.gl.DEPTH_TEST)

		// 修改光标位置
		const reticle = this.reticle
		if (reticle) {
			const hitTestRes = this.session.hitTest(0.5, 0.5)
			if (hitTestRes.length) {
				reticle.matrixAutoUpdate = false
				reticle.matrix.fromArray(hitTestRes[0].transform)
				reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale)
				reticle.visible = true
			} else {
				reticle.visible = false
			}
		}

		// 动画更新
		const dt = this.clock.getDelta()
		if (this.mixers) {
			this.mixers.forEach(mixer => mixer.update(dt))
		}

		// 相机
		if (camera) {
			this.camera.matrixAutoUpdate = false
			this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
			this.camera.matrixWorld.copy(this.camera.matrixWorldInverse).invert()

			const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR)
			this.camera.projectionMatrix.fromArray(projectionMatrix)
			this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert()
		}

		this.renderer.autoClearColor = false
		this.renderer.render(this.scene, this.camera)
		this.renderer.state.setCullFace(this.THREE.CullFaceNone)
	}

	/**
	 * 初始化阴影地板
	 * @param {Object} object 
	 */
	initShadowPlane(object) {
		const planeMaterial = new this.THREE.ShadowMaterial()
		planeMaterial.opacity = 0.6
		const plane = new this.THREE.Mesh(new this.THREE.PlaneGeometry(1000, 1000), planeMaterial);
		plane.rotation.x = -Math.PI / 2
		plane.position.set(0, 0, 0)
		plane.receiveShadow = true
		object.add(plane)
	}

	/**
	 * 添加模型场景中
	 * @param {Object} object
	 * @param {Object} model
	 */
	addModel(object, model) {
		model.scene.scale.set(0.07, 0.07, 0.07) //设置模型缩放大小
		// const modelBox = new this.THREE.Object3D() //设置模型存放的3DObject
		// modelBox.add(this.addAnimation(this.model)) //将模型添加值3DObject中
		// modelBox.rotateX(-Math.PI / 2) //旋转一下盒子
		object.add(this.addAnimation(model))
	}

	/**
	 * 动画混合器（自动播放模型动画）
	 * @param {Object} model
	 */
	addAnimation(model) {
		// 动画混合器
		const mixer = new this.THREE.AnimationMixer(model.scene)
		if (model.animations.length > 0) {
			const clip = model.animations[0]
			const action = mixer.clipAction(clip)
			action.play()
		}

		this.mixers = this.mixers || []
		this.mixers.push(mixer)

		model.scene._mixer = mixer
		return model.scene
	}

	initLights() {
		this.renderer.outputEncoding = this.THREE.sRGBEncoding
		// this.scene.add(new this.THREE.AmbientLight(0xffffff, 1.0))
		// this.scene.add(new this.THREE.DirectionalLight(0xffffff, 1.0))

		const pointLight = new this.THREE.PointLight(0xffffff, 0.9)
		pointLight.position.set(-8.272, 4.227, -2.468)
		this.scene.add(pointLight)

		const ambientLight = new this.THREE.AmbientLight(0x262626, -1.26)
		this.scene.add(ambientLight)


		// const directionalLight = new this.THREE.DirectionalLight(0xffba64, 1)
		// directionalLight.castShadow = true
		// directionalLight.position.set(3, 9, 3)
		// directionalLight.target = target
		// //Set up shadow properties for the light
		// directionalLight.shadow.mapSize.width = 1024; // default
		// directionalLight.shadow.mapSize.height = 1024; // default
		// directionalLight.shadow.camera.near = 0.1; // default
		// directionalLight.shadow.camera.far = 1000; // default
		// this.scene.add(directionalLight)

		const hemiLight = new this.THREE.HemisphereLight(0xF5F5F5, 0xFFBF52, 0.5)
		hemiLight.position.set(-4.082, -11.102, -9.873)
		this.scene.add(hemiLight)
	}

	async onTouchEnd(id, modelUrl, modelMd5, modelScale) {
		console.log('点击了屏幕')
		if (this.scene && this.reticle) {
			const model = await this.loadModel({
				id,
				modelUrl,
				modelMd5
			})
			model.scene.position.copy(this.reticle.position)
			model.scene.rotation.copy(this.reticle.rotation)
			model.scene.scale.set(modelScale, modelScale, modelScale)
			this.addAnimation(model)
			this.scene.add(model.scene)
		}

	}

	removeVkSession() {
		this.session.stop()
	}

}
