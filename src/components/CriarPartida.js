// src/components/CriarPartida.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CriarPartida = () => {
  const [dataPartida, setDataPartida] = useState('');
  const [jogadores, setJogadores] = useState([]);
  const [dupla1Jogador1, setDupla1Jogador1] = useState('');
  const [dupla1Jogador2, setDupla1Jogador2] = useState('');
  const [dupla2Jogador1, setDupla2Jogador1] = useState('');
  const [dupla2Jogador2, setDupla2Jogador2] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Busca os jogadores do usuário autenticado
  useEffect(() => {
    const fetchJogadores = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://beachscore-backend.azurewebsites.net/api/jogadores', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJogadores(response.data);
    };
    fetchJogadores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuario_id'); // Ou use o contexto onde armazena o ID do usuário
  
    try {
      // Cria a partida
      const partidaResponse = await axios.post('https://beachscore-backend.azurewebsites.net/api/partidas', {
        usuario_id: usuarioId,
        data_partida: dataPartida,
        jogadores: [
          { id: dupla1Jogador1, dupla: 1 },
          { id: dupla1Jogador2, dupla: 1 },
          { id: dupla2Jogador1, dupla: 2 },
          { id: dupla2Jogador2, dupla: 2 },
        ],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMessage('Partida criada com sucesso!'); // Mensagem de sucesso
      setTimeout(() => {
        navigate(`/partida/${partidaResponse.data.partidaId}`); // Redireciona para a tela da partida criada
      }, 2000); // Aguarda 2 segundos antes de redirecionar
    } catch (error) {
      console.error('Erro ao criar a partida:', error);
      setMessage('Erro ao criar a partida. Tente novamente.'); // Mensagem de erro
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Criar Partida</h2>
      <Button variant="secondary" onClick={() => navigate('/home')} className="mb-3">
        Voltar para Home
      </Button>
      {message && <Alert variant={message.includes('sucesso') ? 'success' : 'danger'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Data da Partida</Form.Label>
          <Form.Control
            type="date"
            value={dataPartida}
            onChange={(e) => setDataPartida(e.target.value)}
            required
          />
        </Form.Group>

        {/* Dupla 1 */}
        <h5>Dupla 1</h5>
        <Row className="mb-3">
          <Col>
            <Form.Label>Jogador 1</Form.Label>
            <Form.Select
              value={dupla1Jogador1}
              onChange={(e) => setDupla1Jogador1(e.target.value)}
              required
            >
              <option value="">Escolha jogador</option>
              {jogadores.map(jogador => (
                <option key={jogador.id} value={jogador.id}>{jogador.nome}</option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Jogador 2</Form.Label>
            <Form.Select
              value={dupla1Jogador2}
              onChange={(e) => setDupla1Jogador2(e.target.value)}
              required
            >
              <option value="">Escolha jogador</option>
              {jogadores.map(jogador => (
                <option key={jogador.id} value={jogador.id}>{jogador.nome}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* Dupla 2 */}
        <h5>Dupla 2</h5>
        <Row className="mb-3">
          <Col>
            <Form.Label>Jogador 1</Form.Label>
            <Form.Select
              value={dupla2Jogador1}
              onChange={(e) => setDupla2Jogador1(e.target.value)}
              required
            >
              <option value="">Escolha jogador</option>
              {jogadores.map(jogador => (
                <option key={jogador.id} value={jogador.id}>{jogador.nome}</option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Form.Label>Jogador 2</Form.Label>
            <Form.Select
              value={dupla2Jogador2}
              onChange={(e) => setDupla2Jogador2(e.target.value)}
              required
            >
              <option value="">Escolha jogador</option>
              {jogadores.map(jogador => (
                <option key={jogador.id} value={jogador.id}>{jogador.nome}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Button type="submit" variant="success" className="w-100">Criar Partida</Button>
      </Form>
    </Container>
  );
};

export default CriarPartida;
