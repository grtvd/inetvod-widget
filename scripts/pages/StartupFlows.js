/* StartupFlows.js */

/******************************************************************************/
/******************************************************************************/

function StartupInitialCheck()
{
	var oSession = MainApp.getThe().getSession();

	/* has the app been installed locally? */
	if(!oSession.checkInstall())
	{
		return "Error: Not Installed";
	}

	/* connect to the server */
	if(!oSession.CanPingServer)
		if(!oSession.pingServer())
			return "Error: Can't Ping Server";

	if(!oSession.loadDataSettings())
	{
		SetupScreen.newInstance();
		return "Error: No User Found";
	}

	if(!oSession.haveUserPassword())
	{
		return "Error: No PIN Found";
	}

	var statusCode = oSession.signon();
	if(statusCode == sc_Success)
	{
		if(oSession.loadSystemData())
		{
			NowPlayingScreen.newInstance();
			return null;
		}
		else
			oSession.clearLogonInfo();
	}
	else if(statusCode == sc_InvalidUserIDPassword)
	{
		return "Error: Invalid User";
	}

	return "Error: Unknown";
}

/******************************************************************************/

function StartupDoSignonPassword(/*string*/ userPassword)
{
	var oSession = MainApp.getThe().getSession();

	var statusCode = oSession.signon(null, userPassword);
	if(statusCode == sc_Success)
	{
		oSession.saveDataSettings();	// for possible temp store of userPassword

		if(oSession.loadSystemData())
		{
			WelcomeScreen.newInstance();
			return true;
		}

		oSession.clearLogonInfo();
		StartScreen.newInstance();
		return true;
	}

	return false;
}

/******************************************************************************/

function StartupDoSetupSignon(/*string*/ userID, /*string*/ userPassword,
	/*boolean*/ rememberPassword)
{
	var oSession = MainApp.getThe().getSession();

	var statusCode = oSession.signon(userID, userPassword, rememberPassword);
	if(statusCode == sc_Success)
	{
		if(!oSession.saveDataSettings())
		{
			showMsg("An error occured while saving your settings.");
			return false;
		}

		if(oSession.loadSystemData())
		{
			WelcomeScreen.newInstance();
			return true;
		}

		oSession.clearLogonInfo();
		StartScreen.newInstance();
		return true;
	}

	return false;
}

/******************************************************************************/
/******************************************************************************/
