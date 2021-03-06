/* HTTPRequestor.js */

/******************************************************************************/
/******************************************************************************/

HTTPRequestor.newInstance = function()
{
	return new HTTPRequestor();
}

/******************************************************************************/

function HTTPRequestor(/*string*/ sessionData)
{
    this.fXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}

/******************************************************************************/

/*string*/ HTTPRequestor.prototype.sendRequest = function(/*string*/ request)
{
	var session = MainApp.getThe().getSession();

	this.fXmlHttp.open("POST", session.getNetworkURL(), false);
	this.fXmlHttp.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");
	this.fXmlHttp.send(request);

	return this.fXmlHttp.responseText;
}

/******************************************************************************/

/*string*/ HTTPRequestor.prototype.sendGet = function(/*string*/ url, /*string*/ request)
{
	var session = MainApp.getThe().getSession();

	this.fXmlHttp.open("GET", url + request, false);
	this.fXmlHttp.send();

	if(this.fXmlHttp.status == 200)
		return this.fXmlHttp.responseText;

	return "An internal error has occurred: " + this.fXmlHttp.statusText;
}

/******************************************************************************/
/******************************************************************************/
