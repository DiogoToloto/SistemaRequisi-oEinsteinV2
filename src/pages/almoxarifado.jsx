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
  z-index: 1;

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
  min-width: 300px;
  padding-bottom: 20px;
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

const CardScrollContainer = styled.div`
  display: flex;
  flex-wrap: nowrap; /* Impede quebra de linha */
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 10px;

  /* Estilizando a barra de rolagem (opcional) */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
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
      const response = await axios.get(
        "https://backendsistemaeinsteinv2.onrender.com/requests"
      );
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
      await axios.patch(
        `https://backendsistemaeinsteinv2.onrender.com/requests/${id}`,
        {
          status: "finalizado",
        }
      );
      fetchRequests(); // Atualiza a lista de requisições após finalizar
    } catch (error) {
      console.error("Erro ao finalizar requisição:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://backendsistemaeinsteinv2.onrender.com/requests/${deleteRequestId}`
      );
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

  // Requisições separadas manualmente por agrupamentos fixos
  const centroCirurgico5 = requests.filter((req) =>
    ["arsenal 5", "preparo 5", "expurgo 5"].includes(req.setor.toLowerCase())
  );

  const centroCirurgicoI4 = requests.filter((req) =>
    ["arsenal i4", "preparo i4", "expurgo i4"].includes(req.setor.toLowerCase())
  );

  return (
    <div
      className="container"
      style={{ position: "relative", marginTop: "100px" }}
    >
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
      {/* Centro Cirúrgico 5 */}
      <div className="my-4">
        <h3 className="mb-3">Setor: Centro Cirúrgico 5</h3>
        <CardScrollContainer>
          {centroCirurgico5.map((request) => (
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
                <span
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  {request.setor}
                </span>
              </div>
              <CardBody className="card-body">
                <p>
                  <strong>Plantão:</strong> {request.plantao}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <div>
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
        </CardScrollContainer>
      </div>

      <hr className="my-5 border-top border-dark" />

      {/* Centro Cirúrgico I4 */}
      <div className="my-4">
        <h3 className="mb-3">Setor: Centro Cirúrgico I4</h3>
        <CardScrollContainer>
          {centroCirurgicoI4.map((request) => (
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
                <span
                  style={{ position: "absolute", top: "10px", right: "10px" }}
                >
                  {request.setor}
                </span>
              </div>
              <CardBody className="card-body">
                <p>
                  <strong>Plantão:</strong> {request.plantao}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
                <div>
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
        </CardScrollContainer>
      </div>

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
