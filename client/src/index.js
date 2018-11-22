import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './ui-infrastructure/routing';

import './global.less';

ReactDOM.render(
  <Routing />,
  document.getElementById('content')
)
