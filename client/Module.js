Ext.define( 'extAdmin.Module',
{
	requires : [
		'extAdmin.ActionManager'
	],

	/**
	 * @protected
	 * @config {Object} config
	 */
	config : null,

	/**
	 * @protected
	 * @config {Object} name
	 */
	name : null,

	/**
	 * @protected
	 * @config {extAdmin.Environment}
	 */
	env : null,

	/**
	 * @protected
	 * @property {Object} actions
	 */
	actions : null,

	/**
	 * @protected
	 * @property {Boolean} isInitialized
	 */
	isInitialized : false,

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {String} serverHandle
	 * @param {String} name
	 * @param {Object} config
	 */
	constructor : function( config )
	{
		var me = this;

		me.config = config.config;
		me.name   = config.name;
		me.env    = config.env;
	},

	/**
	 * Initializes module
	 *
	 * @public
	 */
	init : function( config )
	{
		var me = this;

		// module is already initialized
		if( me.isInitialized === true ) {
			return;
		}

		me.isInitialized = true;
	},

	/**
	 * Returns module name
	 *
	 * @return {String}
	 */
	getName : function()
	{
		return this.name;
	},

	/**
	 * Returns application environment
	 *
	 * @return {extAdmin.Environment}
	 */
	getEnvironment : function()
	{
		return this.env;
	},

	/**
	 * Returns module view configuration
	 *
	 * @returns {Object}
	 */
	getViewConfig : function()
	{
		return this.config['view'];
	},

	/**
	 * Returns names of actions available for this module
	 *
	 * @return {String[]}
	 */
	getActionNames : function()
	{
		return Ext.Object.getKeys( this.config.actions );
	},

	/**
	 * Creates module view component
	 *
	 * @param  {Object} config
	 * @return {Ext.Component}
	 */
	createView : function( config )
	{
		var me = this;

		config = config || {};

		Ext.applyIf( config, {
			env        : me.env,
			module     : me,
			viewConfig : Ext.clone( me.config.view )
		});

		var type = config.viewConfig.type;
		delete config.viewConfig.type;

		return Ext.create( type, config );
	},

	/**
	 * Creates actions defined for the module
	 *
	 * @param {String[]} actions
	 * @param {Object} config
	 * @return {Object}
	 */
	factoryActions : function( actionNames, config )
	{
		var me         = this,
		    actionsDef = me.config.actions;

		Ext.Object.each( config, function( name, category ) {
			if( Ext.isDefined( category.module ) === false ) {
				category.module = me;
			}
		});

		var actions = {};
		Ext.Array.forEach( actionNames, function( name ) {
			if( actionsDef.hasOwnProperty( name ) === false ) {
				return;
			}

			actions[ name ] = actionsDef[ name ];
		});

		return extAdmin.ActionManager.factoryActions( actions, config );
	},

	/**
	 * Returns action request URL
	 *
	 * @param {String} [action] Action name
	 * @param {Object} [urlParams=null] Additional request parameters
	 * @returns {String}
	 */
	getActionUrl : function( action, urlParams )
	{
		return this.env.getActionUrl( this, action, urlParams );
	},

	/**
	 * Creates data store
	 *
	 * @param {Object} config
	 * @return {Ext.data.AbstractStore}
	 */
	createStore : function( config )
	{
		var me = this;

		if( config.loadAction ) {
			config.loadAction = me.normalizeActionPtr( config.loadAction );
		}

		if( config.saveAction ) {
			config.saveAction = me.normalizeActionPtr( config.saveAction );
		}

		return me.env.createStore( config );
	},

	/**
	 * Runs the server action
	 *
	 * @async
	 * @param {Array} action Action pointer
	 * @param {Object} config Request configuration
	 */
	runAction : function( action, config )
	{
		var me = this;

		action = me.normalizeActionPtr( action );

		me.env.request.runAction( action, config );
	},

	/**
	 * Runs the server action without processing results
	 *
	 * @async
	 * @param {Array} action Action pointer
	 * @param {Object} config Request configuration
	 */
	runRawAction : function( action, config )
	{
		var me = this;

		action = me.normalizeActionPtr( action );

		me.env.request.runRawAction( action, config );
	},

	/**
	 * Normalizes action pointer config to absolute [module, action, params] form
	 *
	 * @param  {Array/String} name Action specification
	 * @param  {String} defaultAction Fallback action name
	 * @return {Array}  Normalized action pointer
	 */
	normalizeActionPtr : function( action, defaultAction )
	{
		var me = this;

		action = me.env.normalizeActionPtr( action, me.name, defaultAction );

		if( action[0] !== me.name ) {
			Ext.Error.raise({
				msg : 'Action module doesn\'t match this module',
				action : action,
				'this' : me.name
			});
		}

		return action;
	},














	/**
	 * Returns given action
	 *
	 * @param   {String} name
	 * @returns {extAdmin.AbstractAction}
	 */
	getAction : function( name )
	{
		return this.actions[ name ];
	},















	/**
	 * Returns module actions
	 *
	 * @returns {Object}
	 */
	getActions : function()
	{
		return this.actions;
	}
});