// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.IDNet = function(runtime)
{
	this.runtime = runtime;
};

var _ID = null;

(function ()
{
	var pluginProto = cr.plugins_.IDNet.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	var _document = null;
	var _unsafeWindow = null;
	var idNetRuntime = null;
	var idNetInst = null;
	var idnetUserName = "Guest";
	var authorized = false;
	var idnetSessionKey = "";
	var onlineSavesData = "";
	
	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		idNetRuntime = this.runtime;
		idNetInst = this;
		this._document = window.document;
		this._unsafeWindow = this._document.defaultView;
		
		if(this._document.getElementById("id-jssdk") == null) {
			var idnetSDKloader = this._document.createElement("script");
			idnetSDKloader.id = "id-jssdk";
			if(this._document.location.protocol == "https:") idnetSDKloader.src = "https://scdn.id.net/api/sdk.js"; else idnetSDKloader.src = "http://cdn.id.net/api/sdk.js";
			this._document.head.insertBefore(idnetSDKloader,this._document.getElementsByTagName("script")[0]);
			console.log("ID.init");
			window.idAsyncInit = function() {
				console.log("asyncInit");
				_ID = this.window.ID;
				_ID.Event.subscribe("id.init",function() {
					console.log("id.init event");
					console.log("ID.initializeComplete");
					idNetInst.authorized = true;
				});
				_ID.Event.subscribe("auth.authResponseChange",function(response) {
					console.log("auth.authResponseChange");
					window.idnet_autologin = function(response){
						idNetInst.idnetSessionKey = response.sessionKey;
						idNetInst.idnetUserName = response.user.nickname;
					}
					var autologinElement = this._document.createElement("script");
					autologinElement.src = "https://www.id.net/api/user_data/autologin?app_id=" + Reg.app_id + "&callback=idnet_autologin";
					this._document.head.insertBefore(autologinElement,this._document.getElementsByTagName("script")[0]);
					var autologinElement1 = this._document.createElement("script");
					autologinElement1.src = "//code.jquery.com/jquery-1.11.2.min.js";
					this._document.head.insertBefore(autologinElement1,this._document.getElementsByTagName("script")[0]);
					idNetInst.authorized = response.status == "ok";
					console.log("ID.authResponse: isAuthorized: " + Std.string(idNetInst.authorized));
					//this.d.dispatch("auth.authResponseChange");
				});
			}
		}
	};
	
	function ShowLeaderBoardCallback(response) {
		
	}
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.isAuthorized = function ()
	{
		return idNetInst.authorized;
	};
	
	Cnds.prototype.isNotAuthorized = function ()
	{
		return !idNetInst.authorized;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.Init = function (appid_)
	{
		if (!idNetInst.authorized) {
			console.log("Init set" + appid_);
			_ID.init({
				appId : appid_
			});
		}
	};
	
	Acts.prototype.RegisterPopup = function ()
	{
		if (idNetInst.authorized)
			_ID.register(function (response) {
				if(response == null) {
					//this.d.dispatch("auth.fail")
				} else {
					//this.d.dispatch("auth.complete");
				}
			});
	};
	
	Acts.prototype.LoginPopup = function ()
	{
		console.log("LoginPopup "+idNetInst.authorized);
		if (idNetInst.authorized){
			_ID.login(function (response) {
				if(response == null) {
					//this.d.dispatch("auth.fail")
				} else {
					//this.d.dispatch("auth.complete");
				}
			});
		}
	};
	
	Acts.prototype.ShowLeaderBoard = function ()
	{
		if (idNetInst.authorized) {
			_ID.GameAPI.Leaderboards.list();
		}
	};
	
	Acts.prototype.SubmitScore = function (score_)
	{
		if (idNetInst.authorized) {
			_ID.GameAPI.Leaderboards.save(score_, jQuery(document).bind(idNetInst,idNetInst.ShowLeaderBoardCallback));
		}
	};
	
	Acts.prototype.SubmitProfileImage = function (image_)
	{
		if (idNetInst.authorized)
			_ID.submit_image(image_, function(response){
				//console.log(response);
			});
	};
	
	Acts.prototype.AchievementSave = function (achievementTitle_, achievementKey_)
	{
		if (idNetInst.authorized) {
			var achievementData = {
				achievement: achievementTitle_,
				achievementKey: achievementKey_
			};
			
			_ID.GameAPI.Achievements.save(achievementData, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.ShowAchievements = function ()
	{
		if (idNetInst.authorized) {
			_ID.GameAPI.Achievements.list();
		}
	};
	
	Acts.prototype.OnlineSavesSave = function (key_, value_)
	{
		if (idNetInst.authorized) {
			_ID.api('user_data/submit', 'POST', {key: key_, value: value_}, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.OnlineSavesRemove = function (key_)
	{
		if (idNetInst.authorized) {
			_ID.api('user_data/remove', 'POST', {key: key_}, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.OnlineSavesLoad = function (key_)
	{
		if (idNetInst.authorized) {
			_ID.api('user_data/retrieve', 'POST', {key: key_}, function(response){
				idNetInst.onlineSavesData = response;
			});
		}
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.UserName = function (ret)
	{
		ret.set_string(idNetInst.idnetUserName);
	};
	
	Exps.prototype.SessionKey = function (ret)
	{
		ret.set_string(idNetInst.idnetSessionKey);
	};
	
	Exps.prototype.GateOnlineSavesData = function (ret)
	{
		ret.set_string(idNetInst.onlineSavesData);
	};
	
	pluginProto.exps = new Exps();

}());