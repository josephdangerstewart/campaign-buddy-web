/* A character delta represents a list of changes in a character's instance data.
   Think of character deltas as a list of instructions to be carried out 
   on a character like, 'Add +1 to insight skill bonus' or 'Add Bardic
   Inspiration Feature' */

export default class CharacterDelta {
	changes = [];

	changeIcon(url) {
		this.changes.push({
			op: 'setIcon',
			target: '',
			value: url
		})
	}

	addTo(to, value) {
		this.changes.push({
			op: 'add',
			target: to,
			value,
		});
	}

	subtractFrom(from, value) {
		this.changes.push({
			op: 'subtract',
			target: from,
			value,
		});
	}

	multiplyBy(target, value) {
		this.changes.push({
			op: 'multiply',
			target,
			value,
		});
	}

	divideBy(target, value) {
		this.changes.push({
			op: 'divide',
			target,
			value,
		})
	}

	raiseToPower(target, value) {
		this.changes.push({
			op: 'pow',
			target,
			value,
		});
	}

	addItem(item, value) {
		this.changes.push({
			op: 'item',
			target: item,
			value,
		});
	}

	get(op) {
		return this.changes.filter(change => change.op === op);
	}
}
CharacterDelta.ops = [
	{
		op: 'add',
		func: (ac, val) => (ac + val),
	},
	{
		op: 'subtract',
		func: (ac, val) => (ac - val),
	},
	{
		op: 'multiply',
		func: (ac, val) => (ac * val),
	},
	{
		op: 'divide',
		func: (ac, val) => (ac / val),
	},
	{
		op: 'pow',
		func: (ac, val) => Math.pow(ac, val),
	},
];
