import React from 'react';
import styles from './styles.less';
import DataList from '../../../../components/data-list';
import Button from '../../../../components/button';

export default class DynamicDataList extends React.Component {
	state = {
		removing: false
	}

	mapData = (data, index) => {
		const { removing } = this.state;
		if (!removing) return data;
		const { onRemove } = this.props;
		const isObject = typeof data === 'object';
		if (isObject) 
			return {
				name: data.name,
				onClick: () => {
					onRemove(data.name, index);
					this.setState(({ removing }) => ({ removing: !removing }));
				}
			};
		
		return {
			name: data,
			onClick: () => {
				onRemove(data, index);
				this.setState(({ removing }) => ({ removing: !removing }));
			}
		};
	}
	
	render() {
		const {
			data,
			title,
			onAdd,
		} = this.props;

		const { removing } = this.state;

		return (
			<div className={styles.container}>
				<DataList
					data={data.map(this.mapData)}
					title={title}
					height="100%"
					elementClass={removing ? styles.removing : null}
				/>
				<div className={styles.buttons}>
					<Button
						icon="plus"
						onClick={onAdd}
					/>
					<Button
						icon="minus"
						onClick={() => this.setState(({ removing }) => ({removing: !removing}))}
					/>
				</div>
			</div>
		)
	}
}
