import cx from 'classnames';
import React, { Component } from 'react';
import InputSlider from 'react-input-slider';
import './time.css'

export default class extends Component {
    changeHours = pos => {
        const m = this.props.moment;
        m.hours(pos.x);
        this.props.onChange(m);
    };

    changeMinutes = pos => {
        const m = this.props.moment;
        m.minutes(pos.x);
        this.props.onChange(m);
    };

    render() {
        const m = this.props.moment;

        console.log(this.props.children)

        return (
            <div className={cx('m-time', this.props.className)}>
                <div className="showtime">
                    <span className="time">{m.format('HH')}</span>
                    <span className="separater">:</span>
                    <span className="time">{m.format('mm')}</span>
                </div>

                <div className="sliders">
                    <div className="time-text">Hours:</div>
                    <InputSlider
                        className="u-slider-time"
                        xmin={0}
                        xmax={23}
                        xstep={this.props.hourStep}
                        x={m.hour()}
                        onChange={this.changeHours}
                    />
                    <div className="time-text">Minutes:</div>
                    <InputSlider
                        className="u-slider-time"
                        xmin={0}
                        xmax={59}
                        xstep={this.props.minStep}
                        x={m.minute()}
                        onChange={this.changeMinutes}
                    />
                </div>
            </div>
        );
    }
}