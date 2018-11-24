import React from 'react';
import CharacterHeaderCard from './character-header';
import StatBox from './stat-box';
import PageControl from './page-control';
import NoCharacter from './no-characters';
import PageOne from './page-one';
import PageTwo from './page-two';

import styles from './styles.less';

export default class PartyMemberView extends React.Component {
	state = {
		page: 0,
	};

	pages = [
		PageOne,
		PageTwo,
	]

	mapStatAttributes = (attributeName, index) => {
		const { character } = this.props;
		return (
			<StatBox
				key={index}
				character={character}
				attributeName={attributeName}
				onAttributeChange={this.onAttributeChange}
			/>
		)
	}

	onAttributeChange = (attributeName, newValue) => {
		const { character, update } = this.props;
		character.setValueOf(attributeName, newValue);
		character.load();
		update();
	}

	render() {
		const {
			character,
			update,
			searchAttributeInGroup,
			overlay,
		} = this.props;

		if (!character) return (
			<NoCharacter />
		)

		const { page } = this.state;

		const statAttributes = character.getStatAttributes();
		const headerAttributes = character.getHeaderAttributes();
		const Page = this.pages[page];
		character.load();

		return (
			<div className={`h100 ${styles.container}`}>
				<div className={styles.wrapper}>
					<div className={`${styles.row} ${styles.rowHeader}`}>
						<CharacterHeaderCard
							character={character}
							headerAttributes={headerAttributes}
							onAttributeChange={this.onAttributeChange}
							update={update}
						/>
						{
							statAttributes.length > 0 ?
								<div className={styles.statsBarWrapper}>
									<div className={styles.statsBar}>
										{statAttributes.map(this.mapStatAttributes)}
									</div>
								</div>
								:
								null
						}
					</div>
					<Page
						rowClass={styles.row}
						character={character}
						update={update}
						onAttributeChange={this.onAttributeChange}
						searchAttributeInGroup={searchAttributeInGroup}
						overlay={overlay}
					/>
				</div>
				<PageControl
					pageCount={2}
					page={page}
					onPageChange={(i) => this.setState({ page: i })}
				/>
			</div>
		)
	}
}
