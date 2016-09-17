FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "eateries_cards"});
  }
});

FlowRouter.route('/:eateryName', {
  action: function(params) {
    BlazeLayout.render("mainLayout", {content: "eatery_page"});
  }
});

