import React from 'react';
import styles from './styles.less';

export default class DataList extends React.Component {
	mapBody = (element, index) => {
		const { elementClass } = this.props;
		const isObject = typeof element === 'object';

		return (
			<div key={index} className={styles.dataListBodyElement}>
				<p
					onClick={isObject && element.onClick ? element.onClick : null}
					className={`${elementClass} ${isObject && element.onClick ? styles.dataListBodyElementInteractive : null}`}
				>{isObject ? element.name : element}</p>
			</div>
		)
	}
	
	render() {
		const {
			data,
			title,
			containerClass,
			height,
			width,
		} = this.props;

		const inlineStyle = { width, height };

		return (
			<div className={`${containerClass} ${styles.dataList}`} style={inlineStyle}>
				<div className={styles.dataListHeader}>
					<p>{title}</p>
				</div>
				<div className={styles.dataListBody}>
					{data.map(this.mapBody)}
				</div>
			</div>
		)
	}
}
