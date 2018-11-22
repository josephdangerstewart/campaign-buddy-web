import Attribute from '../../../infrastructure/Attribute';
import SpellModal from './components/spell-modal';
import React from 'react';
import 'whatwg-fetch';

export default class Spells extends Attribute {	
	static type = 'spells';
	static group = 'Spells';
	static defaultValue = {};
	static defaultVars = [];

	static getAttributeFromData(name, value, vars, type, category, description) {
		return new Spells(name, value, vars, description, category);
	}
	
	static search(val) {
		return fetch('http://www.dnd5eapi.co/api/spells')
		.then(response => response.json())
		.then(results => results.results.filter(item => item.name.includes(val)).map(item => ({ ...item, type: 'spells'})));
	}

	getModalComponent() {
		return <SpellModal value={this.value} />
	}
}
