import React from 'react';
import './Canvas.css';

class Canvas extends React.Component{
    constructor(props){
        super(props);
        this.drawSurfaceRef = React.createRef();
    }
    componentDidMount(){
        this.drawSurfaceCtx = this.drawSurfaceRef.current.getContext('2d');
        this.drawSurfaceCtx.fillStyle = 'black';
    }
    render(){
        return(
            <div className="Canvas">
                <canvas id="drawSurface" 
                    height = { window.innerHeight * .9 }
                    width = { window.innerWidth * .9 }
                    ref={ this.drawSurfaceRef } 
                    onClick={ () => this.drawDot() }
                />
            </div>
        )
    }
    drawDot(){
        this.drawSurfaceCtx.fillRect(10, 10, 100, 100);
    }
}

export default Canvas;
