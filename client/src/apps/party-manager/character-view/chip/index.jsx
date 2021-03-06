import React from 'react';
import Button from '../../../../components/button';
import ComboBox from '../../../../components/combo-box';
import PopupControl from '../../../../components/popup-control';
import styles from './styles.less';

export default class Chip extends React.Component {
	state = {
		newChipRef: null,
	}
	
	newClicked = () => {
		if (this.popup) {
			this.popup.show();
		}
	}

	makeNew = (index) => {
		const { options, onNew } = this.props;
		onNew(options[index]);
	}

	getAnchorPoint = ref => {
		const { newChipRef } = this.state;
		if (!newChipRef && ref) {
			this.setState({
				newChipRef: ref
			});
		} else if (!ref) {
			this.setState({
				newChipRef: null
			})
		}
	}
	
	render() {
		const {
			icon,
			value,
			onRemove,
			isAddNew,
			options,
		} = this.props;

		const { newChipRef } = this.state;

		if (isAddNew && options && options.length > 0) {
			return (
				<div className={styles.chipContainer}>
					<span ref={this.getAnchorPoint} onClick={this.newClicked} className={`${styles.chip} ${styles.chipNew}`}><i className="fa fa-plus"></i></span>
					{
						<PopupControl anchor={newChipRef} ref={(ref) => (this.popup=ref)}>
							<ComboBox
								width={150}
								options={options}
								onChange={this.makeNew}
								showOptions
							/>
						</PopupControl>
					}
				</div>
			)
		} else if (isAddNew) {
			return null;
		}

		return (
			<span className={styles.chip}>
				{
					icon ? 
						<span className={styles.icon}><i className={`fa fa-${icon}`}></i></span> 
					: 
						null
				}
				{value}
				{
					onRemove ?
						<Button
							icon="times"
							onClick={() => onRemove(value)}
							iconClass={styles.removeIcon}
						/>
					:
						null
				}
			</span>
		)
	}
}
