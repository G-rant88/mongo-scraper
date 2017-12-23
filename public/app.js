  var noteflag = false;



 $(document).ready(function() {

  $(".notesHere").hide();
  $(".delNote").hide();
  $(".bodyHere").hide();


});

$(document).on("click", ".save", function() {

var title = $(this).attr("data-title");
var sum = $(this).attr("data-sum");
var link = $(this).attr("data-link");

var info = {

  title: title,
  sum: sum,
  link: link
}

$.post("/save", {info}, function(done){

console.log(done);

if(done === ""){

	Materialize.toast('Article Saved!', 4000);

}

else{

Materialize.toast('ERROR: Article Already Saved in db!', 4000);
Materialize.toast('Try Another Article!', 4000);

}
})

});


$(document).on("click", ".delete", function() {

var title = $(this).attr("data-title");

var info = {

  title: title
}

$.post("/delete", {info}, function(done){

location.reload();
})

});


$(document).on("click", ".note", function() {



  noteflag = !noteflag

  if (noteflag === false) {

  $(".notesHere").hide();
  $(".bodyHere").hide();
  $(".delNote").hide();
  return false;

  }
 

var ids = $(this).attr("data-id");


console.log(ids);

$.get("/articles/"+ids, function(done){

if (noteflag === true) {

 $(".bodyHere").show();
  $(".delNote").show();
$("#"+ ids).show();

  }
   
  
 

  });

});


$(".saveNote").on("click", function(event) {


var ids = $(this).attr("data-id");
var body = $(".notey").val().trim();

console.log(ids);

var info = {

  id: ids,
  body: body
}


$.post("/save/"+ids, {info}, function(done){
  Materialize.toast('Note Saved!', 4000);

 var bodyflag = true;
  console.log(done);

$(".bodyHere").show();
$("#print"+done._id).empty();
$("#print"+done._id).prepend(done.note.body)
$(".delNote").show();


  });

});