
import { useState, useRef, useEffect } from "react";

function App() {
    const [showMap, setShowMap] = useState(false);
 const [search, setSearch] = useState("");
 const [activeCategory, setActiveCategory] = useState("All");
 const [selectedLocation, setSelectedLocation] = useState("");
 const [startLocation, setStartLocation] = useState("");
 const [showNearbyLocations, setShowNearbyLocations] = useState(false);
const [destination, setDestination] = useState("");
 const locations = [
  "Seminar Hall 1",
  "Seminar Hall 2",
  "Seminar Hall 3",
  "Seminar Hall 4 (J010)",
  "Seminar Hall 5",
  "Seminar Hall 6",
  "Seminar Hall 12",
  "Department of Chemical Engineering",
  "Dept Of Chemical Engineering (J021)",
  "Chemical Engineering Lab (J025)",
  "Environmental Engineering Lab (J022)",
  "Fluid Mechanics & Hydraulics Lab (J012)",
  "Project Lab (J013)",
  "CAD & CAM Lab (J014)",
  "Internal Combustion Engine Lab",
  "EEE Lab",
  "Electrical Lab (J006)",
  "E-Leraning Centre",
  "Dr. Shishir Dixit (HOD Electrical)",
  "Dr. Sulochana Wadhwani",
  "J007",
  "J008",
  "J009",
  "J026",
  "Open Court 1",
  "Open Court 2",
  "Open Court 3",
  "Open Court 4",
  "Conclave Centre",
  "Foyer",
  "Faculty Resource Centre",
  "Store Room",
  "Room 003",
  "Room 004",
  "Boys Washroom",
  "Dr. Bhupendra Pandey",
  "Prof. R.P Kori",
  "Dr. Jyoti Vimal",
  "Washroom",
  "Prof. Vedansh Chaturvedi",
  "Dr. Manoj Kumar Gaur, Dean Research",
  "Dr. Chandra Shekhar Malvi (HOD Mech.)",
];
const locationPositions: {
  [key: string]: { x: number; y: number };
} = {
  "Seminar Hall 1": { x: 63, y: 85 },
  "Chemical Engineering Lab (J025)": { x: 40, y: 49 },
};
const locationDetails: Record<string, string> = {
  "Seminar Hall 1": "Ground Floor - MITS",
  "Seminar Hall 2": "Ground Floor - MITS",
  "Seminar Hall 3": "Ground Floor - MITS",
  "Department of Chemical Engineering": "Room J021 - Ground Floor",
};

const filteredLocations = locations.filter((location) => {
  const name = location.toLowerCase();

  const matchesSearch = name.includes(search.toLowerCase());

  const matchesCategory =
    activeCategory === "All" ||
    (activeCategory === "Classrooms" && name.includes("classroom")) ||
    (activeCategory === "Seminar Halls" && name.includes("seminar hall")) ||
    (activeCategory === "Laboratories" && name.includes("lab")) ||
    (activeCategory === "Departments" && name.includes("department")) ||
    (activeCategory === "Facilities" &&
      ["library", "canteen", "washroom", "office"].some(item =>
        name.includes(item)
      ));

  return matchesSearch && matchesCategory;
});
  const [zoom, setZoom] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [roomPositions, setRoomPositions] = useState<{
  [key: string]: { x: number; y: number };
}>({});

useEffect(() => {
  const container = mapContainerRef.current;
  if (!container) return;

 const buttons = container.querySelectorAll<HTMLButtonElement>('button[data-room="true"]');
  const positions: {
    [key: string]: { x: number; y: number };
  } = {};

  buttons.forEach((button) => {
    if (button.style.position !== "absolute") return;

    const name = button.textContent?.trim();
    const x = parseFloat(button.style.left);
    const y = parseFloat(button.style.top);

    if (name && !isNaN(x) && !isNaN(y)) {
      positions[name] = { x, y };
    }
  });

  setRoomPositions(positions);
}, [showMap]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mapFocus, setMapFocus] = useState("");
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetMap = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setMapFocus("");
  setTargetPosition({ x: 0, y: 0 });
  };
  const handleFindRoute = () => {
  alert("Navigation button is working!");

  if (!startLocation || !destination) {
    alert("Please select both locations");
    return;
  }

  if (startLocation === destination) {
    alert("Select two different locations");
    return;
  }

  const start = roomPositions[startLocation];
  const end = roomPositions[destination];

  if (!start || !end) {
    alert("Route positions are not available yet.");
    return;
  }

  setSelectedLocation(destination);
};
  useEffect(() => {
  if (!selectedLocation || !mapContainerRef.current) return;

  const buttons = mapContainerRef.current.querySelectorAll("button");

  buttons.forEach((button) => {
    const isSelected =
      button.textContent?.trim() === selectedLocation;

    button.style.background = isSelected ? "#dc2626" : "#2563eb";
    button.style.transform = isSelected
      ? "translate(-50%, -50%) scale(1.2)"
      : "translate(-50%, -50%)";
  });
}, [selectedLocation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;

    setPosition({
      x: dragRef.current.originX + e.clientX - dragRef.current.startX,
      y: dragRef.current.originY + e.clientY - dragRef.current.startY,
    });
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

    if (!showMap) {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
     backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.30)), url('https://upload.wikimedia.org/wikipedia/commons/4/49/Madhav_Institute_of_Technology_%26_Science.jpg')", 
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{
        fontSize: "48px",
        color: "#0a0221",
textShadow: "2px 3px 10px rgba(0,0,0,0.8)"
      }}>
        MITS MAP
      </h1>

      <h2>Welcome to MITS Campus</h2>

      <p style={{
        color: "#DBEAFE",
        fontSize: "20px",
        maxWidth: "500px"
      }}>
        Find classrooms, laboratories and seminar halls easily.
      </p>

      <button
        onClick={() => setShowMap(true)}
        style={{
          marginTop: "25px",
          padding: "15px 40px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        Get Started →
      </button>
    </div>
  );
}
return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      background: "#f4f7fb",
      minHeight: "100vh",
      color: "#1e293b"
    }}>

      <header style={{
        background: "#ffffff",
        padding: "20px 40px",
        borderBottom: "1px solid #e2e8f0"
      }}>
        <h1 style={{ color: "#174ea6", margin: 0 }}>
          MITS COLLEGE MAP
        </h1>
        <p style={{ marginBottom: 0, color: "#64748b" }}>
          Campus Navigation System
        </p>
      </header>

      <main style={{ padding: "30px 40px" }}>

        <h2>Explore Your Campus</h2>

        <p style={{ color: "#64748b" }}>
          Find classrooms, laboratories and departments easily.
        </p>

        <input
  type="text"
  placeholder="Search rooms (e.g. Seminar Hall 1)..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
    outline: "none",
  }}
/>

{search.trim() !== "" && (
  <div style={{ marginTop: "10px" }}>
  {filteredLocations.length > 0 ? (
    filteredLocations.map((location) => (
      <div
        key={location}
       onClick={() => {
  setSelectedLocation(location);
  setSearch(location);
}}
        role="button"
        style={{
          padding: "10px",
          background: "#eff6ff",
          borderRadius: "8px",
          marginBottom: "6px",
          color: "#1e40af",
          cursor: "pointer",
        }}
      >
        {location}
      </div>
    ))
  ) : (
    <p>No location found.</p>
  )}
</div>

)}
<div style={{
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  margin: "15px 0"
}}>
  {["All", "Classrooms", "Seminar Halls", "Laboratories", "Departments", "Facilities"].map((category) => (
    <button
      key={category}
      onClick={() => setActiveCategory(category)}
      style={{
        padding: "10px 18px",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        background: activeCategory === category ? "#174ea6" : "#e2e8f0",
        color: activeCategory === category ? "#ffffff" : "#334155",
        fontWeight: "bold"
      }}
    >
      {category}
    </button>
  ))}
</div>
<div style={{
  background: "#ffffff",
  padding: "20px",
  marginTop: "15px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0"
}}>
  <h3>Find Your Route</h3>

  <label>Starting Location</label>
  <select
    value={startLocation}
    onChange={(e) => setStartLocation(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "8px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1"
    }}
  >
    <option value="">Select starting location</option>
    {locations.map((location) => (
      <option key={location} value={location}>
        {location}
      </option>
    ))}
  </select>
  <button
  onClick={() => setShowNearbyLocations(!showNearbyLocations)}
  style={{
    padding: "10px 16px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "15px"
  }}
>
  Find Nearby Location
</button>
{showNearbyLocations && (
  <div
    style={{
      background: "#f0fdf4",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      border: "1px solid #86efac"
    }}
  >
    <h4>Choose your nearby location</h4>

    {[
      "Foyer",
      "Conclave Centre",
      "Open Court 1",
      "Open Court 2",
      "Open Court 3",
      "Open Court 4",
      "Seminar Hall 1",
      "Seminar Hall 2",
      "Seminar Hall 3"
    ].map((place) => (
      <button
        key={place}
        onClick={() => {
          setStartLocation(place);
          setShowNearbyLocations(false);
        }}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          border: "1px solid #bbf7d0",
          borderRadius: "6px",
          background: "white",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        {place}
      </button>
    ))}
  </div>
)}{showNearbyLocations && (
  <div
    style={{
      background: "#f0fdf4",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      border: "1px solid #86efac"
    }}
  >
    <h4>Choose your nearby location</h4>

    {[
      "Foyer",
      "Conclave Centre",
      "Open Court 1",
      "Open Court 2",
      "Open Court 3",
      "Open Court 4",
      "Seminar Hall 1",
      "Seminar Hall 2",
      "Seminar Hall 3"
    ].map((place) => (
      <button
        key={place}
        onClick={() => {
          setStartLocation(place);
          setShowNearbyLocations(false);
        }}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginTop: "6px",
          border: "1px solid #bbf7d0",
          borderRadius: "6px",
          background: "white",
          cursor: "pointer",
          textAlign: "left"
        }}
      >
        {place}
      </button>
    ))}
  </div>
)}

  <label>Destination</label>
  <select
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    style={{
      width: "100%",
      padding: "12px",
      marginTop: "8px",
      marginBottom: "15px",
      borderRadius: "8px",
      border: "1px solid #cbd5e1"
    }}
  >
    <option value="">Select destination</option>
    {locations.map((location) => (
      <option key={location} value={location}>
        {location}
      </option>
    ))}
  </select>
  <button
  onClick={handleFindRoute}
  style={{
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px"
  }}
>
  Find Route
</button>
</div>

        <div style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0"
        }}>

          <h3>Campus Map</h3>

          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            alignItems: "center"
          }}>

            <button onClick={zoomIn}>＋ Zoom In</button>

            <button onClick={zoomOut}>－ Zoom Out</button>

            <button onClick={resetMap}>↺ Reset</button>

            <span style={{ color: "#64748b" }}>
              {Math.round(zoom * 100)}%
            </span>

          </div>

          <div
          ref={mapContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              width: "100%",
              height: "650px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              cursor: "grab",
              touchAction: "none",
              background: "#ffffff"
            }}
          >

            
<div
  style={{
    position: "relative",
    width: "100%",
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
    transformOrigin: "center center",
  }}
>
  <img
   src="/mits-map.svg"
    alt="MITS Ground Floor Map"
    draggable={false}
    style={{
      width: "100%",
      height: "auto",
      display: "block",
      userSelect: "none",
      pointerEvents: "none",
    }}
  />
  {startLocation && destination &&
  roomPositions[startLocation] &&
  roomPositions[destination] && (
    <svg
    viewBox="0 0 100 100"
preserveAspectRatio="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
 {((startLocation === "EEE Lab" && destination === "Room 004") ||
  (startLocation === "Room 004" && destination === "EEE Lab")) && (
  <polyline
    points="20,80 20,44 97,44 97,25 95,25"
    fill="none"
    stroke="#ee0c0c"
    strokeWidth="0.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)}

{((startLocation === "Seminar Hall 1" && destination === "Chemical Engineering Lab (J025)") ||
  (startLocation === "Chemical Engineering Lab (J025)" && destination === "Seminar Hall 1")) && (
  <polyline
    points="62,84 62,81 62,75 62,65 62,50 62,49 62,45 40,45 34,45 34,50"
    fill="none"
    stroke="#ee0c0c"
    strokeWidth="0.9"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)}
    </svg>
)}

  <button
  data-room="true"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 1")}
    style={{
      position: "absolute",
      left: "63%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: selectedLocation === "Seminar Hall 1" ? "#dc2626" : "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 1
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 2")}
    style={{
      position: "absolute",
      left: "48%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: selectedLocation === "Seminar Hall 2" ?  "#16a34a": "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 2
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 3")}
    style={{
      position: "absolute",
      left: "33.5%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 3
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Dept Of Chemical Engineering (J021)")}
    style={{
      position: "absolute",
      left: "54%",
      top: "66%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "10px",
    }}
  >
    Dept Of Chemical Engineering (J021)
  </button>
   
  <button
  data-room="true"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("EEE Lab")}
    style={{
      position: "absolute",
      left: "21%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    EEE Lab
  </button>
  <button
  data-room="true"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Prof. Bhupendra Pandey")}
    style={{
      position: "absolute",
      left: "6%",
      top: "5%",
      width: "45px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: selectedLocation === "Prof. Bhupendra Pandey" ? "#dc2626" : "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "4px",
    }}
  >
    Prof. Bhupendra Pandey
  </button>
   
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Electrical Lab (J006)")}
    style={{
      position: "absolute",
      left: "9%",
      top: "86.5%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "10px",
    }}
  >
    Electrical Lab (J006)
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Conclave Centre")}
    style={{
      position: "absolute",
      left: "77%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Conclave Centre
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Foyer")}
    style={{
      position: "absolute",
      left: "91%",
      top: "85%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Foyer
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Environmental Engineering Lab (J022)")}
    style={{
      position: "absolute",
      left: "54%",
      top: "58%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Environmental Engineering Lab (J022)
  </button>
  <button
  data-room="true"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Chemical Engineering Lab (J025)")}
    style={{
      position: "absolute",
      left: "40%",
      top: "49%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: selectedLocation === "Chemical Engineering Lab (J025)"
  ? "#16a34a"
  : "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "6px",
    }}
  >
    Chemical Engineering Lab (J025)
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Open Court 1")}
    style={{
      position: "absolute",
      left: "34%",
      top: "63.7%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    Open Court 1
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Open Court 2")}
    style={{
      position: "absolute",
      left: "75.5%",
      top: "64%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    Open Court 2
  </button>
  <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 12")}
    style={{
      position: "absolute",
      left: "11%",
      top: "28%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 12
  </button> 
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 4 (J010)")}
    style={{
      position: "absolute",
      left: "11%",
      top: "40%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 4 (J010)
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("J009")}
    style={{
      position: "absolute",
      left: "11%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    J009
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("J008")}
    style={{
      position: "absolute",
      left: "11%",
      top: "58%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    J008
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("E-Leraning Centre")}
    style={{
      position: "absolute",
      left: "11%",
      top: "65%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    E-Leraning Centre
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Dr. Shishir Dixit (HOD Electrical)")}
    style={{
      position: "absolute",
      left: "9%",
      top: "72%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "8px",
    }}
  >
    Dr. Shishir Dixit (HOD Electrical)
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("J007")}
    style={{
      position: "absolute",
      left: "15%",
      top: "72%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "5px",
    }}
  >
    J007
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Dr. Sulochana Wadhwani")}
    style={{
      position: "absolute",
      left: "7%",
      top: "77%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "8px",
    }}
  >
    Dr. Sulochana Wadhwani
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Fluid Mechanics & Hydraulics Lab (J012")}
    style={{
      position: "absolute",
      left: "24%",
      top: "15%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Fluid Mechanics & Hydraulics Lab (J012)
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Project Lab (J013")}
    style={{
      position: "absolute",
      left: "41%",
      top: "15%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "11px",
    }}
  >
    Project Lab (J013)
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("CAD & CAM Lab (J014)")}
    style={{
      position: "absolute",
      left: "52%",
      top: "15%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    CAD & CAM Lab (J014)
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Internal Combustion Engine Lab")}
    style={{
      position: "absolute",
      left: "69%",
      top: "15%",
      width: "120px",
whiteSpace: "normal",
overflowWrap: "break-word",
textAlign: "center",
lineHeight: "1.2",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "9px",
    }}
  >
    Internal Combustion Engine Lab 
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 6")}
    style={{
      position: "absolute",
      left: "88%",
      top: "15%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 6
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Seminar Hall 5")}
    style={{
      position: "absolute",
      left: "54%",
      top: "33%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Seminar Hall 5
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Open Court 3")}
    style={{
      position: "absolute",
      left: "34%",
      top: "33%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    Open Court 3
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Open Court 4")}
    style={{
      position: "absolute",
      left: "75.5%",
      top: "33%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "14px",
    }}
  >
    Open Court 4
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Faculty Resource Centre")}
    style={{
      position: "absolute",
      left: "92%",
      top: "63%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "10px",
    }}
  >
    Faculty Resource Centre
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Store Room")}
    style={{
      position: "absolute",
      left: "92%",
      top: "70%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "7px",
    }}
  >
    Store Room
  </button>
   <button
   data-room="true"
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Room 004")}
    style={{
      position: "absolute",
      left: "92%",
      top: "28%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "9px",
    }}
  >
    Room 004
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Room 003")}
    style={{
      position: "absolute",
      left: "92%",
      top: "39%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    Room 003
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("Boys Washroom")}
    style={{
      position: "absolute",
      left: "92%",
      top: "55%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "5px",
    }}
  >
    Boys Washroom 
  </button>
   <button
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => setSelectedLocation("J026")}
    style={{
      position: "absolute",
      left: "83%",
      top: "49%",
      transform: "translate(-50%, -50%)",
      background: "#2563eb",
      color: "white",
      border: "2px solid white",
      borderRadius: "20px",
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "12px",
    }}
  >
    J026
  </button>
</div>

          </div>
{selectedLocation && (
  <div style={{
    background: "#ffffff",
    padding: "16px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
  }}>
    <h3 style={{ color: "#174ea6", margin: "0 0 8px 0" }}>
      {selectedLocation}
    </h3>

    <p style={{ color: "#64748b", margin: 0 }}>
      {locationDetails[selectedLocation] || "Ground Floor - MITS"}
    </p>
  </div>
)}
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Use Zoom In and Zoom Out or drag the map to explore.
          </p>

        </div>
      </main>
    </div>
  );
}

export default App;
