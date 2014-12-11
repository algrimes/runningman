module.exports = {
	server: {
    	options: {
			keepalive: true,
			middleware: function (connect, options) {
				return [connect.static(options.base[0])];
			}
		}
    }
};