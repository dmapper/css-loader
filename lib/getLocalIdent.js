/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var loaderUtils = require("loader-utils");
module.exports = function getLocalIdent(loaderContext, localIdentName, localName, options) {
	if (!( /^[a-z]/.test(localName) )) return localName;
	var request = loaderContext.options && typeof loaderContext.options.context === "string" ?
		loaderUtils.stringifyRequest({ context: loaderContext.options.context }, loaderUtils.getRemainingRequest(loaderContext)) :
		loaderContext.request;
	options.content = localName + " " + request;
	options.context = loaderContext.options && typeof loaderContext.options.context === "string" ? loaderContext.options.context : loaderContext.context;
	if (localName === 'root') {
		localIdentName = localIdentName.replace(/[_-]?\[local\]/gi, '');
	} else {
		localIdentName = localIdentName.replace(/\[local\]/gi, localName);
	}
	var componentName = path.basename(loaderContext.resourcePath, path.extname(loaderContext.resourcePath));
	if (componentName === 'index' || /^_/.test(componentName)) {
		componentName = path.basename(path.dirname(loaderContext.resourcePath))
	}
	localIdentName = localIdentName.replace(/\[component\]/gi, componentName);
	var hash = loaderUtils.interpolateName(loaderContext, localIdentName, options);
	return hash.replace(/[^a-zA-Z0-9\-_]/g, "-").replace(/^([^a-zA-Z_])/, "_$1");
};
