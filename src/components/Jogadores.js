// src/components/Jogadores.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Pagination, Form, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Jogadores = () => {
  const [jogadores, setJogadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(10); // Número de jogadores por página
  const navigate = useNavigate();

  useEffect(() => {
    fetchJogadores();
  }, []);

  const fetchJogadores = async () => {
    try {
      const response = await axios.get('https://beachscore-backend.azurewebsites.net/api/jogadores', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setJogadores(response.data);
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
    }
  };

  const handleAddJogador = async () => {
    if (!nome || !idade) {
      alert('Por favor, preencha o nome e a idade do jogador.');
      return;
    }

    try {
      await axios.post('https://beachscore-backend.azurewebsites.net/api/jogadores', { nome, idade }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNome('');
      setIdade('');
      setShowModal(false);
      fetchJogadores(); // Atualiza a lista de jogadores
    } catch (error) {
      console.error('Erro ao cadastrar jogador:', error);
    }
  };

  const handlePlayerClick = (id) => {
    navigate(`/jogadores/${id}`);
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  // Lógica de paginação
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = jogadores.slice(indexOfFirstPlayer, indexOfLastPlayer);
  const totalPages = Math.ceil(jogadores.length / playersPerPage);

  return (
    <Container className="mt-4" style={{ backgroundColor: '#f0f8ff', borderRadius: '10px', padding: '20px' }}>
      <h1 className="mb-4 text-center text-success">Jogadores</h1>

      {/* Botão Voltar para Home */}
      <div className="mb-3 text-center">
        <Button variant="primary" onClick={handleGoHome} style={{ borderWidth: '2px', marginRight: '10px' }}>
          Voltar para Home
        </Button>
      </div>

      {/* Lista de jogadores */}
      <Card className="shadow-sm">
        <Card.Body>
          <ListGroup>
            {currentPlayers.map((jogador) => (
              <ListGroup.Item
                key={jogador.id}
                action
                onClick={() => handlePlayerClick(jogador.id)}
                className="d-flex justify-content-between align-items-center"
              >
                {jogador.nome}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={currentPage === index + 1}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* Modal para Adicionar Jogador */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Jogador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do jogador"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIdade">
              <Form.Label>Idade</Form.Label>
              <Form.Control
                type="number"
                placeholder="Idade do jogador"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleAddJogador}>
            Adicionar Jogador
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Botão flutuante para adicionar jogador */}
      <Button
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
        }}
        onClick={() => setShowModal(true)}
      >
        <FaPlus />
      </Button>
    </Container>
  );
};

export default Jogadores;
