import React from 'react';
import '@simonwep/pickr/dist/themes/nano.min.css';   // 'classic' theme
import Pickr from '@simonwep/pickr';

export class Palette extends React.Component{
    constructor(props){
        super(props);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleStrokeWidthChange = this.handleStrokeWidthChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            strokeWidth: 3,
            color: "#42445A"
        }
	}
	componentDidMount(){
        this.palette = Pickr.create({
            el: '.colorPalette',
			theme: 'nano', // or 'monolith', or 'nano'

			swatches: [
				'rgba(244, 67, 54, 1)',
				'rgba(233, 30, 99, 0.95)',
				'rgba(156, 39, 176, 0.9)',
				'rgba(103, 58, 183, 0.85)',
				'rgba(63, 81, 181, 0.8)',
				'rgba(33, 150, 243, 0.75)',
				'rgba(3, 169, 244, 0.7)',
				'rgba(0, 188, 212, 0.7)',
				'rgba(0, 150, 136, 0.75)',
				'rgba(76, 175, 80, 0.8)',
				'rgba(139, 195, 74, 0.85)',
				'rgba(205, 220, 57, 0.9)',
				'rgba(255, 235, 59, 0.95)',
				'rgba(255, 193, 7, 1)'
			],

			components: {

				// Main components
				preview: true,
				opacity: true,
				hue: true,

				// Input / output Options
				interaction: {
					input: true,
					clear: true,
					save: true
				}
			}
		});
		this.palette.on('save', (color, instance) => {
            this.palette.hide();
            this.handleColorChange(color, instance);
        });
        this.props.updateStrokeWidth(this.state.strokeWidth);
    }
    handleColorChange(newColor, instance){
        this.setState({
            color: newColor.toRGBA().toString()
        });
        this.props.updateColor(this.state.color);
    }
    handleStrokeWidthChange(event){
        this.setState({
            strokeWidth: event.target.value
        });
        this.props.updateStrokeWidth(this.state.strokeWidth);
        event.preventDefault();
    }
    render(){
        return (
            <div className="row">
                <div className="border border-dark">
                    <div className="colorPalette"/>
                </div>
                <div className="strokeWidthSlider pt-2 pl-3 pr-5">
                    <input type="range" min="1" max="30"
                        className="slider"
                        value={this.state.strokeWidth}
                        onChange={this.handleStrokeWidthChange}     
                    />
                </div>
            </div>
        );
    }
}
