export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      // 如果请求方法不是post，返回405错误
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 })
      }
      // 获取请求的表单数据
      const formData = await request.formData()
      // 获取表单中的year参数
      const year = formData.get("year")
      // 如果year参数不存在，返回400错误
      if (!year) {
        return new Response("Invalid year", { status: 400 })
      }
      // 获取对应的json文件的URL
      const fileURL = `https://raw.githubusercontent.com/NateScarlet/holiday-cn/master/${year}.json`
      // 从URL获取json文件的内容
      const fileResponse = await fetch(fileURL);
      // 返回json文件的内容，设置响应类型为application/json
      return new Response(fileResponse.body, {
        headers: { "Content-Type": "application/json" }
      })
    }
    // Otherwise, serve the static assets.
    // Without this, the Worker will error and no assets will be served.
    return env.ASSETS.fetch(request);
  },
}
