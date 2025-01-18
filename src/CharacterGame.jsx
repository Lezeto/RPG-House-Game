import React, { useState, useEffect } from 'react';
import characterImg from './character.png'; // Import the character image

const Character = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [isDead, setIsDead] = useState(false);
  const [globalCooldown, setGlobalCooldown] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [missionMessage, setMissionMessage] = useState(''); // Tracks the mission result message
  
  const [statPoints, setStatPoints] = useState(0); // Tracks stat points
  const [strength, setStrength] = useState(10); // Stat: strength
  const [intelligence, setIntelligence] = useState(10); // Stat: intelligence
  const [dexterity, setDexterity] = useState(10); // Stat: dexterity
  const [stamina, setStamina] = useState(10); // Stat: stamina
  const [charisma, setCharisma] = useState(10); // Stat: charisma
  
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

    // Health regeneration logic
    const hpRegen = setInterval(() => {
      if (!isDead && hp < maxHp) {
        setHp((prevHp) => Math.min(prevHp + 15, maxHp)); // Increase HP by 15, but not beyond maxHp
      }
    }, 15000); // Every 15 seconds

    return () => {
      clearInterval(timer);
      clearInterval(hpRegen); // Cleanup the regeneration interval
    };
  }, [isDead, cooldown, globalCooldown, maxHp, hp]);

  const handleMission = (successRate, expGain, hpLoss, cooldownTime) => {
    if (isDead || globalCooldown > 0) return;

    setGlobalCooldown(cooldownTime);
    setMissionMessage('Mission in progress...'); // Keeps the "Mission in progress..." message

    // Wait before showing the result and applying the mission effect
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
        setMissionMessage(`Mission accomplished! Your mission was a success. You won ${expGain} XP.`);
      } else {
        const newHp = hp - hpLoss;
        setHp(newHp);
        if (newHp <= 0) {
          setIsDead(true);
          setCooldown(180); // Character dies and has to wait 3 minutes
        }
        setMissionMessage(`Mission failed. Your mission was a failure. You lost ${hpLoss} HP.`);
      }
    }, cooldownTime * 1000); // Delay result by the cooldown time (in ms)
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
      statSetter(stat + 1); // Increase stat by 1
      setStatPoints(statPoints - 1); // Decrease stat points
    }
  };

  const renderStatBar = (stat, maxStat) => {
    const percentage = (stat / maxStat) * 100;
    return (
      <div
        style={{
          border: '1px solid #000',
          width: '200px', // Adjusted for thinner stat bars
          height: '10px',
          margin: 'px auto',
          position: 'relative',
          backgroundColor: '#ddd',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: 'purple', // Change to a desired color
          }}
        ></div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center'}}>
      <img
        src={characterImg}
        alt="Character Icon"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          marginBottom: '20px',
        }}
      />
      <h1>Character</h1>
      <p>Level: {level}</p>
      <p>HP: {hp <= 0 ? 0 : hp}/{maxHp}</p>

      {/* Health Bar */}
      <div
        style={{
          border: '1px solid #000',
          width: '300px',
          height: '20px',
          margin: '10px auto',
          position: 'relative',
          backgroundColor: '#ddd',
        }}
      >
        <div
          style={{
            width: `${(hp / maxHp) * 100}%`,
            height: '100%',
            backgroundColor: 'green',
          }}
        ></div>
      </div>

      {/* XP Bar */}
      <div
        style={{
          border: '1px solid #000',
          width: '300px',
          height: '20px',
          margin: '10px auto',
          position: 'relative',
          backgroundColor: '#ddd',
        }}
      >
        <div
          style={{
            width: `${(exp / maxExp) * 100}%`,
            height: '100%',
            backgroundColor: 'blue',
          }}
        ></div>
      </div>

      <p>{exp}/{maxExp} EXP</p>

      {/* Stats Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <p style={{ width: '100px', textAlign: 'left' }}>Strength:</p>
          {renderStatBar(strength, 30)}
          <p>{strength}</p>
          <button onClick={() => increaseStat(setStrength, strength)}>Increase</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ width: '100px', textAlign: 'left' }}>Intelligence:</p>
          {renderStatBar(intelligence, 30)}
          <p>{intelligence}</p>
          <button onClick={() => increaseStat(setIntelligence, intelligence)}>Increase</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ width: '100px', textAlign: 'left' }}>Dexterity:</p>
          {renderStatBar(dexterity, 30)}
          <p>{dexterity}</p>
          <button onClick={() => increaseStat(setDexterity, dexterity)}>Increase</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ width: '100px', textAlign: 'left' }}>Stamina:</p>
          {renderStatBar(stamina, 30)}
          <p>{stamina}</p>
          <button onClick={() => increaseStat(setStamina, stamina)}>Increase</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ width: '100px', textAlign: 'left' }}>Charisma:</p>
          {renderStatBar(charisma, 30)}
          <p>{charisma}</p>
          <button onClick={() => increaseStat(setCharisma, charisma)}>Increase</button>
        </div>
      </div>

      {/* Stat Points */}
      <p>Stat Points: {statPoints}</p>

      <button
        onClick={() => handleMission(0.6, 20, 20, 10)}
        disabled={isDead || globalCooldown > 0}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isDead || globalCooldown > 0 ? 'not-allowed' : 'pointer',
          margin: '10px',
        }}
      >
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Easy Mission'}
      </button>

      <button
        onClick={() => handleMission(0.4, 40, 40, 30)}
        disabled={isDead || globalCooldown > 0}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isDead || globalCooldown > 0 ? 'not-allowed' : 'pointer',
          margin: '10px',
        }}
      >
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Medium Mission'}
      </button>

      <button
        onClick={() => handleMission(0.25, 70, 70, 60)}
        disabled={isDead || globalCooldown > 0}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: isDead || globalCooldown > 0 ? 'not-allowed' : 'pointer',
          margin: '10px',
        }}
      >
        {globalCooldown > 0 ? `Cooldown: ${globalCooldown}s` : 'Hard Mission'}
      </button>

      {/* Display Mission Result Message */}
      {missionMessage && (
        <p style={{ marginTop: '20px', fontSize: '18px', color: '#333' }}>{missionMessage}</p>
      )}
    </div>
  );
};

export default Character;
