import React from 'react';
import styles from './styles.less';

export default class Overlay extends React.Component {
	state = {
		showing: false,
		Component: null,
		props: {},
	}
	
	show = (Component, props) => {
		if (!Component && (props && typeof props === 'object')) return;
		this.setState({
			Component,
			showing: true,
			props: props,
		});
	}

	hide = () => {
		this.setState({
			showing: false,
			Component: null,
			props: {},
		});
	};
	
	render() {
		const { Component, showing, props } = this.state;

		if (showing) {
			return (
				<div className={styles.overlay}>
					<Component
						{...props}
						hideOverlay={this.hide}
					/>
				</div>
			)
		}
		return null;
	}
}
