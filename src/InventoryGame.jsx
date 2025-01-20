import React, { useState } from "react";

// Import images
import polloImg from "./pollo.png";
import varitaImg from "./varita.png";
import espadaImg from "./espada.png";
import picoImg from "./pico.png";
import anilloImg from "./anillo.png";
import libroImg from "./libro.png";
import gemaImg from "./gema.png";
import capaImg from "./capa.png";
import sombreroImg from "./sombrero.png";
import cascoImg from "./casco.png";
import armorImg from "./armor.png";
import legsImg from "./legs.png";
import potionImg from "./potion.png";
import coinImg from "./coin.png"; // Import the gold coin image

import "./InventoryGame.css"; // Import the external CSS

const itemImages = {
  Chicken: polloImg,
  Wand: varitaImg,
  Sword: espadaImg,
  Pickaxe: picoImg,
  Ring: anilloImg,
  Book: libroImg,
  Gem: gemaImg,
  Cloak: capaImg,
  Hat: sombreroImg,
  Helmet: cascoImg,
  Armor: armorImg,
  LegArmor: legsImg,
  Potion: potionImg,
};

const Inventory = ({ balance, setBalance }) => {
  const [inventory, setInventory] = useState([
    "Chicken", "Wand", "Sword", "Pickaxe", "Ring",
    "Book", "Gem", "Cloak", "Hat", "Helmet",
    "Armor", "LegArmor", "Potion", "Potion", 
    "", "", "", "", "", "", "", "", ""
  ]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(null); // New state to track which menu is open

  const handleDragStart = (event, index) => {
    setDraggingItem(index);
    event.dataTransfer.setData("draggedItemIndex", index);
  };

  const handleDrop = (event, index) => {
    const draggedItemIndex = event.dataTransfer.getData("draggedItemIndex");
    const newInventory = [...inventory];

    const temp = newInventory[index];
    newInventory[index] = newInventory[draggedItemIndex];
    newInventory[draggedItemIndex] = temp;

    setInventory(newInventory);
    setDraggingItem(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredInventory = inventory.filter(item => 
    item.toLowerCase().includes(searchQuery)
  );

  const handleItemClick = (index) => {
    setMenuVisible(menuVisible === index ? null : index); // Toggle menu visibility for the clicked item
  };

  const sellItem = (index) => {
    // Remove the item from the inventory
    const newInventory = [...inventory];
    newInventory.splice(index, 1, ""); // Replace the item with an empty slot

    // Update the inventory state
    setInventory(newInventory);

    // Add 10 gold coins to the balance
    setBalance(prevBalance => prevBalance + 10);
  };

  return (
    <div className="inventory-container">
      <div className="balance">
        <span>Balance: {balance} </span>
        <img src={coinImg} alt="Gold Coins" className="coin-icon" />
      </div>

      <input
        type="text"
        placeholder="Search items"
        className="search-bar"
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="inventory">
        {filteredInventory.map((item, index) => (
          <div
            className={`inventory-slot ${draggingItem === index ? 'dragging' : ''}`}
            key={index}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
          >
            {item ? (
              <>
                <img
                  src={itemImages[item]}
                  alt={item}
                  className="inventory-item"
                  draggable
                  onDragStart={(event) => handleDragStart(event, index)}
                  onClick={() => handleItemClick(index)} // Handle item click
                />
                <div className="item-tooltip">{item}</div>

                {/* Menu for each item */}
                {menuVisible === index && (
                  <div className="item-menu">
                    <button onClick={() => sellItem(index)}>Sell for 10 Gold</button>
                    <button>Option 2</button>
                    <button>Option 3</button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-slot"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryGame = () => {
  const [balance, setBalance] = useState(5); // Initial balance set to 5 gold

  return (
    <div className="app">
      <Inventory balance={balance} setBalance={setBalance} />
    </div>
  );
};

export default InventoryGame;
