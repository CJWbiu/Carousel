export function $(str) {
	if(/^\#/.test(str))
		return document.getElementById(str.slice(1));
	else if(/^\./.test(str))
		return document.getElementsByClassName(str.slice(1));
	else 
		return document.getElementsByTagName(str);
}
export function proxy(target, sourceKey, key) {
  let sharedPropertyDefinition = {};
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)  //一层代理，每次访问this[key]时代理到this._data[key]
}