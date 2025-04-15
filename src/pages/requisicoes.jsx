import React, { useState } from 'react';
import RequestForm from '../components/request/RequestForm';

function Requisicoes() {
  const [requests, setRequests] = useState([]);

  const handleNovaRequisicao = (novaReq) => {
    setRequests([...requests, novaReq]);
  };

  return (
    <div style={{marginTop: "100px"}}>
    
      <RequestForm onRequestCreated={handleNovaRequisicao} />
    </div>
  );
}

export default Requisicoes;
