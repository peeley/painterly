import React from 'react';
import '@simonwep/pickr/dist/themes/nano.min.css';   // 'classic' theme
import Pickr from '@simonwep/pickr';

export class Palette extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
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
		this.palette.on('save', this.handleChange);
    }
    handleChange(newColor, instance){
        this.setState({
            color: newColor.toRGBA().toString()
        });
        this.props.updateColor(this.state.color);
    }
    render(){
        return (
			<div className="colorPalette" >
			</div>
        );
    }
}
