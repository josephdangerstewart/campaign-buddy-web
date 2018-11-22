import React from 'react';
import styles from './styles.less';

import ComboBox from '../combo-box';

export default class SearchModal extends React.Component {
	overlayClicked = (event) => {
		const { hideOverlay } = this.props;
		if (event.target.id === 'search-modal') hideOverlay();
	}

	componentDidMount = () => {
		if (this.combobox) this.combobox.focus();
	}

	handleChange = (index, value) => {
		const { onChange, hideOverlay } = this.props;
		onChange(index, value);
		hideOverlay();
	}
	
	render() {
		const { options } = this.props;

		return (
			<div id="search-modal" onClick={this.overlayClicked} className={styles.container}>
				<ComboBox
					size="big"
					width="80%"
					maxHeight="400px"
					onChange={this.handleChange}
					options={options}
					showOptions
					ref={ref => this.combobox = ref}
				/>
			</div>
		)
	}
}
