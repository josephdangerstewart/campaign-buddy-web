import Attribute from "./Attribute";
import Item from "./Item";
import Character from "./Character";
import { 
	generateNewModel, 
	generateCharacterModel, 
	validateModel, 
	validateCharacterModel 
} from "../models";
import * as appComponents from '../apps';

export default class GameController {
	
	reservedAttribtueCategories = [
		'stat',
		'hidden',
		'image',
		'chip',
		'header',
	]

	/* Character model instance variables */
	attributeTypeRegistry = {};
	itemTypeRegistry = {};
	
	attributeCategories = {};
	itemCategories = {};

	attributeRegistry = {};
	itemRegistry = {};

	calcStatBonus = () => 0;

	/* each index is an object with keys 'name' (string), 'value' (any), and 'vars' (object) */
	defaultCharacterAttributes = [];
	attributeGroups = {};

	characters = [];

	// Main model variables
	apps = {};
	config = {};
	version = {};

	constructor(data, onInvalidModel) {
		if (!data) {
			data = generateNewModel();
		} else {
			const validationResponse = validateModel(data);
			if (!validationResponse.
				status && onInvalidModel) {
				return onInvalidModel;
			} else if (!validationResponse.status) {
				console.error('Model validation failed and no onFail callback was set');
				console.error(validationResponse);
				data = generateNewModel();
			} else {
				console.log('Model was validated successfully');
			}
		}
		this.registerAttributeType(Attribute);
		this.registerItemType(Item);

		this.rawModel = data;
	}

	_init = () => {
		const me = this;
		for (let key in appComponents) {
			this.apps[appComponents[key].appName] = this.rawModel.apps[appComponents[key].appName];
			appComponents[key].init(this.apps[appComponents[key].appName], me);
		}
	}

	save = (sidebarApp) => {
		
	}

	toModel = () => {
		const appData = {};

		for (let key in appComponents) {
			appData[appComponents[key].appName] = appComponents[key].toModel(this.getApp(appComponents[key].appName));
		}

		return {
			apps: appData,
			config: this.rawModel.config,
			modelVersion: this.rawModel.modelVersion,
		}
	}

	getApp = (app) => {
		if (!this.apps[app]) return null;
		return this.apps[app];
	}

	getAppComponent = (app) => {
		for (let key in appComponents) {
			if (app === appComponents[key].appName) {
				return appComponents[key];
			}
		}
		return null;
	}

	setCalcStatBonus = (func) => {
		if (typeof func !== 'function') return;
		this.calcStatBonus = func;
	}

	getReservedAttributeCategories = () => {
		const cats = [ ...this.reservedAttribtueCategories ];
		for (let group in this.attributeGroups) {
			cats.push(`group-${group}`);
		}
		return cats;
	}

	getAttributeGroups = () => {
		return Object.keys(this.attributeGroups);
	}

	searchAttributeInGroup = (group, search) => {
		if (!this.attributeGroups[group]) return [];
		const rVal = [];

		const filter = (item) => {
			const name = item.name || item;
			return !search || (name.contains && name.contains(search));
		}

		rVal.push(...this.attributeGroups[group].filter(filter));

		const promiseList = [];
		
		for (let type in this.attributeTypeRegistry) {
			const typeClass = this.attributeTypeRegistry[type];

			if (typeClass.group !== group || !typeClass.search) continue;
			promiseList.push(typeClass.search(search));
		}

		return Promise.all(promiseList).then(results => {
			results.forEach(item => rVal.push(...item));
			return rVal;
		});
	}

	getAttributesInCategory = (category) => {
		for (let key in this.attributeCategories) {
			if (key === category) {
				return [ ...this.attributeCategories[key] ];
			}
		}
		return [];
	}

	getItemsInCategory = (category) => {
		for (let key in this.itemCategories) {
			if (key === category) {
				return [ ...this.itemCategories[key] ];
			}
		}
		return [];
	}

	getIcons = () => {
		const icons = [];
		for (let key in appComponents) {
			icons.push({
				name: appComponents[key].appName,
				url: appComponents[key].iconUrl,
				displayName: appComponents[key].displayName,
			});
		}
		return icons;
	}

	createPlayerCharacter(data) {
		const me = this;
		if (!data || !validateCharacterModel(data)) {
			data = generateCharacterModel();
			data.attributes = [
				...this.defaultCharacterAttributes,
			];
		}
		const character = new Character(data, me);
		this.characters.push(character);
		return character;
	}

	getPlayer = (index) => {
		if (this.characters[index]) return this.characters[index];
		return null;
	}

	addDefaultCharacterAttribute(name, value, vars) {
		if (name) {
			this.defaultCharacterAttributes.push({
				name,
				value: value || 0,
				vars: vars || [],
			});
		}
	}

	registerAttributeType(attribute) {
		if (this.attributeTypeRegistry[attribute.type]) throw new Error(`Attribute type ${attribute.attributeName} has already been registered`);
		this.attributeTypeRegistry[attribute.type] = attribute;
	}

	/* Registers a Attribute in the Attribute registry to be used in the App */
	registerAttribute(name, description, category, type, defaultValue, defaultVars) {
		if (!type) type = 'attribute';
		if (this.attributeRegistry[name]) throw new Error (`Attribute ${name} has already been registered`);
		if (!this.attributeTypeRegistry[type]) throw new Error(`Attribute type ${type} does not exist in attribute type registry`);

		this.attributeRegistry[name] = {
			type,
			description,
			category,
			defaultValue,
			defaultVars,
		};

		if (category) {
			this._registerAttributeCategories(category, name, defaultValue, defaultVars);
		}
	}

	_registerAttributeCategories(category, name, defaultValue, defaultVars) {
		const categories = category.split(' ');
		categories.forEach((cat) => {
			if (cat === 'default') this.addDefaultCharacterAttribute(name, defaultValue, defaultVars);
			if (cat.startsWith('group-')) this.addToAttributeGroup(cat.split('-')[1], name);
			if (!this.attributeCategories[cat]) this.attributeCategories[cat] = [];
			if (!this.attributeCategories[cat].includes(name)) this.attributeCategories[cat].push(name);
		});
	}

	addToAttributeGroup(group, name) {
		if (!this.attributeGroups[group]) this.attributeGroups[group] = [];
		this.attributeGroups[group].push(name);
	}

	getAttributesInGroup(group) {
		return this.attributeGroups[group] || null;
	}

	/* Registers a custom Item class that you can register items in */
	registerItemType(item) {
		if (this.itemTypeRegistry[item.type]) throw new Error(`Item type ${item.itemName} has already been registered`);
		this.itemTypeRegistry[item.type] = item;
	}

	/* Registers an item in the item registry, defaults to Item type but can be overridden to support
	   custom item classes */
	registerItem(name, defaultValue, description, category, type) {
		if (!type) type = 'item';
		if (this.itemRegistry[name]) throw new Error(`Item ${name} has already been registered`);
		if (!this.itemTypeRegistry[type]) throw new Error(`Item type ${type} does not exist in item type registry`);

		this.itemRegistry[name] = {
			type,
			defaultValue,
			description,
		};

		if (category) {
			if (!this.itemCategories[category]) this.itemCategories[category] = [];
			this.itemCategories[category].push(name);
		}
	}

	/* Creates an attribute instance either from it's parameters or from a model */
	getAttribute(data, value, vars, type, category, description) {
		//if data is a string then it must be the registered attribute name
		if (typeof data === 'string' && this.attributeRegistry[data]) {
			const attribute = this.attributeRegistry[data];
			return new this.attributeTypeRegistry[attribute.type](data, value, vars || attribute.defaultVars, attribute.description, attribute.category);
		} else if (typeof data === 'string' && type && this.attributeTypeRegistry[type]) {
			const typeClass = this.attributeTypeRegistry[type];
			if (typeClass.defaultCategory) {
				this._registerAttributeCategories(typeClass.defaultCategory, data, typeClass.defaultValue, typeClass.defaultVars);
			}
			return typeClass.getAttributeFromData(data, value, vars, description, category);
		} else if (typeof data !== 'object') {
			throw new Error('Data is not a string or an object or could not be found in attribute registry');
		} else if (data.type && this.attributeTypeRegistry[data.type] && !this.attributeRegistry[data.name]) {
			const typeClass = this.attributeTypeRegistry[data.type];
			if (typeClass.defaultCategory) {
				this._registerAttributeCategories(typeClass.defaultCategory, data.name, typeClass.defaultValue, typeClass.defaultVars);
			}
			return typeClass.getAttributeFromData(data.name, data.value, data.vars, data.description, data.category);
		} else if (!this.attributeRegistry[data.name]) {
			console.error(`${data.name} could not be found in the attribute registry, are you sure it was registered?`);
			return null;
		}
		
		const attribute = this.attributeRegistry[data.name];
		return new this.attributeTypeRegistry[attribute.type](data.name, data.value, data.vars, attribute.description, attribute.category);
	}

	/* Creates an item instance either form it's parameters or from a model */
	getItem(data, value, vars, type) {
		if (typeof data === 'string' && this.itemRegistry[data]) {
			const item = this.itemRegistry[data];
			return new this.itemTypeRegistry[item.type](data, value, vars);
		} else if (typeof data === 'string' && type && this.itemTypeRegistry[type]) {
			return this.itemTypeRegistry[type].getItemFromData(data, value);
		} else if (typeof data !== 'object') {
			throw new Error('Data is not a string or an object or could not be found in item registry');
		} else if (!this.itemRegistry[data.name]) {
			console.error(`${data.name} could not be found in the item registry, are you sure it was registered?`);
			return null;
		}

		const item = this.itemRegistry[data.name];
		return new this.itemTypeRegistry[item.type](data.name, data.count, data.vars, item.description);
	}
}
