import * as utils from '../utils'
import { useUserStore } from '@/store/userStore.js'

/* 封装微信请求 */
export async function request(obj) {
	const userStore = useUserStore()
	const token = userStore.user.token

	let Authorization = ''

	if (token !== '' && token !== undefined) {
		Authorization = {
			'Authorization': 'Bearer ' + token
		}
	}

	return new Promise((resolve, reject) => {
		wx.request({
			url: `${utils.api}${obj.url}`,
			data: obj.data,
			method: obj.method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...Authorization,
				...obj.header
			},

			success(res) {
				// 处理返回信息
				handleResult(res)

				resolve(res.data)
			},

			fail(e) {
				reject(e)
			}

		})
	})
}

/* 封装微信上传文件请求 */
export async function uploadFile(obj) {
	const userStore = useUserStore()
	const token = userStore.user.token || ''

	let Authorization = ''

	if (token !== '' && token !== undefined) {
		Authorization = {
			'Authorization': 'Bearer ' + token
		}
	}

	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${utils.api}${obj.url}`,
			header: {
				...Authorization,
				...obj.header
			},
			filePath: obj.filePath,
			name: 'file',
			formData: { user: 'test' },
			success(res) {
				// 处理返回信息
				handleResult(res)
				resolve(JSON.parse(res.data))
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

/* 微信获取用户信息 */
export async function getUserProfile() {
	return new Promise((resolve, reject) => {
		wx.getUserProfile({
			desc: '用于登录更新用户信息数据',
			success: (res) => {
				resolve(res)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

/* 微信登录 */
export async function wxlogin() {
	return new Promise((resolve, reject) => {
		wx.login({
			success: (res) => {
				resolve(res)
			},
			fail(e) {
				reject(e)
			}
		})
	})
}

/**
 * 处理code信息
 * @param res
 */
function handleResult(res) {
	let code = res.statusCode
	switch (code) {
		case 200:
			break
		case 401:
			utils.showToast('身份校验信息失败，请刷新页面重试！')
			const userStore = useUserStore()
			userStore.Restore()
			wx.redirectTo({
				url: '/pages/login/login'
			})
			console.error('身份校验信息失败，请刷新页面重试！')
			break
		default:
			let msg = res.data.message ? res.data.message : '未知错误，请重试！'
			utils.showToast(msg)
	}
}