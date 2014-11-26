module.exports = {
	server: {
    	options: {
        	hostname: '*',
			keepalive: true,
			port: 8000,
			middleware: function (connect, options) {
				return [connect.static(options.base[0])];
			}
		}
    }
};