import React from 'react';
import styles from './styles.less';
import Button from '../button';

export default class ModalContainer extends React.Component {
	overlayClicked = e => {
		const { hideOverlay } = this.props;
		if (e.target.id === 'modal-container') hideOverlay();
	}
	
	render() {
		const { children, hideOverlay} = this.props;

		return (
			<div id="modal-container" className={styles.container} onClick={this.overlayClicked}>
				<div className={styles.modal}>
					<Button iconClass={styles.button} icon="times" onClick={hideOverlay}/>
					{children}
				</div>
			</div>
		)
	}
}
