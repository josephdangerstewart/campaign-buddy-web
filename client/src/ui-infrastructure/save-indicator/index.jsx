import React from 'react';
import Icon from 'react-fontawesome';
import styles from './styles.less';

export default class SaveIndicator extends React.Component {
	render() {
		const { state } = this.props;

		if (state === 'saving') {
			return (
				<div className={styles.container}><span><Icon name="cog" spin /></span></div>
			);
		}

		if (state === 'saved') {
			return (
				<div className={`${styles.saved} ${styles.container}`}>Saved!</div>
			);
		}

		return null;
	}
}
