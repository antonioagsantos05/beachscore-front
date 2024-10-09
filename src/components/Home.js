// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FaUsers, FaGamepad, FaTrophy, FaSignOutAlt } from 'react-icons/fa';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token do localStorage
    onLogout(); // Chama a função onLogout para atualizar o estado de autenticação
    navigate('/'); // Redireciona para a tela de login
  };

  const handleCreateMatch = () => {
    navigate('/criar-partida'); // Redireciona para CriarPartida
  };

  const handleViewMatches = () => {
    navigate('/partidas-finalizadas'); // Redireciona para Partidas Finalizadas
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Row className="text-center">
        <Col md={12}>
          <h2 className="text-success mb-4">Bem-vindo à Home!</h2>
          <p className="mb-5">Você está autenticado.</p>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><FaUsers /> Ver Jogadores</Card.Title>
              <Button onClick={() => navigate('/jogadores')} variant="primary" className="w-100">Ir para Jogadores</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><FaGamepad /> Criar Partida</Card.Title>
              <Button onClick={handleCreateMatch} variant="success" className="w-100">Criar Partida</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title><FaTrophy /> Ver Partidas</Card.Title>
              <Button onClick={handleViewMatches} variant="info" className="w-100">Ver Partidas</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Button onClick={handleLogout} variant="danger" className="w-100 mt-4">
            <FaSignOutAlt /> Sair
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
