"use strict";

{
	const SDK = self.SDK;

	const PLUGIN_CLASS = SDK.Plugins.IDNet;

	PLUGIN_CLASS.Type = class IDNetType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}
