import React from 'react';
import ReactDOM from 'react-dom';
import vkBridge from '@vkontakte/vk-bridge';
import { ConfigProvider, AdaptivityProvider } from '@vkontakte/vkui';
import { App } from './App';

vkBridge.send('VKWebAppInit');

ReactDOM.render(<div>Hello world</div>, document.getElementById('root'));

ReactDOM.render(
  <ConfigProvider transitionMotionEnabled={true}>
    <AdaptivityProvider>
      <App />
    </AdaptivityProvider>
  </ConfigProvider>,
  document.getElementById('root'),
);
