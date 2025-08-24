import wordCount from 'word-count';

export enum DataAnomaly {
  DataNotFound = 'DataNotFound',
  Invalid = 'DataInvalid',
}

export type PostMetaData = {
  id: string;
  title: string;
  description: string;
  created_at: Date | DataAnomaly;
  category: string;
  published_at: Date | DataAnomaly;
  draft: boolean;
  updated_at: Date[] | DataAnomaly;
  tags: string[];
  type: string;
  tech_stack: string[] | DataAnomaly;
  tech_stack_percent: number[] | DataAnomaly;
  tech_stack_icon_names: string[] | DataAnomaly;
  tech_stack_theme_colors: string[] | DataAnomaly;
  word_count: number | DataAnomaly;
};

/*
 * 也许Nuxt Content也能做值处理，并且也有能用于ts传参的自动化生成类型
 * 但我放弃了 我就自己写了
 */

function getDate(data: Record<string, unknown>, key: string): Date | DataAnomaly {
  if (data[key] === undefined)
    return DataAnomaly.DataNotFound;
  if (typeof data[key] !== 'string')
    return DataAnomaly.Invalid;
  const date = new Date(data[key] as string);
  if (isNaN(date.getTime()))
    return DataAnomaly.Invalid;
  return date;
}

export function toMetaDataType(src: unknown): PostMetaData {
  if (typeof src !== 'object' || src === null) {
    console.log(src);
    throw new TypeError('Expected an object');
  }
  const data = src as Record<string, unknown>;
  const created_at: Date | DataAnomaly = getDate(data, 'created_at');
  const published_at: Date | DataAnomaly = getDate(data, 'published_at');
  let updated_at: Date[] | DataAnomaly;
  if (data.updated_at === undefined) {
    updated_at = DataAnomaly.DataNotFound;
  } else if (!Array.isArray(data.updated_at)) {
    updated_at = DataAnomaly.Invalid;
  } else {
    updated_at = data.updated_at.map((x: string) => new Date(x));
    updated_at = updated_at.reduce((last, cur) => last || isNaN(cur.getTime()), false) ? DataAnomaly.Invalid : updated_at;
  }

  let tech_stack: string[] | DataAnomaly;
  if (data.tech_stack === undefined) {
    tech_stack = DataAnomaly.DataNotFound;
  } else if (!Array.isArray(data.tech_stack)) {
    tech_stack = DataAnomaly.Invalid;
  } else {
    tech_stack = data.tech_stack;
  }

  let tech_stack_percent: number[] | DataAnomaly;
  if (data.tech_stack_percent === undefined) {
    tech_stack_percent = DataAnomaly.DataNotFound;
  } else if (!Array.isArray(data.tech_stack_percent)) {
    tech_stack_percent = DataAnomaly.Invalid;
  } else {
    tech_stack_percent = data.tech_stack_percent;
  }

  let tech_stack_icon_names: string[] | DataAnomaly;
  if (data.tech_stack_icon_names === undefined) {
    tech_stack_icon_names = DataAnomaly.DataNotFound;
  } else if (!Array.isArray(data.tech_stack_icon_names)) {
    tech_stack_icon_names = DataAnomaly.Invalid;
  } else {
    tech_stack_icon_names = data.tech_stack_icon_names;
  }

  let tech_stack_theme_colors: string[] | DataAnomaly;
  if (data.tech_stack_theme_colors === undefined) {
    tech_stack_theme_colors = DataAnomaly.DataNotFound;
  } else if (!Array.isArray(data.tech_stack_theme_colors)) {
    tech_stack_theme_colors = DataAnomaly.Invalid;
  } else {
    tech_stack_theme_colors = data.tech_stack_theme_colors;
  }

  let wordCountResult;
  if (data.rawbody === undefined)
    wordCountResult = DataAnomaly.DataNotFound;
  else if (typeof data.rawbody !== 'string')
    wordCountResult = DataAnomaly.Invalid;
  else {
    const contentWithoutMetaData = data.rawbody.replace(/^---[\s\S]*?---\n?/, '');
    wordCountResult = wordCount(contentWithoutMetaData);
  }

  return {
    id: String(data.id),
    title: String(data.title),
    description: String(data.description ?? ''),
    category: String(data.category ?? '无'),
    type: String(data.type ?? 'article'),
    created_at: created_at,
    published_at: published_at,
    draft: Boolean(data.draft ?? false),
    updated_at: updated_at,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    tech_stack: tech_stack,
    tech_stack_percent: tech_stack_percent,
    tech_stack_icon_names: tech_stack_icon_names,
    tech_stack_theme_colors: tech_stack_theme_colors,
    word_count: wordCountResult,
  };
}

export const defaultMetaData = toMetaDataType({
  id: 'default ID',
  title: 'ApiFox / Postman 使用WebSocket连接SignalR进行测试需要注意的小问题',
  description: 'default Description',
  created_at: new Date('2025-01-01T00:00:00Z'), // 默认创建时间
  published_at: new Date('2025-01-01T00:01:00Z'), // 默认发布时间
  draft: true,
  updated_at: [new Date('2025-01-01T00:02:00Z'), new Date('2025-01-01T00:03:00Z')], // 默认更新时间
  tags: ['C#', 'TS', 'Windows Professional version with Webstorm 2025', 'Windows Professional version with Visual Studio 2022'],
  tech_stack: new Map([
    ['Vue', 5],
    ['Nuxt', 3],
    ['TypeScript', 4],
    ['JavaScript', 2],
    ['CSS', 1],
    ['HTML', 1],
    ['Node.js', 2],
    ['Python', 3],
    ['Java', 2],
    ['C#', 1],
  ]),
});
