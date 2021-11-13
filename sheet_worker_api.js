var MyApiWorker = MyApiWorker || (function() {
	let privates = {};
	const setTurnorder = function (turnorder) {
        Campaign().set('turnorder', JSON.stringify(turnorder));
    },
	getTurnorder = function () {
        return (Campaign().get('turnorder') === '') ? [] : Array.from(JSON.parse(Campaign().get('turnorder')));
    },
	sortTurnorder = function (order='DESC') {
        let turnorder = getTurnorder();

        turnorder.sort((a,b) => { 
            return (order === 'ASC') ? a.pr - b.pr : b.pr - a.pr;
        });

        setTurnorder(turnorder);
    },
	setHooks = function () {
		on('change:campaign:turnorder', (obj, prev) => { //(obj, prev) => {
			log('test turnorder');
			log('obj = ' + obj);
			log('prev = ' + prev);
			log('test turnorder END');
		});
	},
	start = function () {
		setHooks();
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