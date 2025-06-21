import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { 
  BellDot, 
  Menu, 
  Search,
  Home,
  Gift,
  MapPin,
  ScanQrCode,
  User,
  Settings,
  LogOut
} from "lucide-react";

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  map.setView(center, 14);
  return null;
};

const App = () => {
  const [currentLocationName, setCurrentLocationName] = useState("Tianguá, CE");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([-3.7333, -40.9919]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);

  const menuItems = [
    { text: "Início", icon: <Home size={24} /> },
    { text: "Pontos de Coleta", icon: <MapPin size={24} /> },
    { text: "Recompensas", icon: <Gift size={24} /> },
    { text: "Registro", icon: <ScanQrCode size={24} /> },
    { text: "Conta", icon: <User size={24} /> },
    { text: "Configurações", icon: <Settings size={24} /> },
    { text: "Sair", icon: <LogOut size={24} /> },
  ];

  useEffect(() => {
    if (menuOpen) {
      setAnimateItems(false);
      const timer = setTimeout(() => setAnimateItems(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimateItems(false);
    }
  }, [menuOpen]);

  const markers = [
    {
      geocode: [-3.7333, -40.9919],
      popUp: "Casa do Caralho",
    },
    {
      geocode: [-3.73, -40.997],
      popUp: "Levi baby",
    },
    {
      geocode: [-3.72, -40.987],
      popUp: "pablitinks",
    },
  ];

  const customIcon = new Icon({
    iconUrl:
      "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-green-1024.png",
    iconSize: [32, 32],
  });

  const handleSearch = async () => {
    if (!searchTerm) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchTerm
      )}&format=json`
    );
    const data = await res.json();
    setSearchResults(data);
  };

  const handleSelectLocation = (lat, lon, displayName) => {
    setMapCenter([parseFloat(lat), parseFloat(lon)]);
    setCurrentLocationName(displayName);
    setSearchResults([]);
    setSearchTerm("");
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden relative"
    style={{
               background: "linear-gradient(to bottom, transparent, rgba(220, 252, 231, 0.5) 70%)"
             }}>
      {/* Navbar */}
      <nav className="flex-none relative flex items-center justify-between bg-green-50 pt-2 pb-2 shadow-md h-14 z-[1000]">
        <Menu 
          className="text-green-600 m-2 stroke-3 cursor-pointer" 
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <h2 className="text-2xl text-green-600 font-bold">EcoPoint</h2>
        <BellDot className="text-green-600 m-2 stroke-3" />
      </nav>

      {/* Container principal do mapa com transformação */}
      <div 
        className={`relative flex-1 overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? "scale-[0.7] translate-x-[50%] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.30)]" : 
            "scale-100 translate-x-0"}`}
      >
        {/* Barra de busca */}
        <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 z-[1000]">
          <div className="flex items-center bg-green-50/80 p-3 rounded-md shadow">
            <Search className="text-green-600/60 stroke-3 mx-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={currentLocationName}
              className="bg-transparent outline-none text-gray-700 w-full"
            />
          </div>
          {searchResults.length > 0 && (
            <ul className="bg-green-50 rounded shadow max-h-40 overflow-y-auto divide-y divide-gray-200">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() =>
                    handleSelectLocation(
                      result.lat,
                      result.lon,
                      result.display_name
                    )
                  }
                  className="px-4 py-2 cursor-pointer hover:bg-green-100 text-sm whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-200"
                  title={result.display_name}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mapa */}
        <MapContainer
          center={mapCenter}
          zoom={14}
          scrollWheelZoom={false}
          attributionControl={false}
          zoomControl={false}
          className="w-full h-full"
        >
          <ChangeMapCenter center={mapCenter} />
          <TileLayer
            url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=UQGRE7XLm3ARzxviBrhmHYYEtGQ1IOvogwhwHHtLyqxstEe0on6KxtLjjBTJmPuB"
            attribution='&copy; <a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">Jawg</a> - &copy; <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">OpenStreetMap</a> contributors'
          />

          {markers.map((marker) => (
            <Marker
              key={marker.popUp}
              position={marker.geocode}
              icon={customIcon}
            >
              <Popup>
                <h3>{marker.popUp}</h3>
              </Popup>
            </Marker>
          ))}

          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>

      {/* Menu flutuante com gradiente suave na parte inferior */}
      {menuOpen && (
        <div className="absolute left-0 top-0 z-30 h-full w-3/4 max-w-xs p-1 pt-16 overflow-hidden">
          <ul className="space-y-7">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`
                  flex items-center gap-2 p-2 transition-all duration-300 ease-out transform
                  ${animateItems ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
                  text-green-700 font-bold
                  hover:text-green-500 cursor-pointer
                `}
                style={{ 
                  transitionDelay: `${animateItems ? index * 30 : 0}ms`,
                  textShadow: '0px 0px 4px rgba(255,255,255,0.8)'
                }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-green-700">{item.icon}</span>
                <span className="text-xl">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
};

export default App;