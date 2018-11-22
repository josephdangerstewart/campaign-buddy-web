export default (gameController) => {
	gameController.registerAttribute(
		'hp',
		'The health points of a character',
		'info default image',
		null,
		10, 
		[
			{name: 'imageUrl', value: '/images/hp_icon.svg'},
			{name: 'control', value: 'number'}
		]
	);
	gameController.registerAttribute(
		'ac',
		'The armor points of a character',
		'info default image',
		null,
		12,
		[
			{name: 'imageUrl', value: '/images/ac_icon.svg'},
			{name: 'control', value: 'number'}
		]
	);
	gameController.registerAttribute(
		'speed',
		'How fast your character can move',
		'core default image',
		null,
		30,
		[
			{name: 'control', value: 'number'}
		]
	);
}