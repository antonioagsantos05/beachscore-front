// src/components/PartidasFinalizadas.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PartidasFinalizadas = () => {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true); // Para gerenciar o estado de carregamento
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const token = localStorage.getItem('token'); // Pegando o token do localStorage
        const response = await axios.get('https://beachscore-backend.azurewebsites.net/api/partidas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filtra as partidas finalizadas
        const partidasFinalizadas = response.data.filter(partida => partida.status === 'finalizada');

        // Adiciona uma chamada para obter os jogadores de cada partida
        const partidasComJogadores = await Promise.all(partidasFinalizadas.map(async (partida) => {
          const jogadoresResponse = await axios.get(`http://beachscore-backend.azurewebsites.net/api/partidas/${partida.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return { ...partida, jogadores: jogadoresResponse.data.jogadores }; // Adiciona os jogadores à partida
        }));

        setPartidas(partidasComJogadores); // Armazena as partidas com os jogadores
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      } finally {
        setLoading(false); // Atualiza o estado de carregamento
      }
    };

    fetchPartidas(); // Chama a função ao montar o componente
  }, []);

  const handlePartidaClick = (id) => {
    // Navegar para os detalhes da partida
    navigate(`/jogoDetalhes/${id}`); // Redireciona para JogoDetalhes.js
  };

  if (loading) {
    return <div>Carregando...</div>; // Exibe uma mensagem de carregamento
  }

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="container mt-4 text-center">
      <h1>Partidas Finalizadas</h1>
      <div className="list-group">
        {partidas.map((partida) => (
          <Button
            key={partida.id}
            className="list-group-item list-group-item-action mb-2"
            onClick={() => handlePartidaClick(partida.id)} // Passa o id da partida
            style={{ width: '100%', textAlign: 'center' }} // Centraliza o texto no botão
          >
            <div>
              {`${partida.jogadores[0].nome} / ${partida.jogadores[1].nome} x ${partida.jogadores[2].nome} / ${partida.jogadores[3].nome}`}
            </div>
            <hr style={{ margin: '5px 0' }} /> {/* Adiciona um traço entre o nome das duplas e o placar */}
            <div>
              Placar: {partida.resultado_partida}
            </div>
          </Button>
        ))}
      </div>
            {/* Botão Voltar para Home */}
            <div className="mb-3 text-center">
        <Button variant="primary" onClick={handleGoHome} style={{ borderWidth: '2px', marginRight: '10px' }}>
          Voltar para Home
        </Button>
      </div>
    </div>
  );
};

export default PartidasFinalizadas;
