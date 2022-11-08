import { Route, Router, Routes } from '@solidjs/router';
import { Component, For, onMount } from 'solid-js';
import Conversation from './components/Conversation';
import Home from './components/Home';
import { connectToPeerServer } from './services/ChatService';
import { chat, errors, setChatData } from './state/ChatStore';

let count = 0;

const App: Component = () => {

  onMount(() => {
    console.log("Main onMount")
    connectToPeerServer();
    setChatData('connected', true);
  });

  return (
      <div class="container p-5 mx-auto">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="chat/:id" component={Conversation} />
          <div class="container">
            <For each={errors}>
              {(currentMessage) => (
                <div>{currentMessage}</div>
              )}
            </For>
          </div>
        </Routes>
      </div>
  )
};

export default App;
