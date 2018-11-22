import React from 'react';

import styles from '../styles.less';

export default class Sidebar extends React.Component {
	render() {
		const {
			title,
			children,
		} = this.props;

		return (
			<div className={styles.sidebar}>
				<div className={styles.sidebarHeader}>
					<h2>{title}</h2>
				</div>
				{children}
			</div>
		);
	}
}
