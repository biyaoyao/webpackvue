(function($) {
	$.fn.objectToForm = function(obj) {
		var obj = obj;
		var key, value, tagName, type, arr;
		for (x in obj) {
			key = x;
			value = obj[x];
			$(this).find("[name='" + key + "'],[name='" + key + "[]']").each(function() {
				tagName = $(this)[0].tagName;
				type = $(this).attr('type');
				if (tagName == 'INPUT') {
					if (type == 'radio') {
						$(this).attr('checked', $(this).val() == value);
					} else if (type == 'checkbox') {
						arr = value.split(',');
						for (var i = 0; i < arr.length; i++) {
							if ($(this).val() == arr[i]) {
								$(this).attr('checked', true);
								break;
							}
						}
					} else {
						$(this).val(value);
					}
				} else if (tagName == 'SELECT' || tagName == 'TEXTAREA') {
					$(this).val(value);
				}else if(tagName == 'IMG'){
					console.error("我是图片！");
					$(this).attr("src",value);
				}else{
					$(this).html(value);
				}

			});
		}
	}

})(jQuery);