$(".deletePaintingForm").on("submit", function () {
    return confirm("Really delete painting?");
});

$(".editTitleSubmitButton").on("click", function () {
    let id = $(this).attr('id');
    let newTitle = $('#titleForm_'+id).val();
    axios.put(`${process.env.MIX_APP_URL}/api/p/${id}`,
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

$(".editPublicSwitch").change(function () {
    let id = $(this).attr('id').split('_')[1];
    let editCheckbox = $(`#editPublicSwitch_${id}`)[0];
    let viewCheckbox = $(`#viewPublicSwitch_${id}`)[0];
    if(editCheckbox.checked && !viewCheckbox.checked){
        viewCheckbox.checked = true;
    }
});

$(".viewPublicSwitch").change(function () {
    let id = $(this).attr('id').split('_')[1];
    let editCheckbox = $(`#editPublicSwitch_${id}`)[0];
    let viewCheckbox = $(`#viewPublicSwitch_${id}`)[0];
    if(!viewCheckbox.checked && editCheckbox.checked){
        editCheckbox.checked = false;
    }
});

$(".submitPrivacySettingsButton").on('click', function () {
    let id = $(this).attr('paintingId');
    let viewPublic = $(`#viewPublicSwitch_${id}`)[0].checked;
    let editPublic = $(`#editPublicSwitch_${id}`)[0].checked;
    axios.put(`${process.env.MIX_APP_URL}/api/p/${id}`,
              {'view_public': viewPublic,
               'edit_public': editPublic },
              {'Content-Type': 'application/json'}
             );
});
