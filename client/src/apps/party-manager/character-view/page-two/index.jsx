import React from 'react';
import DynamicDataList from '../dynamic-data-list';
import SearchModal from '../../../../components/search-modal';
import ModalContainer from '../../../../components/modal-container';
import styles from './styles.less';

export default class PageTwo extends React.Component {
	onAddAttributeToGroup = (group) => {
		const { searchAttributeInGroup, overlay } = this.props;
		console.log(`Searching through ${group}`);
		searchAttributeInGroup(group, '').then(result => {
			overlay.show(SearchModal, {
				options: result,
				onChange: (index, value) => {
					console.log(value);
					this.addAttributeInGroup(value.name || value, value, value.type, value.category, group)
				},
			})
		});
	}

	addAttributeInGroup = (attribute, value, type, category, group) => {
		const { update, character } = this.props;
		character.addAttribute(attribute, value, [], type, `${category || ''} ${group ? `group-${group}`: ''}`);
		update();
	}

	removeAttribute = (attribute) => {
		const { update, character } = this.props;
		character.removeAttribute(attribute);
		update();
	}

	getListObjectForAttribute = (attribute) => {
		const { overlay, character } = this.props;

		if (typeof attribute !== 'object') return attribute;
		return {
			...attribute,
			onClick: () => {
				overlay.show(ModalContainer, {
					children: character.getModalComponentForAttribute(attribute),
				});
			},
		};
	}
	
	mapGroups = (groups) =>
		Object.keys(groups).map(group =>
			<DynamicDataList
				title={group}
				data={groups[group].map(this.getListObjectForAttribute)}
				onAdd={() => this.onAddAttributeToGroup(group)}
				onRemove={this.removeAttribute}
				key={group}
			/>
		);
	
	render() {
		const { character } = this.props;
		const items = character.getItems();
		const groups = character.getAttributeGroups();

		return (
			<div className={styles.container}>
				<DynamicDataList
					title="Items"
					data={items.map(item => `${item.itemName} (${item.count})`)}
					onAdd={() => console.log('adding item')}
					onRemove={(item, index) => console.log(`item: ${item}    index: ${index}`)}
				/>
				{this.mapGroups(groups)}
			</div>
		)
	}
}
