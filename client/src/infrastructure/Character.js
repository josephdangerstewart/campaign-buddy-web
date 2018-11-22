import CharacterDelta from "./CharacterDelta";

/* Instances of this class represent both player and non-player characters */

export default class Character {
	name = 'Barry Jazz';
	playerName = 'Joseph Stewart';
	level = 1;
	attributes = [];
	items = [];
	deltas = [];
	isNPC = false;
	rawModel = {};
	iconUrl = '/images/elf.svg';

	gameController = null;

	constructor(data, gameController) {
		if (!data || !gameController) return null;

		this.name = data.name;
		this.playerName = data.playerName;
		this.level = data.level || 1;
		this.isNPC = data.isNPC || false;

		this.gameController = gameController;
		this.rawModel = data;

		data.attributes.forEach(this._addAttributeFromModel);
		data.items.forEach(item => this.items.push(gameController.getItem(item)));
	}

	_addAttributeFromModel = (model) => {
		const attribute = this.gameController.getAttribute(model);
		if (attribute) this.attributes.push(attribute);
	}

	toModel = () => {
		return {
			name: this.name,
			playerName: this.playerName,
			level: this.level,
			isNPC: this.isNPC,
			attributes: this.attributes.map(attribute => attribute.toModel()),
			items: this.items.map(item => item.toModel()),
		};
	}

	_categoryIsInMask = (category, mask) => {
		const categories = category.split(' ');

		for (let i = 0; i < mask.length; i++) {
			for (let x = 0; x < categories.length; x++) {
				if (categories[x] === mask[i]) return true;
			}
		}
		return false;
	}

	getItems = () => {
		return this.items.filter(item => item.count > 0);
	}

	addItem = (itemName, count = 1, vars, type) => {
		const m_item = this.items.find(item => item.itemName === itemName);

		if (m_item && m_item.stackable) {
			m_item.count += count;
		} else {
			this.items.push(this.gameController.getItem(itemName, count, vars, type));
		}
	}

	removeItem = (itemName, count = 1) => {
		const m_item = this.items.find(item => item.itemName === itemName);
		if (m_item) {
			m_items.count -= count;
		}
	}

	getAttributes = (mask = []) => {
		const reservedAttributes = this.gameController.getReservedAttributeCategories();
		return this.attributes.filter(attribute => !this._categoryIsInMask(attribute.category, reservedAttributes) && !mask.find((m) => m === attribute.attributeName)).map(attribute => attribute.attributeName);
	}

	getStatAttributes = () => {
		return this.gameController.getAttributesInCategory('stat');
	}

	getImageAttributes = () => {
		return this.gameController.getAttributesInCategory('image');
	}

	getChipAttributes = () => {
		return this.gameController.getAttributesInCategory('chip');
	}

	getHeaderAttributes = () => {
		return this.gameController.getAttributesInCategory('header');
	}

	calcStatBonus = (value) => {
		return this.gameController.calcStatBonus(value);
	}

	setIconUrl = (url) => {
		this.iconUrl = url;
	}

	getIconUrl = () => {
		return this.iconUrl;
	}

	getLevel = () => {
		return this.level;
	}

	setName = (name) => {
		this.name = name;
	}

	setPlayerName = (name) => {
		this.playerName = name;
	}

	setValueOf = (attributeName, value) => {
		if (typeof attributeName !== 'string') return;
		const attribute = this.attributes.find((at) => at.attributeName === attributeName);
		if (!attribute) {
			let newAttribute = this.gameController.getAttribute(attributeName, value);
			if (!newAttribute) return;
			this.attributes.push(newAttribute);
		} else {
			attribute.value = value;
		}
	}

	addAttribute = (attributeName, value, vars, type, category, description) => {
		const attribute = this.gameController.getAttribute(attributeName, value, vars, type, category, description);
		if (!attribute) return null;
		this.attributes.push(attribute);
	}

	removeAttribute = (attributeName) => {
		const index = this.attributes.findIndex(at => at.attributeName === attributeName);
		if (index < 0) return;
		this.attributes.splice(index, 1);

	}

	getModalComponentForAttribute = attributeObject => {
		const attribute = this.attributes.find(at => at.attributeName === attributeObject.attributeName);
		return attribute.getModalComponent();
	}

	getValueOfVariableForAttribute = (attributeName, variableName) => {
		if (typeof attributeName !== 'string' || typeof variableName !== 'string') return null;

		const attribute = this.attributes.find((at) => at.attributeName === attributeName);

		if (!attribute) return null;
		return attribute.getValueOfVariable(variableName);
	}

	getValueOf = (attributeName) => {
		if (typeof attributeName !== 'string') return null;

		const attribute = this.attributes.find((at) => at.attributeName === attributeName);

		if (!attribute) return null;
		else if (typeof attribute.value !== 'number') return attribute.value;
		let val = attribute.value;

		val = CharacterDelta.ops.reduce((ac, val) => {
			return this._applyDeltas(attributeName, val.op, val.func, ac);
		}, val);

		return val;
	}

	getAttributeGroups = () => {
		const myGroups = {};
		const allGroups = this.gameController.getAttributeGroups();
		allGroups.forEach(group => {
			myGroups[group] = [];
			this.attributes.forEach(attribute => {
				const categories = attribute.category.split(' ');
				categories.forEach(category => {
					if (category.startsWith('group-') && category.split('-')[1] === group) {
						myGroups[group].push({ ...attribute, name: attribute.attributeName });
					}
				});
			})
		})
		return myGroups;
	}

	getName() {
		return this.name;
	}

	getPlayerName() {
		return this.playerName;
	}

	getRawValueOf = (attributeName) => {
		if (typeof attributeName !== 'string') return null;

		const attribute = this.attributes.find((at) => at.attributeName === attributeName);

		if (!attribute) return null;
		
		return attribute.value;
	}

	load = () => {
		this.deltas = [];
		this.attributes.forEach(this._initAttributes);
		this.items.forEach(item => this.deltas.push(item.onEquip(this)));

		this.deltas.forEach((delta) => {
			delta.changes.forEach(change => {
				if (change.op === 'setIcon') {
					this.iconUrl = change.value;
				}
			})
		})
	}

	/* PRIVATE METHODS */

	_applyDeltas = (target, op, callback, value) => {
		return this.deltas.reduce((val, delta) => {
			if (delta.changes.length <= 0) return val;
			return delta.changes.filter(delta => delta.op === op && delta.target === target)
					  .map(delta => delta.value)
					  .reduce(callback, val);
		}, value);
	}

	_getItemFromDelta = (delta) => {
		return this.gameController.getItem(delta.target, delta.value);
	}

	_initAttributes = (attribute) => {
		const children = attribute.children;
		this.deltas.push(attribute.onLoad(this));
		if (children && children.length > 0) children.forEach(_initAttributes);
	}
}