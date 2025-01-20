import React, { useState, useEffect } from 'react';
import characterImg from './character.png'; // Import the character image
import './Character.css'; // Import the CSS file

const Character = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [globalCooldown, setGlobalCooldown] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [missionMessage, setMissionMessage] = useState('');
  const [statPoints, setStatPoints] = useState(0);
  const [strength, setStrength] = useState(10);
  const [intelligence, setIntelligence] = useState(10);
  const [dexterity, setDexterity] = useState(10);
  const [stamina, setStamina] = useState(10);
  const [charisma, setCharisma] = useState(10);

  const maxExp = Math.floor(100 * Math.pow(1.2, level - 1));

  useEffect(() => {
    let timer;
    if (isDead && cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else if (cooldown === 0 && isDead) {
      setIsDead(false);
      setHp(maxHp);
    }

    if (globalCooldown > 0) {
      timer = setInterval(() => {
        setGlobalCooldown((prev) => prev - 1);
      }, 1000);
    }

    const hpRegen = setInterval(() => {
      if (!isDead && hp < maxHp) {
        setHp((prevHp) => Math.min(prevHp + 15, maxHp));
      }
    }, 15000); // Health regeneration every 15 seconds

    return () => {
      clearInterval(timer);
      clearInterval(hpRegen); // Cleanup regeneration interval
    };
  }, [isDead, cooldown, globalCooldown, maxHp, hp]);

  const saveGame = () => {
    const gameState2 = {
      level,
      exp,
      hp,
      maxHp,
      isDead,
      globalCooldown,
      strength,
      intelligence,
      dexterity,
      stamina,
      charisma,
      statPoints
    };

    localStorage.setItem('gameState2', JSON.stringify(gameState2)); // Save state to localStorage
    setMissionMessage('Game Saved!');
  };

  const loadGame = () => {
    const savedState2 = localStorage.getItem('gameState2');
    
    if (savedState2) {
      const parsedState = JSON.parse(savedState2);
      setLevel(parsedState.level);
      setExp(parsedState.exp);
      setHp(parsedState.hp);
      setMaxHp(parsedState.maxHp);
      setIsDead(parsedState.isDead);
      setGlobalCooldown(parsedState.globalCooldown);
      setStrength(parsedState.strength);
      setIntelligence(parsedState.intelligence);
      setDexterity(parsedState.dexterity);
      setStamina(parsedState.stamina);
      setCharisma(parsedState.charisma);
      setStatPoints(parsedState.statPoints);
      setMissionMessage('Game Loaded!');
    } else {
      setMissionMessage('No saved game found.');
    }
  };

  const handleMission = (successRate, expGain, hpLoss, cooldownTime) => {
    if (isDead || globalCooldown > 0) return;

    setGlobalCooldown(cooldownTime);
    setMissionMessage('Mission in progress...');

    setTimeout(() => {
      const success = Math.random() < successRate;

      if (success) {
        const newExp = exp + expGain;
        if (newExp >= maxExp) {
          setExp(newExp - maxExp);
          levelUp();
        } else {
          setExp(newExp);
        }
        setMissionMessage(`Mission accomplished! You won ${expGain} XP.`);
      } else {
        const newHp = hp - hpLoss;
        setHp(newHp);
        if (newHp <= 0) {
          setIsDead(true);
          setCooldown(180); // Character dies and has to wait 3 minutes
        }
        setMissionMessage(`Mission failed. You lost ${hpLoss} HP.`);
      }
    }, cooldownTime * 1000);
  };

  const levelUp = () => {
    setLevel((prevLevel) => prevLevel + 1);
    const increasedMaxHp = Math.floor(maxHp * 1.2);
    setMaxHp(increasedMaxHp);
    setHp(increasedMaxHp);
    setStatPoints((prevPoints) => prevPoints + 5); // Add 5 stat points when leveling up
  };

  const increaseStat = (statSetter, stat) => {
    if (statPoints > 0 && stat < 30) {
      statSetter(stat + 1);
      setStatPoints(statPoints - 1);
    }
  };

  const renderStatBar = (stat, maxStat) => {
    const percentage = (stat / maxStat) * 100;
    return (
      <div className="stat-bar">
        <div className="stat-bar-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    );
  };

  return (
    <div className="character-container">
      <div className="character-header">
        <img src={characterImg} alt="Character Icon" className="character-img" />
        <div className="character-info">
          <h1>Character</h1>
          <p>Level: {level}</p>
          <p>HP: {hp <= 0 ? 0 : hp}/{maxHp}</p>
        </div>
      </div>

      {/* Health and XP Bars */}
      <div className="health-bar">
        <div className="health-bar-fill" style={{ width: `${(hp / maxHp) * 100}%` }}></div>
      </div>

      <div className="xp-bar">
        <div className="xp-bar-fill" style={{ width: `${(exp / maxExp) * 100}%` }}></div>
      </div>

      <p>{exp}/{maxExp} EXP</p>

      {/* Stats Section */}
      <div className="stats-section">
        {[
          ['Strength', strength, setStrength],
          ['Intelligence', intelligence, setIntelligence],
          ['Dexterity', dexterity, setDexterity],
          ['Stamina', stamina, setStamina],
          ['Charisma', charisma, setCharisma],
        ].map(([label, stat, setStat], idx) => (
          <div className="stat-row" key={idx}>
            <p className="stat-label">{label}:</p>
            {renderStatBar(stat, 30)}
            <p>{stat}</p>
            <button className="incremento-button" onClick={() => increaseStat(setStat, stat)}>Increase</button>
          </div>
        ))}
      </div>

      {/* Stat Points */}
      <p>Stat Points: {statPoints}</p>

      {/* Mission Buttons */}
      <button onClick={() => handleMission(0.6, 20, 20, 10)} className="mission-button">
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Easy Mission'}
      </button>
      <button onClick={() => handleMission(0.4, 40, 40, 30)} className="mission-button">
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Medium Mission'}
      </button>
      <button onClick={() => handleMission(0.25, 70, 70, 60)} className="mission-button">
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Hard Mission'}
      </button>
        <br/>
      {/* Save/Load Buttons */}
      <button onClick={saveGame} className="svbutton">Save Game</button>
      <button onClick={loadGame} className="svbutton">Load Game</button>

      {/* Display Mission Result Message */}
      {missionMessage && <p className="mission-message">{missionMessage}</p>}
    </div>
  );
};

export default Character;
