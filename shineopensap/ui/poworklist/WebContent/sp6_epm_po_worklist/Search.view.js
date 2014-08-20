sap.ui.jsview("sp6_epm_po_worklist.Search", {

	getControllerName : function() {
		return "sp6_epm_po_worklist.Search";
	},

	createContent : function(oController) {

		  //Filter By Panel
	      var searchPanel = new sap.ui.commons.Panel().setText(oBundle.getText("filter"));
	      var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	      searchPanel.addContent(layoutNew);


	      //Filter By Search Field
	      var oSearch = new sap.ui.commons.SearchField("filterBy", {
	        //enableListSuggest: true,
	        maxHistoryItems: 0,
	        enableFilterMode: true,
	        startSuggestion: 1,
	        maxSuggestionItems: 50,
	        enableClear: true,
	        width: "400px",
	        search: function(oEvent){
	        	oController.setFilter(oEvent.getParameter("query"),"COMPANY"); },
	        suggest: oController.loadFilter });

 
	      //Layout Placement for Filter By Panel Content
	      layoutNew.createRow(new sap.ui.commons.Label({text: oBundle.getText("s_search")}), oSearch );

	      
		return searchPanel;
	}
});