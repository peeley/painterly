<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta name="theme-color" content="#000000"/>
    <meta name="description" content="Web site created using create-react-app"/>
    <link rel="apple-touch-icon" href={{ asset("logo192.png") }}/>
    <link rel="manifest" href="/manifest.json"/>
    <title>{{ $title }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <script src={{ asset('js/bootstrap.js') }}></script>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root" paintingId="{{ $id }}"></div>

  <script src= {{ asset("js/app.js") }}></script>
  </body>
</html>
