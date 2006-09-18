/* RecommendScreen.js */

/******************************************************************************/
/******************************************************************************/

RecommendScreen.ScreenID = "Recom003";

RecommendScreen.ShowNameID = "Recom003_ShowName";
RecommendScreen.EmailID = "Recom003_Email";
RecommendScreen.CancelID = "Recom003_Cancel";
RecommendScreen.SendID = "Recom003_Send";

/******************************************************************************/

RecommendScreen.newInstance = function(/*string*/ showName)
{
	return MainApp.getThe().openScreen(new RecommendScreen(showName));
}

/******************************************************************************/

RecommendScreen.prototype = new Screen();
RecommendScreen.prototype.constructor = RecommendScreen;

/******************************************************************************/

function RecommendScreen(/*string*/ showName)
{
	var oControl;

	this.ScreenID = RecommendScreen.ScreenID;

	this.fContainerControl = new ContainerControl(this.ScreenID, 10, 50);
	this.fContainerControl.onNavigate = RecommendScreen.onNavigate;

	oControl = new TextControl(RecommendScreen.ShowNameID, this.ScreenID);
	oControl.setText(showName);
	this.newControl(oControl);

	oControl = new EditControl(RecommendScreen.EmailID, this.ScreenID, 16);
	this.newControl(oControl);
	oControl.Type = ect_AlphaNumeric;
	oControl.MaxLength = 50;
	this.newControl(new ButtonControl(RecommendScreen.CancelID, this.ScreenID));
	this.newControl(new ButtonControl(RecommendScreen.SendID, this.ScreenID));
}

/******************************************************************************/

/*void*/ RecommendScreen.prototype.onButton = function(/*string*/ controlID)
{
	var data;

	if(controlID == RecommendScreen.SendID)
	{
		data = this.getControl(RecommendScreen.EmailID).getText();
		if(!testStrHasLen(data))
		{
			showMsg("Email must be entered.");
			return;
		}

		if(StartupDoSignonPassword(data))
		{
			this.close();
			return;
		}
	}
	else if(controlID == RecommendScreen.CancelID)
	{
		this.close();
		return;
	}

	Screen.prototype.onButton.call(this, controlID);
}

/******************************************************************************/

/*string*/ RecommendScreen.onNavigate = function(/*string*/ fromControl, /*int*/ key)
{
	return null;
}

/******************************************************************************/
/******************************************************************************/
