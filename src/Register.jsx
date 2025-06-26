import React, { useState } from "react";
import { loadUserData, saveUserData } from "./utils/storage";

const Register = ({
  onRegister,
  onSwitchToLogin,
  darkMode,
  themeMode,
  setThemeMode,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const users = await loadUserData();
      if (users.find((u) => u.email === email)) {
        setError("Email já cadastrado.");
        return;
      }
      const newUser = {
        id: `user-${Date.now()}`,
        nome: email.split("@")[0],
        email,
        senha: password,
        foto: "https://randomuser.me/api/portraits/lego/1.jpg",
        amigos: [],
        cupons: [],
        produtos: [],
        metaPontos: 1000,
        pontos: 0,
        historicoReciclagem: [],
      };
      users.push(newUser);
      // Atualiza o array embutido (em memória)
      if (Array.isArray(window.embeddedUsers)) {
        window.embeddedUsers.push(newUser);
      }
      saveUserData(newUser);
      if (onRegister) onRegister();
    } catch {
      setError("Erro ao criar conta.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        darkMode ? "bg-neutral-900" : "bg-green-50"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`${
          darkMode ? "bg-neutral-800" : "bg-white"
        } p-8 rounded shadow-md w-full max-w-sm`}
      >
        <h2
          className={`text-2xl font-bold mb-6 ${
            darkMode ? "text-green-200" : "text-green-700"
          }`}
        >
          Criar Conta
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mb-4 p-2 w-full border rounded transition-colors duration-200
            ${
              darkMode
                ? "bg-neutral-900 border-green-700 text-green-100 placeholder:text-green-400"
                : "bg-white border-green-300 text-green-900 placeholder:text-gray-400"
            }`}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`mb-4 p-2 w-full border rounded transition-colors duration-200
            ${
              darkMode
                ? "bg-neutral-900 border-green-700 text-green-100 placeholder:text-green-400"
                : "bg-white border-green-300 text-green-900 placeholder:text-gray-400"
            }`}
          required
        />
        {error && (
          <div className="text-red-400 mb-2 font-semibold">{error}</div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Registrar
        </button>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className={`mt-4 underline ${
            darkMode ? "text-green-300" : "text-green-700"
          }`}
        >
          Já tenho conta
        </button>
        <div className="mt-4 flex flex-col gap-1">
          <span
            className={`text-xs font-bold mb-1 ${
              darkMode ? "text-green-200" : "text-green-700"
            }`}
          >
            Tema:
          </span>
          <button
            type="button"
            onClick={() => setThemeMode("auto")}
            className={`text-xs underline ${
              themeMode === "auto" ? "font-bold" : ""
            } ${darkMode ? "text-green-200" : "text-green-700"}`}
          >
            Automático (Sistema)
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("light")}
            className={`text-xs underline ${
              themeMode === "light" ? "font-bold" : ""
            } ${darkMode ? "text-green-200" : "text-green-700"}`}
          >
            Modo claro
          </button>
          <button
            type="button"
            onClick={() => setThemeMode("dark")}
            className={`text-xs underline ${
              themeMode === "dark" ? "font-bold" : ""
            } ${darkMode ? "text-green-200" : "text-green-700"}`}
          >
            Modo escuro
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
