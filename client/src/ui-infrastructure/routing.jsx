import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import App from './app';
import TitleScreen from './title-screen';

export default class Routing extends React.Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path="/campaign/:id" component={App} />
					<Route path="/" component={TitleScreen} />
				</Switch>
			</BrowserRouter>
		)

	}
}
