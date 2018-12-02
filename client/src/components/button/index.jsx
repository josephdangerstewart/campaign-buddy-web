import React from 'react';

import styles from './button.less';

export default class Button extends React.Component {
	handleKeyDown = (e) => {
		const { onEnter } = this.props;

		if (e.keyCode === 13 && onEnter) {
			e.preventDefault();
			onEnter();
		}
	}
	
	render() {
		const {
			children,
			icon,
			isCircle,
			onClick,
			iconClass,
			disabled
		} = this.props;

		let className = styles.button;

		if (isCircle) {
			className = `${styles.buttonCircle}`;
		} else if (icon) {
			className = `${styles.buttonCircle} ${styles.iconButton}`;
		}

		return (
			<button 
				onClick={onClick}
				className={`${className} ${iconClass}`}
				disabled={disabled}
				onKeyDown={this.handleKeyDown}
			>
				{
					icon ?
						<i className={`fa fa-${icon}`}></i>
					:
						children
				}
			</button>
		)
	}
}
