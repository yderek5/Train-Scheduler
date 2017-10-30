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

var database = firebase.database();
var trainCount = 0;

database.ref('trains/').on("value", function(snapshot) {
  allTrains = snapshot.val();
  trainCount = allTrains.length;

  showTrains(allTrains);
    console.log(trainCount);
  },function(e){
    console.log(e);
});

$(document).ready(function() {
  $("#enterBtn").on("click", function(event) {
    event.preventDefault();
    var name = $("#trainName").val().trim();
    var destination = $("#trainDestination").val().trim();
    var time = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();

    console.log(name, destination, time, frequency);


    addTrain(name, destination, time, frequency);

    $("#trainName").val('');
    $("#trainDestination").val('');
    $("#trainTime").val('');
    $("#frequency").val('');
  });
});

var addTrain = function(name, destination, time, frequency) {
  database.ref('trains/' + trainCount).set({
    name: name,
    destination: destination,
    time: time,
    frequency: frequency
  });
};

var showTrains = function(trains) {
  $("tbody").empty();
  for (var i = 0; i < allTrains.length; i++) {
    var name = trains[i].name;
    var destination = trains[i].destination;
    var time = trains[i].time;
    var frequency = trains[i].frequency;

    var newRow = $("<tr>");
    var newName = $("<td>").text(name);
    var newDestination = $("<td>").text(destination);
    var newTime = $("<td>").text(time);
    var newFrequency = $("<td>").text(frequency);

    newRow.append(newName);
    newRow.append(newDestination);
    newRow.append(newTime);
    newRow.append(newFrequency);

    $("tbody").append(newRow);
  }
};
