import React from 'react';

import Button from '../button';

import styles from './styles.less';

export default class BackButtonBar extends React.Component {
	render() {
		const {
			onBack,
			onSettings,
		} = this.props;

		return (
			<div className={styles.container}>
				<Button onClick={onBack} icon="arrow-left" isCircle />
				{
					onSettings ? 
						<Button onClick={onSettings} icon="cog" isCircle />
					:
						null
				}
			</div>
		)
	}
}
