$(document).on("click", ".save", function() {

var title = $(this).attr("data-title");
var sum = $(this).attr("data-sum");
var link = $(this).attr("data-link");

var info = {

  title: title,
  sum: sum,
  link: link
}

$.post("/save", {info})

});