// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

/////////////////////////////////////
// Plugin class
cr.plugins_.IDNet = function(runtime) {
  this.runtime = runtime;
};

(function() {
  var pluginProto = cr.plugins_.IDNet.prototype;
    
  /////////////////////////////////////
  // Object type class
  pluginProto.Type = function(plugin) {
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
  var gotSaveData = 0;
  var gameBreakVisible = 1;
  var pointsLoaded = 0;
  var pointsFetched = 0;
  var avatarUpdated = 0;
  
  // called on startup for each object type
  typeProto.onCreate = function() {
  };

  /////////////////////////////////////
  // Instance class
  pluginProto.Instance = function(type) {
    this.type = type;
    this.runtime = type.runtime;
    
    idNetRuntime = this.runtime;
    idNetInst = this;
    this._document = window.document;
    this._unsafeWindow = this._document.defaultView;
  };
  
  function ShowLeaderBoardCallback(response) {
    
  }
  
  var instanceProto = pluginProto.Instance.prototype;

  // called whenever an instance is created
  instanceProto.onCreate = function() {
  };
  
  // called whenever an instance is destroyed
  // note the runtime may keep the object after this call for recycling; be sure
  // to release/recycle/reset any references to other objects in this function.
  instanceProto.onDestroy = function () {
  };
  
  // only called if a layout object - draw to a canvas 2D context
  instanceProto.draw = function(ctx) {
  };
  
  // only called if a layout object in WebGL mode - draw to the WebGL context
  // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
  // directory or just copy what other plugins do.
  instanceProto.drawGL = function (glw) {
  };

  //////////////////////////////////////
  // Conditions
  function Cnds() {};
  
  Cnds.prototype.isAuthorized = function() {
    return idNetInst.authorized;
  };
  
  Cnds.prototype.isNotAuthorized = function() {
    return !idNetInst.authorized;
  };
  
  Cnds.prototype.UserIsAuthorized = function() {
    return idNetInst.userAuthorized;
  };
  
  Cnds.prototype.UserIsNotAuthorized = function() {
    return !idNetInst.userAuthorized;
  };
  
  Cnds.prototype.blacklisted = function() {
    return idNetInst.isBlacklisted;
  };
  
  Cnds.prototype.sponsored = function() {
    return idNetInst.isSponsor;
  };

  Cnds.prototype.dataReady = function() {
    if (idNetInst.gotSaveData === 1) {
      idNetInst.gotSaveData = 0;
      return 1;
    }
  };

  Cnds.prototype.menuVisible = function() {
    if (window.ID && ID.isVisible()) {
      return 1;
    }
  };

  Cnds.prototype.gameBreakVisible = function() {
    return idNetInst.gameBreakVisible;
  };

  Cnds.prototype.pointsAvailable = function() {
    return pointsLoaded;
  };

  Cnds.prototype.onUpdateAvatar = function() {
    if (avatarUpdated === 1) {
      avatarUpdated = 0;
      return 1;
    }
  };
  
  pluginProto.cnds = new Cnds();
  
  //////////////////////////////////////
  // Actions
  function Acts() {};
  
  Acts.prototype.Inititalize = function(appid_) { 
    console.log('init with appid ' + appid_);

    (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src =  document.location.protocol == 'https:' ? "https://cdn.y8.com/api/sdk.js" : "http://cdn.y8.com/api/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'id-jssdk'));

    window.idAsyncInit = function() {
      ID.Event.subscribe("id.init",function() {
        window.idnet_autologin = function(response) {
          if (response != null && response.user != null) {
            console.log("Y8 autologin");
            idNetInst.idnetUserName = response.user.nickname;
            idNetInst.pid = response.user.pid;
            idNetInst.userAuthorized = true;
            ID.getLoginStatus(function(data) {
              if (data.status == 'not_linked' || data.status == 'uncomplete') {
                ID.login();
              }
            }, true);
          }
        }

        var fjs = document.head.getElementsByTagName('meta')[0];
        if (document.getElementById('id-autologin')) {
          var js_auto = document.getElementById('id-autologin');
        } else {
          var js_auto = document.createElement('script');
          js_auto.id = 'id-autologin';
          js_auto.src = "https://account.y8.com/api/user_data/autologin?app_id=" + appid_ + "&callback=window.idnet_autologin";
          fjs.parentNode.insertBefore(js_auto, fjs);
        }

        console.log("Y8 initialized");
        
        ID.Protection.isBlacklisted(function(blacklisted) {
          idNetInst.isBlacklisted = blacklisted;
        });
        
        ID.Protection.isSponsor(function(sponsor) {
          idNetInst.isSponsor = sponsor;
        });
      });
      
      ID.init({
        appId : appid_
      });
      
      idNetInst.authorized = true;
    }
  };
  
  Acts.prototype.RegisterPopup = function() {
    console.log("open registration menu");
    if (idNetInst.authorized)
      ID.register(function (response) {
        if(response == null) {
          //this.d.dispatch("auth.fail")
        } else {
          console.log("Registration complete");
          idNetInst.idnetUserName = response.authResponse.details.nickname;
          idNetInst.pid = response.authResponse.details.pid;
          idNetInst.userAuthorized = true;
          //this.d.dispatch("auth.complete");
        }
      });
  };
  
  Acts.prototype.LoginPopup = function() {
    console.log("open login menu");
    if (idNetInst.authorized){
      ID.login(function (response) {
        //console.log(response);
        if(response == null) {
          //this.d.dispatch("auth.fail")
        } else {
          console.log("Login complete");
          idNetInst.idnetUserName = response.authResponse.details.nickname;
          idNetInst.pid = response.authResponse.details.pid;
          idNetInst.userAuthorized = true;
          //this.d.dispatch("auth.complete");
        }
      });
    }
  };

  Acts.prototype.updateAvatar = function(base64, contentType) {
    if (idNetInst.authorized) {
      ID.Profile.updateAvatar(b64toBlob(base64.split('base64,')[1], contentType), function() {
        avatarUpdated = 1;
      });
    }
  };
  
  Acts.prototype.ShowLeaderBoard = function(table, mode, highest, allowduplicates) {
    if (idNetInst.authorized) {
      var options = { table: table, mode: mode, highest: !!highest, allowduplicates: !!allowduplicates };
      ID.GameAPI.Leaderboards.list(options);
    }
  };
  
  Acts.prototype.SubmitScore = function(score, table, allowduplicates, highest, playername) {
    if (idNetInst.authorized) {
       var score = {
        table: table,
        points: score,
        allowduplicates: !!allowduplicates,
        highest: !!highest,
        playername: playername || idNetInst.idnetUserName
      };
      ID.GameAPI.Leaderboards.save(score, function(response) {
        console.log("score submitted", response);
      });
    }
  };
  
  Acts.prototype.SubmitProfileImage = function(image_) {
    if (idNetInst.authorized)
      ID.submit_image(image_, function(response){
        console.log("screenshot submitted", response);
      });
  };
  
  Acts.prototype.AchievementSave = function(achievementTitle_, achievementKey_, overwrite_, allowduplicates_) {
    if (idNetInst.authorized) {
      var achievementData = {
        achievement: achievementTitle_,
        achievementkey: achievementKey_,
        overwrite: overwrite_,
        allowduplicates: allowduplicates_
      };
      
      ID.GameAPI.Achievements.save(achievementData, function(response) {
        console.log("achievement saved", response);
      });
    }
  };
  
  Acts.prototype.ShowAchievements = function() {
    if (idNetInst.authorized) {
      ID.GameAPI.Achievements.list();
    }
  };
  
  Acts.prototype.OnlineSavesSave = function(key_, value_) {
    if (idNetInst.authorized) {
      ID.api('user_data/submit', 'POST', {key: key_, value: value_}, function(response) {
        console.log("save submitted", response);
      });
    }
  };
  
  Acts.prototype.OnlineSavesRemove = function(key_) {
    if (idNetInst.authorized) {
      ID.api('user_data/remove', 'POST', {key: key_}, function(response) {
        console.log("save deleted", response);
      });
    }
  };
  
  Acts.prototype.OnlineSavesLoad = function(key_) {
    if (idNetInst.authorized) {
      ID.api('user_data/retrieve', 'POST', {key: key_}, function(response) {
        if(response) {
          idNetInst.onlineSavesData = response.jsondata;
          idNetInst.gotSaveData = 1;
          console.log("save loaded", response);
        }
      });
    }
  };
  
  Acts.prototype.CheckIsBlacklisted = function () {
    ID.Protection.isBlacklisted(function(blacklisted){
      console.log("check blacklist called", blacklisted);
      idNetInst.isBlacklisted = blacklisted;
    });
  };
  
  Acts.prototype.CheckIsSponsor = function () {
    ID.Protection.isSponsor(function(sponsor){
      console.log("check sponser called", sponser);
      idNetInst.isSponsor = sponsor;
    });
  };

  Acts.prototype.openProfile = function () {
    ID.openProfile();
  };

  Acts.prototype.gameBreak = function () {
    idNetInst.gameBreakVisible = 1;
    ID.gameBreak(function() {
      idNetInst.gameBreakVisible = 0;
    });
  };

  Acts.prototype.pointsFetch = function() {
    if (pointsFetched === 0) {
      pointsFetched = 1;
      if (idNetInst.pid) {
        ID.api('points/total/' + idNetInst.pid, 'GET', null, function(response) {
          if(response) {
            idNetInst.points = response.points;
            pointsLoaded = 1;
            console.log("Player points", response);
          } else {
            console.log('Error: fetching points, no data');
          }
        });
      } else {
        console.log('Error: fetching points');
      }
    }
  };
  
  pluginProto.acts = new Acts();
  
  //////////////////////////////////////
  // Expressions
  function Exps() {};
  
  Exps.prototype.UserName = function(ret) {
    if(idNetInst.idnetUserName != undefined) {
      ret.set_string(idNetInst.idnetUserName);
    }
  };
  
  Exps.prototype.SessionKey = function(ret) {
    if(idnetSessionKey != undefined) {
      ret.set_string(idnetSessionKey);
    }
  };
  
  Exps.prototype.GateOnlineSavesData = function (ret) {
    ret.set_string(String(idNetInst.onlineSavesData));
  };
  
  Exps.prototype.GetIsBlacklisted = function(ret) {
    if(idNetInst.isBlacklisted) {
      ret.set_int(1);
    } else {
      ret.set_int(0);
    }
  };
  
  Exps.prototype.GetIsSponsor = function(ret) {
    if(idNetInst.isSponsor) {
      ret.set_int(1);
    } else {
      ret.set_int(0);
    }
  };

  Exps.prototype.GetPoints = function(ret) {
    if(idNetInst.points != undefined) {
      ret.set_int(idNetInst.points || 0);
    }
  };
  
  pluginProto.exps = new Exps();

}());
