import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Adiciona useNavigate para redirecionar
import { Card, Container, Row, Col, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const JogoDetalhes = () => {
  const { id } = useParams(); // Pegando o ID da partida da URL
  const navigate = useNavigate(); // Hook para redirecionar
  const [partida, setPartida] = useState(null);
  const [movimentos, setMovimentos] = useState([]); // Para armazenar movimentos por jogador
  const [sets, setSets] = useState([]); // Para armazenar os sets

  useEffect(() => {
    const fetchPartidaDetalhes = async () => {
      try {
        const token = localStorage.getItem('token'); // Pegando o token do localStorage
        if (!token) {
          throw new Error('Token não encontrado');
        }
  
        // Busca os dados da partida
        const partidaResponse = await axios.get(`https://beachscore-backend.azurewebsites.net/api/partidas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPartida(partidaResponse.data); // Armazenando dados da partida
  
        // Busca os sets da partida
        const setsResponse = await axios.get(`https://beachscore-backend.azurewebsites.net/api/sets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSets(setsResponse.data); // Armazenando sets
  
        // Busca as estatísticas dos movimentos de todos os jogadores na partida
        const movimentosPromises = partidaResponse.data.jogadores.map((jogador) =>
          axios.get(`https://beachscore-backend.azurewebsites.net/api/estatisticas/${id}/${jogador.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
  
        const movimentosResponses = await Promise.all(movimentosPromises);
        const movimentosData = movimentosResponses.map((res) => res.data);
        setMovimentos(movimentosData); // Armazenando estatísticas de movimentos
      } catch (error) {
        console.error('Erro ao buscar detalhes da partida:', error);
        alert(error.response?.data?.message || 'Erro ao buscar detalhes da partida.');
      }
    };
  
    fetchPartidaDetalhes(); // Chama a função ao carregar o componente ou quando o id muda
  }, [id]); // O useEffect depende apenas do id
  

  if (!partida) {
    return <div>Carregando...</div>;
  }

  // Cálculo do placar geral e das parciais
  let placarDupla1 = 0;
  let placarDupla2 = 0;
  const parciais = sets.map((set) => {
    if (set.pontos_dupla1 > set.pontos_dupla2) {
      placarDupla1 += 1;
    } else if (set.pontos_dupla2 > set.pontos_dupla1) {
      placarDupla2 += 1;
    }
    return `${set.games_dupla1}x${set.games_dupla2}`; // Mostra a parcial
  });

  // Dados das duplas
  const dupla1 = partida.jogadores.filter((j) => j.dupla === 1).map((j) => j.nome).join(' / ');
  const dupla2 = partida.jogadores.filter((j) => j.dupla === 2).map((j) => j.nome).join(' / ');

  // Função para redirecionar para /home
  const handleVoltarHome = () => {
    navigate('/home');
  };

  return (
    <Container className="mt-4">
      <Card className="text-center shadow-sm p-3 mb-5 bg-white rounded">
        <Card.Body>
          <Card.Title className="mb-3">
            <h2>Detalhes da Partida</h2>
          </Card.Title>
          <Row>
            <Col md={6}>
              <h5><strong>Data da Partida:</strong> {new Date(partida.data_partida).toLocaleDateString()}</h5>
              <h5><strong>Dupla 1:</strong> {dupla1}</h5>
            </Col>
            <Col md={6}>
              <h5><strong>Dupla 2:</strong> {dupla2}</h5>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3 mb-4 bg-light rounded">
            <Card.Body>
              <Card.Title className="text-center"><strong>Placar Geral</strong></Card.Title>
              <h3 className="text-center">{placarDupla1} x {placarDupla2}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm p-3 mb-4 bg-light rounded">
            <Card.Body>
              <Card.Title className="text-center"><strong>Parciais dos Sets</strong></Card.Title>
              <ListGroup variant="flush">
                {parciais.map((parcial, index) => (
                  <ListGroupItem key={index}>
                    Set {index + 1}: {parcial}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h4 className="mt-5">Movimentos por Jogador</h4>
      {partida.jogadores.map((jogador, index) => {
        const estatisticasJogador = movimentos[index] || [];
        const movimentosAgrupados = estatisticasJogador.reduce((acc, mov) => {
          const tipoMovimento = mov.tipo_movimento.trim(); // Remove espaços em branco do tipo_movimento
          if (!acc[tipoMovimento]) {
            acc[tipoMovimento] = { acertos: 0, erros: 0 };
          }
          if (mov.resultado.trim() === 'acerto') {
            acc[tipoMovimento].acertos += mov.total;
          } else if (mov.resultado.trim() === 'erro') {
            acc[tipoMovimento].erros += mov.total;
          }
          return acc;
        }, {});

        return (
          <Card className="mb-4 shadow-sm p-3 bg-white rounded" key={jogador.id}>
            <Card.Body>
              <Card.Title><strong>{jogador.nome}</strong></Card.Title>
              <ListGroup variant="flush">
                {Object.keys(movimentosAgrupados).map((movimento) => (
                  <ListGroupItem key={movimento}>
                    {movimento}: {movimentosAgrupados[movimento].acertos} acertos, {movimentosAgrupados[movimento].erros} erros
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        );
      })}

      {/* Botão para voltar à Home */}
      <div className="text-center mt-4">
        <Button variant="primary" size="lg" onClick={handleVoltarHome}>
          Voltar para Home
        </Button>
      </div>
    </Container>
  );
};

export default JogoDetalhes;
