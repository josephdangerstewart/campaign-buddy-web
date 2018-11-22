import React from 'react';
import start from '../infrastructure';

import { getModel, saveModel } from '../clients/drive-client';

import Sidebar from './base/sidebar';
import Body from './base/body';
import Footer from './base/footer';
import MainMenu from './main-menu';
import SaveIndicator from './save-indicator';
import Overlay from './overlay';

import styles from './styles.less';

export default class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			gameController: null,
			sidebarIsOpen: true,
			currentApp: '',
			sidebarApp: '',
			id: props.match.params.id,
			saveState: '',
		}
	}

	componentDidMount() {
		const { id } = this.props.match.params;
		getModel(id, this.modelWasRecieved, this.handleFail);
	}

	modelWasRecieved = (model) => {
		this.setState({
			gameController: start(model.config.gameSystem, model)
		});
	}

	handleFail = (status, message) => {
		console.error(status);
		console.error(message);
	}

	setSidebarApp = (appName) => {
		this.setState({
			sidebarApp: appName,
		});
	}

	setApp = (appName) => {
		this.setState({
			currentApp: appName,
		});
	}

	toMainMenu = () => {
		this.setState({
			currentApp: '',
		});
	}

	handleSaveSuccess = () => {
		this.setState({ saveState: 'saved' });
	}

	updateModel = () => {
		const { gameController, id } = this.state;
		saveModel(gameController.toModel(), id, this.handleSaveSuccess, this.handleFail);
	}

	update = () => {
		this.setState({
			gameController: this.state.gameController,
			saveState: 'saving',
		}, this.updateModel());
	}

	render() {
		const {
			gameController,
			sidebarIsOpen,
			currentApp,
			sidebarApp,
			saveState,
		} = this.state;

		if (!gameController) return null;

		const wrapperStyles = {
			width: sidebarIsOpen ? '80%' : '100%',
			height: '100%',
			display: 'inline-block'
		}

		const App = gameController.getAppComponent(currentApp);
		const SidebarApp = gameController.getAppComponent(sidebarApp);

		return (
			<div className={styles.main}>
				<Overlay ref={ref => this.overlay = ref} />
				{
					sidebarIsOpen ?
						<Sidebar
							title={SidebarApp ? SidebarApp.displayName : 'Campaign Buddy'}
							overlay={this.overlay}
						>
							{
								SidebarApp && SidebarApp.getSidebar ?
									SidebarApp.getSidebar(gameController, this.update)
								:
									null
							}
						</Sidebar>
					: null
				}
				<div style={wrapperStyles}>
					<Body>
						{
							App ?
								<App
									gameController={gameController}
									toMainMenu={this.toMainMenu}
									update={this.update}
									setSidebarApp={this.setSidebarApp}
									overlay={this.overlay}
								/>
							:
								<MainMenu
									icons={gameController.getIcons()}
									setApp={this.setApp}
									overlay={this.overlay}
								/>
						}
					</Body>
					<Footer overlay={this.overlay}>
						{
							App && App.getFooter ?
								App.getFooter(gameController, this.update, this.save)
							:
								null
						}
					</Footer>
				</div>
				<SaveIndicator
					state={saveState}
				/>
			</div>
		)
	}

}
