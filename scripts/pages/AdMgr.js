/* AdMgr.js */

/******************************************************************************/
/******************************************************************************/

var gAdImagesList = new Array("images/300x125_auto_02.gif", "images/300x125_auto_ins_02.gif", "images/300x125_credit_02.gif", "images/300x125_loan_02.gif");
var gNumAds = 4;
var gCurAd = 0;

function ChangeAdImage()
{
	window.setTimeout("ChangeAdImage()", 8000);

	gCurAd++;
	if(gCurAd >= gNumAds)
		gCurAd = 0;
	var oImage = document.getElementById("AdImage");
	oImage.src = gAdImagesList[gCurAd];
}

/******************************************************************************/
/******************************************************************************/
