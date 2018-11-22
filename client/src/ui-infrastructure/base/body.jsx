import React from 'react';

import styles from '../styles.less';

export default class Body extends React.Component {
	render() {
		return (
			<div className={styles.body}>
				{this.props.children}
			</div>
		)
	}
}