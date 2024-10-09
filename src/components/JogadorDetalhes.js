// src/components/JogadorDetalhes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const JogadorDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jogador, setJogador] = useState(null);
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJogador = async () => {
      try {
        const response = await axios.get(`https://beachscore-backend.azurewebsites.net/api/jogadores/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setJogador(response.data);
        console.log('Jogador encontrado:', response.data);

        // Busca todas as partidas
        const partidasResponse = await axios.get('https://beachscore-backend.azurewebsites.net/api/partidas', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log('Partidas encontradas:', partidasResponse.data);

        // Filtra as partidas que o jogador participou
        const partidasJogador = await Promise.all(
          partidasResponse.data.map(async (partida) => {
            const jogadoresResponse = await axios.get(`https://beachscore-backend.azurewebsites.net/api/partidas/${partida.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });

            const jogadores = jogadoresResponse.data.jogadores || []; // Use um array vazio como fallback
            console.log('Jogadores da partida:', jogadores);

            // Verifica se o jogador está na partida
            const jogadorParticipante = jogadores.find(j => j.id === response.data.id);
            if (jogadorParticipante) {
              // Busca as estatísticas do jogador para esta partida
              const estatisticasResponse = await axios.get(`https://beachscore-backend.azurewebsites.net/api/estatisticas/${partida.id}/${jogadorParticipante.id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              });

              return { ...partida, jogadores, estatisticas: estatisticasResponse.data }; // Adiciona estatísticas à partida
            }
            return null;
          })
        );

        // Filtra partidas que o jogador participou e remove null
        setPartidas(partidasJogador.filter(partida => partida !== null));
        console.log('Partidas filtradas do jogador:', partidasJogador.filter(partida => partida !== null));
      } catch (error) {
        console.error('Erro ao buscar jogador ou partidas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJogador();
  }, [id]);

  const handleBackToPlayers = () => {
    navigate('/jogadores');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!jogador) {
    return <div>Jogador não encontrado.</div>;
  }

  return (
    <Container className="mt-4">
      <Card className="mb-4 shadow-sm border-primary">
        <Card.Body>
          <Card.Title className="text-center text-primary">
            Detalhes do Jogador
          </Card.Title>
          <Card.Text className="text-center">
            <strong>Nome:</strong> {jogador.nome}
          </Card.Text>
          <Card.Text className="text-center">
            <strong>Idade:</strong> {jogador.idade}
          </Card.Text>
        </Card.Body>
      </Card>

      <h2 className="mt-4 text-center">Histórico de Partidas</h2>
      {partidas.length === 0 ? (
        <p className="text-center">Este jogador não participou de nenhuma partida.</p>
      ) : (
        <ListGroup>
          {partidas.map(partida => {
            const [dupla1, dupla2] = partida.jogadores.reduce((acc, jogador) => {
              acc[jogador.dupla - 1].push(jogador.nome);
              return acc;
            }, [[], []]);

            return (
              <Card className="mb-3" key={partida.id}>
                <Card.Body>
                  <Card.Title>
                    {`${dupla1.join(' / ')} x ${dupla2.join(' / ')} | ${new Date(partida.data_partida).toLocaleDateString()}`}
                  </Card.Title>
                  <hr />
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Estatísticas:</strong>
                    </ListGroup.Item>
                    {partida.estatisticas ? (
                      <>
                        <ListGroup.Item>
                          <strong>Backhand:</strong> {partida.estatisticas.backhand_acertos || 0} acertos - {partida.estatisticas.backhand_erros || 0} erros
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Forehand:</strong> {partida.estatisticas.forehand_acertos || 0} acertos - {partida.estatisticas.forehand_erros || 0} erros
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Voleio:</strong> {partida.estatisticas.voleio_acertos || 0} acertos - {partida.estatisticas.voleio_erros || 0} erros
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Total:</strong> {partida.estatisticas.total_acertos || 0} acertos - {partida.estatisticas.total_erros || 0} erros
                        </ListGroup.Item>
                      </>
                    ) : (
                      <ListGroup.Item>Sem estatísticas disponíveis.</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            );
          })}
        </ListGroup>
      )}

      {/* Botão para voltar à lista de jogadores */}
      <div className="text-center mt-3">
        <Button variant="primary" onClick={handleBackToPlayers}>
          Voltar para Jogadores
        </Button>
      </div>
    </Container>
  );
};

export default JogadorDetalhes;
