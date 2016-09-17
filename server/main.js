import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

});

Meteor.publish('eateries', function eateryPublication(eatery) {
	return Eateries.find({name:eatery});
});