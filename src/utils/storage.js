// Utilitário para carregar e salvar dados do usuário localmente
const embeddedUsers = [
  {
    id: "user-1",
    nome: "Pablo Andrade",
    email: "pablo@email.com",
    senha: "12345678",
    foto: "https://randomuser.me/api/portraits/men/99.jpg",
    amigos: [
      {
        id: "user-2",
        nome: "Lucas Silva",
        foto: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        id: "user-3",
        nome: "Ana Souza",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        id: "user-4",
        nome: "Pedro Lima",
        foto: "https://randomuser.me/api/portraits/men/65.jpg",
      },
      {
        id: "user-5",
        nome: "Julia Alves",
        foto: "https://randomuser.me/api/portraits/women/12.jpg",
      },
    ],
    cupons: [
      {
        id: "cupom-1",
        nome: "Cupom Americanas",
        valor: 20,
        pontos: 500,
        resgatado: true,
      },
      {
        id: "cupom-2",
        nome: "Cupom iFood",
        valor: 15,
        pontos: 600,
        resgatado: false,
      },
    ],
    produtos: [
      {
        id: "produto-1",
        nome: "Garrafa OMO Reutilizável",
        pontos: 1200,
        resgatado: false,
      },
    ],
    metaPontos: 3000,
    pontos: 2350,
    historico: [
      {
        id: "rec-1",
        tipo: "Plástico",
        quantidade: 2,
        unidade: "kg",
        pontos: 40,
        data: "2025-06-22",
      },
      {
        id: "rec-2",
        tipo: "Papel",
        quantidade: 1,
        unidade: "kg",
        pontos: 20,
        data: "2025-06-20",
      },
      {
        id: "rec-3",
        tipo: "Vidro",
        quantidade: 3,
        unidade: "kg",
        pontos: 60,
        data: "2025-06-18",
      },
    ],
  },
  {
    id: "user-6",
    nome: "Paulo Oliveira",
    email: "paulo@email.com",
    senha: "123456",
    foto: "https://randomuser.me/api/portraits/men/45.jpg",
    amigos: [],
    cupons: [],
    produtos: [],
    metaPontos: 2000,
    pontos: 800,
    historico: [],
  },
];

export async function loadUserData() {
  // Retorna os usuários embutidos no código
  return embeddedUsers;
}

export async function saveUserData(data) {
  // Em ambiente real, salvaria no backend. Aqui, apenas simula.
  localStorage.setItem("userData", JSON.stringify(data));
}

export function getUserDataFromStorage() {
  const data = localStorage.getItem("userData");
  return data ? JSON.parse(data) : null;
}
