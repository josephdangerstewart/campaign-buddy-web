import React from 'react';
import styles from './styles.less';
import keyboard from 'keyboardjs';
import Button from '../../../../components/button';

export default class PageControl extends React.Component {

	componentDidMount() {
		keyboard.bind('ctrl + left', this.leftClicked);
		keyboard.bind('ctrl + right', this.rightClicked);
	}

	componentWillUnmount() {
		keyboard.unbind('ctrl + left', this.leftClicked);
		keyboard.unbind('ctrl + right', this.rightCLicked);
	}

	mapButtons = () => {
		const {
			pageCount,
			page,
			onPageChange,
		} = this.props;

		const buttons = [];

		for (let i = 0; i < pageCount; i++) {
			buttons.push(
				<Button
					icon="circle"
					iconClass={page !== i ? styles.icon : styles.iconActive}
					onClick={() => onPageChange(i)}
					key={i}
				/>
			);
		};

		return buttons;
	}

	leftClicked = (e) => {
		if (e) {
			e.preventDefault();
		}
		const { page, onPageChange } = this.props;
		if (page - 1 >= 0) onPageChange(page - 1);
	}

	rightClicked = (e) => {
		if (e) {
			e.preventDefault();
		}
		const { page, onPageChange, pageCount } = this.props;
		if (page + 1 < pageCount) onPageChange(page + 1);
	}

	render() {
		return (
			<div className={styles.container}>
				<Button 
					icon="caret-left"
					onClick={this.leftClicked}
				/>
				{this.mapButtons()}
				<Button
					icon="caret-right"
					onClick={this.rightClicked}
				/>
			</div>
		)
	}
}
