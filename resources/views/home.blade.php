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
                    <form method="POST" action="/painting">
                        @csrf
                        <button type="submit">Create New Painting</button>
                    </form>
                    <ul>
                        @foreach ($paintings as $painting)
                            <li class="row">
                                <a id={{"paintingTitle" . $painting->id}}
                                    href = {{ env('APP_URL') . "/painting/" . $painting->id }} >
                                    {{$painting->title }}
                                </a>
                                <div class="pl-5 dropdown">
                                    <button class="btn-sm btn-secondary dropdown-toggle" type="button"
                                        data-toggle="dropdown"> Options </button>
                                    <div class="dropdown-menu" role="menu">
                                        <form method='POST' action={{ "/api/p/" . $painting->id }} class="deletePaintingForm">
                                            @csrf
                                            @method('DELETE')
                                            <button class="dropdown-item" type="submit">Delete</button>
                                        </form>
                                        <button class="dropdown-item" data-toggle="modal"
                                            data-target={{  "#titleModal" . $painting->id }} >
                                            Edit Title
                                        </button>
                                    </div>
                                </div>
                                <div class="modal" role="dialog" id={{  "titleModal" . $painting->id }}>
                                    <div class="modal-dialog" role="document" >
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">Edit Title</h5>
                                                <button type="close" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span>&times;</span>
                                                </button>
                                            </div>
                                            <div class="modal-body row justify-content-center">
                                                <input class="col-8" type="text" placeholder="Edit title" >
                                                <button id={{ $painting->id }}
                                                    class="btn btn-primary editTitleSubmitButton" type="submit">
                                                    Submit
                                                </button>
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
