import React, { useState, useEffect } from 'react';
import foodIcon from './food.png';
import ironIcon from './iron.png';
import mudIcon from './mud.png';
import woodIcon from './wood.png';
import casaIcon from './casa.png';
import './ResourceGame.css'; // Import the CSS file

function ResourceGame() {
  const [resources, setResources] = useState({
    wood: 0,
    iron: 0,
    food: 0,
    mud: 0,
  });

  const [increments, setIncrements] = useState({
    wood: 1,
    iron: 1,
    food: 1,
    mud: 1,
  });

  const [incrementCosts, setIncrementCosts] = useState({
    wood: 10,
    iron: 10,
    food: 10,
    mud: 10,
  });

  const [houseLevel, setHouseLevel] = useState(1);
  const [resourceCost, setResourceCost] = useState(10);

  useEffect(() => {
    const intervals = {};
    for (const resource in resources) {
      intervals[resource] = setInterval(() => {
        setResources((prevResources) => ({
          ...prevResources,
          [resource]: prevResources[resource] + increments[resource],
        }));
      }, 1000);
    }

    return () => {
      for (const resource in intervals) {
        clearInterval(intervals[resource]);
      }
    };
  }, [increments]);

  const increaseIncrement = (resource) => {
    if (
      resources.wood >= incrementCosts[resource] &&
      resources.iron >= incrementCosts[resource] &&
      resources.food >= incrementCosts[resource] &&
      resources.mud >= incrementCosts[resource]
    ) {
      setResources((prevResources) => ({
        ...prevResources,
        wood: prevResources.wood - incrementCosts[resource],
        iron: prevResources.iron - incrementCosts[resource],
        food: prevResources.food - incrementCosts[resource],
        mud: prevResources.mud - incrementCosts[resource],
      }));

      setIncrements((prevIncrements) => ({
        ...prevIncrements,
        [resource]: prevIncrements[resource] * 1.2,
      }));

      setIncrementCosts((prevCosts) => ({
        ...prevCosts,
        [resource]: prevCosts[resource] * 1.2,
      }));
    } else {
      alert(`Not enough resources to increase speed for ${resource}!`);
    }
  };

  const levelUpHouse = () => {
    if (
      resources.wood >= resourceCost &&
      resources.iron >= resourceCost &&
      resources.food >= resourceCost &&
      resources.mud >= resourceCost
    ) {
      setResources({
        wood: resources.wood - resourceCost,
        iron: resources.iron - resourceCost,
        food: resources.food - resourceCost,
        mud: resources.mud - resourceCost,
      });
      setHouseLevel(houseLevel + 1);
      setResourceCost(resourceCost * 1.2);
    } else {
      alert('Not enough resources to level up the house!');
    }
  };

  const saveGame = () => {
    const gameState = {
      resources,
      increments,
      incrementCosts,
      houseLevel,
      resourceCost,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
    alert('Game saved!');
  };

  const loadGame = () => {
    const savedState = JSON.parse(localStorage.getItem('gameState'));
    if (savedState) {
      setResources(savedState.resources);
      setIncrements(savedState.increments);
      setIncrementCosts(savedState.incrementCosts);
      setHouseLevel(savedState.houseLevel);
      setResourceCost(savedState.resourceCost);
      alert('Game loaded!');
    } else {
      alert('No saved game found!');
    }
  };

  return (
    <div className="resource-game-container">
      {/* Resources Section */}
      <div className="resource-section">
        <h1>Resource Management</h1>
        <div>
          {Object.entries(resources).map(([resource, count]) => (
            <div key={resource} className="resource-item">
              <div className="resource-info">
                <img
                  src={
                    resource === 'food' ? foodIcon :
                    resource === 'iron' ? ironIcon :
                    resource === 'mud' ? mudIcon :
                    resource === 'wood' ? woodIcon : null
                  }
                  alt={resource}
                  className="resource-icon"
                />
                <div className="resource-text">
                  <h3>{resource}</h3>
                  <p>{count.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={() => increaseIncrement(resource)}
                className="increment-button"
              >
                Increase Increment by 20% (Cost: {incrementCosts[resource].toFixed(2)} of each)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* House Section */}
      <div className="house-section">
        <div>
          <h3>House Level: {houseLevel}</h3>
          <p>Cost to Level Up: {resourceCost.toFixed(2)} of each resource</p>
          <button onClick={levelUpHouse} className="level-up-button">
            Level Up House
          </button>
        </div>
        <img
          src={casaIcon}
          alt="House"
          className="house-icon"
        />
      </div>

      {/* Save and Load Buttons */}
      <div className="save-load-buttons">
        <button onClick={saveGame} className="save-button">Save Game</button>
        <button onClick={loadGame} className="load-button">Load Game</button>
      </div>
    </div>
  );
}

export default ResourceGame;
