import React from 'react';
import styles from './styles.less';
import SVG from 'react-inlinesvg';

export default class NoCharacter extends React.Component {
	render() {
		return (
			<div className={styles.container}>
				<div className={styles.flexChild}>
					<SVG className={styles.image} src="/images/broken_shield.svg" />
					<p className={styles.text}>No Character Selected</p>
				</div>
			</div>
		)
	}
}
