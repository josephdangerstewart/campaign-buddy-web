import React from 'react';

import { listCampaigns, createModel } from '../../clients/drive-client';

export default class TitleScreen extends React.Component {
	
	state = {
		campaigns: [],
		didFail: false,
		title: '',
	}

	mapCampaigns = (camp, index) => {
		return (
			<div key={index}>
				<a href={`/campaign/${camp.id}`}>{camp.name}</a>
			</div>
		)
	}

	handleSuccess = (campaigns) => {
		this.setState({
			campaigns: campaigns.map(this.mapCampaigns)
		})
	}

	handleFail = (status, message) => {
		console.log(status);
		console.log(message);
	}

	componentDidMount() {
		listCampaigns(this.handleSuccess, this.handleFail);
	}

	handleTitleChange = (event) => {
		this.setState({ title: event.target.value });
	}

	handleNew = () => {
		const { title } = this.state;
		createModel(title, 'Test', (id) => {
			window.location.href = `/campaign/${id}`;
		}, this.handleFail);
	}
	
	render() {
		const { title, campaigns } = this.state;
		return (
			<div>
				<input onChange={this.handleTitleChange} value={title} placeholder="enter title" />
				<button onClick={this.handleNew}>Start new campaign</button>
				<div>
					{campaigns}
				</div>
			</div>
		)
	}
}
