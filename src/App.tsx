import React, { useState } from 'react';
import {
  useAdaptivity,
  AppRoot,
  SplitLayout,
  SplitCol,
  ViewWidth,
  View,
  PanelHeader,
  Panel,
  Root,
  Button, PanelHeaderButton,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Wizard } from './Components/Wizard/Wizard';
import { Icon28SettingsOutline } from '@vkontakte/icons';

export const App = () => {
  const { viewWidth } = useAdaptivity();
  const [panel, setPanel] = useState('wizard');
  const [view, setView] = useState('main');
  const [settings, setSettings] = useState({});

  return (
    <AppRoot>
      <SplitLayout header={<PanelHeader separator={false} />}>
        <SplitCol animate={true} spaced={viewWidth > ViewWidth.MOBILE}>
          <Root activeView={view}>
            <View id="main" activePanel={panel}>
              <Wizard id="wizard" onSubmit={(result) => {
                setSettings(result);
                setPanel('result');
              }} {...settings} />
              <Panel id="result" centered>
                <PanelHeader
                  left={
                    <PanelHeaderButton onClick={() => setView('settings')}>
                      <Icon28SettingsOutline />
                    </PanelHeaderButton>
                  }
                />
                <Button size="l">Хочу есть</Button>
              </Panel>
            </View>
            <View id="settings" activePanel="settings">
              <Wizard id="settings" onSubmit={(result) => {
                setSettings(result);
                setView('main');
                setPanel('result');
              }} {...settings} />
            </View>
          </Root>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
};
