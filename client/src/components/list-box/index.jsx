import React from 'react';
import Button from '../button';
import styles from './list-box.less';

export default class ListBox extends React.Component {
	
	mapOptionToComponent = (option, index) => {
		const { 
			onChange,
			selectedOption
		} = this.props;

		return (
			<div key={index} onClick={() => onChange(index)} className={`${styles.listBoxOption} ${selectedOption === index ? styles.listBoxOptionSelected : ''}`}>
				<span>{option}</span>
			</div>
		)
	}
	
	render() {
		const {
			options,
			title,
			onAdd,
			onRemove,
			onConfirm,
			confirmText,
			confirmDisabled,
		} = this.props;

		return (
			<div className={styles.container}>
				<div className={`${styles.listBox}`}>
					<div className={styles.listBoxHeader}>
						<p>{title}</p>
					</div>
					<div className={styles.listBoxContent}>
						{options.map(this.mapOptionToComponent)}
					</div>
				</div>
				<div className={styles.buttonBar}>
					{
						onAdd ?
							<Button
								icon="plus"
								onClick={onAdd}
							/>
						:
							null
					}
					{
						onConfirm ?
							<Button disabled={confirmDisabled} onClick={onConfirm}>{confirmText || "Confirm"}</Button>
						:
							null
					}
					{
						onRemove ?
							<Button
								icon="minus"
								onClick={onRemove}
							/>
						:
							null
					}
				</div>
			</div>
		)
	}
}
