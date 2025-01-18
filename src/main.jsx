import React from 'react';
import ReactDOM from 'react-dom';
import ResourceGame from './ResourceGame';
import CharacterGame from './CharacterGame';
import InventoryGame from './InventoryGame';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
      <ResourceGame />
      <CharacterGame />
      <InventoryGame/>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);
