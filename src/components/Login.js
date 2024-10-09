// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLogin }) => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://beachscore-backend.azurewebsites.net/api/login', { nome, senha });
      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token); // Armazena o token no localStorage
      onLogin(); // Chama a função onLogin após sucesso
      navigate('/home'); // Redireciona para a Home
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Erro desconhecido');
    }
  };

  return (
    <Container 
      className="d-flex align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#f0f8ff' }} // Cor de fundo leve
    >
      <Card className="p-4 shadow-sm" style={{ width: '400px' }}>
        <h2 className="text-center text-primary mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome:</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoComplete="username"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Senha:</Form.Label>
            <Form.Control
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">Entrar</Button>
        </Form>
        {message && <p className="text-danger text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          Não tem uma conta? <Link to="/register" className="link-primary">Cadastre-se aqui</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Login;
