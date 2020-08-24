import React from 'react';
import ReactDOM from 'react-dom';
import Canvas from './Canvas';
import * as serviceWorker from './serviceWorker';

const idTag = $('#root').attr('paintingId');
const paintingId: number = idTag ? +idTag : -1;
ReactDOM.render(React.createElement(Canvas, { 'paintingId': paintingId }), document.getElementById('root'));

serviceWorker.register();
