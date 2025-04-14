import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa"; // Ícones para os botões
import { FaList, FaClock, FaCheckCircle } from "react-icons/fa"; // Ícones de status
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap"; // Importando Modal e Button do react-bootstrap

// Estilizando o card para contadores
const CounterContainer = styled.div`
  position: absolute;
  top: 25px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 10;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const CounterCard = styled.div`
  width: 10rem;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px;
`;

const CounterCardBody = styled.div`
  padding: 10px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  padding-bottom: 20px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10px);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardText = styled.p`
  font-size: 16px;
  color: #555;
  word-wrap: break-word;
  white-space: normal;
  overflow: auto;
  max-height: 100px; /* Limita a altura do texto */
  text-overflow: ellipsis; /* Trunca o texto se for muito longo */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
`;

const ButtonDelete = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;
const ButtonFinalizar = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

const AlmoxarifadoPage = () => {
  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendentes, setPendentes] = useState(0);
  const [finalizados, setFinalizados] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  // Função para buscar as requisições
  const fetchRequests = async () => {
    try {
      const response = await axios.get('https://backendsistemaeinsteinv2.onrender.com/requests');
      setRequests(response.data);

      // Contagem de requisições pendentes e finalizadas
      const totalReq = response.data.length;
      const pendentesReq = response.data.filter(
        (r) => r.status === "pendente"
      ).length;
      const finalizadosReq = response.data.filter(
        (r) => r.status === "finalizado"
      ).length;

      setTotal(totalReq);
      setPendentes(pendentesReq);
      setFinalizados(finalizadosReq);
    } catch (error) {
      console.error("Erro ao buscar requisições:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFinalize = async (id) => {
    try {
      await axios.patch(`https://backendsistemaeinsteinv2.onrender.com/requests/${id}`, {
        status: "finalizado",
      });
      fetchRequests(); // Atualiza a lista de requisições após finalizar
    } catch (error) {
      console.error("Erro ao finalizar requisição:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://backendsistemaeinsteinv2.onrender.com/requests/${deleteRequestId}`);
      fetchRequests(); // Atualiza a lista de requisições após deletar
      setShowModal(false); // Fecha o modal após excluir
    } catch (error) {
      console.error("Erro ao excluir requisição:", error);
    }
  };

  const showDeleteModal = (id) => {
    setDeleteRequestId(id);
    setShowModal(true);
  };

  // Agrupar requisições por setor
  const groupedBySetor = requests.reduce((groups, request) => {
    const setor = request.setor;
    if (!groups[setor]) {
      groups[setor] = [];
    }
    groups[setor].push(request);
    return groups;
  }, {});

  return (
    <div className="container mt-4" style={{ position: "relative" }}>
      <h1>Página Almoxarifado</h1>

      {/* Contadores - Canto Superior Direito */}
      <CounterContainer>
        <CounterCard className="card border-primary shadow-sm">
          <CounterCardBody>
            <h6 className="card-title text-primary d-flex align-items-center justify-content-center gap-1">
              <FaList size={16} /> Total
            </h6>
            <p className="fs-5 fw-bold mb-0">{total}</p>
          </CounterCardBody>
        </CounterCard>

        <CounterCard className="card border-warning shadow-sm">
          <CounterCardBody>
            <h6 className="card-title text-warning d-flex align-items-center justify-content-center gap-1">
              <FaClock size={16} /> Pendentes
            </h6>
            <p className="fs-5 fw-bold mb-0">{pendentes}</p>
          </CounterCardBody>
        </CounterCard>

        <CounterCard className="card border-success shadow-sm">
          <CounterCardBody>
            <h6 className="card-title text-success d-flex align-items-center justify-content-center gap-1">
              <FaCheckCircle size={16} /> Finalizadas
            </h6>
            <p className="fs-5 fw-bold mb-0">{finalizados}</p>
          </CounterCardBody>
        </CounterCard>
      </CounterContainer>
      <hr className="my-5 border-top border-dark" />

      {/* Requisições por Setor */}
      {Object.keys(groupedBySetor).map((setor, index) => (
        <div key={setor} className="my-4">
          {index > 0 && <hr className="my-5 border-top border-dark" />}{" "}
          {/* divisória entre setores */}
          <h3 className="mb-3">Setor: {setor}</h3>
          <div className="d-flex flex-wrap gap-3">
            {groupedBySetor[setor].map((request) => (
              <Card
                key={request.id}
                className="card shadow-sm"
                style={{ width: "18rem" }}
              >
                <div className="card-header">
                  <h5>{request.nome}</h5>
                  <p>{request.drt}</p>
                  <p className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                    Criado em:{" "}
                    {new Date(request.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                <CardBody className="card-body">
                  <p>
                    <strong>Status:</strong> {request.status}
                  </p>
                  <div className="">
                    <p>
                      <strong>Materiais:</strong>
                    </p>
                    <CardText>{request.materiais}</CardText>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    {request.status === "pendente" && (
                      <ButtonFinalizar
                        onClick={() => handleFinalize(request.id)}
                        className="btn btn-success"
                      >
                        <FaCheckCircle /> Finalizar
                      </ButtonFinalizar>
                    )}
                    <ButtonDelete
                      onClick={() => showDeleteModal(request.id)}
                      className="btn btn-danger"
                    >
                      <FaTrashAlt /> Deletar
                    </ButtonDelete>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Modal para confirmar a exclusão */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja excluir esta requisição?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AlmoxarifadoPage;
