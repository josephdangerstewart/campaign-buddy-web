import React from 'react';
import styles from './styles.less';

export default class SpellDescription extends React.Component {
	state = {
		title: 'Loading...',
		phPage: 'Loading...',
		description: 'Loading...',
	}

	formatArray(arr){
		if (!arr) return '';
		var outStr = '';
		if (arr.length === 1) {
			outStr = arr[0];
		} else if (arr.length === 2) {
			//joins all with "and" but no commas
			//example: "bob and sam"
			outStr = arr.join(' and ');
		} else if (arr.length > 2) {
			//joins all with commas, but last one gets ", and" (oxford comma!)
			//example: "bob, joe, and sam"
			outStr = arr.slice(0, -1).join(', ') + ', and ' + arr.slice(-1);
		}
		return outStr;
	}

	componentDidMount() {
		const { value } = this.props;

		if (typeof value === 'object') {
			fetch(value.url)
				.then(response => response.json())
				.then(result => {
					const newState = {
						title: result.name,
						description: result.desc.join('\n\n').replace(/â€™/g, '\''),
						phPage: result.page,
						level: result.level,
						school: result.school.name,
						duration: result.duration,
						classes: this.formatArray(result.classes.map(obj => obj.name)),
						range: result.range,
						components: this.formatArray(result.components),
					};

					if (result.higher_level) {
						newState.atHigherLevels = result.higher_level.join('\n\n');
					}

					this.setState(newState);
				});
		} else {

		}
	}

	getInfo(key, value) {
		return <p className={styles.info}><span className={styles.key}>{key}: </span>{value}</p>
	}
	
	render() {
		const { title, phPage, description, level, school, duration, classes, range, components, atHigherLevels } = this.state;

		return (
			<div className={styles.container}>
				<h1 className={styles.title}>{title}</h1>
				<h2 className={styles.subtitle}>{level > 0 ? `Level ${level}` : 'Cantrip'} | {phPage}</h2>
				{school && this.getInfo('School', school)}
				{range && this.getInfo('Range', range)}
				{duration && this.getInfo('Duration', duration)}
				{classes && this.getInfo('Classes', classes)}
				{components && this.getInfo('Components', components)}
				<h2 className={styles.heading}>Description</h2>
				<p className={styles.description}>{description}</p>
				{atHigherLevels &&
					<div>
						<h2 className={styles.heading}>At Higher Levels</h2>
						<p className={styles.description}>{atHigherLevels}</p>
					</div>
				}
			</div>
		)
	}
}
