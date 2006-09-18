/* SearchResultsScreen.js */

/******************************************************************************/
/******************************************************************************/

SearchResultsScreen.ScreenID = "Search003";
SearchResultsScreen.PlayListID = "Search003_PlayList";
SearchResultsScreen.FeaturedID = "Search003_Featured";
SearchResultsScreen.CloseID = "Search003_Close";
SearchResultsScreen.ShowListID = "Search003_ShowList";
SearchResultsScreen.GetID = "Search003_Get";
SearchResultsScreen.NoShowsTextID = "Search003_NoShowsText";

/******************************************************************************/

SearchResultsScreen.newInstance = function()
{
	var oSession = MainApp.getThe().getSession();
	var showSearchListRef = new Object();

	var oSearchData = new SearchData();
	oSearchData.CategoryID = Category.FeaturedCategoryID;

	if(oSession.showSearch(oSearchData, showSearchListRef))
	{
		var oScreen = new SearchResultsScreen(showSearchListRef.value);
		MainApp.getThe().openScreen(oScreen);
		oScreen.focusControl(SearchResultsScreen.ShowListID, true);
		return oScreen;
	}

	return null;
}

/******************************************************************************/

SearchResultsScreen.prototype = new Screen();
SearchResultsScreen.prototype.constructor = SearchResultsScreen;

/******************************************************************************/

function SearchResultsScreen(/*Array*/ showSearchList)
{
	this.fShowSearchList = showSearchList;
//	this.fShowSearchList.sort(ShowSearchByNameCmpr);
	this.ScreenID = SearchResultsScreen.ScreenID;

	var oRowItemList = new Array();
	oRowItemList.push(new ListControlRowItem("Show", 380));

	this.fContainerControl = new ContainerControl(this.ScreenID, 10, 10);

	var oControl;

	this.newControl(new ButtonControl(SearchResultsScreen.PlayListID, this.ScreenID));
	this.newControl(new ButtonControl(SearchResultsScreen.FeaturedID, this.ScreenID));
	this.newControl(new ButtonControl(SearchResultsScreen.CloseID, this.ScreenID));

	oControl = new ShowSearchListControl(SearchResultsScreen.ShowListID, this.ScreenID,
		6, oRowItemList, showSearchList);
	if(showSearchList.length > 0)
		this.newControl(oControl);
	oControl.show(showSearchList.length > 0);

	this.newControl(new ButtonControl(SearchResultsScreen.GetID, this.ScreenID));

	oControl = new TextControl(SearchResultsScreen.NoShowsTextID, this.ScreenID);
	if(showSearchList.length == 0)
		this.newControl(oControl);
	oControl.show(showSearchList.length == 0);
}

/******************************************************************************/

/*void*/ SearchResultsScreen.prototype.onButton = function(/*string*/ controlID)
{
	var oSession = MainApp.getThe().getSession();
	var oShowSearchListControl;

	if(controlID == SearchResultsScreen.PlayListID)
	{
		this.close();
		NowPlayingScreen.newInstance();
		return;
	}
	else if(controlID == SearchResultsScreen.FeaturedID)
	{
		this.close();
		SearchResultsScreen.newInstance();
		return;
	}
	else if(controlID == SearchResultsScreen.CloseID)
	{
		window.close();
		return;
	}
	else if((controlID == SearchResultsScreen.ShowListID) || (controlID == SearchResultsScreen.GetID))
	{
		oShowSearchListControl = this.getControl(SearchResultsScreen.ShowListID);
		var oShowSearch = oShowSearchListControl.getFocusedItemValue();

		var oShowDetail = oSession.showDetail(oShowSearch.ShowID);
		if(oShowDetail != null)
		{
			var rc = RentMgr.rent(oShowDetail);
			if(rc == RentMgr.ResultSuccess)
				showMsg("This Show has been successfully added to your Playlist.");
			else if(rc == RentMgr.ResultError)
				;
			else
				showMsg(rc);
		}

		return;
	}

	Screen.prototype.onButton.call(this, controlID);
}

/******************************************************************************/

/*void*/ SearchResultsScreen.prototype.onListItem = function(/*string*/ controlID)
{
	var oSession = MainApp.getThe().getSession();

	if(controlID == SearchResultsScreen.ShowListID)
	{
		return;
	}

	Screen.prototype.onButton.call(this, controlID);
}

/******************************************************************************/
/******************************************************************************/
