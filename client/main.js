import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.timer.onCreated(function(){
    this.state = new ReactiveVar(0);
    console.log(this.state.get());
    this.var1 = null;
    this.var2 = null;
    this.var3 = null;
});

Template.timer.helpers({
    "get_total_time": function(){
        var template = Template.instance();
        if(template.state.get() > 2) {
            var new_date = new Date(template.var3 - template.var1).toISOString().substr(11, 8);
            return new_date;
        }
    }
});

Template.timer.events({
    "click #reset": function(event, instance){
        event.stopImmediatePropagation();
        instance.state.set(0);
        instance.var1 = 0;
        instance.var2 = 0;
        instance.var3 = 0;
        console.log("Reset");
    },
    "click button": function(event, instance){
        //TODO: this state method isn't really a good idea
        //TODO: Reset when clicking on first button
        //TODO: Move reset into a reset function
        var d = new Date();
        console.log(d.getHours()  + ":" + d.getMinutes() + ":" + d.getSeconds());
        console.log(event.target.id);
        var clicked_id = event.target.id;
        switch(clicked_id) {
            case "button-1":
                console.log("Button 1");
                instance.state.set(1);
                instance.var1 = d;
                break;
            case "button-2":
                console.log("Button 2");
                if (instance.state.get() == 1) {
                    instance.state.set(2);
                    instance.var2 = d;
                }
                else {
                    Materialize.toast("Wrong mode", 3000);
                }
                break;
            case "button-3":
                console.log("Button 3");
                if (instance.state.get() == 2) {
                    instance.state.set(3);
                    instance.var3 = d;
                }
                else {
                    Materialize.toast("Wrong mode", 3000);
                }
                break;
        }

    }
});
