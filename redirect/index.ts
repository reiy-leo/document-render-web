// fmtagno.rei8t.dev 是改名前的旧域名：所有请求 301 到 document-render.rei8t.dev，路径和查询参数不变。
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.host = "document-render.rei8t.dev";
    url.port = "";
    return Response.redirect(url.toString(), 301);
  },
};
