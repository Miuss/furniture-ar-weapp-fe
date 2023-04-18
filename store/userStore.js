import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo } from '@/api/user'
import { wxlogin } from '@/utils/fetch'
import { showError, showToast } from '@/utils'

export const useUserStore = defineStore('user', () => {
	const user = ref({
		token: wx.getStorageSync('token') || '',
		isLogin: false,
		userInfo: null	//用户信息
	})
	
	const loginLoading = ref(false)
	
	const getUserMainInfo = async () => {
		try {
			const res = await getUserInfo()
			user.value.userInfo = res.data
		} catch (e) {
			console.error(e)
		}
	}
	
	const userLogin = async () => {
		loginLoading.value = true
		try {
			const wxLoginRes = await wxlogin()
			console.log(wxLoginRes)
			const res = await login({
				code: wxLoginRes.code
			})
			console.log('登录成功')
			wx.setStorageSync('token', res.data.token)
			user.value.token = res.data.token
			user.value.isLogin = true
			await getUserMainInfo()
			wx.redirectTo({
				url: '/pages/index/index'
			})
			showToast('登录成功')
		} catch (e) {
			showError('登录失败，请重试')
			console.error(e)
		} finally {
			loginLoading.value = false
		}
	}
	
	const Restore = async () => {
		wx.removeStorageSync('token')
		user.value.isLogin = false
		user.value.token = ''
		user.value.userInfo = null
	}
 	
	return {
		user,
		userLogin,
		Restore,
		loginLoading,
		getUserMainInfo
	}
})