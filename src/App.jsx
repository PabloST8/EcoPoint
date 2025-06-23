import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
  Polyline,
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
  LogOut,
} from "lucide-react";

const ChangeMapCenter = ({ center }) => {
  const map = useMap();
  map.setView(center, 14);
  return null;
};

const empresasColeta = [
  {
    id: 1,
    nome: "EcoRecicla",
    descricao:
      "Coleta seletiva de papel, plástico e vidro. Atende bairros centrais.",
    foto: "https://images.unsplash.com/photo-1586773860414-0c7f1cb4a4a0?auto=format&fit=crop&w=400&q=80",
    local: "Rua das Flores, 123",
    geocode: [-3.733, -40.991],
    rota: [
      [-3.733, -40.991],
      [-3.734, -40.993],
      [-3.736, -40.995],
      [-3.738, -40.997],
      [-3.74, -40.999],
      [-3.742, -41.001],
      [-3.744, -41.003],
      [-3.746, -41.005],
      [-3.748, -41.007],
      [-3.75, -41.009],
      [-3.752, -41.011],
      [-3.754, -41.013],
      [-3.756, -41.015],
      [-3.758, -41.017],
      [-3.76, -41.019],
      [-3.762, -41.021],
      [-3.764, -41.023],
      [-3.766, -41.025],
      [-3.768, -41.027],
      [-3.77, -41.029],
    ],
  },
  {
    id: 2,
    nome: "Verde Vida",
    descricao:
      "Especializada em coleta de eletrônicos e metais. Atendimento em toda a cidade.",
    foto: "https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=400&q=80",
    local: "Av. Central, 456",
    geocode: [-3.73, -40.997],
    rota: [
      [-3.73, -40.997],
      [-3.732, -40.995],
      [-3.734, -40.993],
      [-3.736, -40.991],
      [-3.738, -40.989],
      [-3.74, -40.987],
      [-3.742, -40.985],
      [-3.744, -40.983],
      [-3.746, -40.981],
      [-3.748, -40.979],
      [-3.75, -40.977],
    ],
  },
  {
    id: 3,
    nome: "ReciclaFácil",
    descricao:
      "Coleta de resíduos orgânicos e óleo de cozinha. Rota semanal nos bairros.",
    foto: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    local: "Praça Verde, 789",
    geocode: [-3.72, -40.987],
    rota: [
      [-3.72, -40.987],
      [-3.721, -40.988],
      [-3.722, -40.989],
      [-3.723, -40.99],
      [-3.724, -40.991],
      [-3.725, -40.992],
      [-3.726, -40.993],
      [-3.727, -40.994],
      [-3.728, -40.995],
      [-3.729, -40.996],
      [-3.73, -40.997],
      [-3.731, -40.998],
      [-3.732, -40.999],
      [-3.733, -41.0],
      [-3.734, -41.001],
    ],
  },
];

const App = () => {
  const [currentLocationName, setCurrentLocationName] = useState("Tianguá, CE");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([-3.7333, -40.9919]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [activePage, setActivePage] = useState("Início");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // refs para markers
  const markerRefs = useRef({});

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

  useEffect(() => {
    if (activePage !== "Início") setSelectedEmpresa(null);
  }, [activePage]);

  useEffect(() => {
    if (selectedEmpresa) {
      setMapCenter(selectedEmpresa.geocode);
      setActivePage("Início");
    }
  }, [selectedEmpresa]);

  // Aplica/remover classe dark no body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const customIcon = new Icon({
    iconUrl:
      "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-green-1024.png",
    iconSize: [32, 32],
  });

  // Icon for dark mode (light marker)

  const selectedIcon = new Icon({
    iconUrl:
      "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-green-1024.png",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  // Selected icon for dark mode (light marker)
  // const selectedIconLight = new Icon({
  //   iconUrl:
  //     "https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-white-1024.png",
  //   iconSize: [48, 48],
  //   iconAnchor: [24, 48],
  //   popupAnchor: [0, -48],
  // });

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

  const [empresaDetalhe, setEmpresaDetalhe] = useState(null);

  const empresaFotos = [
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  ];

  const closeEmpresaDetalhe = () => {
    setEmpresaDetalhe(null);
    setSelectedEmpresa(null);
  };

  // Adicionar função utilitária para buscar rota real via OSRM
  const getRouteFromOSRM = async (coords) => {
    if (!coords || coords.length < 2) return null;
    const coordsStr = coords.map((c) => `${c[1]},${c[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (
        data.routes &&
        data.routes[0] &&
        data.routes[0].geometry &&
        data.routes[0].geometry.coordinates
      ) {
        return data.routes[0].geometry.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]);
      }
    } catch {
      // erro silencioso
    }
    return null;
  };

  const MiniMap = ({ empresa }) => {
    const [miniRoute, setMiniRoute] = useState(null);
    useEffect(() => {
      let mounted = true;
      const fetchMiniRoute = async () => {
        if (empresa.rota && empresa.rota.length > 1) {
          const realRoute = await getRouteFromOSRM(empresa.rota);
          if (mounted) setMiniRoute(realRoute);
        } else {
          setMiniRoute(null);
        }
      };
      fetchMiniRoute();
      return () => {
        mounted = false;
      };
    }, [empresa]);
    return (
      <MapContainer
        center={empresa.geocode}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: 180, width: "100%", borderRadius: 12 }}
        className="shadow"
      >
        <TileLayer
          url={
            darkMode
              ? "https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=UQGRE7XLm3ARzxviBrhmHYYEtGQ1IOvogwhwHHtLyqxstEe0on6KxtLjjBTJmPuB"
              : "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=UQGRE7XLm3ARzxviBrhmHYYEtGQ1IOvogwhwHHtLyqxstEe0on6KxtLjjBTJmPuB"
          }
        />
        <Marker position={empresa.geocode} icon={selectedIcon} />
        {miniRoute && (
          <Polyline
            positions={miniRoute}
            pathOptions={{
              color: darkMode ? "#6ee7b7" : "green",
              weight: 4,
              opacity: 0.7,
            }}
          />
        )}
      </MapContainer>
    );
  };

  const [fotoIndex, setFotoIndex] = useState(0);
  const verMaisFotos = () => setFotoIndex((i) => (i + 1) % empresaFotos.length);

  // Corrigir overlay de detalhes para dark mode
  const EmpresaDetalheOverlay = ({ empresa, onClose }) => (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center"
      onClick={onClose}
      style={{ cursor: "pointer" }}
    >
      <div
        className={`rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in transition-colors duration-300
          ${
            darkMode
              ? "bg-neutral-900 text-green-100 border border-neutral-700"
              : "bg-white text-green-900 border border-green-100"
          }
        `}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: "default" }}
      >
        <button
          className={`absolute top-3 right-3 text-xl font-bold transition-colors duration-300
            ${
              darkMode
                ? "text-green-300 hover:text-green-100"
                : "text-green-700 hover:text-green-900"
            }`}
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-3">
          <img
            src={empresaFotos[fotoIndex]}
            alt="Foto coleta"
            className={`w-32 h-32 rounded-lg object-cover border-2 shadow transition-colors duration-300
              ${darkMode ? "border-green-900" : "border-green-200"}`}
          />
          <button
            className={`text-xs underline hover:text-green-800 transition-colors duration-300
              ${
                darkMode
                  ? "text-green-400 hover:text-green-200"
                  : "text-green-600 hover:text-green-800"
              }`}
            onClick={verMaisFotos}
          >
            Ver outra foto
          </button>
          <h3
            className={`text-2xl font-bold ${
              darkMode ? "text-green-200" : "text-green-800"
            }`}
          >
            {empresa.nome}
          </h3>
          <p
            className={`text-center ${
              darkMode ? "text-green-100" : "text-gray-700"
            }`}
          >
            {empresa.descricao}
          </p>
          <div
            className={`flex items-center gap-2 mt-2 ${
              darkMode ? "text-green-400" : "text-green-700"
            }`}
          >
            <MapPin size={18} /> <span>{empresa.local}</span>
          </div>
          {empresa.rota && (
            <span
              className={`text-xs mt-1 ${
                darkMode ? "text-green-500" : "text-green-500"
              }`}
            >
              🚚 Possui rota de coleta
            </span>
          )}
          <div className="w-full mt-4">
            <MiniMap empresa={empresa} />
          </div>
          <div className="mt-4 flex flex-col gap-1 w-full">
            <span
              className={`font-semibold ${
                darkMode ? "text-green-200" : "text-green-800"
              }`}
            >
              Horário de funcionamento:
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-green-400" : "text-gray-600"
              }`}
            >
              Seg-Sex: 8h às 18h
            </span>
            <span
              className={`font-semibold mt-2 ${
                darkMode ? "text-green-200" : "text-green-800"
              }`}
            >
              Contato:
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-green-400" : "text-gray-600"
              }`}
            >
              Telefone: (88) 99999-0000
            </span>
            <span
              className={`text-sm ${
                darkMode ? "text-green-400" : "text-gray-600"
              }`}
            >
              Email: contato@{empresa.nome.toLowerCase().replace(/\s/g, "")}.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const [routeCoords, setRouteCoords] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (
        selectedEmpresa &&
        selectedEmpresa.rota &&
        selectedEmpresa.rota.length > 1
      ) {
        const realRoute = await getRouteFromOSRM(selectedEmpresa.rota);
        setRouteCoords(realRoute);
      } else {
        setRouteCoords(null);
      }
    };
    fetchRoute();
  }, [selectedEmpresa]);

  return (
    <main
      className={`flex flex-col h-screen overflow-hidden relative transition-colors duration-300 ${
        darkMode ? "dark" : ""
      }`}
      style={{
        background: darkMode
          ? "linear-gradient(to bottom, #18181b 60%, #222 100%)"
          : "linear-gradient(to bottom, transparent, rgba(220, 252, 231, 0.5) 70%)",
      }}
    >
      {/* Navbar */}
      <nav
        className={`flex-none relative flex items-center justify-between pt-2 pb-2 shadow-md h-14 z-[1000] transition-colors duration-300
        ${
          darkMode
            ? "bg-neutral-900 border-b border-neutral-800"
            : "bg-green-50"
        }
      `}
      >
        <Menu
          className={`${
            darkMode ? "text-green-300" : "text-green-600"
          } m-2 stroke-3 cursor-pointer`}
          onClick={() => setMenuOpen(!menuOpen)}
        />
        <h2
          className={`text-2xl font-bold ${
            darkMode ? "text-green-300" : "text-green-600"
          }`}
        >
          EcoPoint
        </h2>
        <BellDot
          className={`${
            darkMode ? "text-green-300" : "text-green-600"
          } m-2 stroke-3`}
        />
      </nav>

      {/* Conteúdo da página atual */}
      <div
        className={`relative flex-1 transition-all duration-300 ease-in-out
          ${
            menuOpen
              ? "scale-[0.7] translate-x-[50%] rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.30)]"
              : "scale-100 translate-x-0"
          }
          ${
            activePage === "Recompensas" || activePage === "Registro"
              ? "overflow-auto"
              : "overflow-hidden"
          }
        `}
      >
        {/* Barra de busca (só para a página Início) */}
        {activePage === "Início" && (
          <div className="absolute top-4 left-4 right-4 flex flex-col gap-2 z-[1000]">
            <div
              className={`flex items-center p-3 rounded-md shadow transition-colors duration-300
              ${darkMode ? "bg-neutral-800" : "bg-green-50/80"}
            `}
            >
              <Search
                className={`${
                  darkMode ? "text-green-300" : "text-green-600/60"
                } stroke-3 mx-2`}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={currentLocationName}
                className={`bg-transparent outline-none w-full transition-colors duration-300
                  ${
                    darkMode
                      ? "text-green-100 placeholder:text-green-400"
                      : "text-gray-700"
                  }`}
              />
            </div>
            {searchResults.length > 0 && (
              <ul
                className={`rounded shadow max-h-40 overflow-y-auto divide-y transition-colors duration-300
                ${
                  darkMode
                    ? "bg-neutral-900 divide-neutral-700"
                    : "bg-green-50 divide-gray-200"
                }`}
              >
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
                    className={`px-4 py-2 cursor-pointer text-sm whitespace-nowrap overflow-hidden text-ellipsis border-b transition-colors duration-300
                      ${
                        darkMode
                          ? "hover:bg-neutral-800 text-green-100 border-neutral-800"
                          : "hover:bg-green-100 text-gray-800 border-gray-200"
                      }`}
                    title={result.display_name}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Conteúdo renderizado com base na página ativa */}
        {activePage === "Início" && (
          <MapContainer
            center={mapCenter}
            zoom={14}
            scrollWheelZoom={false}
            attributionControl={false}
            zoomControl={false}
            className="w-full h-full transition-colors duration-300"
            eventHandlers={{
              click: () => {
                setSelectedEmpresa(null);
                setEmpresaDetalhe(null);
              },
            }}
          >
            <ChangeMapCenter center={mapCenter} />
            <TileLayer
              url={
                darkMode
                  ? "https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=UQGRE7XLm3ARzxviBrhmHYYEtGQ1IOvogwhwHHtLyqxstEe0on6KxtLjjBTJmPuB"
                  : "https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=UQGRE7XLm3ARzxviBrhmHYYEtGQ1IOvogwhwHHtLyqxstEe0on6KxtLjjBTJmPuB"
              }
            />
            {empresasColeta.map((empresa) => (
              <Marker
                key={empresa.id}
                position={empresa.geocode}
                icon={
                  selectedEmpresa && selectedEmpresa.id === empresa.id
                    ? selectedIcon
                    : customIcon
                }
                ref={(el) => {
                  if (el) markerRefs.current[empresa.id] = el;
                }}
                eventHandlers={{
                  click: (e) => {
                    e.originalEvent.stopPropagation();
                    setSelectedEmpresa(empresa);
                  },
                  popupclose: () => {
                    setSelectedEmpresa(null);
                  },
                }}
              >
                <Popup>
                  <div
                    onClick={() => setEmpresaDetalhe(empresa)}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>{empresa.nome}</strong>
                    <br />
                    {empresa.local}
                    <br />
                    <span className="text-green-600 underline text-xs">
                      Ver mais detalhes
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedEmpresa && routeCoords && (
              <Polyline
                positions={routeCoords}
                pathOptions={{
                  color: darkMode ? "#6ee7b7" : "green",
                  weight: 6,
                  opacity: 0.7,
                }}
              />
            )}
            <ZoomControl position="bottomright" />
          </MapContainer>
        )}

        {activePage === "Pontos de Coleta" && (
          <div
            className={`p-4 space-y-6 overflow-y-auto h-full transition-colors duration-300
            ${
              darkMode
                ? "bg-neutral-900 text-neutral-100"
                : "bg-green-50 text-green-900"
            }
          `}
          >
            <h2
              className={`text-3xl font-extrabold mb-6 text-center drop-shadow transition-colors duration-300 ${
                darkMode ? "text-green-300" : "text-green-800"
              }`}
            >
              Pontos de Coleta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {empresasColeta.map((empresa) => (
                <div
                  key={empresa.id}
                  className={`flex flex-col rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border p-5 relative group
                    ${
                      darkMode
                        ? "bg-neutral-800 border-neutral-700"
                        : "bg-white border-green-100"
                    }
                  `}
                >
                  <img
                    src={empresa.foto}
                    alt={empresa.nome}
                    className={`w-full h-40 object-cover rounded-xl border-2 mb-4 group-hover:scale-105 transition-transform
                      ${darkMode ? "border-green-900" : "border-green-200"}`}
                  />
                  <span
                    className={`text-xl font-bold mb-1 ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    {empresa.nome}
                  </span>
                  <span
                    className={`text-sm mb-2 ${
                      darkMode ? "text-neutral-300" : "text-gray-600"
                    }`}
                  >
                    {empresa.descricao}
                  </span>
                  <span
                    className={`text-xs flex items-center gap-1 mb-2 ${
                      darkMode ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    <MapPin size={16} className="inline" /> {empresa.local}
                  </span>
                  {empresa.rota && (
                    <span
                      className={`text-xs mb-2 ${
                        darkMode ? "text-green-500" : "text-green-500"
                      }`}
                    >
                      🚚 Possui rota de coleta
                    </span>
                  )}
                  <div className="flex gap-2 mt-auto">
                    <button
                      className={`font-bold shadow transition-all w-full rounded-lg px-4 py-2
                        ${
                          darkMode
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      onClick={() => setEmpresaDetalhe(empresa)}
                    >
                      Ver mais
                    </button>
                    <button
                      className={`font-bold shadow transition-all w-full rounded-lg px-4 py-2
                        ${
                          darkMode
                            ? "bg-neutral-900 border border-green-400 text-green-300 hover:bg-neutral-800"
                            : "bg-white border border-green-600 text-green-700 hover:bg-green-50"
                        }`}
                      onClick={() => {
                        setSelectedEmpresa(empresa);
                        setMapCenter(empresa.geocode);
                        setActivePage("Início");
                        setTimeout(() => {
                          if (markerRefs.current[empresa.id]) {
                            markerRefs.current[empresa.id].openPopup();
                          }
                        }, 300);
                      }}
                    >
                      Ver no mapa
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-8" />
            {empresaDetalhe && (
              <EmpresaDetalheOverlay
                empresa={empresaDetalhe}
                onClose={closeEmpresaDetalhe}
              />
            )}
          </div>
        )}
        {activePage === "Recompensas" && (
          <div
            className={`p-2 sm:p-4 md:p-8 min-h-full flex flex-col gap-6 sm:gap-8 overflow-auto transition-colors duration-300
            ${
              darkMode
                ? "bg-neutral-900 text-neutral-100"
                : "bg-gradient-to-b from-green-50 to-white text-green-900"
            }
          `}
          >
            {/* Mini dashboard aprimorado */}
            <div
              className={`w-full max-w-2xl mx-auto rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 p-4 sm:p-6 border mt-2 sm:mt-4
              ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-white border-green-100"
              }
            `}
            >
              <div className="flex flex-col items-center md:items-start gap-1 sm:gap-2 flex-1">
                <span
                  className={`text-base sm:text-lg ${
                    darkMode ? "text-green-300" : "text-gray-500"
                  }`}
                >
                  Seus pontos
                </span>
                <span
                  className={`text-3xl sm:text-4xl font-extrabold drop-shadow ${
                    darkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  2.350
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-neutral-400" : "text-gray-400"
                  }`}
                >
                  Atualizado em 23/06/2025
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                <span
                  className={`text-base sm:text-lg ${
                    darkMode ? "text-green-300" : "text-gray-500"
                  }`}
                >
                  Meta para próxima recompensa
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-green-200" : "text-green-600"
                  }`}
                >
                  3.000 pts
                </span>
                <div
                  className={`w-24 sm:w-32 h-2.5 sm:h-3 rounded-full overflow-hidden mt-1 ${
                    darkMode ? "bg-green-900" : "bg-green-100"
                  }`}
                >
                  <div
                    className={`h-full bg-gradient-to-r from-green-400 to-green-600`}
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <span
                  className={`text-xs ${
                    darkMode ? "text-green-300" : "text-gray-500"
                  }`}
                >
                  Faltam{" "}
                  <span
                    className={`font-bold ${
                      darkMode ? "text-green-400" : "text-green-700"
                    }`}
                  >
                    650 pts
                  </span>
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                <span
                  className={`text-base sm:text-lg ${
                    darkMode ? "text-green-300" : "text-gray-500"
                  }`}
                >
                  Cupons resgatados
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-green-200" : "text-green-600"
                  }`}
                >
                  5
                </span>
                <span
                  className={`text-base sm:text-lg mt-1 sm:mt-2 ${
                    darkMode ? "text-green-300" : "text-gray-500"
                  }`}
                >
                  Produtos trocados
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-green-200" : "text-green-600"
                  }`}
                >
                  2
                </span>
              </div>
            </div>
            {/* Lista de recompensas responsiva */}
            <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 sm:gap-8 mt-2 sm:mt-4">
              <h2
                className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-center transition-colors duration-300 ${
                  darkMode ? "text-green-300" : "text-green-800"
                }`}
              >
                O que você pode fazer com seus pontos?
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Cupom Americanas */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://logodownload.org/wp-content/uploads/2019/09/americanas-logo-0.png"
                    alt="Cupom Americanas"
                    className="w-20 sm:w-24 h-10 sm:h-12 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Cupom Americanas
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 500 pontos por um cupom de R$20 para compras na
                    Americanas.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 500 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Receba o código do cupom por e-mail e use no site/app.
                  </span>
                </div>
                {/* Cupom iFood */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://logodownload.org/wp-content/uploads/2017/11/ifood-logo-1.png"
                    alt="Cupom iFood"
                    className="w-16 sm:w-20 h-8 sm:h-10 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Cupom iFood
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 600 pontos por um cupom de R$15 para pedir sua comida
                    favorita.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 600 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Válido para qualquer restaurante parceiro.
                  </span>
                </div>
                {/* Cupom Pão de Açúcar */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://logodownload.org/wp-content/uploads/2017/11/pao-de-acucar-logo-0.png"
                    alt="Cupom Pão de Açúcar"
                    className="w-16 sm:w-20 h-8 sm:h-10 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Cupom Pão de Açúcar
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 700 pontos por R$25 de desconto em compras no
                    supermercado.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 700 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Use no app ou loja física.
                  </span>
                </div>
                {/* Produto sustentável OMO */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=200&q=80"
                    alt="Garrafa Ecológica OMO"
                    className="w-16 sm:w-20 h-16 sm:h-20 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Garrafa OMO Reutilizável
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 1200 pontos por uma garrafa ecológica exclusiva da
                    OMO.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 1200 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Retire em pontos parceiros ou receba em casa.
                  </span>
                </div>
                {/* Kit Natura Ekos */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://www.natura.com.br/static/imgs/natura-logo.png"
                    alt="Kit Natura Ekos"
                    className="w-16 sm:w-20 h-8 sm:h-10 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Kit Natura Ekos
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 1500 pontos por um kit de produtos sustentáveis
                    Natura Ekos.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 1500 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Entrega gratuita para todo o Brasil.
                  </span>
                </div>
                {/* Experiência real: Visita Reciclagem */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://www.sesc-ce.com.br/wp-content/uploads/2022/06/centro-de-reciclagem.jpg"
                    alt="Visita Reciclagem"
                    className="w-20 sm:w-24 h-12 sm:h-16 mb-2 sm:mb-3 object-cover rounded group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Visita ao Centro de Reciclagem
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Troque 800 pontos por uma visita guiada ao Centro de
                    Reciclagem SESC.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Resgatar por 800 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Agende sua visita pelo app após resgatar.
                  </span>
                </div>
                {/* Doação para ONG real: WWF */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/WWF_logo.svg/2560px-WWF_logo.svg.png"
                    alt="Doação WWF"
                    className="w-16 sm:w-20 h-8 sm:h-12 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Doação WWF Brasil
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Doe 300 pontos para apoiar projetos ambientais da WWF
                    Brasil.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Doar 300 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Você receberá um certificado digital de doação.
                  </span>
                </div>
                {/* Doação para ONG real: SOS Mata Atlântica */}
                <div
                  className={`rounded-2xl shadow-md border p-4 sm:p-6 flex flex-col items-center hover:shadow-xl transition-all group min-h-[260px]
                  ${
                    darkMode
                      ? "bg-neutral-800 border-green-700 text-green-100"
                      : "bg-white border-green-100 text-green-900"
                  }`}
                >
                  <img
                    src="https://sosma.org.br/wp-content/themes/sosma/assets/images/logo-sosma.svg"
                    alt="Doação SOS Mata Atlântica"
                    className="w-16 sm:w-20 h-8 sm:h-10 mb-2 sm:mb-3 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span
                    className={`text-lg sm:text-xl font-bold mb-1 text-center ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Doação SOS Mata Atlântica
                  </span>
                  <span
                    className={`text-center mb-2 text-sm sm:text-base ${
                      darkMode ? "text-green-100" : "text-gray-600"
                    }`}
                  >
                    Doe 300 pontos para ajudar a preservar a Mata Atlântica.
                  </span>
                  <button
                    className={`mt-2 px-4 sm:px-6 py-2 rounded-lg font-bold shadow transition-all w-full text-base sm:text-lg
                    ${
                      darkMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    Doar 300 pts
                  </button>
                  <span
                    className={`text-xs mt-2 text-center ${
                      darkMode ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Receba um certificado digital personalizado.
                  </span>
                </div>
              </div>
              {/* Instruções de resgate */}
              <div
                className={`mt-6 sm:mt-8 rounded-xl p-3 sm:p-4 shadow flex flex-col gap-2 max-w-2xl mx-auto
                ${
                  darkMode
                    ? "bg-neutral-800 text-green-200"
                    : "bg-green-50 text-green-900"
                }
              `}
              >
                <span
                  className={`font-bold ${
                    darkMode ? "text-green-400" : "text-green-700"
                  }`}
                >
                  Como resgatar:
                </span>
                <ul className="list-disc ml-4 sm:ml-6">
                  <li>Escolha a recompensa desejada e clique em "Resgatar".</li>
                  <li>
                    Confirme o resgate e siga as instruções para receber seu
                    cupom, produto ou agendar experiência.
                  </li>
                  <li>
                    Para doações, o valor será transferido automaticamente para
                    a ONG escolhida.
                  </li>
                </ul>
                <span
                  className={`text-xs mt-2 ${
                    darkMode ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  * Exemplos reais de marcas e ONGs parceiras. Sujeito à
                  disponibilidade.
                </span>
              </div>
            </div>
          </div>
        )}
        {activePage === "Registro" && (
          <div
            className={`p-2 sm:p-4 md:p-8 min-h-full flex flex-col gap-8 overflow-auto transition-colors duration-300
            ${
              darkMode
                ? "bg-neutral-900 text-neutral-100"
                : "bg-gradient-to-b from-green-50 to-white text-green-900"
            }
          `}
          >
            <h2
              className={`text-2xl font-bold mb-2 text-center ${
                darkMode ? "text-green-300" : "text-green-800"
              }`}
            >
              Registrar Reciclagem
            </h2>
            {/* Escaneamento de QR Code */}
            <div
              className={`flex flex-col items-center gap-4 rounded-2xl shadow-md max-w-md mx-auto border p-6
              ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-white border-green-100"
              }
            `}
            >
              <button
                className={`flex flex-col items-center gap-2 font-bold shadow-lg text-lg transition-all focus:outline-none rounded-2xl px-8 py-6
                ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                <ScanQrCode size={48} />
                Escanear QR Code
              </button>
              <span
                className={`text-center text-sm ${
                  darkMode ? "text-neutral-300" : "text-gray-600"
                }`}
              >
                Aponte a câmera para o QR Code do ponto de coleta ou parceiro
                para registrar sua reciclagem automaticamente.
              </span>
            </div>
            {/* Histórico de reciclagem */}
            <div className="max-w-2xl mx-auto w-full">
              <h3
                className={`text-lg font-bold mb-2 ${
                  darkMode ? "text-green-300" : "text-green-700"
                }`}
              >
                Seu histórico
              </h3>
              <div className="flex flex-col gap-3">
                {/* Exemplo de histórico, pode ser dinâmico depois */}
                <div
                  className={`flex items-center gap-3 rounded-xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <span className="bg-green-100 rounded-full p-2">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1046/1046857.png"
                      alt="Plástico"
                      className="w-6 h-6"
                    />
                  </span>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    Plástico
                  </span>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    2 kg
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    +40 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    22/06/2025
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 rounded-xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <span className="bg-green-100 rounded-full p-2">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/190/190406.png"
                      alt="Papel"
                      className="w-6 h-6"
                    />
                  </span>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    Papel
                  </span>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    1 kg
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    +20 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    20/06/2025
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 rounded-xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <span className="bg-green-100 rounded-full p-2">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1046/1046876.png"
                      alt="Vidro"
                      className="w-6 h-6"
                    />
                  </span>
                  <span
                    className={`font-semibold ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    Vidro
                  </span>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    3 kg
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    +60 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    18/06/2025
                  </span>
                </div>
              </div>
            </div>
            {/* Ranking de amigos */}
            <div className="max-w-2xl mx-auto w-full mt-4">
              <h3
                className={`text-lg font-bold mb-4 ${
                  darkMode ? "text-green-300" : "text-green-700"
                }`}
              >
                Ranking entre amigos
              </h3>
              <div className="flex flex-col gap-3">
                {/* 1º lugar - destaque */}
                <div
                  className={`flex items-center gap-3 rounded-2xl shadow-lg p-4 border-2 scale-105 transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-gradient-to-r from-green-900 to-green-700 border-green-500"
                      : "bg-gradient-to-r from-green-300 to-green-100 border-green-500"
                  }`}
                >
                  <span className="relative">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Lucas"
                      className="w-14 h-14 rounded-full border-4 border-yellow-400 shadow-lg"
                    />
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-white font-bold rounded-full px-2 py-0.5 text-xs shadow">
                      1º
                    </span>
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={`font-bold text-lg ${
                        darkMode ? "text-green-200" : "text-green-900"
                      }`}
                    >
                      Lucas Silva
                    </span>
                    <span
                      className={`text-sm ${
                        darkMode ? "text-green-400" : "text-green-700"
                      }`}
                    >
                      1.850 pts
                    </span>
                  </div>
                </div>
                {/* 2º lugar */}
                <div
                  className={`flex items-center gap-3 rounded-2xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Ana"
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <span
                    className={`font-bold ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    Ana Souza
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    1.320 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    2º
                  </span>
                </div>
                {/* 3º lugar */}
                <div
                  className={`flex items-center gap-3 rounded-2xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-neutral-800 border-neutral-700"
                      : "bg-white border-green-100"
                  }`}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/65.jpg"
                    alt="Pedro"
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <span
                    className={`font-bold ${
                      darkMode ? "text-green-200" : "text-green-800"
                    }`}
                  >
                    Pedro Lima
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    1.100 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    3º
                  </span>
                </div>
                {/* Usuário logado (exemplo) */}
                <div
                  className={`flex items-center gap-3 rounded-2xl shadow p-3 border transition-colors duration-300
                  ${
                    darkMode
                      ? "bg-green-900 border-green-700"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <img
                    src="https://randomuser.me/api/portraits/men/99.jpg"
                    alt="Você"
                    className="w-10 h-10 rounded-full border-2 border-green-400"
                  />
                  <span
                    className={`font-bold ${
                      darkMode ? "text-green-200" : "text-green-700"
                    }`}
                  >
                    Você
                  </span>
                  <span
                    className={`ml-auto font-bold ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    950 pts
                  </span>
                  <span
                    className={`text-xs ml-2 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    4º
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activePage === "Conta" && (
          <div
            className={`p-2 sm:p-4 md:p-8 min-h-full flex flex-col items-center gap-8 overflow-auto transition-colors duration-300
            ${
              darkMode
                ? "bg-neutral-900 text-neutral-100"
                : "bg-gradient-to-b from-green-50 to-white text-green-900"
            }
          `}
          >
            {/* Perfil do usuário */}
            <div
              className={`w-full max-w-md rounded-2xl shadow-xl flex flex-col items-center gap-4 p-6 border mt-4
              ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-white border-green-100"
              }
            `}
            >
              <img
                src="https://randomuser.me/api/portraits/men/99.jpg"
                alt="Foto de perfil"
                className={`w-28 h-28 rounded-full shadow-lg object-cover mb-2 border-4
                  ${darkMode ? "border-green-700" : "border-green-400"}`}
              />
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-green-200" : "text-green-800"
                }`}
              >
                Pablo Andrade
              </span>
              <span
                className={`text-sm mb-2 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                @pablo.andrade
              </span>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col items-center">
                  <span
                    className={`font-bold text-lg ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    2.350
                  </span>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-gray-500"
                    }`}
                  >
                    Pontos
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={`font-bold text-lg ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    4
                  </span>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-gray-500"
                    }`}
                  >
                    Amigos
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span
                    className={`font-bold text-lg ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    5
                  </span>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-neutral-400" : "text-gray-500"
                    }`}
                  >
                    Cupons
                  </span>
                </div>
              </div>
              <button
                className={`mt-4 font-bold shadow transition-all w-full text-base rounded-lg px-6 py-2
                ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Editar perfil
              </button>
            </div>
            {/* Lista de amigos */}
            <div
              className={`w-full max-w-md rounded-2xl shadow-lg p-5 border flex flex-col gap-4
              ${
                darkMode
                  ? "bg-neutral-800 border-neutral-700"
                  : "bg-white border-green-100"
              }
            `}
            >
              <span
                className={`text-lg font-bold mb-2 ${
                  darkMode ? "text-green-300" : "text-green-700"
                }`}
              >
                Amigos
              </span>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Lucas"
                    className="w-14 h-14 rounded-full border-2 border-yellow-400 shadow"
                  />
                  <span
                    className={`font-semibold text-sm mt-1 ${
                      darkMode ? "text-green-300" : "text-green-900"
                    }`}
                  >
                    Lucas Silva
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Ana"
                    className="w-14 h-14 rounded-full border-2 border-gray-200 shadow"
                  />
                  <span
                    className={`font-semibold text-sm mt-1 ${
                      darkMode ? "text-green-300" : "text-green-900"
                    }`}
                  >
                    Ana Souza
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/65.jpg"
                    alt="Pedro"
                    className="w-14 h-14 rounded-full border-2 border-gray-200 shadow"
                  />
                  <span
                    className={`font-semibold text-sm mt-1 ${
                      darkMode ? "text-green-300" : "text-green-900"
                    }`}
                  >
                    Pedro Lima
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/12.jpg"
                    alt="Julia"
                    className="w-14 h-14 rounded-full border-2 border-gray-200 shadow"
                  />
                  <span
                    className={`font-semibold text-sm mt-1 ${
                      darkMode ? "text-green-300" : "text-green-900"
                    }`}
                  >
                    Julia Alves
                  </span>
                </div>
              </div>
              <button
                className={`mt-2 font-bold shadow w-full text-base rounded-lg px-4 py-2 border
                ${
                  darkMode
                    ? "bg-neutral-900 border-green-400 text-green-300 hover:bg-neutral-800"
                    : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                }`}
              >
                Convidar amigo
              </button>
            </div>
            {/* Ações rápidas */}
            <div className="w-full max-w-md flex gap-4 justify-center mt-2">
              <button
                className={`flex-1 font-bold shadow transition-all text-base rounded-lg px-4 py-2 border
                ${
                  darkMode
                    ? "bg-neutral-900 border-green-400 text-green-300 hover:bg-neutral-800"
                    : "bg-white border-green-600 text-green-700 hover:bg-green-50"
                }`}
              >
                Ver histórico
              </button>
              <button
                className={`flex-1 font-bold shadow transition-all text-base rounded-lg px-4 py-2 border
                ${
                  darkMode
                    ? "bg-neutral-900 border-green-400 text-green-300 hover:bg-neutral-800"
                    : "bg-white border-green-600 text-green-700 hover:bg-green-50"
                }`}
              >
                Ranking
              </button>
            </div>
          </div>
        )}
        {activePage === "Configurações" && (
          <div
            className={`p-4 sm:p-8 max-w-lg mx-auto w-full flex flex-col gap-6 rounded-2xl shadow-xl mt-8 border animate-fade-in transition-colors duration-300
            ${
              darkMode
                ? "bg-neutral-900 text-neutral-100 border-neutral-800"
                : "bg-white text-green-900 border-green-100"
            }
          `}
          >
            <h2
              className={`text-2xl font-bold mb-4 text-center transition-colors duration-300 ${
                darkMode ? "text-green-300" : "text-green-800"
              }`}
            >
              Configurações
            </h2>
            {/* Modo escuro */}
            <div
              className={`flex items-center justify-between py-3 border-b transition-colors duration-300 ${
                darkMode ? "border-neutral-800" : "border-green-100"
              }`}
            >
              <span
                className={`font-medium transition-colors duration-300 ${
                  darkMode ? "text-green-200" : "text-green-700"
                }`}
              >
                Modo escuro
              </span>
              <button
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  darkMode ? "bg-green-400" : "bg-green-200"
                }`}
                onClick={() => setDarkMode((v) => !v)}
                aria-label="Alternar modo escuro"
              >
                <span
                  className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    darkMode ? "translate-x-6" : ""
                  }`}
                ></span>
              </button>
            </div>
            {/* Notificações */}
            <div
              className={`flex items-center justify-between py-3 border-b transition-colors duration-300 ${
                darkMode ? "border-neutral-800" : "border-green-100"
              }`}
            >
              <span className="font-medium">Notificações</span>
              <input
                type="checkbox"
                className="accent-green-600 w-5 h-5"
                defaultChecked
              />
            </div>
            {/* Privacidade */}
            <div
              className={`flex items-center justify-between py-3 border-b transition-colors duration-300 ${
                darkMode ? "border-neutral-800" : "border-green-100"
              }`}
            >
              <span className="font-medium">Conta privada</span>
              <input type="checkbox" className="accent-green-600 w-5 h-5" />
            </div>
            {/* Idioma */}
            <div
              className={`flex items-center justify-between py-3 border-b transition-colors duration-300 ${
                darkMode ? "border-neutral-800" : "border-green-100"
              }`}
            >
              <span className="font-medium">Idioma</span>
              <select
                className={`rounded px-2 py-1 border transition-colors duration-300 ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700 text-green-200"
                    : "bg-green-50 border-green-100 text-green-800"
                }`}
              >
                <option>Português</option>
                <option>English</option>
              </select>
            </div>
            {/* Suporte */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium">Ajuda e suporte</span>
              <button
                className={`underline font-semibold transition-colors duration-300 ${
                  darkMode ? "text-green-300" : "text-green-600"
                }`}
              >
                Fale conosco
              </button>
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="absolute left-0 top-0 z-30 h-full w-3/4 max-w-xs p-1 pt-16 overflow-hidden">
          <ul className="space-y-7">
            {menuItems.map((item, index) => (
              <li
                key={item.text}
                className={`
                  flex items-center gap-2 p-2 transition-all duration-300 ease-out transform
                  ${
                    animateItems
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-full opacity-0"
                  }
                  font-bold hover:text-green-500 cursor-pointer
                  ${darkMode ? "text-green-300" : "text-green-700"}
                `}
                style={{
                  transitionDelay: `${animateItems ? index * 30 : 0}ms`,
                }}
                onClick={() => {
                  setActivePage(item.text);
                  setMenuOpen(false);
                }}
              >
                <span
                  className={darkMode ? "text-green-300" : "text-green-700"}
                >
                  {item.icon}
                </span>
                <span className="text-xl">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Adiciona estilos globais para customizar os botões de zoom do Leaflet no dark mode */}
      <style>{`
        .dark .leaflet-control-zoom a {
          background: #18181b !important;
          color: #6ee7b7 !important;
          border: 1px solid #6ee7b7 !important;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .dark .leaflet-control-zoom a:hover {
          background: #23272e !important;
          color: #bbf7d0 !important;
          border-color: #bbf7d0 !important;
        }
      `}</style>
    </main>
  );
};

export default App;
