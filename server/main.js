import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

});

//Meteor.publish('all_eateries', function eateriesPublication() {
//	return Eateries.find();
//});

Meteor.publish('eateries', function eateryPublication(eatery) {
	return Eateries.find({name:eatery});
});