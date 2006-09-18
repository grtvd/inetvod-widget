/* RentMgr.js */

/******************************************************************************/
/******************************************************************************/

RentMgr.ResultSuccess = "success";
RentMgr.ResultError = "error";

/******************************************************************************/

RentMgr.rent = function(/*ShowDetail*/ oShowDetail)
{
	var oMgr = new RentMgr(oShowDetail);

	return oMgr.allowAnonymous();
}

/******************************************************************************/

function RentMgr(/*ShowDetail*/ oShowDetail)
{
	this.fRentData = new RentData(oShowDetail);
}

/******************************************************************************/

/*string*/ RentMgr.prototype.allowAnonymous = function()
{
	if(this.fRentData.HasMultipleRentals)
		return "Can't get shows with multiple rentals.";

	if(this.fRentData.ShowCost.ShowCostType == sct_Free)
		return this.checkShowAvail();

	return "Can only get shows that are Free.";
}

/******************************************************************************/

/*string*/ RentMgr.prototype.checkShowAvail = function()
{
	var oSession = MainApp.getThe().getSession();
	var oCheckShowAvailResp;
	var statusCodeRef = new Object();
	var statusCode;

	oCheckShowAvailResp = oSession.checkShowAvail(this.fRentData.getShowID(),
		this.fRentData.getProviderID(), this.fRentData.ShowCost, statusCodeRef);
	statusCode = statusCodeRef.value;
	if(statusCode != sc_Success)
		return RentMgr.ResultError;

	var oShowCost = oCheckShowAvailResp.ShowCost;

	this.fRentData.ShowCost = oShowCost;
	if(oShowCost.ShowCostType == sct_PayPerView)
		return "Can only get shows that are Free.";

	return this.rentShow();
}

/******************************************************************************/

/*string*/ RentMgr.prototype.rentShow = function()
{
	var oSession = MainApp.getThe().getSession();
	var oRentShowResp;

	oRentShowResp = oSession.rentShow(this.fRentData.getShowID(),
		this.fRentData.getProviderID(), this.fRentData.ShowCost);
	if(oRentShowResp != null)
	{
		return RentMgr.ResultSuccess;
	}

	return RentMgr.ResultError;
}

/******************************************************************************/
/******************************************************************************/
