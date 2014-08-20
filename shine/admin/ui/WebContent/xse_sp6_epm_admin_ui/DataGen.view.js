sap.ui.jsview("xse_sp6_epm_admin_ui.DataGen", {

	
      getControllerName : function() {
         return "xse_sp6_epm_admin_ui.DataGen";
      },

      createContent : function(oController) {
    	 var oLayout = new sap.ui.commons.layout.MatrixLayout();
    	 buildSettingsPanel(oController,oLayout);
    	 buildLogPanel(oController,oLayout);
    	 buildDataVolumePanel(oController,oLayout);
  	       
  	     return oLayout;
      }

});

function buildSettingsPanel(oController,oLayout){
	var oSettingsPanel = new sap.ui.commons.Panel().setText(oBundle.getText("settings"));
    oLayout.createRow(oSettingsPanel);

    oLLayout = new sap.ui.commons.layout.MatrixLayout("mLayout1",{columns: 3} );
    var oCB1 = new sap.ui.commons.CheckBox("cb1",{
        text : oBundle.getText("cb1"),
        tooltip : oBundle.getText("cbt1"),
        checked : false });
    
    var oCB2 = new sap.ui.commons.CheckBox("cb2",{
        text : oBundle.getText("cb2"),
        tooltip : oBundle.getText("cbt2"),
        checked : false });
    
    var oCB2a = new sap.ui.commons.CheckBox("cb2a",{
        text : oBundle.getText("cb2a"),
        tooltip : oBundle.getText("cbt2a"),
        checked : false });
    
	oLLayout.createRow(oCB1,oCB2,oCB2a);
    var oCB3 = new sap.ui.commons.CheckBox("cb3",{
        text : oBundle.getText("cb3"),
        tooltip : oBundle.getText("cbt3"),
        checked : false });
    
    var oCB4 = new sap.ui.commons.CheckBox("cb4",{
        text : oBundle.getText("cb4"),
        tooltip : oBundle.getText("cbt4"),
        checked : false,
        change : function(oEvent){
        	  oController.toggleGenerate(oEvent,oController); }
    });    
	oLLayout.createRow(oCB3,oCB4);
	oSettingsPanel.addContent(oLLayout);
	
	var oLabel1 = new sap.ui.commons.Label("lblPOVal", {text:oBundle.getText("lblPO"), labelFor:oPOVal, visible: false});
	var oPOVal = new sap.ui.commons.TextField("POVal",{editable:true, visible: false, value: 1 });
    var oTimes1 = new sap.ui.commons.TextView("times1",{text: " * " + numericSimpleFormatter(1000), visible: false});
	
	var oLabel2 = new sap.ui.commons.Label("lblSOVal", {text:oBundle.getText("lblSO"), labelFor:oSOVal, visible: false});
	var oSOVal = new sap.ui.commons.TextField("SOVal",{editable:true, visible: false, value: 1 });
    var oTimes2 = new sap.ui.commons.TextView("times2",{text: " * " + numericSimpleFormatter(1000), visible: false});
	
    var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	oSettingsPanel.addContent(layoutNew);
	
    layoutNew.createRow(oLabel1, oPOVal, oTimes1 );
    layoutNew.createRow(oLabel2, oSOVal, oTimes2 );    
	
    var oButton1 = new sap.ui.commons.Button("btnExecute",{
        text : oBundle.getText("btnExecute"),
        press : function(oEvent){
      	  oController.execute(oEvent,oController); }
    });
    layoutNew.createRow(oButton1 );  
}

function buildLogPanel(oController,oLayout){
	 var oLogPanel = new sap.ui.commons.Panel().setText(oBundle.getText("log"));   
	 oLayout.createRow(oLogPanel);

	 var layoutNew = new sap.ui.commons.layout.MatrixLayout({width:"auto"});
	 oLogPanel.addContent(layoutNew);
	 
	 var oLabelPhase = new sap.ui.commons.Label("lblPhase", {text:oBundle.getText("lblPhase"), labelFor:oPhase});
	 var oPhase = new sap.ui.commons.TextView("Phase",{text: "", design: sap.ui.commons.TextViewDesign.H4});
	 layoutNew.createRow(oLabelPhase,oPhase);	
	 
	 var oProgress = new sap.ui.commons.ProgressIndicator("ProgInd1", {
	        width: "300px", 
	        percentValue: 0, 
	        displayValue: "" });
	 var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan: 2});
     oCell.addContent(oProgress);	 
	 layoutNew.createRow(oCell);
	 
	 otxtLog = new sap.ui.commons.TextArea('txtLog',{
		 	cols : 100,
			rows : 8,});	 
	 var oCell = new sap.ui.commons.layout.MatrixLayoutCell({colSpan: 2});
     oCell.addContent(otxtLog);	 
	 layoutNew.createRow(oCell);	 
}

function buildDataVolumePanel(oController,oLayout){
	var oDataVolumePanel = new sap.ui.commons.Panel().setText(oBundle.getText("datavolume")); 
	oLayout.createRow(oDataVolumePanel);
	
    data = [{ label : oBundle.getText("empty"), value: 1, size: 1}];
    oBarModel.setData({modelData: data});
    
 // A Dataset defines how the model data is mapped to the chart 
    var oDataset = new sap.viz.ui5.data.FlattenedDataset({
            // a Bar Chart requires exactly one dimension (x-axis) 
            dimensions : [ 
                    {
                            axis : 1, // must be one for the x-axis, 2 for y-axis
                            name : oBundle.getText("table"), 
                            value : "{label}"
                    } 
            ],

            // it can show multiple measures, each results in a new set of bars in a new color 
            measures : [ 
                // measure 1
                    {
                            name : oBundle.getText("size"), // 'name' is used as label in the Legend 
                            value : '{record_count}' // 'value' defines the binding for the displayed value   
                    },
                    {
                        name : oBundle.getText("size2"), // 'name' is used as label in the Legend 
                        value : '{table_size}' // 'value' defines the binding for the displayed value   
                    }
            ],
            
            // 'data' is used to bind the whole data collection that is to be displayed in the chart 
            data : {
                    path : "/modelData"
            }
            
    });
    
    
	     var oBarChart = new sap.viz.ui5.Column({
         width : "95%",
         height : "400px",
         plotArea : {
         //'colorPalette' : d3.scale.category20().range()
         },
         title : {
                 visible : true,
                 text : oBundle.getText("bartitle")
         },
         dataset : oDataset
 });

// attach the model to the chart and display it
 oBarChart.setModel(oBarModel);
 oDataVolumePanel.addContent(oBarChart);
 oController.getTableSizes(oController);
}
