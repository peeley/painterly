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
                            <li>
                                <a href = {{ env('APP_URL') . "/painting/" . $painting->id }} >
                                    {{$painting->title }}
                                </a>
                                <form method='POST' action={{ "/api/p/" . $painting->id }}>
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit">Delete</button>
                                </form>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
