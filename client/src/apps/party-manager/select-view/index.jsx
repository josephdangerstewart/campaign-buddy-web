import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles.less';
import mainMenuStyles from '../../../ui-infrastructure/main-menu/styles.less';

export default class SelectPage extends React.Component {
	mapParty = (character, index) => {
		const { setPartyMember } = this.props;

		return (
			<div key={index} className={mainMenuStyles.icon} onClick={() => setPartyMember(index)}>
				<SVG
					src={character.getIconUrl()}
				/>
				<p className={styles.characterName}>{character.getName()}</p>
			</div>
		)
	}
	
	render() {
		const { party } = this.props;

		return (
			<div className={styles.container}>
				{party.map(this.mapParty)}
			</div>
		)
	}
}
