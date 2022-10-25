
(function(window, undefined) {
var pageName = location.href.substring( location.href.lastIndexOf("html/")+5, location.href.lastIndexOf(".") );

var 
thisFileName = "mcore.extends.js",

importFiles = [
	"wnInterface.extends.js",
	"libs/jquery-3.1.1.min.js",
	"libs/swiper.min.js",
	"libs/moment.min.js",
    "common/definition.js",
	"common/mcore_api.js",
	"common/util.js",
	"common/common.js",
	"common/setup.js",
	"ui/" + pageName + ".js"
];

M.ScriptLoader.writeScript( importFiles, M.ScriptLoader.scriptPath(thisFileName) );

})(window);