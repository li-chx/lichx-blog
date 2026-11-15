// RGB 转 HSL
export function rgbToHsl(rgb: number[]) {
  if (rgb.length !== 3) {
    throw new Error('Input must be an array of three numbers representing RGB values.');
  }
  let [r, g, b] = rgb;
  r = r!;
  b = b!;
  g = g!;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

// HSL 转 RGB
export function hslToRgb(hsl: number[]) {
  if (hsl.length !== 3) {
    throw new Error('Input must be an array of three numbers representing HSL values.');
  }
  let [h, s, l] = hsl;
  h = h!;
  s = s!;
  l = l!;
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function toRGBArray(color: string): number[] {
  // 处理 rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]!), parseInt(rgbMatch[2]!), parseInt(rgbMatch[3]!)];
  }
  // 处理 #fff 或 #ffffff
  const hexMatch = color.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex!.length === 3) {
      hex = hex!.split('').map((x) => x + x).join('');
    }
    const num = parseInt(hex!, 16);
    return [
      (num >> 16) & 255,
      (num >> 8) & 255,
      num & 255,
    ];
  }
  throw new Error('Invalid color format');
}

export function toHexString(rgb: number[]): string {
  let ans = '#';
  for (const value of rgb) {
    if (value < 0 || value > 255) {
      throw new Error('RGB values must be in the range 0-255.');
    }
    ans += value.toString(16).padStart(2, '0');
  }
  return ans.toUpperCase();
}

export function toLightColor(rgb: number[]): number[] {
  const hsl = rgbToHsl(rgb);
  if (hsl[2]! < 50)
    hsl[2] = hsl[2]! / 5 + 50; // 增加亮度
  return hslToRgb(hsl);
}

export function toDarkColor(rgb: number[]): number[] {
  const hsl = rgbToHsl(rgb);
  if (hsl[2]! > 50)
    hsl[2] = 50 - (hsl[2]! - 50) / 5; // 减少亮度
  return hslToRgb(hsl);
}
