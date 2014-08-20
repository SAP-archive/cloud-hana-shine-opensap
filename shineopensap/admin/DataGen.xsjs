$.import("<PACKAGE_NAME>.services", "messages");
var MESSAGES = $.<PACKAGE_NAME>.services.messages;
$.import("<PACKAGE_NAME>.services", "session");
var SESSIONINFO = $.<PACKAGE_NAME>.services.session;


function reloadSeed() {
	try {
		var object = $.request.parameters.get('object');
		var body = '';

		switch (object) {
		case "purchaseOrder":
			break;
		case "purchaseOrderItem":
			break;
		case "salesOrder":
			break;
		case "salesOrderItem":
			break;
		case "addresses":
			break;
		case "businessPartner":
			break;
		case "constants":
			break;
		case "employees":
			break;
		case "messages":
			break;
		case "products":
			break;
		case "texts":
			break;
		default:
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody("Invalid seed object: " + object);
			return;
		}
		// open db connection needed for repository sessions
		var conn = $.db.getConnection(8);

		// Truncate the existing table
		var query = "TRUNCATE TABLE \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\"";
		var pstmt = conn.prepareStatement(query);
		pstmt.execute();
		pstmt.close();
		conn.commit();
		body = body
				+ "Truncated: \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\" \n";

		// Reload seed data by activating the CSV
		// create object id (object to write to)
		var objectId = $.repo.createObjectId("",
				"<PACKAGE_NAME>.data", object, "csv");
		// create inactive session
		var inactiveSession = $.repo.createInactiveSession(conn, "TempReseed");
		// activate the object
		var activateResult = $.repo.activateObjects(inactiveSession,
				[ objectId ], $.repo.ACTIVATION_CASCADE_TWO_PHASES);
		// commit the changes
		
		conn.commit();
		body = body
				+ "Reseeded: \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\" \n";

		$.response.status = $.net.http.OK;
		$.response.setBody(body);

		// close db connection
		conn.close();

	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

function resetSequence() {
	try {
		var object = $.request.parameters.get('object');
		var body = '';

		switch (object) {
		case "addressId":
			break;
		case "employeeId":
			break;
		case "partnerId":
			break;
		case "purchaseOrderId":
			break;
		case "salesOrderId":
			break;
		case "textId":
			break;
		default:
			$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
			$.response.setBody("Invalid sequence object: " + object);
			return;
		}
		// open db connection needed for repository sessions
		var conn = $.db.getConnection(8);

		// Truncate the existing table
		var query = "DROP SEQUENCE \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\"";
		
		var pstmt = conn.prepareStatement(query);
		pstmt.execute();
		pstmt.close();
		conn.commit();
		body = body
				+ "Dropped: \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\" \n";

		// Reload seed data by activating the CSV
		// create object id (object to write to)
		var objectId = $.repo.createObjectId("",
				"<PACKAGE_NAME>.data", object, "hdbsequence");
		// create inactive session
		var inactiveSession = $.repo.createInactiveSession(conn,
				"TempResequence");
		// activate the object
		var activateResult = $.repo.activateObjects(inactiveSession,
				[ objectId ], $.repo.ACTIVATION_CASCADE_TWO_PHASES);
		// commit the changes
		conn.commit();
		body = body
				+ "Sequence reset: \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ object + "\" \n";

		$.response.status = $.net.http.OK;
		$.response.setBody(body);

		// close db connection
		conn.close();

	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

function replicatePurchaseOrders() {
	var body = '';
	var maxPoId = '';

	try {
		var conn = $.db.getConnection();

		var query = "SELECT MAX(\"PurchaseOrderId\") FROM \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::purchaseOrder\"";
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		while (rs.next()) {
			maxPoId = rs.getNString(1);
		}
		rs.close();
		pstmt.close();

		if (maxPoId === '0300000999') {
			maxPoId = '1300000000';
		} // Only The Seed Exists
		else {
			maxPoId = parseInt(maxPoId, 10) + 1;
		}

		query = "INSERT INTO \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::purchaseOrder\" "
				+ "(\"PurchaseOrderId\", \"CreatedBy\", \"CreatedAt\", \"ChangedBy\", \"ChangedAt\", \"NoteId\", \"PartnerId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"LifecycleStatus\", \"ApprovalStatus\", \"ConfirmStatus\", \"OrderingStatus\", \"InvoicingStatus\" ) "
				+ "select to_int(\"PurchaseOrderId\" + "
				+ maxPoId
				+ " - 300000000 ), \"CreatedBy\", \"CreatedAt\", \"ChangedBy\", \"ChangedAt\", \"NoteId\", \"PartnerId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"LifecycleStatus\", \"ApprovalStatus\", \"ConfirmStatus\", \"OrderingStatus\", \"InvoicingStatus\" "
				+ "  from \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::purchaseOrder\" WHERE \"PurchaseOrderId\" <= '0300000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumPo = pstmt.executeUpdate();
		pstmt.close();
		body = body
				+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumPo,
						'purchaseOrder') + "\n";

		query = "INSERT INTO \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::purchaseOrderItem\" "
				+ "(\"PurchaseOrderId\", \"PurchaseOrderItem\", \"ProductId\", \"NoteId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"Quantity\", \"QuantityUnit\", \"DeliveryDate\") "
				+ "select to_int(\"PurchaseOrderId\" + "
				+ maxPoId
				+ " - 300000000 ), \"PurchaseOrderItem\", \"ProductId\", \"NoteId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"Quantity\", \"QuantityUnit\", \"DeliveryDate\" "
				+ "  from \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::purchaseOrderItem\" WHERE \"PurchaseOrderId\" <= '0300000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumItem = pstmt.executeUpdate();
		pstmt.close();
		body = body
				+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumItem,
						'purchaseOrderItem') + "\n";

		conn.commit();
		conn.close();
		$.response.status = $.net.http.OK;
		$.response.setBody(body);
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}

function replicateSalesOrders() {
	var body = '';
	var maxSoId = '';

	try {
		var conn = $.db.getConnection();

		var query = "SELECT MAX(\"SalesOrderId\") FROM \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::salesOrder\"";
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
		while (rs.next()) {
			maxSoId = rs.getNString(1);
		}  
		rs.close();
		pstmt.close();

		if (maxSoId === '0500000999') {
			maxSoId = '1500000000';
		} // Only The Seed Exists
		else {
			maxSoId = parseInt(maxSoId, 10) + 1;
		}

		query = "INSERT INTO \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::salesOrder\" "
				+ "(\"SalesOrderId\", \"CreatedBy\", \"CreatedAt\", \"ChangedBy\", \"ChangedAt\", \"NoteId\", \"PartnerId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"LifecycleStatus\", \"BillingStatus\", \"DeliveryStatus\" ) "
				+ "select to_int(\"SalesOrderId\" + "
				+ maxSoId
				+ " - 500000000 ), \"CreatedBy\", \"CreatedAt\", \"ChangedBy\", \"ChangedAt\", \"NoteId\", \"PartnerId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"LifecycleStatus\", \"BillingStatus\", \"DeliveryStatus\" "
				+ "  from \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::salesOrder\" WHERE \"SalesOrderId\" <= '0500000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumSo = pstmt.executeUpdate();
		pstmt.close();
		body = body
				+ MESSAGES
						.getMessage('SEPM_ADMIN', '001', iNumSo, 'salesOrder')
				+ "\n";

		query = "INSERT INTO \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::salesOrderItem\" "
				+ "(\"SalesOrderId\", \"SalesOrderItem\", \"ProductId\", \"NoteId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"ItemATPStatus\", \"OPItemPos\", \"Quantity\", \"QuantityUnit\", \"DeliveryDate\") "
				+ "select to_int(\"SalesOrderId\" + "
				+ maxSoId
				+ " - 500000000 ), \"SalesOrderItem\", \"ProductId\", \"NoteId\", \"Currency\", \"GrossAmount\", \"NetAmount\", \"TaxAmount\", \"ItemATPStatus\", \"OPItemPos\", \"Quantity\", \"QuantityUnit\", \"DeliveryDate\" "
				+ "  from \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::salesOrderItem\" WHERE \"SalesOrderId\" <= '0500000999' ";
		pstmt = conn.prepareStatement(query);
		var iNumItem = pstmt.executeUpdate();
		pstmt.close();
		body = body
				+ MESSAGES.getMessage('SEPM_ADMIN', '001', iNumItem,
						'salesOrderItem') + "\n";

		conn.commit();
		conn.close();
		$.response.status = $.net.http.OK;
		$.response.setBody(body);
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
	}
}


function getTableSize() {

	function createTotalEntry(rs, table, rs2) {
		
		var record_count =  rs.getInteger(1); 
		var table_size = Math.round(rs2.getInteger(1) / 1024);
		
	
		return {
			"name" : table,
			"table_size" : table_size,
			"record_count" : record_count			
		};

	}
	
	
	var i = 0;
	var body = '';
	var list = [];

	var tableArray = [ "addresses", "businessPartner", "constants",
			"employees", "messages", "products", "purchaseOrder",
			"purchaseOrderItem", "salesOrder", "salesOrderItem", "texts" ];
	
	for (i = 0; i < tableArray.length; i++) {
		var query = 'SELECT COUNT(*) FROM \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::'
				+ tableArray[i] + '\"';
		var conn = $.db.getConnection();
		var pstmt = conn.prepareStatement(query);
		var rs = pstmt.executeQuery();
	
	
		var query2 = 'SELECT "TABLE_SIZE" FROM \"SYS\".\"M_TABLES\" WHERE \"SCHEMA_NAME\" = \'<SCHEMA_NAME>\' AND \"TABLE_NAME\" = \'<PACKAGE_NAME>.data::'
				+ tableArray[i] + '\'';
		var pstmt2 = conn.prepareStatement(query2);
		var rs2 = pstmt2.executeQuery();

		while (rs.next()) {
			rs2.next();
			list.push(createTotalEntry(rs, tableArray[i], rs2));
		}

		rs.close();
		rs2.close();
		pstmt.close();
		pstmt2.close();
	}

	body = JSON.stringify({
		"entries" : list
	});

	$.response.contentType = 'application/json; charset=UTF-8';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}
function generateSynonym() {

	// open db connection
	var conn = $.db.getConnection();
	var i = 0;
	var body = '';
	var query = '';
	var pstmt;

	var tableArray = [ "T006", "T006A", "TCURC", "TCURF", "TCURN", "TCURR",
			"TCURT", "TCURV", "TCURW", "TCURX" ];
	for (i = 0; i < tableArray.length; i++) {
		try {
			query = "DROP SYNONYM \"<SCHEMA_NAME>\".\"" + tableArray[i]
					+ "\" ";
			pstmt = conn.prepareStatement(query);
			pstmt.execute();
			pstmt.close();
		} catch (e) {
		}
	}

	for (i = 0; i < tableArray.length; i++) {
		query = "CREATE SYNONYM \"<SCHEMA_NAME>\".\""
				+ tableArray[i]
				+ "\" FOR \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ tableArray[i] + "\"";
		pstmt = conn.prepareStatement(query);
		pstmt.execute();
		pstmt.close();
		body = body
				+ "Created Synonym: \"<SCHEMA_NAME>\".\""
				+ tableArray[i]
				+ " FOR \"<SCHEMA_NAME>\".\"<PACKAGE_NAME>.data::"
				+ tableArray[i] + "\" \n";
	}

	conn.commit();

	$.response.status = $.net.http.OK;
	$.response.setBody(body);

	// close db connection
	conn.close();

}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
case "reseed":
	reloadSeed();
	break;
case "resetSequence":
	resetSequence();
	break;
case "replicatePO":
	replicatePurchaseOrders();
	break;
case "replicateSO":
	replicateSalesOrders();
	break;
case "getSize":
	getTableSize();
	break;
case "synonym":
	generateSynonym();
	break;
case "getSessionInfo":
	SESSIONINFO.fillSessionInfo();
	break;	
default:
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	$.response.setBody(MESSAGES.getMessage('SEPM_ADMIN', '002', aCmd));
}