import React from 'react';
import SVG from 'react-inlinesvg';
import styles from './styles.less';
import VariableDisplay from '../../../../components/variable-display';

export default class ImageAttribute extends React.Component {
	render() {
		const {
			src,
			value,
			attributeName,
			onChange,
			options,
			control,
			rawValue,
		} = this.props;

		return (
			<div className={styles.svgBackground}>
				<SVG
					src={src}
				/>
				<div className={styles.svgBackgroundContent}>
					<VariableDisplay
						valueClass={styles.number}
						control={control}
						value={value}
						defaultValue={rawValue}
						onChange={onChange}
						options={options}
					/>
				</div>
				<p className={styles.attributeName}>{attributeName}</p>
			</div>
		)
	}
}
