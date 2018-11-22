import React from 'react';

import PopupControl from '../../../../components/popup-control';
import NumberInput from '../../../../components/number-input';
import styles from './styles.less';

export default class StatBox extends React.Component {
	
	getBonus = (value) => {
		const { character } = this.props;
		const rVal = character.calcStatBonus(value);
		return rVal >= 0 ? `+${rVal}` : `-${rVal}`;
	}

	onValueClicked = () => {
		if (this.popup) this.popup.show();
	}

	onChange = (attributeName, value) => {
		const { onAttributeChange } = this.props;
		if (this.popup) this.popup.hide();
		onAttributeChange(attributeName, value);
	}
	
	render() {
		const {
			attributeName,
			character,
		} = this.props;

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
						<p onClick={this.onValueClicked} className={styles.value}>{rawValue}</p>
					</div>
					<div className={styles.statBoxBonus}>
						<p>{this.getBonus(value)}</p>
					</div>
				</div>
				<PopupControl
					ref={(ref) => this.popup = ref}
				>
					<NumberInput
						giveValueOnEnter
						onChange={(val) => this.onChange(attributeName, val)}
						defaultValue={rawValue}
					/>
				</PopupControl>
			</div>
		)
	}
}
