import React from 'react';
import Input from '../input';
import DropDown from '../drop-down';
import styles from './styles.less';

export default class ComboBox extends React.Component {
	state = {
		search: '',
	}

	searchOptions = (search) => {
		const { options, showOptions } = this.props;
		if (!search && showOptions) return options;
		else if (!search) return [];
		return options.filter((option) => {
			const value = option.name || option;
			return value.toLowerCase().includes(search.toLowerCase())
		});
	}

	handleInputChange = (search) => {
		this.setState({ search });
	}

	handleEnter = () => {
		const { search } = this.state;
		const {
			canAddNew,
			options,
			onChange,
			onAddNew,
		} = this.props;

		let index;
		const searchIsOption = !!options.find((option, i) => {index = i; return (option.name || option) === search});
		if (searchIsOption) return onChange(index, options[index]);

		if (canAddNew && onAddNew) return onAddNew(search);
		else if (canAddNew) return onChange(search);
	}

	handleTab = () => {
		const { options } = this.props;
		const { search } = this.state;
		const approximate = options.find(option => option.name ? option.name.includes(search) : option.includes(search));
		if (approximate) {
			this.setState({ search: approximate });
		}
	}

	focus = () => {
		if (this.input) this.input.focus();
	}

	handleChange = (index, resultSet) => {
		const { onChange, options } = this.props;
		const result = resultSet[index];
		return onChange(options.indexOf(result), result);
	}

	render() {
		const { search } = this.state;
		const { width, size, maxHeight } = this.props;
		const results = this.searchOptions(search);

		let inputPadding, inputFontSize;

		if (size === 'big') {
			inputPadding = '10px 15px';
			inputFontSize = '22pt';
		}

		return (
			<div className={styles.comboBox} style={{width: typeof width === 'string' ? width : width ? `${width}px` : '200px'}}>
				<Input
					value={search}
					onChange={this.handleInputChange}
					onEnter={this.handleEnter}
					onTab={this.handleTab}
					ref={(ref) => (this.input = ref)}
					padding={inputPadding}
					fontSize={inputFontSize}
					width="100%"
				/>
				<DropDown
					options={results}
					width="90%"
					onChange={(index) => this.handleChange(index, results)}
					size={size}
					maxHeight={maxHeight}
				/>
			</div>
		)
	}
}
