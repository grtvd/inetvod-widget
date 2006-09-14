/* NowPlayingScreen.js */

/******************************************************************************/
/******************************************************************************/

NowPlayingScreen.ScreenID = "Show002";
NowPlayingScreen.ShowListID = "Show002_ShowList";
NowPlayingScreen.NoShowsTextID = "Show002_NoShowsText";

/******************************************************************************/

NowPlayingScreen.newInstance = function()
{
	var oSession = MainApp.getThe().getSession();
	var rentedShowSearchListRef = new Object();

	if(oSession.rentedShowList(rentedShowSearchListRef) == sc_Success)
	{
		var oScreen = new NowPlayingScreen(rentedShowSearchListRef.value);
		MainApp.getThe().openScreen(oScreen);
		oScreen.focusControl(NowPlayingScreen.ShowListID, true);
		return oScreen;
	}

	return null;
}

/******************************************************************************/

NowPlayingScreen.prototype = new Screen();
NowPlayingScreen.prototype.constructor = NowPlayingScreen;

/******************************************************************************/

function NowPlayingScreen(/*Array*/ rentedShowSearchList)
{
	this.fRentedShowSearchList = rentedShowSearchList;
	//no initial sort - this.fRentedShowSearchList.sort(RentedShowSearchByAvailableUntilCmpr);
	this.ScreenID = NowPlayingScreen.ScreenID;

	var oRowItemList = new Array();
	oRowItemList.push(new ListControlRowItem("Show", 380));

	this.fContainerControl = new ContainerControl(this.ScreenID, 10, 120);
	this.fContainerControl.onNavigate = NowPlayingScreen.onNavigate;

	var oControl;

	oControl = new RentedShowListControl(NowPlayingScreen.ShowListID, this.ScreenID,
		6, oRowItemList, rentedShowSearchList);
	if(rentedShowSearchList.length > 0)
		this.newControl(oControl);
	oControl.show(rentedShowSearchList.length > 0);

	oControl = new TextControl(NowPlayingScreen.NoShowsTextID, this.ScreenID);
	if(rentedShowSearchList.length == 0)
		this.newControl(oControl);
	oControl.show(rentedShowSearchList.length == 0);
}

/******************************************************************************/

/*void*/ NowPlayingScreen.prototype.onButton = function(/*string*/ controlID)
{
	var oSession = MainApp.getThe().getSession();
	var oRentedShowListControl;

	if(controlID == NowPlayingScreen.ShowListID)
	{
		oRentedShowListControl = this.getControl(NowPlayingScreen.ShowListID);
		var rentedShowID = oRentedShowListControl.getFocusedItemValue().RentedShowID;

		oSession.downloadRefresh();
		var downloadStatus = oSession.getDownloadRentedShowStatus(rentedShowID);

		if(downloadStatus == DownloadStatus_NotStarted)
		{
			showMsg("This show cannot be played until it has first been downloaded.");
			return;
		}

		if(downloadStatus == DownloadStatus_InProgress)
		{
			showMsg("This show cannot be played until it has finished downloading.");
			return;
		}

		var watchShowResp = oSession.watchShow(rentedShowID);
		if(watchShowResp == null)
			return;

		var url = oSession.getDownloadRentedShowPath(rentedShowID);
		if(!testStrHasLen(url))
			url = watchShowResp.License.ShowURL;

		oSession.fDownloadServiceMgr.openMediaPlayer(url);
		//window.open("\"C:\\Program Files\\Windows Media Player\\wmplayer.exe\" /prefetch:9 /Play " + url);
		return;
	}

	Screen.prototype.onButton.call(this, controlID);
}

/******************************************************************************/

/*void*/ NowPlayingScreen.prototype.onListItem = function(/*string*/ controlID)
{
	var oSession = MainApp.getThe().getSession();

	if(controlID == NowPlayingScreen.ShowListID)
	{
		var rentedShowListControl = this.getControl(NowPlayingScreen.ShowListID);
		var rentedShowSearch = rentedShowListControl.getFocusedItemValue();

		return;
	}

	Screen.prototype.onButton.call(this, controlID);
}

/******************************************************************************/
/******************************************************************************/