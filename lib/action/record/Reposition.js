Ext.define( 'extAdmin.action.record.Reposition',
{
	extend : 'extAdmin.action.record.AbstractAction',
	
	requires : [
		'Ext.window.MessageBox'
	],
	
	texts : {
		title         : 'Smazat',
		popTitle      : 'Potvrzení smazání',
		popContent    : 'Opravdu chete smazat následující?',
		progressTitle : 'Probíhá mazání'
	},
	
	multiRow : true,
	dataDep  : true,
	iconCls  : 'i-delete',
	
	params : {
		action      : 'remove',
		idName      : 'recordID',
		recordTitle : 'title'
	},
	
	handler : function( records )
	{
		var me = this;
		
		// do nothing when no records were supplied
		if( !records.length ) {
			return;
		}
		
		// build confirmation popup content
		var content = me.texts.popContent + '<br /><ul>';
		for( var i = 0, rl = records.length; i < rl; ++i ) {
			content += '<li>' + records[ i ].data[ me.params.recordTitle ] +'</li>';
		}
		content += '</ul>';
		
		// show confirmation popup
		Ext.MessageBox.confirm( me.texts.popTitle, content, function( reply ) {
			if( reply != 'yes' ) {
				return;
			}
			
			// create progress popup
			var progressPopup = Ext.MessageBox.progress( me.texts.progressTitle );
			
			// pick IDs of records
		    var IDs = [];
			for( var i = 0, rl = records.length; i < rl; ++i ) {
				var id = records[ i ].internalId;
				
				if( id ) {
					IDs.push( id );
				}
			}
			
			// send request
			var reqData = {};
	        reqData[ me.params.idName ] = IDs;
			
	        me.module.makeRequest({
				params : {
					action : me.params.action
				},
				data : reqData,
				
				complete : function( options, success, response ) {
					// remove progress on response
					progressPopup.close();
					
					// refresh dataList
					// FIXME implement more abstract way (do not call getStore().load() directly)
					me.dataBrowser.getDataList().getStore().load();
				}
			});
		} );
	}
});