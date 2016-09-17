FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "eateries_cards"});
  }
});

FlowRouter.route('/:eateryName', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "timer"});
  }
});