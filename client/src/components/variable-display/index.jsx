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

	handleClick = () => {
		if (this.popup) this.popup.show();
	}

	handleChange = (value) => {
		const { onChange } = this.props;
		if (this.popup) this.popup.hide();
		onChange(value);
	}

	render() {
		const {
			control,
			value,
			valueClass,
			onChange,
			...rest
		} = this.props;

		let Control = this.controls[control];
		if (!Control) Control = this.controls.input;
		const isEmptyString = typeof value === 'string' && value.trim() === '';

		return (
			<div className={styles.container}>
				<span onClick={this.handleClick} className={`${valueClass} ${styles.value} ${isEmptyString ? styles.valueEmptry : ''}`}>{isEmptyString ? 'NA' : typeof value === 'object' ? '' : value}</span>
				<PopupControl ref={ref => (this.popup = ref)}>
					<Control
						{...rest}
						giveValueOnEnter
						onChange={this.handleChange}
					/>
				</PopupControl>
			</div>
		)
	}
}
