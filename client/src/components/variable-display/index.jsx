import React from 'react';
import PopupControl from '../popup-control';
import Input from '../input';
import DropDown from '../drop-down';
import ComboBox from '../combo-box';
import styles from './styles.less';
import NumberInput from '../number-input';

export default class VariableDisplay extends React.Component {
	controls = {
		'input': Input,
		'dropdown': DropDown,
		'combobox': ComboBox,
		'number': NumberInput
	}

	state = {
		anchorRef: null,
		inputValue: null,
	}

	handleClick = () => {
		if (this.popup) this.popup.show();
	}

	handleChange = (value) => {
		const { onChange } = this.props;
		if (this.popup) this.popup.hide();
		onChange(value);
	}

	getAnchorRef = ref => {
		const { anchorRef } = this.state;
		if (!anchorRef && ref) {
			this.setState({
				anchorRef: ref
			});
		}
		else if (!ref) {
			this.setState({
				anchorRef: null
			});
		}
	}

	onClickAway = () => {
		const { onChange } = this.props;
		const { inputValue } = this.state;
		if (inputValue !== null) {
			onChange(inputValue);
		}
	}

	render() {
		const {
			control,
			value,
			valueClass,
			onChange,
			...rest
		} = this.props;

		const { anchorRef } = this.state;

		let Control = this.controls[control];
		if (!Control) Control = this.controls.input;
		const isEmptyString = typeof value === 'string' && value.trim() === '';

		return (
			<div className={styles.container}>
				<span
					onClick={this.handleClick}
					className={`${valueClass} ${styles.value} ${isEmptyString ? styles.valueEmptry : ''}`}
					ref={this.getAnchorRef}
				>
					{isEmptyString ? 'NA' : typeof value === 'object' ? '' : value}
				</span>
				<PopupControl 
					onClose={this.onClickAway}
					ref={ref => (this.popup = ref)}
					anchor={anchorRef}
				>
					<Control
						{...rest}
						giveValueOnEnter
						onChange={this.handleChange}
						onInputValueChanged={inputValue => this.setState({ inputValue })}
					/>
				</PopupControl>
			</div>
		)
	}
}
