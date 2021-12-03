export default function hasOwn (thisArg: unknown, prop: string): boolean {
  return Object.prototype.hasOwnProperty.call(thisArg, prop);
}
