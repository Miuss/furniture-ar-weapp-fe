import * as THREE from 'three-platformize';
import { WechatPlatform } from 'three-platformize/src/WechatPlatform'

export function useThree(canvas) {

	const platform = new WechatPlatform(canvas)
	platform.enableDeviceOrientation("game")
	THREE.PLATFORM.set(platform);
	
	const renderer = new THREE.WebGL1Renderer({
		canvas,
		antialias: true,
		alpha: true	
	})	// 初始化渲染器
	renderer.gammaFactor = 2.2
	const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
	const scene = new THREE.Scene()
	
	// 销毁画布
	function destroy() {
		scene.dispose()
		renderer.dispose()
		this.disposing = true
		PLATFORM.dispose()
	}

	return {
		THREE,
		renderer,
		camera,
		scene,
		destroy
	}
}
