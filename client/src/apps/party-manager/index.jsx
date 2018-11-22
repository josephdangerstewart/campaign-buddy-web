import React from 'react';
import keyboard from 'keyboardjs';
import PartyMemberView from './character-view';
import SelectPage from './select-view';
import ListBox from '../../components/list-box';
import SettingsView from './settings-view';
import BackButtonBar from '../../components/back-button-bar';

import styles from './styles.less';

export default class PartyManager extends React.Component {
	static appName = 'partyManager';
	static displayName = 'Party Manager';
	static iconUrl = '/images/party_manager_icon.svg';

	// Use the init function to transform raw data into the datatypes you need and to do any defaulting
	// this method should NOT altar or add to the model
	static init(model, gameController) {
		model.data.party = model.data.party.map((item) => gameController.createPlayerCharacter(item));
		if (model.data.party[0]) model.data.party[0].addItem('sword', 4);
	}

	static toModel(model) {
		const party = model.data.party.map(char => char.toModel());

		return {
			config: {...model.config},
			data: {
				...model.data,
				party,
			}
		}
	}

	// Use this function define what the sidebar component should be
	// by design, it should be read only, but it is not necesary
	static getSidebar(gameController, update) {

	}

	static getFooter(gameController, update) {

	}

	constructor(props) {
		super(props);
		this.state = {
			view: 'select',
			partyMember: 0,
		}
	}

	setPartyMember = (memberId) => {
		this.setState({ partyMember: memberId });
	}

	setView = (view) => {
		this.setState({ view });
	}

	onSettings = () => {
		this.setState({ view: 'settings' });
	}

	handleUp = () => {
		this.setState(({ partyMember }) => {
			if (partyMember - 1 < 0) return {};
			return { partyMember: partyMember - 1 };
		});
	}

	handleDown = () => {
		this.setState(({ partyMember }) => {
			const { gameController } = this.props;
			const { data } = gameController.getApp('partyManager');
			if (partyMember + 1 >= data.party.length) return {};
			return { partyMember: partyMember + 1 };
		});
	}

	componentDidMount() {
		keyboard.bind('ctrl + up', this.handleUp);
		keyboard.bind('ctrl + down', this.handleDown);
	}

	componentWillUnmount() {
		keyboard.unbind('ctrl + up', this.handleUp);
		keyboard.unbind('ctrl + down', this.handleDown);
	}

	onBack = () => {
		const { view } = this.state;
		const { gameController, toMainMenu } = this.props;

		const { selectMode } = gameController.getApp('partyManager').config;

		if ((selectMode === 'select' && view !== 'settings') || view === 'select') {
			toMainMenu();
		} else {
			this.setState({ view: 'select' });
		}
	}

	addPartyMember = () => {
		const { gameController, update } = this.props;
		const { data } = gameController.getApp('partyManager');
		const character = gameController.createPlayerCharacter();

		character.setName(`Character ${data.party.length + 1}`);
		character.setPlayerName(`Player ${data.party.length + 1}`);

		data.party.push(character);
		update();
	}

	removePartyMember = () => {
		const { partyMember } = this.state;
		const { gameController, update } = this.props;
		const { data } = gameController.getApp('partyManager');

		if (data.party[partyMember]) {
			data.party.splice(partyMember, 1);
			update();
		}
	}
	
	render() {
		const { 
			gameController,
			update,
			overlay,
		} = this.props;

		const {
			view,
			partyMember,
		} = this.state;

		const {
			config,
			data: app,
		} = gameController.getApp('partyManager');

		const MemberView = (
			<PartyMemberView
				character={app.party[partyMember]}
				update={update}
				searchAttributeInGroup={gameController.searchAttributeInGroup}
				overlay={overlay}
			/>
		)

		return (
			<div className="h100">
				<BackButtonBar
					onBack={this.onBack}
					onSettings={view !== 'settings' ? this.onSettings : null}
				/>
				{
					view === 'select' && config.selectMode === 'page' ?
						<SelectPage
							party={app.party}
							setPartyMember={(index) => { this.setPartyMember(index); this.setView('party-member') }}
						/>
					: view === 'settings' ?
						<SettingsView
							config={config}
							update={update}
						/>
					: config.selectMode !== 'page' ?
						<div className={`h100 ${styles.selectModeContainer}`}>
							<div className={styles.listContainer}>
								<ListBox
									options={app.party.map((char) => char.getName())}
									selectedOption={partyMember}
									onChange={this.setPartyMember}
									title="Party"
									onAdd={this.addPartyMember}
									onRemove={this.removePartyMember}
								/>
							</div>
							<div className={styles.bodyContainer}>
								{MemberView}
							</div>
						</div>
					:
						<div className="h100">
							{MemberView}
						</div>
				}
			</div>
		);
	}
}
