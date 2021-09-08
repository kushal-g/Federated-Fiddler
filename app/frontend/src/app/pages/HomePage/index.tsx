/**
 *
 * HomePage
 *
 */
import { Loader } from 'app/components/Loader';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { io, Socket } from 'socket.io-client';
import DESE from '../../assets/images/dese.png';
import IISC from '../../assets/images/iisc.png';

enum AppState {
  Form,
  InProgress,
  Result,
}

interface Props {}

export const HomePage = memo((props: Props) => {
  const [C, setC] = useState<string>('');
  const [batchSize, setBatchSize] = useState<string>('');
  const [numRounds, setNumRounds] = useState<string>('');
  const [epochs, setEpochs] = useState<string>('');
  const [message, setMessage] = useState<string>();
  const [appState, setAppState] = useState<AppState>(AppState.Form);
  const [loss, setLoss] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  const socket = useRef<Socket>(io('http://localhost:8000'));

  const changeToInProgress = () => {
    setAppState(AppState.InProgress);
    setMessage('IN PROGRESS...');
  };

  const changeToResult = ({ loss, accuracy }) => {
    setAppState(AppState.Result);
    setMessage('');
    setLoss(loss);
    setAccuracy(accuracy);
  };

  const changeToForm = () => {
    setAppState(AppState.Form);
    setMessage('');
    setLoss(0);
    setAccuracy(0);
  };

  useEffect(() => {
    socket.current.on('result', data => {
      changeToResult(data);
    });
  }, []);

  const startFed = async () => {
    if (
      isNaN(parseInt(C)) ||
      isNaN(parseInt(batchSize)) ||
      isNaN(parseInt(numRounds)) ||
      isNaN(parseInt(epochs))
    ) {
      return setMessage('All fields should be integers');
    } else {
      setMessage('');
    }

    const response: Response = await fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        C,
        batch_size: batchSize,
        num_rounds: numRounds,
        epochs,
      }),
    });
    if (response.status === 200) {
      changeToInProgress();
    }
  };

  return (
    <Div>
      <Header>
        <img src={DESE} height="30" alt="DESE-logo" />
        <img src={IISC} height="70" alt="IISC logo" />
      </Header>
      <Form>
        {appState === AppState.Form && (
          <>
            <Input
              type="text"
              placeholder="C"
              value={C}
              onChange={e => setC(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Batch Size"
              value={batchSize}
              onChange={e => setBatchSize(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Epochs"
              value={epochs}
              onChange={e => setEpochs(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Number of Rounds"
              value={numRounds}
              onChange={e => setNumRounds(e.target.value)}
            />
            <Submit onClick={startFed}>Start</Submit>
          </>
        )}
        {appState === AppState.InProgress && <Loader />}
        {appState === AppState.Result && (
          <>
            <div>RESULT</div>
            <div>Federated Loss: {loss}</div>
            <div>Federated Accuracy: {accuracy}</div>
            <Submit onClick={changeToForm}>{`< Run Again`}</Submit>
          </>
        )}
        {message}
      </Form>
    </Div>
  );
});

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: absolute;
  top: 0;
  padding: 10px 50px;
`;

const Div = styled.div`
  background-color: #64c9cf;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled.div`
  background-color: #ffb740;
  padding: 50px 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const Input = styled.input`
  background-color: #fde49c;
  border-radius: 8px;
  border: none;
  font-size: 20px;
  padding: 5px 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const Submit = styled.button`
  border-radius: 5px;
  font-size: 20px;
  background-color: #df711b;
  border: none;
  padding: 5px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  color: #fde49c;
  margin-top: 30px;
  cursor: pointer;
  width: 100%;
`;
