/* RentedShowListControl.js */

/******************************************************************************/
/******************************************************************************/

RentedShowListControl.prototype = new ListControl();
RentedShowListControl.prototype.constructor = ListControl;

/******************************************************************************/

function RentedShowListControl(/*string*/ controlID, /*string*/ screenID, /*int*/ numRows,
	/*ListControlRowItemList*/ oRowItemList, /*Array*/ rentedShowSearchList)
{
	this.RentedShowSearchList = rentedShowSearchList;

	ListControl.prototype.init.call(this, controlID, screenID, numRows, oRowItemList);
}

/******************************************************************************/

/*void*/ RentedShowListControl.prototype.setRentedShowSearchList = function(
	/*Array*/ rentedShowSearchList, /*boolean*/ reset)
{
	this.RentedShowSearchList = rentedShowSearchList;
	this.recalcAfterDataChange(reset);
}

/******************************************************************************/

/*RentedShowSearch*/ RentedShowListControl.prototype.getFocusedItemValue = function()
{
	var focusedItem = this.getFocusedItemPos();
	if((focusedItem >= 0) && (focusedItem < this.RentedShowSearchList.length))
		return this.RentedShowSearchList[focusedItem];

	return null;
}

/******************************************************************************/

/*int*/ RentedShowListControl.prototype.getItemCount = function()
{
	return this.RentedShowSearchList.length;
}

/******************************************************************************/

/*void*/ RentedShowListControl.prototype.drawItem = function(/*int*/ item,
	/*ListControlRow*/ oRow)
{
	var rentedShowSearch = this.RentedShowSearchList[item];
	var tempStr;

	tempStr = rentedShowSearch.Name;
	if(testStrHasLen(rentedShowSearch.EpisodeName))
		tempStr += ' - "' + rentedShowSearch.EpisodeName + '"';

	oRow.drawRowItem(0, tempStr);
}

/******************************************************************************/
/******************************************************************************/
