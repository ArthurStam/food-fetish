import React, { useState } from 'react';
import {
  AppRoot,
  Button,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Placeholder,
  Platform,
  Root,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  usePlatform,
  View,
  ViewWidth,
  withAdaptivity,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Wizard, WizardSettings } from './Components/Wizard/Wizard';
import { Icon28SettingsOutline, Icon56CheckCircleOutline } from '@vkontakte/icons';

const Airtable = require('airtable');
const base = new Airtable({ apiKey: 'keyVWFbLtlqU1tMht' }).base('appyqSjavyDbO4pmV');

export const App = withAdaptivity(() => {
  const { viewWidth } = useAdaptivity();
  const [panel, setPanel] = useState('wizard');
  const [view, setView] = useState('main');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [settings, setSettings]: [WizardSettings, any] = useState({});
  const platform = usePlatform();

  return (
    <AppRoot>
      <SplitLayout header={platform !== Platform.VKCOM && <PanelHeader separator={false} />}>
        <SplitCol animate={viewWidth <= ViewWidth.MOBILE} spaced={viewWidth > ViewWidth.MOBILE}>
          <Root activeView={view}>
            <View id="main" activePanel={panel}>
              <Wizard id="wizard" onSubmit={(result) => {
                setSettings(result);
                setPanel('result');
              }} {...settings} />
              <Panel id="result" centered>
                <PanelHeader
                  left={
                    !sent && !sending && <PanelHeaderButton onClick={() => setView('settings')}>
                      <Icon28SettingsOutline />
                    </PanelHeaderButton>
                  }
                />
                {!sent && <Button disabled={sending} onClick={() => {
                  setSending(true);
                  const result = {
                    name: settings.name,
                    address: settings.address,
                    kitchens: settings.kitchens.map((item) => item.label).toString(),
                    blackListProducts: settings.blackListProducts.map((item) => item.label).toString(),
                    maxPrice: settings.maxPrice.toString(),
                  };
                  base('Table 1').create([{ fields: result }], () => {
                    setSent(true);
                  });
                }} size="l">Хочу есть</Button>}
                {sent &&
                  <Placeholder header="Спасибо за заявку!" icon={<Icon56CheckCircleOutline fill="var(--accent)" />}>
                    Нам важно знать, что сервис вам интересен.
                    <br />
                    Проект находится в разработке. Будем держать вас в курсе!
                  </Placeholder>
                }
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
}, { viewWidth: true });
