import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.less';

export default class Portal extends React.Component {
	
	componentWillMount() {
		this.element = document.getElementById('react-portal');
	}
	
	render() {
		const { children, dimOverlay, onOverlayClick } = this.props;

		const inlineStyle = { backgroundColor: dimOverlay ? 'rgba(111, 116, 142, 0.2)' : ''}

		return ReactDOM.createPortal(
			(
				<div className={styles.container} style={inlineStyle} onClick={onOverlayClick}>
					{children}
				</div>
			),
			this.element
		)
	}
}