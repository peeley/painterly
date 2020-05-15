import React from 'react';
import ReactDOM from 'react-dom';
import Painting from './components/Painting.js';

let userId = $('#root').attr('userId');

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            paintings: [ ]
        }
    }
    componentDidMount(){
        axios.get(`${process.env.MIX_APP_URL}/api/u/${this.props.userId}/paintings`)
        .then( response => {
            this.setState({
                paintings: response.data
            });
        })
    }
    render(){
        return (
            <>
                <div className="row py-3" >
                    <h3 className="col-6">My Paintings</h3>
                    <form method="POST" action="/painting">
                        <button className="btn btn-sm btn-success col" type="submit">
                            Create New Painting
                        </button>
                    </form>
                </div>
                <ul className="list-group list-group-flush">
                { this.state.paintings.map(painting => {
                    return <Painting title={painting.title} paintingId={painting.id} key={painting.id}/>;
                })}
                </ul>
            </>
        );
    }
}

ReactDOM.render(<Home userId={userId}/>, document.getElementById('root'));

/*
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
            $('#titleModal'+id).find('.modal-dialog').remove(".alert");
            $('#titleModal'+id).modal('hide');
        }
    })
    .catch( error => {
        let content = $('#titleModal'+id).find('.modal-dialog');
        content.append($.parseHTML(`
            <div class="alert alert-danger alert-dismissable fade show" role="alert">
                ${error.response.data.errors.title[0]}
            </div>
        `));
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
*/
