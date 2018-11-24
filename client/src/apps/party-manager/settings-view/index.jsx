import React from 'react';
import PopupControl from '../../../components/popup-control';
import DropDown from '../../../components/drop-down';
import styles from './styles.less';

export default class SettingsPage extends React.Component {
	state = {
		showDropdown: false,
		selectAnchorRef: null,
	}

	options = [
		'select',
		'page',
	]

	showOptions = () => {
		if (this.popup) this.popup.show();
	}

	getAnchorRef = ref => {
		const { selectAnchorRef } = this.state;
		if (!selectAnchorRef && ref) {
			this.setState({
				selectAnchorRef: ref
			});
		}
		else if (!ref) {
			this.setState({
				selectAnchorRef: null,
			})
		}
	}

	onChange = (index) => {
		const { update, config } = this.props;
		config.selectMode = this.options[index];
		update();
	}
	
	render() {
		const { config } = this.props;
		const { selectAnchorRef } = this.state;

		const index = this.options.indexOf(config.selectMode);
	
		return (
			<div className="h100">
				<p className={styles.header}>Party Manager Settings</p>
				<div className={styles.settings}>
					<p className={styles.settingsName}>
						<span>Select Mode:&nbsp;</span>
						<span ref={this.getAnchorRef} onClick={this.showOptions} className={styles.dropdownSelected}>
							{config.selectMode}
						</span>
						<PopupControl
							ref={ref => this.popup = ref}
							left={0}
							anchor={selectAnchorRef}
						>
							<DropDown
								options={this.options}
								onChange={this.onChange}
								width="100px"
							/>
						</PopupControl>
					</p>
				</div>
			</div>
		)
	}
}
