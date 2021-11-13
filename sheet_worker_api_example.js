var MyApiWorkerExample = MyApiWorkerExample || (function() {
	let privates = {};
	const start = function () {
		// setHooks();
		log('hello world');
	};
	
 	return {
	    Start: start
	};
})();

on('ready',function() {
    'use strict';

	log('MyApiWorker::ready !!!!!');
    MyApiWorker.Start();
 	log('MyApiWorker::ready !!!!! END');
});