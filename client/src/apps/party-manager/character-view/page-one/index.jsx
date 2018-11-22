import KeyValuePair from '../key-value-pair';
import Chip from '../chip';
import ImageAttribute from '../image-attribute';
import React from 'react';

export default class PageOne extends React.Component {
	
	mapKeyValuePairs = (attributeName, index) => {
		const { character, onAttributeChange } = this.props;
		const value = character.getValueOf(attributeName);
		if (!value && typeof value === 'object') return null;
		const rawValue = character.getRawValueOf(attributeName);

		let control = character.getValueOfVariableForAttribute(attributeName, 'control');
		let options = character.getValueOfVariableForAttribute(attributeName, 'options');

		let controlIsDropdown = control === 'dropdown' || control === 'combobox';

		if (!control) {
			control = 'input'
		} else if (controlIsDropdown && !options) {
			control = 'input';
			controlIsDropdown = false;
		}

		return (
			<KeyValuePair
				key={index}
				keyName={attributeName}
				value={value}
				control={control}
				options={options}
				rawValue={rawValue}
				onChange={
					controlIsDropdown ? 
						(index) => onAttributeChange(attributeName, options[index]) 
					: 
						(newValue) => onAttributeChange(attributeName, newValue)
				}
			/>
		)
	}

	mapImageAttributes = (attributeName, index) => {
		const { character, onAttributeChange } = this.props;
		const value = character.getValueOf(attributeName);
		if (!value) return null;
		const rawValue = character.getRawValueOf(attributeName);

		let control = character.getValueOfVariableForAttribute(attributeName, 'control');
		let options = character.getValueOfVariableForAttribute(attributeName, 'options');

		let controlIsDropdown = control === 'dropdown' || control === 'combobox';

		if (!control) {
			control = 'input'
		} else if (controlIsDropdown && !options) {
			control = 'input';
			controlIsDropdown = false;
		}

		let image = character.getValueOfVariableForAttribute(attributeName, 'imageUrl');
		if (!image) image = '/images/speed_icon.svg';
		return (
			<ImageAttribute
				src={image}
				value={value}
				key={index}
				attributeName={attributeName}
				control={control}
				options={options}
				onChange={
					controlIsDropdown ?
						(index) => onAttributeChange(attributeName, options[index])
					:
						(val) => onAttributeChange(attributeName, val)
				}
				rawValue={rawValue}
			/>
		);
	}

	removeChip = (chip) => {
		const { character, update } = this.props;
		character.setValueOf(chip, false);
		update();
	}

	addChip = (chip) => {
		const { character, update } = this.props;
		const value = character.getValueOf(chip);
		if (value) return;
		character.setValueOf(chip, true);
		update();
	}

	mapChips = (attributeName, index) => {
		const { character } = this.props;
		const value = character.getValueOf(attributeName);
		if (!value) return null;
		let icon = character.getValueOfVariableForAttribute(attributeName, 'iconName');
		return (
			<Chip
				value={attributeName}
				icon={icon}
				key={index}
				onRemove={this.removeChip}
			/>
		);
	}

	filterChips = (chip) => {
		const { character } = this.props;
		const value = character.getValueOf(chip);
		return !value;
	}
	
	render() {
		const { character, rowClass } = this.props;
		const attributes = character.getAttributes();
		const imageAttributes = character.getImageAttributes();
		const chipAttributes = character.getChipAttributes();

		return (
			<div>
				<div className={rowClass}>
					{imageAttributes.map(this.mapImageAttributes)}
				</div>
				<div className={rowClass}>
					{chipAttributes.map(this.mapChips)}<Chip options={chipAttributes.filter(this.filterChips)} onNew={this.addChip} isAddNew={true}/>
				</div>
				<div className={rowClass}>
					{attributes.map(this.mapKeyValuePairs)}
				</div>
			</div>
		);
	}
}
