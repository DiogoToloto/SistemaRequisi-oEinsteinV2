import React, { useState } from 'react';
import RequestForm from '../components/request/RequestForm';

function Requisicoes() {
  const [requests, setRequests] = useState([]);

  const handleNovaRequisicao = (novaReq) => {
    setRequests([...requests, novaReq]);
  };

  return (
    <>
      <RequestForm onRequestCreated={handleNovaRequisicao} />
    </>
  );
}

export default Requisicoes;
