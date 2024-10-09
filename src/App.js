import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Jogadores from './components/Jogadores';
import JogadorDetalhes from './components/JogadorDetalhes'; // Importa o componente JogadorDetalhes
import CriarPartida from './components/CriarPartida'; 
import Jogo from './components/Jogo'; // Importa o componente Jogo
import { useState } from 'react';
import JogoDetalhes from './components/JogoDetalhes';
import PartidasFinalizadas from './components/PartidasFinalizadas'; // Correto: renomear para PartidasFinalizadas

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log(isAuthenticated)

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home onLogout={handleLogout} />} />
        <Route path="/jogadores" element={<Jogadores />} />
        <Route path="/jogadores/:id" element={<JogadorDetalhes />} /> {/* Rota para os detalhes do jogador */}
        <Route path="/criar-partida" element={<CriarPartida />} /> {/* Rota para criar partida */}
        <Route path="/partida/:id" element={<Jogo />} /> {/* Rota para a página do jogo */}
        <Route path="/jogoDetalhes/:id" element={<JogoDetalhes />} /> {/* Rota para a página de detalhes do jogo */}
        <Route path="/partidas-finalizadas" element={<PartidasFinalizadas />} /> {/* Rota para listar as partidas finalizadas */}
      </Routes>
    </Router>
  );
};

export default App;
