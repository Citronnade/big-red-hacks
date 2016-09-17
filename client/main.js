import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.eateries_cards.onCreated(function(){
    var self = this;
    self.autorun(function() {
       self.subscribe('all_eateries');
    });
});

Template.eatery_page.onCreated(function(){
    var self = this;
      self.autorun(function() {
        var eateryName = FlowRouter.getParam('eateryName');
        self.subscribe('eateries', eateryName);
      });
});

Template.eatery_page.helpers({
    "get_data": function(){
        console.log(Eateries.find().fetch());
        return Eateries.find({name:FlowRouter.getParam('eateryName')}).fetch();
    }
});


Template.timer.onCreated(function(){
    this.state = new ReactiveVar(0);
    console.log(this.state.get());
    this.time1 = new ReactiveVar(0);
    this.time2 = new ReactiveVar(0);
    this.time3 = new ReactiveVar(0);
    this.current_time = new ReactiveVar(0);

    var self = this;
    this.reset_template = function(){
        self.time1.set(0);
        self.time2.set(0);
        self.time3.set(0);
        self.state.set(0);
    };

    // this.time_interval = Meteor.setInterval(function(){
    //     self.current_time.set(new Date())
    // }, 10)

});

Template.timer.onDestroyed(function(){
    Meteor.clearInterval(this.time_interval);
});

Template.timer.helpers({
    "get_total_time": function(){
        var template = Template.instance();
        if(template.state.get() > 0) {
            //var new_date = new Date(template.time3 - template.time1).toISOString().substr(14, 8);
            var new_date = new Date(template.current_time.get() - template.time1.get())
                .toISOString().substr(14, 8);
            return new_date;
        }
        else{
            return "";
        }
    },
    "get_state_text": function(){
        switch (Template.instance().state.get()){
            case 0:
                return "Start";
            case 1:
                return "On line";
            case 2:
                return "Waiting for food";
            case 3:
                return "Received food; RESET";
        }
    }
});


Template.timer.events({
    "click #reset": function(event, instance){
        event.stopImmediatePropagation();
        instance.reset_template();
        Meteor.clearInterval(instance.time_interval);
    },
    "click #button-timer": function(event, instance){
        //TODO: this state method isn't really a good idea
        //TODO: Reset when clicking on first button
        //TODO: Move reset into a reset function
        var d = new Date();
        //console.log(d.getHours()  + ":" + d.getMinutes() + ":" + d.getSeconds());
        //console.log(event.target.id);
        var clicked_id = event.target.id;
        current_state = instance.state.get();
        //console.log(current_state);
        switch(current_state){
            case 0:
                instance.time1.set(d);
                instance.time_interval = Meteor.setInterval(function(){
                    instance.current_time.set(new Date())
                }, 10);
                console.log("case 0 time_interval", instance.time_interval);
                instance.state.set(current_state + 1);
                break;
            case 1:
                instance.time2.set(d);
                instance.state.set(current_state + 1);
                break;
            case 2:
                instance.time3.set(d);
                instance.state.set(current_state + 1);
                //instance.current_time.set(instance.time3.get());
                console.log("??");
                Meteor.clearInterval(instance.time_interval);
                console.log("case 2 time_interval", instance.time_interval);
                break;
            case 3:
                instance.reset_template();
                break;

        }
    },
    "click #submit": function(event, instance){
        if(instance.state.get() != 3){
            Materialize.toast("Please finish recording before submitting", 2500);
        }
        else {
            var eatery_id = Eateries.findOne()._id;
            Eateries.upsert({_id: eatery_id}, {$push:{time: {
                "gotInLine": instance.time1.get(),
                "orderedFood": instance.time2.get(),
                "gotFood": instance.time3.get()
            }}});
            console.log("Time 1: ", instance.time1.get());
            console.log("Time 2: ", instance.time2.get());
            console.log("Time 3: ", instance.time3.get());
            instance.reset_template();
        }
    }
});
