export default (gameController) => {
	gameController.registerAttribute(
		'Passive Wisdom',
		'How good your character is at being passivley wise',
		'default',
		null,
		10,
		[
			{
				name: 'control',
				value: 'number',
			},
		],
	);
	gameController.registerAttribute(
		'KI',
		'The inner magic baby',
		'default',
		null,
		2,
		[
			{
				name: 'control',
				value: 'number',
			},
		],
	);
}