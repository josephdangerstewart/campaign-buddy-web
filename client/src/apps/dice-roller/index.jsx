import React from 'react';
import BackButtonBar from '../../components/back-button-bar';
import SVG from 'react-inlinesvg';
import styles from './styles.less';
import Button from '../../components/button';
import VariableDisplay from '../../components/variable-display';

const diceOptions = [
	20,
	12,
	6,
	4,
]

export default class DiceRoller extends React.Component {
	static appName = 'diceRoller';
	static displayName = 'Dice Roller';
	static iconUrl = '/images/dice_roller_icon.svg';

	state = {
		value: null,
		dice: 20,
		numberOfDice: 1,
	};

	// Use this function define what the sidebar component should be
	// by design, it should be read only, but it is not necesary
	static getSidebar(gameController, update) {

	}

	static getFooter(gameController, update) {

	}

	componentDidMount() {
		const { gameController } = this.props;
		const { lastPickedDice, lastPickedNumberOfDice } = gameController.getApp('diceRoller');

		this.setState({
			dice: lastPickedDice || 20,
			numberOfDice: lastPickedNumberOfDice || 1,
		})
	}

	onBack = () => {
		const { toMainMenu } = this.props;
		toMainMenu();
	}

	onLastPickedDiceChanged = value => {
		const { update, gameController } = this.props;
		const model = gameController.getApp('diceRoller');
		model.lastPickedDice = diceOptions[value];
		this.setState({ dice: diceOptions[value] });
		update();
	}

	onLastPickedNumberOfDiceChanged = value => {
		if (value <= 0) return;
		const { update, gameController } = this.props;
		const model = gameController.getApp('diceRoller');
		model.lastPickedNumberOfDice = value;
		this.setState({ numberOfDice: value });
		update();
	}

	rollDice = () => {
		const { dice, numberOfDice } = this.state;
		let sum = 0;
		for (let i = 0; i < numberOfDice; i++) {
			sum += Math.floor((Math.random() * dice) + 1);
		}
		this.setState({ value: sum });
	}

	render() {
		const { value, dice, numberOfDice } = this.state;

		return (
			<div className="h100">
				<BackButtonBar
					onBack={this.onBack}
				/>
				<div className={styles.grid}>
					<div className={styles.columnGrow}>
						<p className={styles.text}>Rolling&nbsp;
							<VariableDisplay
								value={numberOfDice}
								control="number"
								defaultValue={numberOfDice}
								onChange={this.onLastPickedNumberOfDiceChanged}
							/>
							D
							<VariableDisplay
								value={dice}
								control="dropdown"
								options={diceOptions}
								onChange={this.onLastPickedDiceChanged}
							/>
						</p>
						<div className={styles.svgWrapper}>
							<SVG
								src={`/images/dice/d${dice}.svg`}
							/>
							<p className={styles.svgOverlay}>{value}</p>
						</div>
						<Button onClick={this.rollDice}><p className={styles.buttonText}>Roll!</p></Button>
					</div>
				</div>
			</div>
		)
	}
}