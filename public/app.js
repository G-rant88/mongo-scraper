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