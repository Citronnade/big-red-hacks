import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.eateries_cards.onCreated(function(){
    var self = this;
    self.autorun(function() {
       self.subscribe('all_eateries');
    });
});

Template.eateries_cards.helpers({
    'get_eateries': function(){
        return Eateries.find({}, { sort: {name: 1} })
    },
    'compute_time': function(){
        //var eateryTime = Eateries.find({name:this.name}, {sort: {gotFood : -1} })[0];
        var eatery = Eateries.find({name:this.name}).fetch()[0];
        var times = eatery.time.sort().reverse();
        var time = times[0]
        var waitingTime = Math.round((time.gotFood - time.gotInLine)/6000);
        var updated = time.gotFood;
        return waitingTime.toString() + " minutes; Updated " + updated
    }
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
        return Eateries.find({name:FlowRouter.getParam('eateryName')}).fetch();
    }
});

Template.wait_times.onRendered(function () {
    //var eateryTime = Eateries.find({name:this.name}, {sort: {gotFood : -1} })[0];
        var eatery = Eateries.find({name:FlowRouter.getParam('eateryName')}).fetch()[0];
        console.log(eatery);
        var times = eatery.time.sort();

        var dataset = [];

        var startTime = new Date(times[0].gotFood);
        console.log(startTime);

        for (var k = 0; k < times.length; k++) {
            var time = times[k];
            var tLine = new Date(time.gotInLine);
            var tFood = new Date(time.gotFood);
            var waitingTime = (tFood - tLine)/6000;
            var time2 = (tFood - startTime)/6000;
            console.log("Plotted (" + time2 + ", " + waitingTime + ").");
            dataset.push([time2, waitingTime]); 
        }

        var w = 600;
        var h = 400;
        var padding = 30;

        //Create scale functions
            var xScale = d3.scale.linear()
                                 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
                                 .range([padding, w - padding * 2]);

            var yScale = d3.scale.linear()
                                 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                                 .range([h - padding, padding]);

            var rScale = d3.scale.linear()
                                 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
                                 .range([2, 5]);

            //Define X axis
            var xAxis = d3.svg.axis()
                              .scale(xScale)
                              .orient("bottom")
                              .ticks(5);

            //Define Y axis
            var yAxis = d3.svg.axis()
                              .scale(yScale)
                              .orient("left")
                              .ticks(5);

            //Create SVG element
            var svg = d3.select("body")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);

            //Create circles
            svg.selectAll("circle")
               .data(dataset)
               .enter()
               .append("circle")
               .attr("cx", function(d) {
                    return xScale(d[0]);
               })
               .attr("cy", function(d) {
                    return yScale(d[1]);
               })
               .attr("r", function(d) {
                    return rScale(5);
               });

            /*
            //Create labels
            svg.selectAll("text")
               .data(dataset)
               .enter()
               .append("text")
               .text(function(d) {
                    return d[0] + "," + d[1];
               })
               .attr("x", function(d) {
                    return xScale(d[0]);
               })
               .attr("y", function(d) {
                    return yScale(d[1]);
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "11px")
               .attr("fill", "red");
            */
            
            //Create X axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);
            
            //Create Y axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);
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
