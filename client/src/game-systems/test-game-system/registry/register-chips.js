export default (gameController) => {
	gameController.registerAttribute(
		'intoxicated',
		'This class is a fighter',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'beer'}]
	);
	gameController.registerAttribute(
		'blinded',
		'You can\'t see',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'glasses'}]
	);
	gameController.registerAttribute(
		'charmed',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'grin-hearts'}]
	);
	gameController.registerAttribute(
		'deafened',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'deaf'}]
	);
	gameController.registerAttribute(
		'frightened',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'flushed'}]
	);
	gameController.registerAttribute(
		'grappled',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'hands-helping'}]
	);
	gameController.registerAttribute(
		'incapacitated',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'wheelchair'}]
	);
	gameController.registerAttribute(
		'invisible',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'eye-slash'}]
	);
	gameController.registerAttribute(
		'paralyzed',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'meh-blank'}]
	);
	gameController.registerAttribute(
		'petrified',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'id-badge'}]
	);
	gameController.registerAttribute(
		'poisoned',
		'You have been poised',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'heartbeat'}]
	);
	gameController.registerAttribute(
		'prone',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'dizzy'}]
	);
	gameController.registerAttribute(
		'restrained',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'lock'}]
	);
	gameController.registerAttribute(
		'stunned',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'flushed'}]
	);
	gameController.registerAttribute(
		'unconscience',
		'',
		'chip',
		null,
		true,
		[{name: 'iconName', value: 'bed'}]
	);
}