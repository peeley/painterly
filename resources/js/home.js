$(".deletePaintingForm").on("submit", function () {
    return confirm("Really delete painting?");
});

$(".editTitleSubmitButton").on("click", function () {
    let id = $(this).attr('id');
    let newTitle = $('#titleForm'+id).val();
    axios.put(`${process.env.MIX_APP_URL}/api/p/${id}/title`,
              {title: newTitle},
              {headers: { 'Content-Type': 'application/json'}})
    .then( response => {
        if(response.status == 200){
            $('#paintingTitle'+id).text(newTitle);
        }
    })
    .catch( error => {
        console.log(error);
    })
});
