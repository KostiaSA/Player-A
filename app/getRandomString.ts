export function getRandomString(length: number = 20): string {
    let str = Math.random().toString(36).slice(2, 12);
    str = str + Math.random().toString(36).slice(2, 12);
    return str.slice(0, length);
}