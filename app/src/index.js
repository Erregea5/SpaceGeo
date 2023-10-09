import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {RenderWorld} from './renderer'
//import reportWebVitals from './reportWebVitals';


const root=document.getElementById('root');
root.appendChild(RenderWorld());

const reactRoot = ReactDOM.createRoot(document.getElementById('reactRoot'));
reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//reportWebVitals();
