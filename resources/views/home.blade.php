@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Dashboard</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    You are logged in!
                    <div class="row py-3" >
                        <h3 class="col-4">My Paintings</h3>
                        <form method="POST" action="/painting">
                            @csrf
                            <button class="btn btn-sm btn-success" col" type="submit">Create New Painting</button>
                        </form>
                    </div>
                    <ul class="list-group list-group-flush">
                        @foreach ($paintings as $painting)
                            <li class="list-group-item row">
                                <a id={{"paintingTitle" . $painting->id}} class="col"
                                    href = {{ env('APP_URL') . "/painting/" . $painting->id }} >
                                    {{$painting->title }}
                                </a>
                                <div class="dropdown col">
                                    <button class="btn-sm btn-outline-secondary dropdown-toggle" type="button"
                                        data-toggle="dropdown">
                                        ...
                                    </button>
                                    <div class="dropdown-menu" role="menu">
                                        <button class="dropdown-item" data-toggle="modal"
                                            data-target={{ "#titleModal" . $painting->id }} >
                                            Edit Title
                                        </button>
                                        <button class="dropdown-item" data-toggle="modal"
                                                data-target={{ "#privacyModal" . $painting->id }} >
                                            Edit Privacy Settings
                                        </button>
                                        <div class="dropdown-divider" ></div>
                                        <form method='POST' action={{ "/api/p/" . $painting->id }} class="deletePaintingForm">
                                            @csrf
                                            @method('DELETE')
                                            <button class="dropdown-item" type="submit">Delete</button>
                                        </form>
                                    </div>
                                </div>
                                <div class="modal fade" role="dialog" id={{ "titleModal" . $painting->id }}>
                                    <div class="modal-dialog" role="document" >
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Edit Title</h5>
                                                <button type="close" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span>&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body row justify-content-center">
                                                <input id={{"titleForm_" . $painting->id}} class="col-8"
                                                    type="text" placeholder="Edit title" value={{ $painting->title }}>
                                                <button data-dismiss="modal" id={{ $painting->id }}
                                                    class="btn btn-primary editTitleSubmitButton" type="submit">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="modal fade" role="dialog" id={{ "privacyModal" . $painting->id }}>
                                    <div class="modal-dialog" role="document" >
                                        <div class="modal-content" >
                                            <div class="modal-header" >
                                                <h5 class="modal-title" >Edit Privacy Settings</h5>
                                                <button type="close" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span>&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body" >
                                                <div class="row justify-content-center" >
                                                    <div class="custom-control custom-switch" >
                                                        <input type="checkbox" class="custom-control-input viewPublicSwitch"
                                                            id={{"viewPublicSwitch_" . $painting->id}} >
                                                        <label class="custom-control-label"
                                                            for={{"viewPublicSwitch_" . $painting->id}}>
                                                            Anyone can view
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="row justify-content-center" >
                                                    <div class="custom-control custom-switch" >
                                                        <input type="checkbox" class="custom-control-input editPublicSwitch"
                                                            id={{"editPublicSwitch_" . $painting->id}}>
                                                        <label class="custom-control-label"
                                                            for={{"editPublicSwitch_" . $painting->id}}>
                                                            Anyone can edit
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="modal-footer" >
                                                <button class="btn btn-primary" data-dismiss="modal">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
<script src= {{asset("js/home.js") }}></script>
@endsection
