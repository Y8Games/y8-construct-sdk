function GetPluginSettings()
{
  return {
    "name":     "Y8",     // as appears in 'insert object' dialog, can be changed as long as "id" stays the same
    "id":     "IDNet",      // this is used to identify this plugin and is saved to the project; never change it
    "version":    "2.6",          // (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
    "description":  "Connect your C2 game with Y8",
    "author":   "Y8.com",
    "help url":   "https://github.com/webgroup-limited/y8-construct-sdk",
    "category":   "Platform specific",  // Prefer to re-use existing categories, but you can set anything here
    "type":     "object",       // either "world" (appears in layout and is drawn), else "object"
    "rotatable":  false,          // only used when "type" is "world".  Enables an angle property on the object.
    "flags":    0           // uncomment lines to enable flags...
            | pf_singleglobal   // exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
  };
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])      // a number
// AddStringParam(label, description [, initial_string = "\"\""])   // a string
// AddAnyTypeParam(label, description [, initial_string = "0"])     // accepts either a number or string
// AddCmpParam(label, description)                    // combo with equal, not equal, less, etc.
// AddComboParamOption(text)                      // (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])      // a dropdown list parameter
// AddObjectParam(label, description)                 // a button to click and pick an object type
// AddLayerParam(label, description)                  // accepts either a layer number or name (string)
// AddLayoutParam(label, description)                 // a dropdown list with all project layouts
// AddKeybParam(label, description)                   // a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)                // a string intended to specify an animation name
// AddAudioFileParam(label, description)                // a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,         // any positive integer to uniquely identify this condition
//        flags,        // (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//                  // cf_deprecated, cf_incompatible_with_triggers, cf_looping
//        list_name,      // appears in event wizard list
//        category,     // category in event wizard list
//        display_str,    // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//        description,    // appears in event wizard dialog when selected
//        script_name);   // corresponding runtime function name
        
AddCondition(0, cf_none, "initialized", "Main", "Initialized", "Y8 Account sdk is ready to use.", "isAuthorized");    
AddCondition(1, cf_none, "Not initialized", "Main", "Not Initialized", "Y8 Account SDK is not ready to use", "isNotAuthorized");
AddCondition(2, cf_none, "Logged In", "Main", "Logged in", "Active when the player is signed in", "UserIsAuthorized");
AddCondition(3, cf_none, "Not Logged In", "Main", "Not logged in", "Active when the player is a guest", "UserIsNotAuthorized");

AddCondition(4, cf_none, "isBlacklisted", "Protection and sponsor API", "isBlacklisted", "True if domain in blacklist", "blacklisted");
AddCondition(5, cf_none, "isSponsor", "Protection and sponsor API", "isSponsor", "True if domain in sponsor list", "sponsored");

AddCondition(6, cf_none, "Player data loaded", "User", "player data loaded", "Fires once when any player data has finished downloading.", "dataReady");

AddCondition(7, cf_none, "Y8 Menu is visible", "Main", "Menu is visible", "Running when the menu is open", "menuVisible");

AddCondition(8, cf_none, "gameBreak is visible", "Main", "gameBreak is visible", "will run when an ad is playing", "gameBreakVisible");

AddCondition(9, cf_none, "points data fetched", "Main", "points data available", "will run when pointsFetch is complete", "pointsAvailable");

////////////////////////////////////////
// Actions

// AddAction(id,        // any positive integer to uniquely identify this action
//       flags,       // (see docs) af_none, af_deprecated
//       list_name,     // appears in event wizard list
//       category,      // category in event wizard list
//       display_str,   // as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//       description,   // appears in event wizard dialog when selected
//       script_name);    // corresponding runtime function name

AddStringParam("Appid", "appId");
AddAction(0, 0, "Init", "Main", "Init", "Initialisation of Y8 Account", "Inititalize");

AddAction(1, 0, "Registration", "User", "Show registration menu", "Show registration menu", "RegisterPopup");
AddAction(2, 0, "Login", "User", "Show login menu", "Shows login menu", "LoginPopup");

AddNumberParam("Score", "The player's score value");
AddStringParam("Table", "Table name");
AddNumberParam("Allowduplicates", "Set to 1 if player’s can submit more than one score.", 0);
AddNumberParam("Highest", "Table name", 1);
AddStringParam("Playername (optional)", "Set playername");
AddAction(3, 0, "Submit score", "scores", "Submit scores {0}", "Submit a player's score", "SubmitScore");

AddStringParam("Image", "Text to add to the shout box.");
AddAction(4, 0, "Send image to profile", "User", "Send image {0}", "Allow the user to post image to page", "SubmitProfileImage");

AddStringParam("Table", "The table name from Y8 Account apps page");
AddStringParam("Mode", "Equals alltime, last30days, last7days, today, or newest.", '"alltime"');
AddNumberParam("Highest", " Set to 0 if a low score is better.", 1);
AddAction(5, 0, "Show leaderboard", "scores", "Show data leaderboard", "Show data leaderboard", "ShowLeaderBoard");

AddStringParam("AchievementTitle", "AchievementName");
AddStringParam("AchievementKey", "AchievementKey");
AddNumberParam("Overwrite", "Allow players to unlock the same achievement more than once.", 0);
AddNumberParam("Allowduplicates", " Allow players to unlock the same achievement and display them seperatly.", 0);
AddAction(6, 0, "Save achievement", "Achievements", "Save achievement with title {0} and key {1}", "Save achievement", "AchievementSave");

AddAction(7, 0, "Show achievements", "Achievements", "Show achievements", "Show achievements", "ShowAchievements");

AddStringParam("Key", "Key");
AddStringParam("Value", "Value");
AddAction(8, 0, "Save user data", "User", "Save data to online saves with title {0} and value {1}", "Save user data", "OnlineSavesSave");

AddStringParam("Key", "Key");
AddAction(9, 0, "Load user data", "User", "Load data from online saves with title {0}", "Load user data", "OnlineSavesLoad");

AddStringParam("Key", "Key");
AddAction(10, 0, "Remove user data", "User", "Remove data from online saves with title {0}", "Remove user data", "OnlineSavesRemove");

AddAction(11, 0, "CheckIsBlacklisted", "Protection", "Check if domain on blacklist", "Check if domain on blacklist", "CheckIsBlacklisted");
AddAction(12, 0, "CheckIsSponsor", "Protection", "Check if domain on sponsorlist", "Check if domain on sponsorlist", "CheckIsSponsor");

AddAction(13, 0, "OpenProfile", "User", "Open a player's profile", "Open a player's profile", "openProfile");

AddAction(14, 0, "gameBreak", "Main", "Play advertisement (requires activation)", "Play advertisement", "gameBreak");

AddAction(15, 0, "Fetch player points", "User", "Player points are awarded for playing games.", "Fetch player points", "pointsFetch");

////////////////////////////////////////
// Expressions

// AddExpression(id,      // any positive integer to uniquely identify this expression
//         flags,     // (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//                // ef_return_any, ef_variadic_parameters (one return flag must be specified)
//         list_name,   // currently ignored, but set as if appeared in event wizard
//         category,    // category in expressions panel
//         exp_name,    // the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//         description);  // description in expressions panel

// example
AddExpression(0, ef_return_string, "User name", "User", "UserName", "Return the current user's name, or a guest name if not logged in.");
AddExpression(1, ef_return_string, "Session Key", "User", "SessionKey", "Return session key");
AddExpression(2, ef_return_string, "User data", "Saves", "GateOnlineSavesData", "Return user data of online saves");


AddExpression(3, ef_return_number, "Get is blacklisted", "Protection and sponsor API", "GetIsBlacklisted", "Return is blacklisted");
AddExpression(4, ef_return_number, "Get is sponsor", "Protection and sponsor API", "GetIsSponsor", "Return get is sponsor");
AddExpression(5, ef_return_number, "Get player points", "User", "GetPoints", "Return player points");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,   name, initial_value,  description)    // an integer value
// new cr.Property(ept_float,   name, initial_value,  description)    // a float value
// new cr.Property(ept_text,    name, initial_value,  description)    // a string
// new cr.Property(ept_color,   name, initial_value,  description)    // a color dropdown
// new cr.Property(ept_font,    name, "Arial,-16",  description)    // a font with the given face name and size
// new cr.Property(ept_combo,   name, "Item 1",   description, "Item 1|Item 2|Item 3")  // a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,    name, link_text,    description, "firstonly")   // has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [];
  
// Called by IDE when a new object type is to be created
function CreateIDEObjectType() {
  return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType() {
  assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance) {
  return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
  assert2(this instanceof arguments.callee, "Constructor called as a function");
  
  // Save the constructor parameters
  this.instance = instance;
  this.type = type;
  
  // Set the default property values from the property table
  this.properties = {};
  
  for (var i = 0; i < property_list.length; i++)
    this.properties[property_list[i].name] = property_list[i].initial_value;
    
  // Plugin-specific variables
  // this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function() {
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function() {
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name) {
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer) {
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer) {
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer) {
}
