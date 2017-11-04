// Initialize Firebase
var config = {
  apiKey: "AIzaSyDzxeWf9PkjTDOegoECS5-_zBeJt7wb5eU",
  authDomain: "train-scheduler-abaa7.firebaseapp.com",
  databaseURL: "https://train-scheduler-abaa7.firebaseio.com",
  projectId: "train-scheduler-abaa7",
  storageBucket: "train-scheduler-abaa7.appspot.com",
  messagingSenderId: "188627024798"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

//put all code inside document.ready function
$(document).ready(function(){
	//when clicking submit button
	$("#submit-train").on("click", function(event){
		//prevent default form submission
		event.preventDefault();

		//pull data out of the form and reset the fields
		var name = $("#train-name").val().trim();
		$("#train-name").val("");
		var destination = $("#destination").val().trim();
		$("#destination").val("");
		var frequency = $("#frequency").val().trim();
		$("#frequency").val("");
		var firstTime = $("#firstTime").val().trim();
		$("#firstTime").val("");

		//push data to
    database.ref("/trains").push({
      trainName: name,
      destination: destination,
			frequency: frequency,
			firstTime: firstTime
		});
	});

	//database reference to retreive trains info
	var trainsRef = firebase.database().ref("/trains");

	//the child_added event is triggered once for each existing child, so no for loop or pulling all of the data
	//it's also triggered when a new child is added.  Thanks to Dave for finding this during class with the employee
	//activity, seems easier than what other folks were doing with for loops and what not.
	trainsRef.on('child_added', function(data){

		//Again, dave started this.  I don't like the mulitple lines to get to the end but it's fine
		//create the var r for a table row
		r = $("<tr>");

		//create table data for train name and append to the tr
		var trainName = $("<td>");
		trainName.append(data.val().trainName);
		r.append(trainName);

		//same for destination
		var destination = $("<td>");
		destination.append(data.val().destination);
		r.append(destination);

		//and frequency
		var frequency = $("<td>");
		frequency.append(data.val().frequency);
		r.append(frequency);

//**************** get date difference ************************


		//this time stuff is crazy, but pull the time of the first train from data
		var firstTrain = moment(data.val().firstTime, "HH:mm");
		//create a variable with the current date and time
		var now = moment();

		//get the different between now and the first train in minutes
		var diff = now.diff(firstTrain, "minutes");

		//if diff is a negative number, we have to start tomorrow (1440 minutes is 24 hours) minus the minute now
		if (diff < 0) {
			diff = 1440 + diff - 1;
		}

		//get frequency of trains
		var freq = parseInt(data.val().frequency);

		//get the minutes away with the remainder
		var minutesAway = (freq - (diff % freq));
		console.log("Minutes away is: " + minutesAway);

		//get the next time the train will show up and format it
		var nextTime = now.add(minutesAway, 'minutes').format("h:mm A");

		console.log("Next train time is: " + nextTime);

		//I like this a lot better, it just seems cleaner than other methods.
		r.append("<td>" + nextTime + "</td>");
		r.append("<td>" + minutesAway + "</td>");

		//as a tr and all tds are created, append it to the tbody.
		$("tbody").append(r);
	})
});
