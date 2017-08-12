## id.net Construct 2 Plugin

### Install
1. Download and unzip this repository
2. Copy the idnet folder to the C2 plugins folder <install path>\exporters\html5\plugins
2. Start or restart Construct2

### Getting Started
- Double click in a layout tab to open insert dialog
- Add the IDNet plugin from the platform specific section
- Now id.net events should be available in the event tabs
- Start by making a id.net _init_ action for _On start of layout_ event

### Example

We provide the <b>example.capx</b> file to show the basics of how to use the plugin. Give it a glace, it's easier to understand compared to text only instructions.

### Important Notes
- Games must be hosted on <b>https</b> in order to work. Using https is possible using the id.net <a href="http://dev.id.net/docs/storage/">storage solution</a>. Any website, even non https ones, can iframe the game.

### Available Functions
- Is authorized - Returns true if sdk is loaded
- Is not authorized - Returns true if sdk is not loaded
- Init - Initialisation of id.net API
- Registration - Show a dialog prompting the user to register an account
- Login - Show a dialog prompting the user to login with an account
- Submit statistic - Submit a high score
- Show leaderboard - Show high score menu
- User name - Return the current user's name, or a guest name if not logged in
- Session Key - SessionKey", "Return session key
- Menu is visible - Know when a id.net menu is shown to the player

### Need More Help

There is a awesome community of devs and players on the <a href="https://forum.id.net/">id.net forum</a>. Leave a message, we will try to reply.
