// src/components/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Adiciona navegação após cadastro bem-sucedido

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://beachscore-backend.azurewebsites.net/api/register', { nome, senha });
      setMessage(response.data.message);
      navigate('/'); // Redireciona para a tela de login após sucesso
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
        <h2 className="text-center text-success mb-4">Cadastro</h2>
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
              autoComplete="new-password"
            />
          </Form.Group>
          <Button type="submit" variant="success" className="w-100">Cadastrar</Button>
        </Form>
        {message && <p className="text-danger text-center mt-3">{message}</p>}
        <p className="text-center mt-3">
          Já tem uma conta? <Link to="/" className="link-success">Faça login aqui</Link>
        </p>
      </Card>
    </Container>
  );
};

export default Register;
