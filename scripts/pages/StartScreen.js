/* StartScreen.js */

/******************************************************************************/
/******************************************************************************/

StartScreen.ScreenID = "StartUp001";
StartScreen.TextID = "StartUp001_Text";

/******************************************************************************/

StartScreen.newInstance = function()
{
	return MainApp.getThe().openScreen(new StartScreen());
}

/******************************************************************************/

StartScreen.prototype = new Screen();
StartScreen.prototype.constructor = StartScreen;

/******************************************************************************/

function StartScreen()
{
	this.ScreenID = StartScreen.ScreenID;
	this.fInited = false;

	this.fContainerControl = new ContainerControl(this.ScreenID, 0, 170);
	this.fContainerControl.onNavigate = StartScreen.onNavigate;

	this.newControl(new TextControl(StartScreen.TextID, this.ScreenID));
}

/******************************************************************************/

/*void*/ StartScreen.prototype.idle = function()
{
	if(!this.fInited)
	{
		this.fInited = true;

		var msg = StartupInitialCheck();
		if(msg == null)
			this.close();
		else
		{
			var oControl = this.getControl(StartScreen.TextID);
			oControl.setText(msg);
		}
	}

	Screen.prototype.idle.call(this);
}

/******************************************************************************/
/******************************************************************************/
