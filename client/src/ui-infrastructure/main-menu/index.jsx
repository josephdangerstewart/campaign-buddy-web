import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles.less';

export default class MainMenu extends React.Component {
	mapIcon = (icon, index) => {
		return (
			<div key={index} className={styles.icon} onClick={() => this.props.setApp(icon.name)}> 
				<SVG
					src={icon.url}
				/>
				<p>{icon.displayName}</p>
			</div>
		)
	} 
	
	render() {
		const {
			icons,
		} = this.props

		return (
			<div className={styles.container}>
				{icons.map(this.mapIcon)}
			</div>
		)
	}
}