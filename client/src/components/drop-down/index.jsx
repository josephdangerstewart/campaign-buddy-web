import React from 'react';
import styles from './styles.less';

export default class DropDown extends React.Component {
	mapOptions = (option, index) => {
		const { onChange, size } = this.props;

		const divStyle = {};
		const pStyle = {};

		if (size === 'big') {
			divStyle.padding = '20px 25px';
			pStyle.fontSize = '15pt';
		}

		return (
			<div key={index} style={divStyle} className={styles.option} onClick={() => onChange(index)}>
				<p style={pStyle}>{option.name || option}</p>
			</div>
		)
	}
	
	render() {
		const { options, width, maxHeight } = this.props;

		if (!options || options.length === 0) return null;

		let style;
		if (width) {
			style = {
				width,
				maxHeight,
			};
		}

		return (
			<div style={style} className={styles.options}>
				{options.map(this.mapOptions)}
			</div>
		)
	}
}
