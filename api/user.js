import { request } from '../utils/fetch'

export const login = async function (data) {
    const res = await request({
      url: `/v1/auth/login`,
      method: 'POST',
	  data
    })

    return res
}

export const getUserInfo = async function () {
    const res = await request({
      url: `/v1/user/maininfo`,
      method: 'GET'
    })

    return res
}

export const loginAdmin = async function (data) {
	const res = await request({
      url: `/v1/auth/confirmAdminLogin`,
      method: 'POST',
	  data
    })
	
	return res
}