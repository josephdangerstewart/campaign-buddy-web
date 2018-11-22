import React from 'react';
import styles from './styles.less';
import Button from '../button';

export default class NumberInput extends React.Component {
	constructor(props) {
		super(props);
		const hasDefault = props.defaultValue || typeof props.defaultValue !== 'obejct';
		this.state = {
			value: hasDefault ? props.defaultValue : ''
		}
	}

	handleKeyDown = (e) => {
		const { onChange, giveValueOnEnter } = this.props;
		const { value } = this.state;

		if (e.keyCode === 13 && giveValueOnEnter) {
			if (isNaN(value)) return;
			onChange(value);
		}
		else if (e.keyCode === 38) this.handlePlus();
		else if (e.keyCode === 40) this.handleMinus();
	}
	
	handlePlus = () => {
		const value = parseFloat(this.getValue());
		if (!isNaN(value)) this.handleChange(value + 1);
	}

	handleMinus = () => {
		const value = parseFloat(this.getValue());
		if (!isNaN(value)) this.handleChange(value - 1);
	}

	handleChange = (value) => {
		const { giveValueOnEnter, canAcceptNaN, onChange } = this.props;

		if (giveValueOnEnter && (!isNaN(value) || canAcceptNaN || value === '-')) {
			this.setState({ value });
		} else if (!isNaN(value) || canAcceptNaN || value === '-') {
			onChange(value);
		}
	}

	getValue = () => {
		const { giveValueOnEnter, value } = this.props;
		const { value: valueFromState } = this.state;

		return giveValueOnEnter ? valueFromState : value;
	}

	handleButtonEnter = () => {
		const { onChange } = this.props;
		const value = this.getValue();
		if (isNaN(value)) return;
		onChange(value);
	}

	focus = () => {
		if (this.input) {
			this.input.focus();
			this.input.select();
		}
	}
	
	render() {
		const { placeholder, width, canAcceptNaN } = this.props;
		const value = this.getValue();

		let style = {}
		if (width) {
			style = {
				width,
			};
		}

		const isANumber = !isNaN(value) || value === '-';

		return (
			<div className={styles.container}>
				<Button icon="plus" onEnter={this.handleButtonEnter} onClick={this.handlePlus} />
				<input 
					className={`${styles.input} ${isANumber ? style.error : ''}`}
					onChange={(e) => this.handleChange(e.target.value)}
					placeholder={placeholder}
					style={style}
					value={isANumber || canAcceptNaN ? value : 0}
					onKeyDown={this.handleKeyDown}
					ref={(ref) => (this.input = ref)}
				/>
				<Button icon="minus" onEnter={this.handleButtonEnter} onClick={this.handleMinus} />
			</div>
		)
	}
}
