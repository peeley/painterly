$(".deletePaintingForm").on("submit", function() {
    return confirm("Really delete painting?");
});

$(".editTitleSubmitButton").on("click", function() {
    let id = $(this).attr('id');
    console.log(id);
});
