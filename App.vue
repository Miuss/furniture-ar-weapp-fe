<script setup>
	import { useUserStore } from '@/store/userStore'
	
	const userStore = useUserStore()
	console.log(`token: ${userStore.user.token}`)
	if (userStore.user.token == '') {
		userStore.Restore()
		wx.redirectTo({
			url: '/pages/login/login'
		})
	} else {
		userStore.getUserMainInfo()
	}
	
</script>

<style>
	/*每个页面公共css */
</style>
