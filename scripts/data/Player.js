/* Player.js */

/******************************************************************************/
/******************************************************************************/

Player.ModelNoMaxLength = 32;
Player.SerialNoMaxLength = 64;
Player.VersionMaxLength = 16;

/******************************************************************************/

Player.newInstance = function()
{
	return new Player();
}

/******************************************************************************/

function Player()
{
	this.ManufacturerID;
	this.ModelNo;
	this.SerialNo;
	this.Version;
}

/******************************************************************************/

/*void*/ Player.prototype.writeTo = function(/*DataWriter*/ writer)
{
	writer.writeString("ManufacturerID", this.ManufacturerID, ManufacturerIDMaxLength);
	writer.writeString("ModelNo", this.ModelNo, Player.ModelNoMaxLength);
	writer.writeString("SerialNo", this.SerialNo, Player.SerialNoMaxLength);
	writer.writeString("Version", this.Version, Player.VersionMaxLength);
}

/******************************************************************************/
/******************************************************************************/
