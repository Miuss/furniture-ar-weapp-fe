var _errCB

export default class Marker {

	/**
	 * @param {Object} session 
	 * (VKSession：https://developers.weixin.qq.com/miniprogram/dev/api/ai/visionkit/VKSession.html)
	 */
	constructor(session, errorCallback) {
		this.session = session
		_errCB = errorCallback
	}

	/**
	 * 初始化Marker图像
	 * 通过uni.getFileSystemManager
	 */
	async initMarkerImage(Images) {
		const Models = await this.downloadAllMarkerImage(Images)
		console.log(Models)
		return Models.map((item) => {
			return {
				id: item.id,
				markerId: this.addMarker(item.markerUrl),	// 生成的markerId
				markerUrl: item.markerUrl,	//生成的markerUrl,
				modelUrl: item.modelUrl	//接口返回的模型Url
			}
		})
	}

	/**
	 * 添加Marker标记
	 */
	addMarker(filePath) {
		return this.session.addMarker(filePath)
	}

	/**
	 * 删除Marker标记
	 */
	removeMarker(markerId) {
		this.session.removeMarker(markerId)
		console.log('remove Markerid: ', markerId)
	}
	
	/**
	 * 获取所有Marker标记
	 */
	getAllMarker() {
		const markers =  this.session.getAllMarker()
		console.log('all Markers', markers)
	}

	/**
	 * 同步下载所有的Marker图像
	 * TODO: 将Marker图像和模型进行绑定，来实现多Marker并行识别
	 */
	downloadAllMarkerImage(Images) {

		const fs = wx.getFileSystemManager()


		// 同步下载图像
		const downloadImage = (item) => {
			return new Promise((resolve) => {
				const filePath = `${wx.env.USER_DATA_PATH}/marker${item.id}.png`

				wx.downloadFile({
					url: item.markerUrl,
					success: res => {
						fs.saveFile({
							filePath,
							tempFilePath: res.tempFilePath,
							success: function (data) {
								_errCB('LOG: SAVED ITEM ' + item.id)
								resolve({
									id: item.id,
									markerUrl: data.savedFilePath,	//转换成本地存储的markerUrl
									modelUrl: item.modelUrl
								})
							},
							fail: function(e) { _errCB('ERROR: Ex-SAV ' + e.errMsg) }  
			
						})
					},
					fail: function (e) { _errCB('ERROR: Ex-DL ' + e.errMsg + `(${item.markerUrl})`) }
				})
			})
		}

		return Promise.all(Images.map(async (item) => {
			return await downloadImage(item)
		}))
	}
}
