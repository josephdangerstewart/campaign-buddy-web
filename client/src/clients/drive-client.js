import 'whatwg-fetch';

export function saveModel(model, id, onSuccess, onFail) {
	fetch(`/api/updatecampaign/${id}`, {
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify(model),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(response => response.json())
	.then(results => {
		if (results.status === 200) return onSuccess();
		onFail(results.status, results.message);
	})
}

export function createModel(name, gameSystem, onSuccess, onFail) {
	fetch(`/api/createcampaign?name=${name}&system=${gameSystem}`, { credentials: 'include' })
	.then(response => response.json())
	.then(results => {
		if (results.status !== 200) return onFail(results.status, results.message);
		return onSuccess(results.id);
	})
}

export function getModel(id, onSuccess, onFail) {
	fetch(`/api/getmodel/${id}`, { credentials: 'include' })
	.then(response => response.json())
	.then(results => {
		if (results.status !== 200) return onFail(results.status, results.message);
		return onSuccess(results.model);
	})
}

export function listCampaigns(onSuccess, onFail) {
	fetch('/api/listcampaigns', { credentials: 'include' })
	.then(response => response.json())
	.then(results => {
		if (results.status !== 200) return onFail(results.status, results.message);
		return onSuccess(results.files);
	});
}
