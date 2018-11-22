import React from 'react';
import styles from './styles.less';
import VariableDisplay from '../../../../components/variable-display';

export default class KeyValuePair extends React.Component {
	render() {
		const { keyName, rawValue, value, onChange, control, options } = this.props;
		
		return (
			<div className={styles.container}>
				<span className={styles.key}>{keyName}</span>
				<VariableDisplay
					valueClass={styles.value}
					value={value}
					onChange={onChange}
					control={control}
					options={options}
					defaultValue={rawValue}
				/>
			</div>
		)
	}
}
