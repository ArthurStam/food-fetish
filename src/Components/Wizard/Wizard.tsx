import {
  FormItem,
  Group,
  Header,
  Panel,
  PanelHeader,
  Slider,
  CellButton,
  Subhead,
  Input,
} from '@vkontakte/vkui';
import { ChipsSelect } from '@vkontakte/vkui/unstable';
import '@vkontakte/vkui/dist/unstable.css';
import React, { FC, useCallback, useState } from 'react';
import './Wizard.css';

export interface WizardSettings {
  kitchens?: Array<{ value: string; label: string }>;
  blackListProducts?: Array<{ value: number; label: string }>;
  maxPrice?: number;
  address?: string;
}

const kitchensDictionary = [{
  value: 'asian',
  label: 'Азиатская',
}, {
  value: 'georgian',
  label: 'Грузинская',
}, {
  value: 'russian',
  label: 'Русская',
}];

const blackListProductsDictionary = [{
  value: 0,
  label: 'Сельдерей',
}, {
  value: 1,
  label: 'Помидоры',
}, {
  value: 2,
  label: 'Яйца',
}];

interface WizardProps extends WizardSettings {
  id: string;
  onSubmit: (result: WizardSettings) => void;
}

export const Wizard: FC<WizardProps> = ({
  id,
  onSubmit,
  kitchens: defaultKitchens = [],
  blackListProducts: defaultBlackListProducts = [],
  maxPrice: defaultMaxPrice = 500,
  address: defaultAddress = '',
}) => {
  const [kitchens, setKitchens] = useState(defaultKitchens);
  const [address, setAddress] = useState(defaultAddress);
  const [blackListProducts, setBlackListProducts] = useState(defaultBlackListProducts);
  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice);

  const onSubmitCallback = useCallback((settings: WizardSettings) => {
    onSubmit(settings);
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader>Что бы поесть?</PanelHeader>
      <Group header={<Header>Давайте знакомиться</Header>}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmitCallback({
            kitchens,
            blackListProducts,
            maxPrice,
            address,
          });
        }}>
          <FormItem top="Адрес доставки">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Улица Пушкина, дом Колотушкина"
            />
          </FormItem>
          <FormItem top="Предпочитаемые кухни">
            <ChipsSelect
              value={kitchens}
              placeholder="Можно все"
              options={kitchensDictionary}
              onChange={(options) => {
                setKitchens(options);
              }}
            />
          </FormItem>
          <FormItem top="Продукты, которые я не ем">
            <ChipsSelect
              value={blackListProducts}
              placeholder="Аллергии там всякие"
              options={blackListProductsDictionary}
              onChange={(options) => {
                setBlackListProducts(options);
              }}
            />
          </FormItem>
          <FormItem top="Максимальная цена" className="maxPrice">
            <Subhead weight="regular" className="maxPriceLabel">{maxPrice}</Subhead>
            <Slider value={maxPrice} step={1} min={0} max={5000} onChange={(value) => {
              setMaxPrice(value);
            }} />
          </FormItem>
          <FormItem>
            <CellButton>Готово</CellButton>
          </FormItem>
        </form>
      </Group>
    </Panel>
  );
};

