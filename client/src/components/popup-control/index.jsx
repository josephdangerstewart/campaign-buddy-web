import React from 'react';
import styles from './styles.less';

import Portal from '../portal';

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
		const { onClose } = this.props;
		if (!this.clickedMe(ev.target)) {
			this.hide();
			if (onClose) {
				onClose();
			}
		}
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
	}

	hide() {
		if (!this._ismounted) return;
		this.setState({ showing: false });
	}

	toggle() {
		if (!this._ismounted) return;
		this.setState(({ showing }) => ({ showing: !showing }));
	}

	handleRef = (ref) => {
		if (ref && ref.focus) ref.focus();
	}

	handleSelfRef = (ref) => {
		const { left, anchor, yOffset, xOffset } = this.props;
		if (!ref) return;
		this.node = ref;

		if (anchor) {
			// Get width, bottom y, and left x from anchor element
			const anchorRect = anchor.getBoundingClientRect();
			const anchorWidth = anchorRect.width;
			const anchorBottom = anchorRect.bottom;
			const anchorHeight = anchorRect.height;
			const anchorX = anchorRect.x;

			// Get width from self
			const { width, height } = ref.getBoundingClientRect();

			// get left window height
			const windowHeight = window.innerHeight;
			const windowWidth = window.innerWidth;

			// Calculate new position for self relative to anchor point
			const newX = Math.floor(((anchorWidth / 2) + anchorX) - (width / 2));
			const newY = anchorBottom + (yOffset || 5);
			const newRight = newX + width;
			const newBottom = newY + height;

			let offsetY = 0;
			let offsetX = 0;

			// If the right x coordinate goes outside the window width, set offsetx to move the self inside the window
			if (newRight > (windowWidth + (xOffset || 5))) {
				offsetX = ((newRight-windowWidth) + (xOffset || 5)) * (-1);
			}
			// If the left x goes below the xOffset given through props, bring it inside the window more
			else if (newX < (xOffset || 5)) {
				offsetX = (0 - newX) + (xOffset || 5);
			}

			if (newBottom > (windowHeight + (yOffset || 5))) {
				offsetY = (2 * (yOffset || 5)) + anchorHeight + height;
			}

			ref.style.left = `${newX + offsetX}px`;
			ref.style.top = `${newY + offsetY}px`;
		}
		else {
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
	}

	render() {
		const { children, dimOverlay } = this.props;
		const { showing } = this.state;

		if (!showing) return null;

		return (
			<Portal dimOverlay={dimOverlay} onOverlayClick={this.documentListener}>
				<div ref={this.handleSelfRef} className={styles.container}>
					{
						typeof children === 'object' ?
							React.cloneElement(children, { ref: this.handleRef })
						:
							null
					}
				</div>
			</Portal>
		)
	}
}
