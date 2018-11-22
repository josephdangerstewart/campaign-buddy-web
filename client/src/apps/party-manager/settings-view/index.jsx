import React from 'react';
import PopupControl from '../../../components/popup-control';
import DropDown from '../../../components/drop-down';
import styles from './styles.less';

export default class SettingsPage extends React.Component {
	state = {
		showDropdown: false,
	}

	options = [
		'select',
		'page',
	]

	showOptions = () => {
		if (this.popup) this.popup.show();
	}

	onChange = (index) => {
		const { update, config } = this.props;
		config.selectMode = this.options[index];
		update();
		this.setState({
			showDropdown: false
		});
	}
	
	render() {
		const { config } = this.props;
		const { showDropdown } = this.state;

		const index = this.options.indexOf(config.selectMode);
	
		return (
			<div className="h100">
				<p className={styles.header}>Party Manager Settings</p>
				<div className={styles.settings}>
					<p className={styles.settingsName}>Select Mode:&nbsp;
						<span onClick={this.showOptions} className={styles.dropdownSelected}>
							{config.selectMode}
							<PopupControl
								ref={ref => this.popup = ref}
								left={0}
							>
								<DropDown
									options={this.options}
									onChange={this.onChange}
									width="100px"
								/>
							</PopupControl>
						</span>
					</p>
				</div>
			</div>
		)
	}
}
