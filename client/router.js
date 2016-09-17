FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "eateries_cards"});
  }
});

FlowRouter.route('/:eateryName', {
	triggersEnter: [function(context, redirect) {
  		if (Eateries.find({name:context.params.eateryName}).count() < 1)
    	redirect('/');
	}],
  action: function(params) {
  	console.log(Eateries);
    BlazeLayout.render("mainLayout", {content: "eatery_page"});
  }
});