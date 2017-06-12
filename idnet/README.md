## id.net Construct 2 Plugin

The id.net C2 plugin offers cross site logins, acheivements, high scores, screenshots, and cloud saves. Use it to enable fun features inside your game, it's free.

### Install
1. Download and unzip this repository
2. Copy the idnet folder to the C2 plugins folder <install path>\exporters\html5\plugins
2. Start or restart Construct2

### Getting Started
- Double click in a layout tab to open insert dialog
- Add the id.net plugin from the platform specific section
- Now id.net events should be available in the event tabs
- Start by making the first event. Under system, choose _On Start of layout_
- Next, add the action _init_ from the id.net initialize section
- Now the id.net plugin is ready to use.

### Events
- Initialized - When id.net is ready to use
- Not initialized - When id.net is still loading
- Logged In - Once a player has signed in
- Not Logged In - Only when a guest is playing
- isBlacklisted - When website is blocked
- isSponsered - When the game is on the Y8 network

### Need Help?

Post on the awesome id.net developer forum
https://forum.id.net/c/app-developers