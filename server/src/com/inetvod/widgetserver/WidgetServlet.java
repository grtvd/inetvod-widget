/**
 * Copyright © 2006 iNetVOD, Inc. All Rights Reserved.
 * iNetVOD Confidential and Proprietary.  See LEGAL.txt.
 */
package com.inetvod.widgetserver;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.inetvod.common.dbdata.Provider;
import com.inetvod.common.dbdata.MemberPrefs;
import com.inetvod.common.dbdata.DatabaseAdaptor;
import com.inetvod.common.dbdata.Member;
import com.inetvod.common.dbdata.Rating;
import com.inetvod.common.dbdata.MemberProvider;
import com.inetvod.common.dbdata.ShowCategory;
import com.inetvod.common.dbdata.ShowProvider;
import com.inetvod.common.dbdata.RentedShow;
import com.inetvod.common.dbdata.Show;
import com.inetvod.common.dbdata.MemberAccount;
import com.inetvod.common.dbdata.MemberSession;
import com.inetvod.common.dbdata.Category;
import com.inetvod.common.dbdata.ProviderConnection;
import com.inetvod.common.dbdata.MemberLogon;
import com.inetvod.common.dbdata.ShowProviderList;
import com.inetvod.common.crypto.CryptoKeyStore;
import com.inetvod.common.core.Logger;
import com.inetvod.common.data.ShowID;
import com.inetvod.common.data.ProviderConnectionType;
import com.inetvod.common.data.ShowCostType;

public class WidgetServlet extends HttpServlet
{
	private static final int RQST_METHOD_POS = 2;
	private static final int RQST_PARTS = 3;

	private static final String SEND_SHOW_METHOD = "sendshow";
	private static final String SHOWID_ARG = "showid";
	private static final String EMAIL_ARG = "email";

	public void init() throws ServletException
	{
		try
		{
			// set the log file
			Logger.initialize(getServletContext().getRealPath("/log4j.xml"),
				getServletContext().getInitParameter("logdir"));

			// setup db connection
			DatabaseAdaptor.setDBConnectFile(getServletContext().getInitParameter("dbconnect"));

			// init the CryptoKeyStore
			CryptoKeyStore.load(getServletContext().getInitParameter("cryptokeystore"));

			// prime UUID, first hit is big
			UUID.randomUUID();
		}
		catch(Exception e)
		{
			throw new ServletException(e.getMessage(), e);
		}

		// Preload DatabaseAdaptors
		Provider.getDatabaseAdaptor();
		ProviderConnection.getDatabaseAdaptor();
		Category.getDatabaseAdaptor();
		Rating.getDatabaseAdaptor();
		Member.getDatabaseAdaptor();
		MemberLogon.getDatabaseAdaptor();
		MemberAccount.getDatabaseAdaptor();
		MemberPrefs.getDatabaseAdaptor();
		MemberSession.getDatabaseAdaptor();
		MemberProvider.getDatabaseAdaptor();
		Show.getDatabaseAdaptor();
		ShowProvider.getDatabaseAdaptor();
		ShowCategory.getDatabaseAdaptor();
		RentedShow.getDatabaseAdaptor();
	}

	protected void doGet(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse)
		throws ServletException, IOException
	{
		try
		{
			String requestMethod = getRequestMethod(httpServletRequest.getRequestURL().toString());
			String queryString = httpServletRequest.getQueryString();
			String result = null;

			if(SEND_SHOW_METHOD.equals(requestMethod))
			{
				result = sendShowRqst(getRequestArg(queryString, SHOWID_ARG), getRequestArg(queryString, EMAIL_ARG));
			}
			else
				throw new Exception("Unknown request");

			sendResult(httpServletResponse, result);
		}
		catch(Exception e)
		{
			httpServletResponse.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
	}

	private String getRequestMethod(String requestURL) throws Exception
	{
		String[] parts = (new URL(requestURL)).getPath().split("/");

		if(parts.length != RQST_PARTS)
			throw new Exception(String.format("Cannot parse request, parts != %d", RQST_PARTS));

		return parts[RQST_METHOD_POS];
	}

	private String getRequestArg(String queryString, String argName)
	{
		if((queryString == null) || (queryString.length() == 0))
			return "";

		String[] parts = queryString.split("&");

		for(String part : parts)
		{
			String name = "";
			String value = "";
			int pos = part.indexOf('=');
			if(pos >= 0)
			{
				name = part.substring(0, pos);
				value = part.substring(pos + 1);
			}
			else
				name = part;

			if(name.toLowerCase().equals(argName))
				return value;
		}

		return "";
	}

	private void sendResult(HttpServletResponse httpServletResponse, String result) throws IOException
	{
		httpServletResponse.getWriter().write(result);
	}

	private String sendShowRqst(String showIDStr, String email) throws Exception
	{
		// find the memeber
		MemberLogon memberLogon = MemberLogon.findByEmail(email);
		if(memberLogon == null)
			return "Member not found for email: " + email;

		// get the show info
		ShowID showID = new ShowID(showIDStr);
		Show show = Show.get(showID);
		ShowProviderList showProviderList = ShowProviderList.findByShowID(showID);

		// find a provider who offers this show for free
		for(ShowProvider showProvider : showProviderList)
		{
			ProviderConnection providerConnection = ProviderConnection.get(showProvider.getProviderConnectionID());

			if((!ProviderConnectionType.ProviderAPI.equals(providerConnection.getProviderConnectionType()))
				&& ShowCostType.Free.equals(showProvider.getShowCost().getShowCostType()))
			{
				// Save the RentedShow record
				RentedShow rentedShow = RentedShow.newInstance(memberLogon.getMemberID(), showID,
					showProvider.getProviderID(), providerConnection.getProviderConnectionID());

				rentedShow.setShowURL(showProvider.getShowURL());
				rentedShow.setShowCost(showProvider.getShowCost());
				rentedShow.setRentedOn(new Date());
				rentedShow.setAvailableUntil(null);
				rentedShow.update();

				return "success";
			}
		}

		//return "Show ID: " + showID + "<br>" + "Email: " + email + "<br>";
		return "No providers found offering this show for free.";
	}
}
