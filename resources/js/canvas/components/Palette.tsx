import * as React from 'react';
import '@simonwep/pickr/dist/themes/classic.min.css';   // 'classic' theme
import Pickr from '@simonwep/pickr';

interface PaletteProps {
    updateStrokeWidth(width: number): void,
    updateColor(color: string): void
}

interface PaletteState {
    strokeWidth: number,
    color: string,
}

export class Palette extends React.Component<PaletteProps, PaletteState>{
    private palette: any;
    public state: PaletteState;
    constructor(props: PaletteProps) {
        super(props);
        this.state = {
            strokeWidth: 3,
            color: "rgba(17, 17, 17, 1)",
        }
    }
    componentDidMount() {
        this.palette = Pickr.create({
            el: '.colorPalette',
            theme: 'classic', // or 'monolith', or 'nano'

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

            default: this.state.color,

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
        this.palette.on('save', (color: Pickr.HSVaColor, _: any) => {
            this.palette.hide();
            this.handleColorChange(color);
        });
        this.props.updateStrokeWidth(this.state.strokeWidth);
    }
    handleColorChange = (newColor: Pickr.HSVaColor) => {
        this.setState({
            color: newColor.toRGBA().toString()
        });
        this.props.updateColor(this.state.color);
    }
    handleStrokeWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            strokeWidth: +event.target.value
        }, () => {
            this.props.updateStrokeWidth(this.state.strokeWidth);
        });
        event.preventDefault();

    }
    render() {
        return (
            <div className="col-2 d-flex">
                <div className="align-bottom">
                    <div className="colorPalette"></div>
                </div>
                <div className="strokeWidthSlider pt-2 pl-3">
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
