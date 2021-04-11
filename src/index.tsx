import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import vkBridge, { VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge';
import { AdaptivityProvider, ConfigProvider, Platform, Scheme } from '@vkontakte/vkui';
import { App } from './App';
import { querystring } from '@vkontakte/vkjs';

const isVKCOM = querystring.parse(window.location.search || window.location.hash || window.location.href).vk_platform === 'desktop_web';

const AppWrapper = () => {
  const [scheme, setScheme]: [Scheme, any] = useState(Scheme.BRIGHT_LIGHT);
  const connectListener: VKBridgeSubscribeHandler = useCallback((e) => {
    switch (e.detail.type) {
      case 'VKWebAppUpdateConfig':
        setScheme(e.detail.data.scheme);
    }
  }, []);

  useEffect(() => {
    vkBridge.subscribe(connectListener);
    vkBridge.send('VKWebAppInit');
    return () => {
      vkBridge.unsubscribe(connectListener);
    };
  });

  return (
    <ConfigProvider transitionMotionEnabled={true} scheme={scheme} platform={isVKCOM ? Platform.VKCOM : undefined}>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

ReactDOM.render(
  <AppWrapper />,
  document.getElementById('root'),
);
