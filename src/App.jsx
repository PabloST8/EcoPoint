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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Login from "./Login";
import Register from "./Register";
import { getUserDataFromStorage } from "./utils/storage";
import { QrReader } from "react-qr-reader";

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
    foto: "src/assets/ChatGPT Image 24_06_2025, 08_35_02.png",
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
    foto: "src/assets/ChatGPT Image 24_06_2025, 08_56_09.png",
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
    foto: "src/assets/ChatGPT Image 24_06_2025, 09_33_30.png",
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
  const [currentLocationName, setCurrentLocationName] = useState("Tianguá");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([-3.7333, -40.9919]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [animateItems, setAnimateItems] = useState(false);
  const [activePage, setActivePage] = useState("Início");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(() => getUserDataFromStorage());
  const [userData, setUserData] = useState(() => getUserDataFromStorage());
  const [themeMode, setThemeMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    return saved || "auto"; // 'auto', 'dark', 'light'
  });
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [setQrResult] = useState(null);

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

  // Detecta tema do sistema e salva preferência do usuário
  useEffect(() => {
    if (themeMode === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    } else {
      setDarkMode(themeMode === "dark");
    }
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

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

  const verMaisFotos = () => {};

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
            src={empresa.foto}
            alt={empresa.nome}
            className={`w-32 h-32 rounded-lg object-contain border-2 shadow transition-colors duration-300
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

  // Notificações de exemplo
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      titulo: "Parabéns! Você ganhou 40 pontos",
      resumo: "Sua reciclagem de plástico foi registrada.",
      texto:
        "Sua reciclagem de 2kg de plástico foi registrada com sucesso no ponto EcoRecicla. Continue reciclando para acumular mais pontos e trocar por recompensas!",
      aberta: false,
      data: "22/06/2025 10:12",
    },
    {
      id: 2,
      titulo: "Ranking atualizado",
      resumo: "Você subiu para 4º lugar entre seus amigos.",
      texto:
        "Continue reciclando para subir ainda mais no ranking e desafiar seus amigos! Veja o ranking completo na aba Registro.",
      aberta: false,
      data: "21/06/2025 18:40",
    },
    {
      id: 3,
      titulo: "Cupom resgatado!",
      resumo: "Seu cupom Americanas foi enviado por e-mail.",
      texto:
        "Use o código recebido para garantir R$20 de desconto em sua próxima compra na Americanas. Aproveite!",
      aberta: false,
      data: "20/06/2025 14:05",
    },
    {
      id: 4,
      titulo: "Nova rota de coleta disponível",
      resumo: "A empresa Verde Vida atualizou sua rota.",
      texto:
        "Agora a coleta de eletrônicos e metais passa no seu bairro às quartas-feiras. Veja detalhes no mapa ou na aba Pontos de Coleta.",
      aberta: false,
      data: "19/06/2025 09:30",
    },
    {
      id: 5,
      titulo: "Meta próxima de ser atingida!",
      resumo: "Faltam apenas 150 pontos para sua próxima recompensa.",
      texto:
        "Continue reciclando para atingir sua meta e trocar por cupons, produtos ou experiências exclusivas.",
      aberta: false,
      data: "18/06/2025 16:20",
    },
    {
      id: 6,
      titulo: "Bem-vindo ao EcoPoint!",
      resumo: "Sua conta foi criada com sucesso.",
      texto:
        "Explore o app, registre reciclagens, acompanhe seu progresso e desafie amigos para tornar o mundo mais sustentável.",
      aberta: false,
      data: "17/06/2025 08:00",
    },
  ]);

  const toggleNotificacao = (id) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, aberta: !n.aberta } : n))
    );
  };

  // Carrega dados do usuário ao logar
  useEffect(() => {
    const local = getUserDataFromStorage();
    setUser(local);
    setUserData(local);
  }, []);

  const handleMenuItemClick = (item) => {
    if (item.text === "Sair") {
      // Remover Firebase: apenas limpar estados e localStorage
      setUser(null);
      setUserData(null);
      localStorage.removeItem("userData"); // Limpa dados persistidos
      setMenuOpen(false);
      return;
    }
    setActivePage(item.text);
    setMenuOpen(false);
  };

  const [showRegister, setShowRegister] = useState(false);

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onSwitchToLogin={() => setShowRegister(false)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
        />
      );
    }
    return (
      <Login
        onLogin={() => {
          const local = getUserDataFromStorage();
          setUser(local);
          setUserData(local);
        }}
        onSwitchToRegister={() => setShowRegister(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
      />
    );
  }

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
          onClick={() => {
            setActivePage("Notificações");
            setMenuOpen(false);
          }}
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
                    key={result.place_id || result.display_name}
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
                    className={`w-full h-40 object-contain rounded-xl border-2 mb-4 group-hover:scale-105 transition-transform
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
                  {userData?.pontos || 0}
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
                  {userData?.metaPontos
                    ? userData.metaPontos - (userData?.pontos || 0)
                    : "Defina uma meta"}{" "}
                  pts
                </span>
                <div
                  className={`w-24 sm:w-32 h-2.5 sm:h-3 rounded-full overflow-hidden mt-1 ${
                    darkMode ? "bg-green-900" : "bg-green-100"
                  }`}
                >
                  <div
                    className={`h-full bg-gradient-to-r from-green-400 to-green-600`}
                    style={{
                      width: `${
                        userData?.metaPontos
                          ? ((userData?.pontos || 0) / userData.metaPontos) *
                            100
                          : 0
                      }%`,
                    }}
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
                    {userData?.metaPontos
                      ? userData.metaPontos - (userData?.pontos || 0)
                      : "Defina uma meta"}{" "}
                    pts
                  </span>
                </span>
                {(!userData?.metaPontos || userData.metaPontos <= 0) && (
                  <span className="text-xs text-red-400 mt-1">
                    Defina uma meta de pontos no seu perfil!
                  </span>
                )}
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
                  {userData?.cupons?.length || 0}
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
                  {userData?.produtos?.length || 0}
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
                onClick={() => setShowQrScanner(true)}
              >
                <ScanQrCode size={48} />
                Escanear QR Code
              </button>

              {showQrScanner && (
                <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                  <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={() => setShowQrScanner(false)}
                  >
                    ✕
                  </button>
                  <QrReader
                    constraints={{ facingMode: "environment" }}
                    onResult={(result) => {
                      if (result) {
                        setQrResult(result?.text);
                        setShowQrScanner(false);
                        // Aqui você pode tratar o resultado do QR (ex: registrar reciclagem)
                      }
                    }}
                    style={{ width: "300px" }}
                  />
                  <span className="text-white mt-4">
                    Aponte a câmera para o QR Code
                  </span>
                </div>
              )}

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
                {userData?.historico && userData.historico.length > 0 ? (
                  userData.historico.map((item) => (
                    <div
                      key={item.id || item.data + item.tipo + item.pontos}
                      className={`flex items-center gap-3 rounded-xl shadow p-3 border transition-colors duration-300
                ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700"
                    : "bg-white border-green-100"
                }`}
                    >
                      <span className="bg-green-100 rounded-full p-2">
                        <img
                          src={item.icone}
                          alt={item.tipo}
                          className="w-6 h-6"
                        />
                      </span>
                      <span
                        className={`font-semibold ${
                          darkMode ? "text-green-200" : "text-green-800"
                        }`}
                      >
                        {item.tipo}
                      </span>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-green-400" : "text-gray-500"
                        }`}
                      >
                        {item.quantidade}
                      </span>
                      <span
                        className={`ml-auto font-bold ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        +{item.pontos} pts
                      </span>
                      <span
                        className={`text-xs ml-2 ${
                          darkMode ? "text-neutral-400" : "text-gray-400"
                        }`}
                      >
                        {item.data}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-center text-sm opacity-60 py-4">
                    Nenhum registro encontrado.
                  </span>
                )}
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
                {(() => {
                  // Monta lista de ranking: usuário + amigos
                  const ranking = [
                    {
                      ...userData,
                      nome: userData?.nome || "Você",
                      foto:
                        userData?.foto ||
                        "https://randomuser.me/api/portraits/lego/1.jpg",
                      pontos: userData?.pontos || 0,
                      isUser: true,
                    },
                    ...(userData?.amigos || []).map((amigo) => ({
                      ...amigo,
                      isUser: false,
                    })),
                  ].sort((a, b) => (b.pontos || 0) - (a.pontos || 0));
                  return ranking.map((item, idx) => (
                    <div
                      key={item.email || item.nome || idx}
                      className={`flex items-center gap-3 rounded-2xl shadow-lg p-4 border-2 transition-colors duration-300
                ${
                  idx === 0
                    ? darkMode
                      ? "bg-gradient-to-r from-green-900 to-green-700 border-green-500 scale-105"
                      : "bg-gradient-to-r from-green-300 to-green-100 border-green-500 scale-105"
                    : darkMode
                    ? "bg-neutral-800 border-neutral-700"
                    : "bg-white border-green-100"
                }`}
                    >
                      <span className="relative">
                        <img
                          src={item.foto}
                          alt={item.nome}
                          className={`w-14 h-14 rounded-full border-4 ${
                            idx === 0
                              ? "border-yellow-400 shadow-lg"
                              : item.isUser
                              ? darkMode
                                ? "border-green-400"
                                : "border-green-400"
                              : "border-gray-200"
                          }`}
                        />
                        {idx === 0 && (
                          <span className="absolute -top-2 -right-2 bg-yellow-400 text-white font-bold rounded-full px-2 py-0.5 text-xs shadow">
                            1º
                          </span>
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span
                          className={`font-bold text-lg ${
                            darkMode ? "text-green-200" : "text-green-900"
                          }`}
                        >
                          {item.isUser ? "Você" : item.nome}
                        </span>
                        <span
                          className={`text-sm ${
                            darkMode ? "text-green-400" : "text-green-700"
                          }`}
                        >
                          {item.pontos} pts
                        </span>
                      </div>
                      <span
                        className={`ml-auto font-bold ${
                          darkMode ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        {item.pontos} pts
                      </span>
                      <span
                        className={`text-xs ml-2 ${
                          darkMode ? "text-neutral-400" : "text-gray-400"
                        }`}
                      >
                        {idx + 1}º
                      </span>
                    </div>
                  ));
                })()}
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
                src={userData?.foto}
                alt="Foto de perfil"
                className={`w-28 h-28 rounded-full shadow-lg object-cover mb-2 border-4
          ${darkMode ? "border-green-700" : "border-green-400"}`}
              />
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-green-200" : "text-green-800"
                }`}
              >
                {userData?.nome || "Usuário"}
              </span>
              <span
                className={`text-sm mb-2 ${
                  darkMode ? "text-green-400" : "text-green-600"
                }`}
              >
                {userData?.email || user?.email || "sem email"}
              </span>
              <div className="flex gap-4 mt-2">
                <div className="flex flex-col items-center">
                  <span
                    className={`font-bold text-lg ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}
                  >
                    {userData?.pontos ?? 0}
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
                    {userData?.amigos?.length ?? 0}
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
                    {userData?.cupons?.length ?? 0}
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
                {userData?.amigos?.map((amigo) => (
                  <div
                    key={amigo.email || amigo.id || amigo.nome}
                    className="flex flex-col items-center"
                  >
                    <img
                      src={amigo.foto}
                      alt={amigo.nome}
                      className="w-14 h-14 rounded-full border-2 border-gray-200 shadow"
                    />
                    <span
                      className={`font-semibold text-sm mt-1 ${
                        darkMode ? "text-green-300" : "text-green-900"
                      }`}
                    >
                      {amigo.nome}
                    </span>
                  </div>
                ))}
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
            {/* Tema */}
            <div
              className={`flex items-center justify-between py-3 border-b transition-colors duration-300 ${
                darkMode ? "border-neutral-800" : "border-green-100"
              }`}
            >
              <span className="font-medium">Tema</span>
              <select
                className={`rounded px-2 py-1 border transition-colors duration-300 ${
                  darkMode
                    ? "bg-neutral-800 border-neutral-700 text-green-200"
                    : "bg-green-50 border-green-100 text-green-800"
                }`}
                value={themeMode}
                onChange={(e) => {
                  setThemeMode(e.target.value);
                  if (e.target.value === "auto") {
                    const isDark = window.matchMedia(
                      "(prefers-color-scheme: dark)"
                    ).matches;
                    setDarkMode(isDark);
                  } else {
                    setDarkMode(e.target.value === "dark");
                  }
                }}
              >
                <option value="auto">Automático</option>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
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
        {activePage === "Notificações" && (
          <div
            className={`p-2 sm:p-4 md:p-8 flex-1 flex flex-col gap-6 overflow-y-auto h-full transition-colors duration-300
              ${
                darkMode
                  ? "bg-neutral-900 text-neutral-100"
                  : "bg-green-50 text-green-900"
              }
            `}
          >
            <h2
              className={`text-2xl font-bold mb-4 text-center ${
                darkMode ? "text-green-300" : "text-green-800"
              }`}
            >
              Notificações
            </h2>
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
              {notificacoes.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl shadow-md border p-4 flex flex-col gap-2 transition-all duration-300
                    ${
                      darkMode
                        ? "bg-neutral-800 border-green-700"
                        : "bg-white border-green-100"
                    }
                  `}
                >
                  <div
                    className="flex items-center justify-between gap-2 cursor-pointer"
                    onClick={() => toggleNotificacao(n.id)}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-base sm:text-lg ${
                          darkMode ? "text-green-200" : "text-green-700"
                        }`}
                      >
                        {n.titulo}
                      </span>
                      <span
                        className={`text-sm ${
                          darkMode ? "text-green-400" : "text-gray-600"
                        }`}
                      >
                        {n.resumo}
                      </span>
                    </div>
                    <button
                      className={`rounded-full p-2 transition-colors duration-300 focus:outline-none
                        ${
                          darkMode
                            ? "text-green-300 hover:bg-green-900"
                            : "text-green-700 hover:bg-green-100"
                        }`}
                      aria-label={
                        n.aberta ? "Fechar notificação" : "Abrir notificação"
                      }
                    >
                      {n.aberta ? (
                        <ChevronUp size={22} />
                      ) : (
                        <ChevronDown size={22} />
                      )}
                    </button>
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      darkMode ? "text-neutral-400" : "text-gray-400"
                    }`}
                  >
                    {n.data}
                  </span>
                  {n.aberta && (
                    <div
                      className={`mt-2 text-sm ${
                        darkMode ? "text-green-100" : "text-gray-800"
                      }`}
                    >
                      {n.texto}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="absolute left-0 top-0 z-30 h-full w-3/4 max-w-xs p-1 pt-16 overflow-hidden">
          {/* Menu lateral */}
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
                onClick={() => handleMenuItemClick(item)}
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
