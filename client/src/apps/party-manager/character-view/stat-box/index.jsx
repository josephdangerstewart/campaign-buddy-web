import React from 'react';

import PopupControl from '../../../../components/popup-control';
import NumberInput from '../../../../components/number-input';
import styles from './styles.less';

export default class StatBox extends React.Component {
	
	state = {
		anchorRef: null,
		inputValue: 0,
	}

	getBonus = (value) => {
		const { character } = this.props;
		const rVal = character.calcStatBonus(value);
		return rVal >= 0 ? `+${rVal}` : `-${rVal}`;
	}

	onValueClicked = () => {
		const { character, attributeName } = this.props;
		const rawValue = character.getRawValueOf(attributeName);
		this.setState({ inputValue: rawValue }, () => {
			if (this.popup) this.popup.show();
		});
	}

	onChange = (attributeName, value) => {
		const { onAttributeChange } = this.props;
		if (this.popup) this.popup.hide();
		onAttributeChange(attributeName, value);
	}

	getAnchorRef = ref => {
		const { anchorRef } = this.state;

		if (!anchorRef && ref) {
			this.setState({
				anchorRef: ref
			})
		}
	}

	componentWillUnmount() {
		this.setState({
			anchorRef: null,
		});
	}
	
	render() {
		const {
			attributeName,
			character,
			onAttributeChange,
		} = this.props;

		const {
			anchorRef,
			inputValue
		} = this.state;

		const value = character.getValueOf(attributeName);
		if (!value && typeof value === 'object') return null;
		const rawValue = character.getRawValueOf(attributeName);

		return (
			<div className={styles.container}>
				<div className={styles.statBox}>
					<div className={styles.statBoxHeader}>
						<p>{attributeName}</p>
					</div>
					<div>
						<p ref={this.getAnchorRef} onClick={this.onValueClicked} className={styles.value}>{rawValue}</p>
					</div>
					<div className={styles.statBoxBonus}>
						<p>{this.getBonus(value)}</p>
					</div>
				</div>
				<PopupControl
					ref={(ref) => this.popup = ref}
					anchor={anchorRef}
					onClose={() => onAttributeChange(attributeName, inputValue)}
				>
					<NumberInput
						giveValueOnEnter
						onChange={(val) => this.onChange(attributeName, val)}
						onInputValueChanged={inputValue => this.setState({ inputValue }, () => console.log(this.state.inputValue))}
						defaultValue={rawValue}
					/>
				</PopupControl>
			</div>
		)
	}
}
