import React from 'react';
import TitleEditor from './TitleEditor.js';

function PaintingOptions({ paintingId, paintingTitle }) {
    return (
            <div className="dropdown col">
                <button className="btn-sm btn-outline-secondary dropdown-toggle"
                    data-toggle="dropdown">
                    ...
                </button>
                <div className="dropdown-menu" role="menu" >
                    <TitleEditor paintingId={paintingId} title={paintingTitle}/>
                </div>
            </div>
    );
}

export default PaintingOptions;
