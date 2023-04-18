import { useThree } from '@/composables/useThree'
import { GLTFLoader } from 'three-platformize/examples/jsm/loaders/GLTFLoader'
import Marker from '@/marker/Marker.js'
import GL from '@/gl'

const NEAR = 0.1
const FAR = 1000

export default class MarkerExperience {

	constructor(canvas, loading, callback, errorCallback) {
		this.emptyModel = 'https://g.nycreativity.com/ny-weapp/ar/game/empty.glb'
		this.canvas = canvas
		this.loading = loading
		this.errorCallback = errorCallback
		// 加载完的模型数据
		this.loadedModels = [] 
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
		this.threeDestroy = destroy
	}

	/**
	 * 加载资源文件（模型/识别图）
	 */
	async initAssetFiles(session) {
		this.loading.loaded = 0
		// 定义微信 marker
		const marker = new Marker(session, this.errorCallback)
		
		// 请求接口获取识别图和模型对照数据
		const result = [{
			id: 1,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/1w.jpg',
			modelUrl: this.emptyModel,
		},{
			id: 2,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/2x.png',
			modelUrl: this.emptyModel,
		},{
			id: 3,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/3x.jpg',
			modelUrl: this.emptyModel,
		},{
			id: 4,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/4x.jpg',
			modelUrl: this.emptyModel,
		},{
			id: 5,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/5x.png',
			modelUrl: this.emptyModel,
		},{
			id: 6,
			markerUrl: 'https://g.nycreativity.com/ny-weapp/ar/game/tracking/6x.jpg',
			modelUrl: this.emptyModel,
		}]
		
		const MarkerTimer = setInterval(() => {
			if (this.loading.loaded < 10) {
				this.loading.loaded += Math.round(Math.random()*(4-2)+2)
			}
		},100)
		
		// 定义MarkerImage获取对应的Makers对应数组
		const markers = await marker.initMarkerImage(result)
		
		console.log('loaded', markers)
		
		clearInterval(MarkerTimer)
		const ModelTimer = setInterval(() => {
			if (this.loading.loaded < 85) {
				this.loading.loaded += Math.round(Math.random()*(8-3)+3) / 10
			}
		},100)
		
		//加载模型资源文件
		await this.loadModels(markers) 
		
		clearInterval(ModelTimer)
		const loadEndTimer = setInterval(() => {
			if (this.loading.loaded < 100) {
				this.loading.loaded += Math.round(Math.random()*(2-1)+1)
			} else {
				this.loading.loaded = 100
				clearInterval(loadEndTimer)
			}
		},100)
	}
	
	/**
	 * 加载单个模型，已废弃
	 * @param {Object} modelUrl 
	 */
	async loadModel(modelUrl) {
		const getGLTFModel = function(modelUrl) {
			return new Promise((resolve, reject) => {
				// gltf模型加载
				const gltfLoader = new GLTFLoader()
				gltfLoader.load(modelUrl,
					function(gltf) {
						console.log("gltfload");
						resolve(gltf)
					},
					function(xhr) {
						console.log("gltfloadingnoww");

						console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
					},
					function(err) {
						console.log("err!");
						reject(e)
					}
				)
			})
		}

		const gltf = await getGLTFModel(modelUrl)

		this.model = gltf
		this.model.scene.traverse(child => {
			if (child.material) {
				child.material.transparent = true
				child.castShadow = true
				child.material.depthTest = true
				// child.material.side = this.THREE.FrontSide
				// 设置贴图自发光，解决模型黢黑问题
				child.material.emissive = child.material.color
				child.material.emissiveMap = child.material.map
			}
		})
	}
	
	/**
	 * 加载多个模型
	 * @param {Object} models
	 */
	async loadModels(models) {
		// gltf模型加载
		const gltfLoader = new GLTFLoader()
		return Promise.all(
			models.map(async (item) => {
				const gltf = await gltfLoader.loadAsync(item.modelUrl, (e) => {
					//进度
					console.log(e)
				})

				const loadedModel = gltf
				loadedModel.scene.traverse(child => {
					if (child.material) {
						child.material.transparent = true
						child.castShadow = true
						child.material.depthTest = true
						// child.material.side = this.THREE.FrontSide
						// 设置贴图自发光，解决模型黢黑问题
						child.material.emissive = child.material.color
						child.material.emissiveMap = child.material.map
					}
				})
					
				// 将加载完毕的模型及markerId的对应数据添加到loadedModels里
				this.loadedModels.push({
					id: item.id,
					markerId: item.markerId,
					model: loadedModel
				})
				
			})
		)
	}

	/**
	 * 初始化场景灯光
	 * @param {Object} target
	 */
	initLights(target) {
		this.renderer.outputEncoding = this.THREE.sRGBEncoding
		// this.scene.add(new this.THREE.AmbientLight(0xffffff, 1.0))
		// this.scene.add(new this.THREE.DirectionalLight(0xffffff, 1.0))

		const directionalLight = new this.THREE.DirectionalLight(0xffffff, 1)
		directionalLight.castShadow = true
		directionalLight.position.set(3, 9, 3)
		directionalLight.target = target
		//Set up shadow properties for the light
		directionalLight.shadow.mapSize.width = 1024; // default
		directionalLight.shadow.mapSize.height = 1024; // default
		directionalLight.shadow.camera.near = 0.1; // default
		directionalLight.shadow.camera.far = 1000; // default
		this.scene.add(directionalLight)

		const hemiLight = new this.THREE.HemisphereLight(0xdddddd, 0x444444, 1)
		hemiLight.position.set(0, 100, 0)
		this.scene.add(hemiLight)
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
				marker: true,
			},
			version: isSupportV2 ? 'v2' : 'v1',
			gl: this.GL.gl
		})

		// 初始化加载资源文件
		this.initAssetFiles(this.session)

		/**
		 * 开始VkSession检测
		 */
		this.session.start((error) => {
			if (error)
				return console.error('VK error: ', error)
			console.log('VKSession.version', this.session.version)

			// 创建平面盒子
			const planeBox = this.planeBox = new this.THREE.Object3D()
			this.scene.add(planeBox)

			this.initLights(planeBox) // 初始化定向灯光

			// 更新模型在标记物上的偏移角度
			const updateMatrix = (object, m) => {
				object.matrixAutoUpdate = false
				object.matrix.fromArray(m)
			}

			this.session.on('addAnchors', anchors => {
				anchors.forEach(anchor => {
					let object, size = anchor.size

					console.log('找到了', anchor.id, anchor.size)
					
					// 获取识别marker对应的模型
					const markerModel = this.loadedModels.find((item) => item.markerId == anchor.id)
		
					console.log('找到了', markerModel)

					if (!markerModel) {
						console.warn('模型还没加载完成 ！！！！！')
						return
					}
					
					this.callback(markerModel.id)

					object = new this.THREE.Object3D()

					this.initShadowPlane(object) //初始化阴影地板
					this.addModel(object, markerModel.model) //添加模型

					object._id = anchor.id
					object._size = size
					updateMatrix(object, anchor.transform)
					this.planeBox.add(object)
				})
			})

			this.session.on('updateAnchors', anchors => {
				console.log('更新')
				const map = anchors.reduce((temp, item) => {
					temp[item.id] = item
					return temp
				}, {})
				this.planeBox.children.forEach(object => {
					if (object._id && map[object._id]) {
						const anchor = map[object._id]
						const size = anchor.size
						object._id = anchor.id
						object._size = size
						updateMatrix(object, anchor.transform)
					}
				})
			})

			// 检测丢失，删除模型
			this.session.on('removeAnchors', anchors => {
				const map = anchors.reduce((temp, item) => {
					temp[item.id] = item
					return temp
				}, {})
				this.planeBox.children.forEach(object => {
					if (object._id && map[object._id]) {
						this.planeBox.remove(object)
						console.log('删除：', object._id)
					}
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
		const dt = this.clock.getDelta()
		if (this.mixers) {
			this.mixers.forEach(mixer => mixer.update(dt))
		}

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

}
