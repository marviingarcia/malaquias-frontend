import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [saldo, setSaldo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descricaoEntrada, setDescricaoEntrada] = useState('');
  const [valorEntrada, setValorEntrada] = useState('');
  const [contribuinteId, setContribuinteId] = useState(''); // Contribuinte selecionado
  const [contribuintes, setContribuintes] = useState([]); // Lista de contribuintes
  const [motivoSaidaId, setMotivoSaidaId] = useState(''); // Motivo de saída selecionado
  const [motivosSaida, setMotivosSaida] = useState([]); // Lista de motivos de saída
  const [descricaoMotivo, setDescricaoMotivo] = useState(''); // Descrição do motivo de saída
  const [nomeContribuinte, setNomeContribuinte] = useState(''); // Nome do contribuinte
  const [identificacaoContribuinte, setIdentificacaoContribuinte] = useState(''); // Identificação do contribuinte
  const [valorSaida, setValorSaida] = useState('');
  const [dataInicio, setDataInicio] = useState(''); // Data de início do filtro
  const [dataFim, setDataFim] = useState(''); // Data de fim do filtro
  const [historico, setHistorico] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false); // Controlar exibição do histórico
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const responseSaldo = await fetch('http://localhost:3000/api/caixa', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        const responseContribuintes = await fetch('http://localhost:3000/api/contribuintes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        const responseMotivosSaida = await fetch('http://localhost:3000/api/motivos-saida', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });

        if (!responseSaldo.ok || !responseContribuintes.ok || !responseMotivosSaida.ok) {
          throw new Error('Erro ao buscar dados do servidor');
        }

        const dataSaldo = await responseSaldo.json();
        const dataContribuintes = await responseContribuintes.json();
        const dataMotivosSaida = await responseMotivosSaida.json();

        setSaldo(dataSaldo.saldo_atual);
        setContribuintes(dataContribuintes);
        setMotivosSaida(dataMotivosSaida);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEntrada = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/entradas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ descricao: descricaoEntrada, valor: valorEntrada, id_contribuinte: contribuinteId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar entrada');
      }

      alert('Entrada registrada com sucesso!');
      setDescricaoEntrada('');
      setValorEntrada('');
      setContribuinteId('');
      setSaldo((prevSaldo) => prevSaldo + parseFloat(valorEntrada));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaida = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/saidas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ valor: valorSaida, id_motivo: motivoSaidaId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar saída');
      }

      alert('Saída registrada com sucesso!');
      setMotivoSaidaId('');
      setValorSaida('');
      setSaldo((prevSaldo) => prevSaldo - parseFloat(valorSaida));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFiltrarHistorico = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/historico?data_inicio=${dataInicio}&data_fim=${dataFim}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        throw new Error('Erro ao filtrar histórico');
      }

      const data = await response.json();
      setHistorico(data);
      setMostrarHistorico(true);
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para cadastrar novo contribuinte
  const handleCadastroContribuinte = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/contribuintes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nome: nomeContribuinte, identificacao: identificacaoContribuinte }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar contribuinte');
      }

      alert('Contribuinte cadastrado com sucesso!');
      setNomeContribuinte('');
      setIdentificacaoContribuinte('');
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para cadastrar novo motivo de saída
  const handleCadastroMotivoSaida = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/motivos-saida', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ descricao: descricaoMotivo }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar motivo de saída');
      }

      alert('Motivo de saída cadastrado com sucesso!');
      setDescricaoMotivo('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="dashboard">
      <h1>Bem-vindo ao Dashboard</h1>
      <p>Esta é uma área protegida.</p>

      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          <p>Saldo atual do caixa: R$ {saldo}</p>

          <h3>Histórico de Transações</h3>
          <form onSubmit={handleFiltrarHistorico} className="form-filtro">
            <label>Data de Início:</label>
            <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
            <label>Data de Fim:</label>
            <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
            <button type="submit">Filtrar Histórico</button>
          </form>

          {mostrarHistorico && historico.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>{new Date(transacao.data_hora).toLocaleString()}</td>
                    <td>{transacao.descricao}</td>
                    <td>{transacao.tipo}</td>
                    <td>{transacao.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div>
            <h3>Registrar Entrada</h3>
            <form onSubmit={handleEntrada} className="form-entrada">
              <label>Contribuinte:</label>
              <select value={contribuinteId} onChange={(e) => setContribuinteId(e.target.value)} required>
                <option value="">Selecione um contribuinte</option>
                {contribuintes.map((contribuinte) => (
                  <option key={contribuinte.id} value={contribuinte.id}>
                    {contribuinte.nome}
                  </option>
                ))}
              </select>
              <label>Descrição da Entrada:</label>
              <input type="text" value={descricaoEntrada} onChange={(e) => setDescricaoEntrada(e.target.value)} required />
              <label>Valor da Entrada:</label>
              <input type="number" value={valorEntrada} onChange={(e) => setValorEntrada(e.target.value)} required />
              <button type="submit">Registrar Entrada</button>
            </form>
          </div>

          <div>
            <h3>Registrar Saída</h3>
            <form onSubmit={handleSaida} className="form-saida">
              <label>Motivo da Saída:</label>
              <select value={motivoSaidaId} onChange={(e) => setMotivoSaidaId(e.target.value)} required>
                <option value="">Selecione um motivo</option>
                {motivosSaida.map((motivo) => (
                  <option key={motivo.id} value={motivo.id}>
                    {motivo.descricao}
                  </option>
                ))}
              </select>
              <label>Valor da Saída:</label>
              <input type="number" value={valorSaida} onChange={(e) => setValorSaida(e.target.value)} required />
              <button type="submit">Registrar Saída</button>
            </form>
          </div>

          <div>
            <h3>Cadastrar Contribuinte</h3>
            <form onSubmit={handleCadastroContribuinte} className="form-contribuinte">
              <label>Nome do Contribuinte:</label>
              <input type="text" value={nomeContribuinte} onChange={(e) => setNomeContribuinte(e.target.value)} required />
              <label>Identificação:</label>
              <input type="text" value={identificacaoContribuinte} onChange={(e) => setIdentificacaoContribuinte(e.target.value)} required />
              <button type="submit">Cadastrar Contribuinte</button>
            </form>
          </div>

          <div>
            <h3>Cadastrar Motivo de Saída</h3>
            <form onSubmit={handleCadastroMotivoSaida} className="form-motivo">
              <label>Descrição do Motivo:</label>
              <input type="text" value={descricaoMotivo} onChange={(e) => setDescricaoMotivo(e.target.value)} required />
              <button type="submit">Cadastrar Motivo</button>
            </form>
          </div>
        </div>
      )}

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
