import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; 
import '../assets/quadra.css'

const Jogo = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [partida, setPartida] = useState(null); 
  // const [pontuacao, setPontuacao] = useState({
  //   dupla1: { pontos: 0, games: 0, sets: 0, vantagem: false, tiebreak: false, tiebreakPontos: 0 },
  //   dupla2: { pontos: 0, games: 0, sets: 0, vantagem: false, tiebreak: false, tiebreakPontos: 0 },
  // });

  const [showModal, setShowModal] = useState(false);
  const [tipoMovimento, setTipoMovimento] = useState(''); 
  const [resultado, setResultado] = useState(''); 
  const [jogadorSelecionado, setJogadorSelecionado] = useState(null); 
  const [botaoQuadra, setBotaoQuadra] = useState(''); // Salva o nome do botão da quadra clicado
  const [jogadoresAtivos, setJogadoresAtivos] = useState(false); // Estado para ativar/desativar botões de jogadores

  // Função para buscar a partida
  const fetchPartida = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const response = await axios.get(`https://beachscore-backend.azurewebsites.net/api/partidas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPartida(response.data); 
    } catch (error) {
      console.error('Erro ao buscar a partida:', error);
      alert(error.response?.data?.message || 'Erro ao buscar a partida.');
    }
  };

  useEffect(() => {
    fetchPartida(); 
  }, [id]);

  const handleClickQuadra = (area) => {
    setBotaoQuadra(area); // Salva o nome do botão da quadra
    setJogadoresAtivos(true); // Ativa os botões dos jogadores
  };

  const handleShowModal = (jogador) => {
    if (!jogador || !jogador.id) {
      console.error('ID do jogador não encontrado:', jogador);
      return;
    }
    setJogadorSelecionado(jogador); 
    setShowModal(true);
  };

  const registrarMovimento = async () => {
    if (!tipoMovimento || !resultado) {
      alert('Por favor, selecione o tipo de movimento e o resultado antes de registrar.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      await axios.post(`https://beachscore-backend.azurewebsites.net/api/movimentos`, {
        partidaId: id,
        jogadorId: jogadorSelecionado.id, 
        tipoMovimento,
        resultado,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(`Movimento registrado para ${jogadorSelecionado.nome}: ${tipoMovimento} - ${botaoQuadra}`); // Alerta com nome do botão da quadra
    } catch (error) {
      console.error('Erro ao registrar movimento:', error);
      alert('Erro ao registrar movimento: ' + (error.response?.data?.message || error.message));
    }

    setShowModal(false);
    setJogadoresAtivos(false); // Desativa os botões de jogadores novamente
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTipoMovimento('');
    setResultado('');
  };

  if (!partida) {
    return <div>Carregando...</div>;
  }

  const encerrarPartida = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
  
      // Faz a chamada PUT para finalizar a partida
      await axios.put(`https://beachscore-backend.azurewebsites.net/api/partidas/${id}/finalizar`, {
        resultado_partida: '2x1' // ou outro valor de resultado
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Redirecionar para a tela de detalhes da partida
      navigate(`/jogoDetalhes/${id}`); 
    } catch (error) {
      console.error('Erro ao encerrar partida:', error);
      alert(error.response?.data?.message || 'Erro ao encerrar a partida.');
    }
  };
  

  // const dupla1Jogadores = partida.jogadores.filter(j => j.dupla === 1).map(j => j.nome).join(' / ');
  // const dupla2Jogadores = partida.jogadores.filter(j => j.dupla === 2).map(j => j.nome).join(' / ');

  return (
    <div className="container text-center">

      <div className="quadra mb-4">
        {/* Botões da quadra */}
        <button className="Fora-Fundo" onClick={() => handleClickQuadra('Fora-Fundo')}>Fora-Fundo</button>
        <button className="Fora-Cima" onClick={() => handleClickQuadra('Fora-Cima')}>Fora-Cima</button>
        <button className="Fora-Baixo" onClick={() => handleClickQuadra('Fora-Baixo')}>Fora-Baixo</button>
        <button className="Rede" onClick={() => handleClickQuadra('Rede')}>Rede</button>
        <button className="Vermelho1" onClick={() => handleClickQuadra('Vermelha 1')}>Vermelha 1</button>
        <button className="Vermelho2" onClick={() => handleClickQuadra('Vermelha 2')}>Vermelha 2</button>
        <button className="Vermelho3" onClick={() => handleClickQuadra('Vermelha 3')}>Vermelha 3</button>
        <button className="Vermelho4" onClick={() => handleClickQuadra('Vermelha 4')}>Vermelha 4</button>
        <button className="Vermelho5" onClick={() => handleClickQuadra('Vermelha 5')}>Vermelha 5</button>
        <button className="Amarelo1" onClick={() => handleClickQuadra('Amarela 1')}>Amarela 1</button>
        <button className="Amarelo2" onClick={() => handleClickQuadra('Amarela 2')}>Amarela 2</button>
        <button className="Amarelo3" onClick={() => handleClickQuadra('Amarela 3')}>Amarela 3</button>
        <button className="Amarelo4" onClick={() => handleClickQuadra('Amarela 4')}>Amarela 4</button>
        <button className="Amarelo5" onClick={() => handleClickQuadra('Amarela 5')}>Amarela 5</button>
        <button className="Verde1" onClick={() => handleClickQuadra('Verde 1')}>Verde 1</button>
        <button className="Verde2" onClick={() => handleClickQuadra('Verde 2')}>Verde 2</button>
        <button className="Verde3" onClick={() => handleClickQuadra('Verde 3')}>Verde 3</button>
        <button className="Verde4" onClick={() => handleClickQuadra('Verde 4')}>Verde 4</button>
        <button className="Verde5" onClick={() => handleClickQuadra('Verde 5')}>Verde 5</button>
      </div>

      {/* Botões dos jogadores */}
      <div className="row my-4">
        {partida.jogadores.map((jogador, index) => (
          <div className="col-6 mb-3" key={jogador.id}>
            <button
              className="btn btn-warning btn-block"
              onClick={() => handleShowModal(jogador)}
              disabled={!jogadoresAtivos} // Botão desativado até clicar na quadra
            >
              {jogador.nome}
            </button>
          </div>
        ))}
      </div>


      {/* Modal para registrar tipo de movimento e resultado */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Movimentos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Tipo de Movimento:</label>
            <select
              className="form-select"
              value={tipoMovimento}
              onChange={(e) => setTipoMovimento(e.target.value)}
            >
              <option value="" disabled>Selecione o movimento</option>
              <option value="smash">Smash</option>
              <option value="drop-shot">Drop-shot</option>
              <option value="slice">Slice</option>
              <option value="lob">Lob</option>
              <option value="voleio">Voleio</option>
              <option value="passing shot">Passing shot</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Resultado:</label>
            <select
              className="form-select"
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
            >
              <option value="" disabled>Selecione o resultado</option>
              <option value="acerto">Acerto</option>
              <option value="erro">Erro</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          <Button variant="primary" onClick={registrarMovimento}>
            Registrar Movimentos
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Botão para encerrar a partida */}
      <div className="row">
        <div className="col-12">
          <Button variant="danger" size="lg" onClick={encerrarPartida}>
            Encerrar Partida
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Jogo;