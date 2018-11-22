import React from 'react';
import SVG from 'react-inlinesvg';

import VariableDisplay from '../../../../components/variable-display';

import styles from './styles.less';

export default class CharacterHeaderCard extends React.Component {
	getControls = (attributeName) => {
		const { character } = this.props;
		let control = character.getValueOfVariableForAttribute(attributeName, 'control');
		let options = character.getValueOfVariableForAttribute(attributeName, 'options');

		let controlIsDropdown = control === 'dropdown' || control === 'combobox';

		if (!control) {
			control = 'input'
		} else if (controlIsDropdown && !options) {
			control = 'input';
			controlIsDropdown = false;
		}

		return {
			control,
			options,
			controlIsDropdown
		}
	}

	onChange = (controlIsDropdown, attributeName, value, options) => {
		const { onAttributeChange } = this.props;
		if (controlIsDropdown) {
			return onAttributeChange(attributeName, options[value]);
		} else {
			return onAttributeChange(attributeName, value);
		}
	}
	
	getHeaderAttributes = () => {
		const { headerAttributes, character } = this.props;
		const rVal = [];

		for (let i = 0; i < headerAttributes.length; i+=2) {
			let showLabel = character.getValueOfVariableForAttribute(headerAttributes[i], 'displayLabel');
			if (showLabel !== false) showLabel = true;
			const value = character.getValueOf(headerAttributes[i]);
			const rawValue = character.getRawValueOf(headerAttributes[i]);
			const controlObj = this.getControls(headerAttributes[i]);

			let showLabel2 = false;
			let controlObj2 = {};
			let value2, rawValue2;
			if (i+1 < headerAttributes.length) {
				showLabel2 = character.getValueOfVariableForAttribute(headerAttributes[i+1], 'displayLabel');
				value2 = character.getValueOf(headerAttributes[i+1]);
				rawValue2 = character.getRawValueOf(headerAttributes[i+1]);
				if (showLabel2 !== false) showLabel2 = true;
				controlObj2 = this.getControls(headerAttributes[i+1]);
			}

			rVal.push(
				<div key={i} className={styles.subtitle}>
					{showLabel ? `${headerAttributes[i]} ` : null}
					<VariableDisplay
						valueClass={showLabel ? styles.value : null}
						value={value}
						onChange={(val) => this.onChange(controlObj.controlIsDropdown, headerAttributes[i], val, controlObj.options)}
						control={controlObj.control}
						options={controlObj.options}
						defaultValue={rawValue}
					/>
					{
						(i+1 < headerAttributes.length) ?
							<span>&nbsp;-
								{
									showLabel2 ?
										` ${headerAttributes[i+1]}`
									:
										null
								}
								&nbsp;<VariableDisplay
									valueClass={showLabel2 ? styles.value : null}
									value={value2}
									onChange={(val) => this.onChange(controlObj2.controlIsDropdown, headerAttributes[i+1], val, controlObj2.options)}
									control={controlObj2.control}
									options={controlObj2.options}
									defaultValue={rawValue2}
								/>
							</span>
						:
							null
					}
				</div>
			)
		}

		return rVal;
	}

	onNameChange = (name) => {
		const { update, character } = this.props;
		character.setName(name);
		update();
	}

	onPlayerNameChange = (name) => {
		const { update, character } = this.props;
		character.setPlayerName(name);
		update();
	}
	
	render() {
		const {
			character,
		} = this.props;

		const name = character.getName();
		const playerName = character.getPlayerName();

		return (
			<div className={styles.characterHeaderContainer}>
				<div className={styles.characterIcon}>
					<SVG
						src={character.getIconUrl()}
					/>
				</div>
				<div className={styles.characterInfo}>
					<VariableDisplay
						valueClass={`p ${styles.name}`}
						value={name}
						onChange={this.onNameChange}
						control="input"
						defaultValue={name}
					/>
					<div className={`p ${styles.subtitle}`}>
						<VariableDisplay
							value={playerName}
							onChange={this.onPlayerNameChange}
							control="input"
							defaultValue={playerName}
						/> - Level: {character.getLevel()}</div>
					{this.getHeaderAttributes()}
				</div>
			</div>
		)
	}
}
