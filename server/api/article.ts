// server/api/article.get.ts
export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (typeof id !== 'string' || id.trim() === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required',
    });
  }

  const article = await queryCollection(event, 'content')
    .where('id', '=', id)
    .where('draft', '=', false)
    .first();

  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
    });
  }

  // 测试阶段避免响应被缓存，方便观察运行结果
  setResponseHeader(event, 'Cache-Control', 'no-store');

  return {
    servedAt: new Date().toISOString(),
    article,
  };
});
