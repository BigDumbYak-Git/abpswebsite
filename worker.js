export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname !== "abps.ca") {
      return Response.redirect(
        "https://abps.ca" + url.pathname + url.search,
        301
      );
    }

    return env.ASSETS.fetch(request);
  }
};