Template.eateries_cards.helpers({
	'get_eateries': function(){
		return Eateries.find({}, { sort: {name: 1} })
	}
})