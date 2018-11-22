import React from 'react';
import styles from './styles.less';

export default class PopupControl extends React.Component {
	constructor(props) {
		super(props);
		let showing = false
		if (props.defaultShowing) {
			showing = true;
		}
		this.state = {
			showing,
		};
	}

	documentListener = (ev) => {
		if (!this.clickedMe(ev.target)) this.hide();
	}

	clickedMe = (node) => {
		if (!node || !this.node) return false;
		if (node.isEqualNode(this.node)) return true;
		return this.clickedMe(node.parentNode);
	}

	componentDidMount() { 
		this._ismounted = true;
	}
	
	componentWillUnmount() {
		this._ismounted = false;
	}

	show() {
		if (!this._ismounted) return;
		this.setState({ showing: true });
		document.addEventListener('click', this.documentListener);
	}

	hide() {
		if (!this._ismounted) return;
		this.setState({ showing: false });
		document.removeEventListener('click', this.documentListener);
	}

	toggle() {
		if (!this._ismounted) return;
		this.setState(({ showing }) => ({ showing: !showing }));
	}

	handleRef = (ref) => {
		if (ref && ref.focus) ref.focus();
	}

	handleSelfRef = (ref) => {
		const { left } = this.props;
		if (!ref) return;

		this.node = ref;
		const { width, x } = ref.getBoundingClientRect();
		const diff = (width + x + leftOffset) - window.innerWidth;
		const leftOffset = (typeof left === 'number') ? left : (-(width/2));
		if (diff > 0) {
			if (leftOffset + diff + 30 > 0)
				ref.style.left = `${leftOffset + diff + 30}px`;
			else
				ref.style.left = `-${(-1) * (leftOffset + diff + 30)}px`;
		} else {
			if (leftOffset > 0)
				ref.style.left = `${leftOffset}px`;
			else
				ref.style.left = `-${leftOffset * (-1)}px`
		}
	}

	render() {
		const { children } = this.props;
		const { showing } = this.state;

		if (!showing) return null;

		return (
			<div ref={this.handleSelfRef} className={styles.container}>
				{
					typeof children === 'object' ?
						React.cloneElement(children, { ref: this.handleRef })
					:
						null
				}
			</div>
		)
	}
}
