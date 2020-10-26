@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-12">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div id="root" userId="{{ Auth::id() }}"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src= {{asset("js/home.js") }}></script>
@endsection
