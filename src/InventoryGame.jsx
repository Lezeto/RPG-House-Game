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

const itemImages = {
  pollo: polloImg,
  varita: varitaImg,
  espada: espadaImg,
  pico: picoImg,
  anillo: anilloImg,
  libro: libroImg,
  gema: gemaImg,
  capa: capaImg,
  sombrero: sombreroImg,
  casco: cascoImg,
  armor: armorImg,
  legs: legsImg,
  potion: potionImg,
};

const Inventory = ({ balance }) => {
  const [inventory, setInventory] = useState([
    "pollo", "varita", "espada", "pico", "anillo",
    "libro", "gema", "capa", "sombrero", "casco",
    "armor", "legs", "potion", "potion", // Two potions at the end
    "", "", "", "", "", "", "", "", "","" // Empty spaces
  ]);

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("draggedItemIndex", index); // Store the index of the dragged item
  };

  const handleDrop = (event, index) => {
    const draggedItemIndex = event.dataTransfer.getData("draggedItemIndex");
    const newInventory = [...inventory];

    // Swap items
    const temp = newInventory[index];
    newInventory[index] = newInventory[draggedItemIndex];
    newInventory[draggedItemIndex] = temp;

    setInventory(newInventory); // Update state with swapped items
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow a drop to happen
  };

  return (
    <div style={styles.inventoryContainer}>
      {/* Display the bank balance with the larger coin image */}
      <div style={styles.balance}>
        <span>Balance: {balance} </span>
        <img src={coinImg} alt="Gold Coins" style={styles.coinIcon} />
      </div>

      <div style={styles.inventory}>
        {inventory.map((item, index) => (
          <div
            style={styles.inventorySlot}
            key={index}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, index)}
          >
            {item ? (
              <img
                src={itemImages[item]}
                alt={item}
                style={styles.inventoryItem}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
              />
            ) : (
              <div style={styles.emptySlot}></div> // Blank space for empty slots
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryGame = () => {
  const [balance, setBalance] = useState(5); // Initial balance

  return (
    <div style={styles.app}>
      <Inventory balance={balance} />
    </div>
  );
};

const styles = {
  app: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    flexDirection: "column", // Stack the balance and inventory
    padding: "0 10px", // Prevent overflow due to margin
    boxSizing: "border-box",
    overflow: "hidden", // Prevent vertical scrollbar
  },
  inventoryContainer: {
    width: "100%", // Make sure the balance takes the full width
    maxWidth: "900px", // Optional: Set a max width for layout
    padding: "10px",
    overflow: "hidden", // Remove vertical and horizontal scrollbar
  },
  balance: {
    display: "flex",
    alignItems: "center",
    fontSize: "30px", // Increase font size for balance text
    fontWeight: "bold",
    marginBottom: "20px", // Space between balance and inventory
    justifyContent: "center", // Center the balance across the screen
  },
  coinIcon: {
    width: "45px", // Increase the coin icon size
    height: "45px",
    marginLeft: "10px", // Add space between balance text and coin
  },
  inventory: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 columns in the grid
    gridTemplateRows: "repeat(8, 1fr)",  // 8 rows in the grid
    gridGap: "10px",
    background: "#ddd",
    padding: "10px 20px 20px 10px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxHeight: "calc(100vh - 120px)", // Adjust height for grid content to avoid overflow
    overflow: "hidden", // Remove scrollbars for the grid
  },
  inventorySlot: {
    width: "100%",
    aspectRatio: "1 / 1", // Keep square aspect ratio
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  inventoryItem: {
    maxWidth: "80%", // Make sure images fit within the slot
    maxHeight: "80%",
  },
  emptySlot: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0", // Blank space styling
  },
};

export default InventoryGame;
