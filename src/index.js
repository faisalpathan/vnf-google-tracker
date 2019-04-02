import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MapContainer from './container/MapContainer';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<MapContainer />, document.getElementById('root'));
serviceWorker.unregister();
