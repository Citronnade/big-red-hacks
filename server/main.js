import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
	if (Eateries.find().count() === 0) {
        console.log("Importing private/mock_data.json to db")

        var data = JSON.parse(Assets.getText("mock_data.json"));

        data.forEach(function (item, index, array) {
            for(var i = 0; i < item.time.length; i++) {
                item.time[i]["gotInLine"] = new Date(item.time[i]["gotInLine"]);
                item.time[i]["orderedFood"] = new Date(item.time[i]["orderedFood"]);
                item.time[i]["gotFood"] = new Date(item.time[i]["gotFood"]);
            }
            Eateries.insert(item);
        });
    }
});

//Meteor.publish('all_eateries', function eateriesPublication() {
//	return Eateries.find();
//});

Meteor.publish('eateries', function eateryPublication(eatery) {
	return Eateries.find({name:eatery});
});

Meteor.methods({
	"removeAllEntries": function(){
		return Eateries.remove({});
	}
});