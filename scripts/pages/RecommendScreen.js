/* RecommendScreen.js */

/******************************************************************************/
/******************************************************************************/

RecommendScreen.ScreenID = "Recom003";

RecommendScreen.ShowNameID = "Recom003_ShowName";
RecommendScreen.EmailID = "Recom003_Email";
RecommendScreen.CancelID = "Recom003_Cancel";
RecommendScreen.SendID = "Recom003_Send";

/******************************************************************************/

RecommendScreen.newInstance = function(/*string*/ showID, /*string*/ showName)
{
	return MainApp.getThe().openScreen(new RecommendScreen(showID, showName));
}

/******************************************************************************/

RecommendScreen.prototype = new Screen();
RecommendScreen.prototype.constructor = RecommendScreen;

/******************************************************************************/

function RecommendScreen(/*string*/ showID, /*string*/ showName)
{
	var oControl;

	this.ScreenID = RecommendScreen.ScreenID;
	this.fShowID = showID;

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

		var oSession = MainApp.getThe().getSession();
		var rc = oSession.sendShowViaEmail(this.fShowID, data);
		if(rc == "success")
		{
			this.close();
		}
		else
			showMsg(rc);
		return;
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
