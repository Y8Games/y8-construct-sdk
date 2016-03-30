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

//var ID = null;

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
	var userAuthorized = false;
	var idnetSessionKey = "";
	var onlineSavesData = "";
	var isBlacklisted = 0;
	var isSponsor = 0;
	
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
		
        var fjs = document.head.getElementsByTagName('script')[0];
        if (document.getElementById('id-jssdk')) {return;}
        var js = document.createElement('script');
		js.id = 'id-jssdk';
        js.src =  document.location.protocol == 'https:' ? "https://scdn.id.net/api/sdk.js" : "http://cdn.id.net/api/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
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
	
	Cnds.prototype.UserIsAuthorized = function ()
	{
		return idNetInst.userAuthorized;
	};
	
	Cnds.prototype.UserIsNotAuthorized = function ()
	{
		return !idNetInst.userAuthorized;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	
	Acts.prototype.Init = function (appid_)
	{				
		//window.idAsyncInit = function() {
			console.log("asyncInit");
			console.log(ID);
			console.log("Init set" + appid_);
			ID.init({
				appId : appid_
			});
			ID.Event.subscribe("id.init",function() {
				console.log("id.init event");
				console.log("ID.initializeComplete");
				ID.GameAPI.init(appid_, null, function(data, response) {
					console.log(response);
				});
			});
			
			idNetInst.authorized = true;
		//}
	};
	
	Acts.prototype.RegisterPopup = function ()
	{
		if (idNetInst.authorized)
			ID.register(function (response) {
				if(response == null) {
					//this.d.dispatch("auth.fail")
				} else {
					idNetInst.userAuthorized = true;
					//this.d.dispatch("auth.complete");
				}
			});
	};
	
	Acts.prototype.LoginPopup = function ()
	{
		console.log("LoginPopup "+idNetInst.authorized);
		if (idNetInst.authorized){
			ID.login(function (response) {
				if(response == null) {
					//this.d.dispatch("auth.fail")
				} else {
					idNetInst.userAuthorized = true;
					//this.d.dispatch("auth.complete");
				}
			});
		}
	};
	
	Acts.prototype.ShowLeaderBoard = function (table_, mode_, highest_, allowduplicates_)
	{
		if (idNetInst.authorized) {
			ID.GameAPI.Leaderboards.list({table:table_, mode: mode_, highest: highest_, allowduplicates: allowduplicates_});
		}
	};
	
	Acts.prototype.SubmitScore = function (score_, table_, allowduplicates_, highest_, playername_)
	{
		if (idNetInst.authorized) {
			 var score = {
				table: table_,
				points: score_,
				allowduplicates: allowduplicates_,
				highest: highest_,
				playername: playername_
			};
			ID.GameAPI.Leaderboards.save(score, function(response){
						console.log(response);
			});
		}
	};
	
	Acts.prototype.SubmitProfileImage = function (image_)
	{
		if (idNetInst.authorized)
			ID.submit_image(image_, function(response){
				//console.log(response);
			});
	};
	
	Acts.prototype.AchievementSave = function (achievementTitle_, achievementKey_, overwrite_, allowduplicates_)
	{
		if (idNetInst.authorized) {
			var achievementData = {
			  achievement: achievementTitle_,
			  achievementkey: achievementKey_,
			  overwrite: overwrite_,
			  allowduplicates: allowduplicates_
			};
			
			ID.GameAPI.Achievements.save(achievementData, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.ShowAchievements = function ()
	{
		if (idNetInst.authorized) {
			ID.GameAPI.Achievements.list();
		}
	};
	
	Acts.prototype.OnlineSavesSave = function (key_, value_)
	{
		if (idNetInst.authorized) {
			ID.api('user_data/submit', 'POST', {key: key_, value: value_}, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.OnlineSavesRemove = function (key_)
	{
		if (idNetInst.authorized) {
			ID.api('user_data/remove', 'POST', {key: key_}, function(response){
				//console.log(response);
			});
		}
	};
	
	Acts.prototype.OnlineSavesLoad = function (key_)
	{
		if (idNetInst.authorized) {
			idNetInst.onlineSavesData = null;
			ID.api('user_data/retrieve', 'POST', {key: key_}, function(response){
				if(response != null) {
					idNetInst.onlineSavesData = response.jsondata;
				}
			});
		}
	};
	
	Acts.prototype.CheckIsBlacklisted = function () {
		ID.Protection.isBlacklisted(function(blacklisted){
			console.log(blacklisted);
			idNetInst.isBlacklisted = isBlacklisted;
		});
	};
	
	Acts.prototype.CheckIsSponsor = function () {
		ID.Protection.isSponsor(function(sponsor){
			console.log(sponsor);
			idNetInst.isSponsor = sponsor;
		});
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
	
	Exps.prototype.GetIsBlacklisted = function (ret)
	{
		ret.set_int(idNetInst.isBlacklisted);
	};
	
	Exps.prototype.GetIsSponsor = function (ret)
	{
		ret.set_int(idNetInst.isSponsor);
	};
	
	pluginProto.exps = new Exps();

}());