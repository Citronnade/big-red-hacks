import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	if (Eateries.find().count() === 0) {
        console.log("Importing private/mock_data.json to db")

        var data = JSON.parse(Assets.getText("mock_data.json"));

        data.forEach(function (item, index, array) {
            Eateries.insert(item);
        })
    }
});

Meteor.publish('all_eateries', function eateriesPublication() {
	return Eateries.find();
});

Meteor.publish('eateries', function eateryPublication(eatery) {
	return Eateries.find({name:eatery});
});

Meteor.methods({
	"removeAllEntries": function(){
		return Eateries.remove({});
	}
})