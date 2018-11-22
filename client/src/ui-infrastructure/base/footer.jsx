import React from 'react';

import styles from '../styles.less';

export default class Footer extends React.Component {
	render() {
		return (
			<div className={styles.footer}>
				{this.props.children}
			</div>
		)
	}
}
