
(function(window, undefined) {

var 
thisFileName = "mcore.extends.js",

importFiles = [
	"wnInterface.extends.js",
	"libs/jquery-3.1.1.min.js",
	"common/mcore_api.js",
	"common/util.js",
	"ui/common.js"
];

M.ScriptLoader.writeScript( importFiles, M.ScriptLoader.scriptPath(thisFileName) );

})(window);