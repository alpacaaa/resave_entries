Symphony.Language.add({
	'Looks like the request cannot be completed. Lowering entries per page might be a good idea :)': false,
	'Processing...': false, 'Done': false,
	'Processing {$page} of {$total}': false
});

jQuery(function($){

	var fieldset = $('.resave-entries');
	if (!fieldset.length) return;
	
	var _ = Symphony.Language.get;

	fieldset.find('button').click(function(e){
		e.preventDefault();

		var rate = fieldset.find('input').val(),
			section = fieldset.find('select').val(),
			page = 1, total = 0;

		rate = parseInt(rate);
		if (isNaN(rate)) return; // -.-
		
		var logger = $('<span />').text(_('Processing...'));
		fieldset.find('button').replaceWith(logger);
		
		var doAjax = function(){
			var data = {resave: {rate: rate, section: section, page: page, total: total}, 'action[resave]': 'doIt!'};

			$.get(window.location.href, data, function(res){
				if (res == '')
				{
					return logger.text(_(
						'Looks like the request cannot be completed. Lowering entries per page might be a good idea :)'
					));
				}
				
				if (res.status == 'success')
					return logger.text(_('Done') + '!');

				total = parseInt(res.total);
				logger.text(_('Processing {$page} of {$total}', {page: page, total: total}));
				page++;

				if (res.status == 'processing')
					doAjax();
			});
		};
		
		doAjax();
	});
});
