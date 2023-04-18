import { request } from '../utils/fetch'
import qs from 'qs'

export const getFurnitureList = async function (data) {
    const res = await request({
      url: `/v1/furniture/list?${qs.stringify(data)}`,
      method: 'GET'
    })

    return res
}

export const getFurnitureDetail = async function (data) {
    const res = await request({
      url: `/v1/furniture/info?${qs.stringify(data)}`,
      method: 'GET'
    })

    return res
}