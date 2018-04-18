function renderStyleSheet(){
	var style = document.createElement("style");

	style.setAttribute("media", "only screen and (max-width: 760px), (min-device-width: 768px) and (max-device-width: 1024px)");

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);
	
	return style.sheet;
}
var sheet = renderStyleSheet();
var numberOfOptionsToRender = 0;

function renderHeader(details){
	var tr = $("#orders-table tr:first");
	var i = 1;
	// count maximum number of options first
	details.promotion.items.forEach(function(item){
		if(item.options && item.options.length > numberOfOptionsToRender) numberOfOptionsToRender = item.options.length;
	});
	details.promotion.items.forEach(function(item) {
		var div = $.template("#available-item-template",
		{
			title: item.name
		});
		i++;
		sheet.insertRule("#orders-table td:nth-of-type(" + i + "):before {content: \"" + item.name + "\"; }", 0);
		tr.append($("<th>").addClass("responsive-table-cell").append(div));
	});
	
	var div = $.template("#available-item-template",
	{
		title: "Totaal"
	});
	tr.append($("<th>").addClass("responsive-table-cell").append(div));

	if(numberOfOptionsToRender > 0)
	{
		tr.append($("<th>").attr("colspan", numberOfOptionsToRender).addClass("responsive-table-cell").append("Keuzes"));
	}
}

function renderRows(details){
	var table = $("#orders-table");
	details.subscriptions.forEach(function(subscription) {
		var tr = $("<tr>");
		var div = $.template("#subscriber-template",
		{
			subscriberName: subscription.subscriberName
		});
		var tr = $("<tr>");
		table.append(tr.append($("<td>").addClass("responsive-table-cell").append(div)));
		var price = 0;
		details.promotion.items.forEach(function(item){
			var items = subscription.items.filter(function(e){ return e.promotionItem.id === item.id });
			
			var subscribed = items.length > 0 ? items[0] : null;
			if(subscribed)
			{
				var quantity = 0;
				items.forEach(function(s){
					quantity += s.quantity
				});	
				
				var content = $.template("#subscribed-template",
				{
					quantity: quantity
				});
				
				price += quantity * item.price;
				
				tr.append($("<td>").attr('id', subscribed.id).addClass("responsive-table-cell").append(content));				
			}
			else{
				tr.append($("<td>").addClass("responsive-table-cell").append("0"));
			}
			
		});		
		
		var content = $.template("#subscribed-template",
		{
			quantity: "€ " + price
		});
		
		tr.append($("<td>").addClass("responsive-table-cell").append(content));

		// show options

		details.promotion.items.forEach(function(item){
			var items = subscription.items.filter(function(e){ return e.promotionItem.id === item.id });
			var subscribed = items.length > 0 ? items[0] : null;			
			if(subscribed && subscribed.selectedOptions){
				var optionCellsRendered = 0;
				subscribed.selectedOptions.forEach(function(option){
					tr.append($("<td>").addClass("responsive-table-cell").append(option.selectedOptionType.name));
					optionCellsRendered++;
				});
				for(var i = optionCellsRendered; i < numberOfOptionsToRender; i++){
					tr.append($("<td>").addClass("responsive-table-cell").append(""));
				}
			}			
		});	
	});
}

$(document).ready(function(){
    var id = $("#orders").attr("data-id");
    var service = "community-service.azurewebsites.net";
  //  var service = "localhost:22465"; // uncomment for local testing
    var uri= "http://" + service + "/api/promotions/" + id + "/subscriptions";
    var items = [];

    $.ajax({
        type: 'GET',
        url: uri,
        dataType: 'json', 
        crossDomain: true, 
        success: function(details){    
            
            renderHeader(details);
			renderRows(details);	
            
        }
      });
});