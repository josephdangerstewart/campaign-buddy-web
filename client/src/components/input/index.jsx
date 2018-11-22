import React from 'react';
import styles from './styles.less';

export default class Input extends React.Component {
	constructor(props) {
		super(props);
		const hasDefault = props.defaultValue || typeof props.defaultValue !== 'obejct';
		this.state = {
			value: hasDefault ? props.defaultValue : ''
		}
	}
	
	handleKeyDown = (e) => {
		const { onEnter, onTab, giveValueOnEnter, onChange } = this.props;
		const { value } = this.state;

		if (e.keyCode === 13) {
			e.preventDefault();
			if (onEnter) onEnter();
			if (giveValueOnEnter) onChange(value);
		} else if (e.keyCode === 9 && onTab) {
			e.preventDefault();
			onTab();
		}
	}
	
	focus = () => {
		if (this.input) {
			this.input.focus();
			this.input.select();
		}
	}

	render() {
		const { onChange, placeholder, width, value, giveValueOnEnter, padding, fontSize } = this.props;
		const { value: valueFromState } = this.state;

		let style = {}
		if (width) {
			style = {
				width,
				padding,
				fontSize,
			};
		}

		return (
			<input
				className={styles.input}
				onChange={giveValueOnEnter ? ((e) => this.setState({ value: e.target.value })) : ((e) => onChange(e.target.value))}
				placeholder={placeholder}
				style={style}
				value={giveValueOnEnter ? valueFromState : value}
				onKeyDown={this.handleKeyDown}
				ref={(ref) => (this.input = ref)}
			/>
		)
	}
}
