sap.ui.jsview("sp6_epm_po_worklist.Table", {

      getControllerName : function() {
         return "sp6_epm_po_worklist.Table";
      },

      createContent : function(oController) {
   	  
    	  
    	  var oModel = new sap.ui.model.odata.ODataModel("../../../services/poWorklist.xsodata/", false);
   	  
    	  var arrayHeaders = new Array();
          var oControl;
          oTable = new sap.ui.table.Table("poTable",{tableId: "tableID",
                   visibleRowCount: 6,
                   rowSelectionChange: oController.onRowSelect,
                   selectionMode: sap.ui.table.SelectionMode.Single,
                   selectionBehavior: sap.ui.table.SelectionBehavior.Row         
          });
          oTable.setTitle(oBundle.getText("po"));
             
         //Table Column Definitions
          oControl = new sap.ui.commons.TextField().bindProperty("value","PurchaseOrderId");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("spoid")}), template: oControl, sortProperty: "PurchaseOrderId", filterProperty: "PurchaseOrderId", filterOperator: sap.ui.model.FilterOperator.EQ, flexible: true, width: "125px" }));
     
          oControl = new sap.ui.commons.TextField().bindProperty("value","PurchaseOrderItem");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("item")}), template: oControl, sortProperty: "PurchaseOrderItem", filterProperty: "PurchaseOrderItem", width: "125px" }));
          
          oControl = new sap.ui.commons.TextField().bindProperty("value","ProductId");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("product")}), template: oControl, sortProperty: "ProductId", filterProperty: "ProductId", width: "125px" }));
          
          oControl = new sap.ui.commons.TextField().bindProperty("value","PartnerId");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("bpart")}), template: oControl, sortProperty: "PartnerId", filterProperty: "PartnerId", width: "125px" }));
     
          oControl = new sap.ui.commons.TextField().bindProperty("value","CompanyName");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("company")}), template: oControl, sortProperty: "CompanyName", filterProperty: "CompanyName", width: "125px" }));
         
          oControl = new sap.ui.commons.TextView().bindText("GrossAmount",numericFormatter);
          oControl.setTextAlign("End");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("gross")}), template: oControl, sortProperty: "GrossAmount", filterProperty: "GrossAmount", hAlign: sap.ui.commons.layout.HAlign.End, width: "125px"}));

          oControl = new sap.ui.commons.TextField().bindProperty("value","Currency");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("currency")}), template: oControl, sortProperty: "Currency", filterProperty: "Currency", width: "125px" }));
        
          oControl = new sap.ui.commons.TextField().bindProperty("value","LifecycleDesc");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("lifecycle")}), template: oControl, sortProperty: "LifecycleDesc", filterProperty: "LifecycleDesc", width: "125px" }));

          oControl = new sap.ui.commons.TextField().bindProperty("value","ApprovalDesc");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("approval")}), template: oControl, sortProperty: "ApprovalDesc", filterProperty: "ApprovalDesc", width: "125px" }));
          
          oControl = new sap.ui.commons.TextField().bindProperty("value","ConfirmationDesc");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("confirm")}), template: oControl, sortProperty: "ConfirmationDesc", filterProperty: "ConfirmationDesc", width: "125px" }));
          
          oControl = new sap.ui.commons.TextField().bindProperty("value","OrderingDesc");
          oTable.addColumn(new sap.ui.table.Column({label:new sap.ui.commons.Label({text: oBundle.getText("ordering")}), template: oControl, sortProperty: "OrderingDesc", filterProperty: "OrderingDesc", width: "125px" }));          
          
         oTable.setModel(oModel);
         var sort1 = new sap.ui.model.Sorter("PurchaseOrderId,PurchaseOrderItem");
    	 oTable.bindRows("/PO_WORKLIST",sort1);
    	 
    	 var iNumberOfRows = oTable.getBinding("rows").iLength;
    	 oTable.setTitle("Purchase Orders" + " (" + numericSimpleFormatter(iNumberOfRows) + ")" );
    	
    	//Work around a limitation in SAPUI5 where numeric values for string fields couldn't be sent in the filter as string
 	    var orig_createFilterParams = sap.ui.model.odata.ODataListBinding.prototype.createFilterParams;
	    sap.ui.model.odata.ODataListBinding.prototype.createFilterParams = function(aFilters) {
	        orig_createFilterParams.apply(this, arguments);
	        
	        if (aFilters) {
	          
            
	            // adapt or modify the internal sFilterParams
	        	if(aFilters[0]==null){ }
	        	else {
	        		this.sFilterParams = "$filter=((" + aFilters[0].sPath + " eq '" + aFilters[0].oValue1 + "'))"; }
	            
	          	        }
	    }
        
	    //Toolbar
	    var oToolbar1 = new sap.ui.commons.Toolbar("tb1");
		oToolbar1.setDesign(sap.ui.commons.ToolbarDesign.Standard);

		var oButton1 = new sap.ui.commons.Button("btnNew",{
			text : oBundle.getText("new"),
			tooltip : oBundle.getText("create"),
			press : function(oEvent){
          	  oController.onTBPress(oEvent,oController); } 
		});
		oToolbar1.addItem(oButton1);
	   
		var oButton1 = new sap.ui.commons.Button("btnEdit",{
			text : oBundle.getText("edit"),
			tooltip : oBundle.getText("t_edit"),
			press : function(oEvent){
	          	  oController.onTBPress(oEvent,oController); } 
		});
		oToolbar1.addItem(oButton1);
	
		var oButton1 = new sap.ui.commons.Button("btnDelete",{
			text : oBundle.getText("delete"),
			tooltip : oBundle.getText("t_delete"),
			press : function(oEvent){
	          	  oController.onTBPress(oEvent,oController); } 
		});
		oToolbar1.addItem(oButton1);

		var oMenuButton1 = new sap.ui.commons.MenuButton("btnMenu",{
			text : oBundle.getText("actions"),
			tooltip : oBundle.getText("t_actions"),
			itemSelected : function(oEvent){
	          	  oController.onMenuSelected(oEvent,oController); }	
		});
		var oMenu = new sap.ui.commons.Menu("menuTB");
		var oMenuItem;
		
		oMenuItem = new sap.ui.commons.MenuItem("itemAccept", {text: oBundle.getText("accept")});
		oMenu.addItem(oMenuItem);
	
		oMenuItem = new sap.ui.commons.MenuItem("itemReject", {text: oBundle.getText("reject")});
		oMenu.addItem(oMenuItem);
		
		oMenuButton1.setMenu(oMenu);
		oToolbar1.addItem(oMenuButton1);
		
		oToolbar1.addItem(new sap.ui.commons.ToolbarSeparator());
		
		var oButton1 = new sap.ui.commons.Button("btnExcel",{
			text : oBundle.getText("excel"),
			tooltip : oBundle.getText("t_excel"),
			press : function(oEvent){
	          	  oController.onTBPress(oEvent,oController); } 
		});
		oToolbar1.addItem(oButton1);		
  	  
		oTable.setToolbar(oToolbar1);
    	 return oTable;
      }
});


