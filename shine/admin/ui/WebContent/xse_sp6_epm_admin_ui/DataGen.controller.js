sap.ui.controller("xse_sp6_epm_admin_ui.DataGen", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
*/
//   onInit: function() {
//
//   },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
*/
//   onBeforeRendering: function() {
//
//   },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
*/
//   onAfterRendering: function() {
//
//   },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
*/
//   onExit: function() {
//
//   }
	
	getTableSizes: function(oController){
		var aUrl = '../../DataGen.xsjs?cmd=getSize';
		 
	    jQuery.ajax({
	       url: aUrl,
	       method: 'GET',
	       dataType: 'json',
	       success: onLoadSizes,
	       error: onErrorCall });
	},
	
	execute: function(oEvent,oController){
		 sap.ui.getCore().byId('txtLog').setValue("");
		 phase1 = 0; phase2 = 0; phase3 = 0; phase4 = 0; poLoops = 0; soLoops = 0;
		 sap.ui.getCore().byId('Phase').setText("");
		 sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
		 sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
		 sap.ui.commons.MessageBox.confirm(oBundle.getText("confirm_delete"),
				 function(bResult){oController.executeConfirm(bResult,oController); },
				 oBundle.getText("title_delete"));		
	},
	
	executeConfirm: function(bResult,oController){
		 if(bResult){ 
			//oEvent.oSource.setEnabled(false); 
			if(sap.ui.getCore().byId("cb1").getChecked()){
				sap.ui.core.BusyIndicator.show();
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb1"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				var aUrl = '../../DataGen.xsjs?cmd=reseed&object=';
				var tableArray = ["addresses","businessPartner","constants","employees","messages","products","texts"];
				for (var i = 0; i < tableArray.length; i++){
				    jQuery.ajax({
					       url: aUrl+tableArray[i],
					       method: 'GET',
					       dataType: 'text',
					       success: function(myTxt){
					          	  oController.onReseedComplete(myTxt,oController,tableArray[i]); },
					       error: onErrorCall,
					       async: true });
				}
			}
			else if(sap.ui.getCore().byId("cb2").getChecked()){
				sap.ui.core.BusyIndicator.show();
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb2"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");				
				var aUrl = '../../DataGen.xsjs?cmd=reseed&object=';
				var tableArray = ["purchaseOrder","purchaseOrderItem","salesOrder","salesOrderItem"];
				for (var i = 0; i < tableArray.length; i++){
				    jQuery.ajax({
					       url: aUrl+tableArray[i],
					       method: 'GET',
					       dataType: 'text',
					       success: function(myTxt){
					          	  oController.onReseedComplete2(myTxt,oController,tableArray[i]); },
					       error: onErrorCall,
					       async: true });
				}				
			}
			else if(sap.ui.getCore().byId("cb2a").getChecked()){
				sap.ui.core.BusyIndicator.show();
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb2a"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");				
				var aUrl = '../../DataGen.xsjs?cmd=synonym';
				    jQuery.ajax({
					       url: aUrl,
					       method: 'GET',
					       dataType: 'text',
					       success: function(myTxt){
					          	  oController.onSynonymComplete(myTxt,oController); },
					       error: onErrorCall,
					       async: true });
			}			
			else if(sap.ui.getCore().byId("cb3").getChecked()){
				sap.ui.core.BusyIndicator.show();
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb3"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");					
				var aUrl = '../../DataGen.xsjs?cmd=resetSequence&object=';
				var tableArray = ["addressId","employeeId","partnerId","purchaseOrderId","salesOrderId","textId"];
				for (var i = 0; i < tableArray.length; i++){
				    jQuery.ajax({
					       url: aUrl+tableArray[i],
					       method: 'GET',
					       dataType: 'text',
					       success: function(myTxt){
					          	  oController.onResequenceComplete(myTxt,oController,tableArray[i]); },
					       error: onErrorCall,
					       async: true });
				}					
			}
			else if(sap.ui.getCore().byId("cb4").getChecked()){
				sap.ui.core.BusyIndicator.show();
				sap.ui.getCore().byId('Phase').setText(oBundle.getText("cb4"));
				sap.ui.getCore().byId('ProgInd1').setPercentValue(0);
				sap.ui.getCore().byId('ProgInd1').setDisplayValue("");
				oController.triggerReplicatePO(oController);
				oController.triggerReplicateSO(oController);			    
				
			}			
			
		 }
	 },
	
	updateReplicateProgress: function(){
		var totalPO = parseInt(sap.ui.getCore().byId('POVal').getValue(),10);
		var totalSO = parseInt(sap.ui.getCore().byId('SOVal').getValue(),10);
		sap.ui.getCore().byId('ProgInd1').setPercentValue( Math.round( (poLoops + soLoops) / (totalPO + totalSO) * 100 ) );
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("generatedPG", [numericSimpleFormatter((poLoops + soLoops)* 1000),numericSimpleFormatter((totalPO + totalSO)*1000)]) );

	},
	triggerReplicatePO: function(oController){
		poLoops++;	
		oController.updateReplicateProgress();
		var aUrl = '../../DataGen.xsjs?cmd=replicatePO&dummy=' + oController.getUniqueTime().toString();					
	    jQuery.ajax({
		       url: aUrl,
		       method: 'GET',
		       dataType: 'text',
		       success: function(myTxt){
		          	  oController.onPOComplete(myTxt,oController); },
		       error: onErrorCall,
		       async: true });		
	}, 
	triggerReplicateSO: function(oController){
		soLoops++;
		oController.updateReplicateProgress();
		var aUrl = '../../DataGen.xsjs?cmd=replicateSO&dummy=' + oController.getUniqueTime().toString();					
	    jQuery.ajax({
		       url: aUrl,
		       method: 'GET',
		       dataType: 'text',
		       success: function(myTxt){
		          	  oController.onSOComplete(myTxt,oController); },
		       error: onErrorCall,
		       async: true });			
	},	
	
	toggleGenerate: function(oEvent,oController){
		if(oEvent.oSource.getChecked()){
			sap.ui.getCore().byId("lblPOVal").setVisible(true);
			sap.ui.getCore().byId("POVal").setVisible(true);
			sap.ui.getCore().byId("times1").setVisible(true);
			sap.ui.getCore().byId("lblSOVal").setVisible(true);
			sap.ui.getCore().byId("SOVal").setVisible(true);
			sap.ui.getCore().byId("times2").setVisible(true);			
		}else{
			sap.ui.getCore().byId("lblPOVal").setVisible(false);
			sap.ui.getCore().byId("POVal").setVisible(false);
			sap.ui.getCore().byId("times1").setVisible(false);
			sap.ui.getCore().byId("lblSOVal").setVisible(false);
			sap.ui.getCore().byId("SOVal").setVisible(false);
			sap.ui.getCore().byId("times2").setVisible(false);			
		};
	},
	
	onReseedComplete: function(myTxt,oController,oObject){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		phase1++;
		sap.ui.getCore().byId('ProgInd1').setPercentValue( Math.round( phase1 / 7 * 100 ) );
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("reloadedPG", [phase1.toString(),7]) );

		if(phase1===7){
			sap.ui.getCore().byId("cb1").setChecked(false);
			sap.ui.core.BusyIndicator.hide();
			oController.getTableSizes();
			oController.executeConfirm(true,oController);
		}     
	},
	
	onReseedComplete2: function(myTxt,oController,oObject){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		phase2++;
		sap.ui.getCore().byId('ProgInd1').setPercentValue( Math.round( phase2 / 4 * 100 ) );
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("reloadedPG", [phase2.toString(),4]) );
		oController.getTableSizes();
		
		if(phase2===4){
			sap.ui.getCore().byId("cb2").setChecked(false);
			sap.ui.core.BusyIndicator.hide();

			oController.executeConfirm(true,oController);
		}     
	},

	onSynonymComplete: function(myTxt,oController){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		sap.ui.getCore().byId('ProgInd1').setPercentValue( 100 );
		sap.ui.getCore().byId('ProgInd1').setDisplayValue( '100%' );
			sap.ui.getCore().byId("cb2a").setChecked(false);
			sap.ui.core.BusyIndicator.hide();
			oController.executeConfirm(true,oController);
		
	},
	onResequenceComplete: function(myTxt,oController,oObject){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		phase3++;
		sap.ui.getCore().byId('ProgInd1').setPercentValue( Math.round( phase3 / 6 * 100 ) );
		sap.ui.getCore().byId('ProgInd1').setDisplayValue(oBundle.getText("resequencePG", [phase3.toString(),6]) );
		if(phase3===6){
			sap.ui.getCore().byId("cb3").setChecked(false);
			sap.ui.core.BusyIndicator.hide();
			oController.executeConfirm(true,oController);
			oController.getTableSizes();
		}     
	},
	
	onPOComplete: function(myTxt,oController,i){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		if(poLoops>=parseInt(sap.ui.getCore().byId('POVal').getValue(),10)){
			if(soLoops>=parseInt(sap.ui.getCore().byId('SOVal').getValue(),10)){
			sap.ui.getCore().byId("cb4").setChecked(false);
	   		sap.ui.getCore().byId("lblPOVal").setVisible(false);
			sap.ui.getCore().byId("POVal").setVisible(false);
			sap.ui.getCore().byId("times1").setVisible(false);
			sap.ui.getCore().byId("lblSOVal").setVisible(false);
			sap.ui.getCore().byId("SOVal").setVisible(false);
			sap.ui.getCore().byId("times2").setVisible(false);	
						
			sap.ui.core.BusyIndicator.hide();
			oController.getTableSizes();
			}			
		}    
		else{
			oController.triggerReplicatePO(oController);
		}
	},	
	onSOComplete: function(myTxt,oController,i){
		sap.ui.getCore().byId('txtLog').setValue(myTxt+sap.ui.getCore().byId('txtLog').getValue());
		oController.getTableSizes();
		if(soLoops>=parseInt(sap.ui.getCore().byId('SOVal').getValue(),10)){
			if(poLoops>=parseInt(sap.ui.getCore().byId('POVal').getValue(),10)){
			sap.ui.getCore().byId("cb4").setChecked(false);
			sap.ui.getCore().byId("lblPOVal").setVisible(false);
			sap.ui.getCore().byId("POVal").setVisible(false);
			sap.ui.getCore().byId("times1").setVisible(false);
			sap.ui.getCore().byId("lblSOVal").setVisible(false);
			sap.ui.getCore().byId("SOVal").setVisible(false);
			sap.ui.getCore().byId("times2").setVisible(false);				
			sap.ui.core.BusyIndicator.hide();
			}			
		}    
		else{
			oController.triggerReplicateSO(oController);
		}    
	},	
	getUniqueTime: function(){
		var time = new Date().getTime();
		while(time == new Date().getTime());
		return new Date().getTime();
		
	}	
});

function onLoadSizes(myJSON){

    var data = [];
    for( var i = 0; i<myJSON.entries.length; i++)
    {
      data[i] = { label: myJSON.entries[i].name, table_size: myJSON.entries[i].table_size, record_count: myJSON.entries[i].record_count
    		  };
    }
    oBarModel.setData({modelData: data});
	     
}

function onErrorCall(jqXHR, textStatus, errorThrown){
	sap.ui.core.BusyIndicator.hide();		
	sap.ui.commons.MessageBox.show(jqXHR.responseText, 
			 "ERROR",
			 oBundle.getText("error_action") );		
	return;
	}

