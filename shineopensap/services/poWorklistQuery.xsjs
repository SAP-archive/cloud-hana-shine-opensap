$.import("<PACKAGE_NAME>.services", "messages");
var MESSAGES = $.<PACKAGE_NAME>.services.messages;
$.import("<PACKAGE_NAME>.services", "session");
var SESSIONINFO = $.<PACKAGE_NAME>.services.session;

function getFilter() {
	function createFilterEntry(rs, attribute, obj) {
		return {
			"terms" : rs.getNString(1),
			"attribute" : attribute,
			"category" : obj
		};
	}

	var body = '';
	var terms = $.request.parameters.get('query');
	var termList = terms.split(" ");
	var termStr = "";
	var i;
	for (i = 0; i < termList.length; i++) {
		termStr += termList[i].replace(/\s+/g, '') + "* ";
	}
	terms = termStr;

	var conn = $.db.getConnection();
	var pstmt;
	var rs;
	var query;
	var list = [];

	try {
		// Business Partner Company Name
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"CompanyName\") FROM \"<PACKAGE_NAME>.data::businessPartner\" "
				+ " WHERE CONTAINS(\"CompanyName\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'001'), "businessPartner"));
		}

		rs.close();
		pstmt.close();

		// Business Partner City
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"City\") FROM \"<PACKAGE_NAME>.models::AT_BUYER\" "
				+ " WHERE CONTAINS(\"City\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'007'), "businessPartner"));
		}

		rs.close();
		pstmt.close();

		// Product - Product Category
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"Category\") FROM \"<PACKAGE_NAME>.data::products\" "
				+ "WHERE CONTAINS(\"Category\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'008'), "products"));
		}

		rs.close();
		pstmt.close();

		// Product - Product ID
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"ProductId\") FROM \"<PACKAGE_NAME>.data::products\" "
				+ "WHERE CONTAINS(\"ProductId\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'009'), "products"));
		}

		rs.close();
		pstmt.close();

		// Product - Product Name
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"Product_Name\") FROM \"<PACKAGE_NAME>.models::AT_PRODUCT\" "
				+ "WHERE CONTAINS(\"Product_Name\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'010'), "products"));
		}

		rs.close();
		pstmt.close();

		// Product - Product Desc
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"Product_Description\") FROM \"<PACKAGE_NAME>.models::AT_PRODUCT\" "
				+ "WHERE CONTAINS(\"Product_Description\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'011'), "products"));
		}

		// PO - PO ID
		query = "SELECT TOP 50 DISTINCT TO_NVARCHAR(\"PurchaseOrderId\") FROM \"<PACKAGE_NAME>.data::purchaseOrder\" "
				+ "WHERE CONTAINS(\"PurchaseOrderId\",?)";
		pstmt = conn.prepareStatement(query);
		pstmt.setString(1, terms);
		rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createFilterEntry(rs, MESSAGES.getMessage('SEPM_POWRK',
					'012'), "purchaseOrder"));
		}

		rs.close();
		pstmt.close();
		conn.close();
		
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	body = JSON.stringify(list);
	$.trace.debug(body);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.headers.set('access-control-allow-origin', '*');
	$.response.status = $.net.http.OK;
}

function getTotalOrders() {
	function createTotalEntry(rs) {
		return {
			"name" : rs.getNString(1),
			"value" : rs.getDecimal(2)
		};
	}

	var body = '';
	var ivGroupBy = $.request.parameters.get('groupby');
	var ivCurrency = $.request.parameters.get('currency');
	var list = [];

	switch (ivGroupBy) {
	case "PartnerCompanyName":
		break;
	case "ProductCategory":
		break;
	case "PartnerCity":
		break;
	case "PartnerPostalCode":
		break;
	case "ProductId":
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '000', ivGroupBy));
		return;
	}
	if (ivCurrency === null) {
		ivCurrency = "USD";
	}
	
	ivCurrency = ivCurrency.substring(0, 3);

	try {
		var query = 'SELECT top 5 "'
				+ ivGroupBy
				+ '", SUM("ConvGrossAmount") FROM "<PACKAGE_NAME>.models::AN_PURCHASE_COMMON_CURRENCY" (\'PLACEHOLDER\' = (\'$$IP_O_TARGET_CURRENCY$$\', \''
				+ ivCurrency + '\')) group by "' + ivGroupBy
				+ '" order by sum("ConvGrossAmount") desc';
		$.trace.debug(query);
		var conn = $.db.getConnection();
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();

		while (rs.next()) {
			list.push(createTotalEntry(rs));
		}

		rs.close();
		pstmt.close();
		
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	body = JSON.stringify({
		"entries" : list
	});

	$.response.contentType = 'application/json; charset=UTF-8';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function downloadExcel() {
	var body = '';

	try {
		var query = 'SELECT TOP 25000 \"PurchaseOrderId\", \"PartnerId\", \"CompanyName\", \"CreatedByLoginName\", \"CreatedAt\", \"GrossAmount\" '
				+ 'FROM \"_SYS_BIC\".\"<PACKAGE_NAME>.data::purchaseOrderHeaderExt\" order by \"PurchaseOrderId\"';

		var conn = $.db.getConnection();
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();

		body = MESSAGES.getMessage('SEPM_POWRK', '002') + "\t" + // Purchase
																	// Order ID
		MESSAGES.getMessage('SEPM_POWRK', '003') + "\t" + // Partner ID
		MESSAGES.getMessage('SEPM_POWRK', '001') + "\t" + // Company Name
		MESSAGES.getMessage('SEPM_POWRK', '004') + "\t" + // Employee
															// Responsible
		MESSAGES.getMessage('SEPM_POWRK', '005') + "\t" + // Created At
		MESSAGES.getMessage('SEPM_POWRK', '006') + "\n"; // Gross Amount

		while (rs.next()) {
			body += rs.getNString(1) + "\t" + rs.getNString(2) + "\t"
					+ rs.getNString(3) + "\t" + rs.getNString(4) + "\t"
					+ rs.getDate(5) + "\t" + rs.getDecimal(6) + "\n";
		}
		
		rs.close();
		pstmt.close();
		
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	$.response.setBody(body);
	$.response.contentType = 'application/vnd.ms-excel; charset=utf-16le';
	$.response.headers.set('Content-Disposition',
			'attachment; filename=Excel.xls');
	$.response.headers.set('access-control-allow-origin', '*');
	$.response.status = $.net.http.OK;

}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
case "filter":
	getFilter();
	break;
case "getTotalOrders":
	getTotalOrders();
	break;
case "Excel":
	downloadExcel();
	break;
case "getSessionInfo":
	SESSIONINFO.fillSessionInfo();
	break;
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}