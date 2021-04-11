import {
  FormItem,
  Group,
  Panel,
  PanelHeader,
  Slider,
  CellButton,
  Subhead,
  Input,
} from '@vkontakte/vkui';
import { ChipsSelect } from '@vkontakte/vkui/unstable';
import '@vkontakte/vkui/dist/unstable.css';
import React, { FC, useCallback, useEffect, useState } from 'react';
import './Wizard.css';
import vkBridge from '@vkontakte/vk-bridge';

export interface WizardSettings {
  kitchens?: Array<{ value: string; label: string }>;
  blackListProducts?: Array<{ value: string; label: string }>;
  maxPrice?: number;
  address?: string;
  name?: string;
}

const kitchensDictionary = ['Грузинская', 'Итальянская', 'Японская', 'Вегетарианская', 'Китайская'];

const blackListProductsDictionary = ['Молоко', 'Рыба', 'Яйца', 'Орехи', 'Грибы', 'Мёд', 'Курица', 'Морковь', 'Цитрусовые', 'Клубника', 'Ананас', 'Шоколад', 'Кофе'];

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
  const [name, setName] = useState('');

  const onSubmitCallback = useCallback((settings: WizardSettings) => {
    onSubmit(settings);
  }, []);

  useEffect(() => {
    if (name.length === 0) {
      vkBridge.send('VKWebAppGetUserInfo').then((result) => {
        setName(`${result.first_name} ${result.last_name}`);
      });
    }
  }, [name]);

  return (
    <Panel id={id}>
      <PanelHeader>Что бы поесть?</PanelHeader>
      <Group>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmitCallback({
            kitchens,
            blackListProducts,
            maxPrice,
            address,
            name,
          });
        }}>
          <FormItem top="Имя">
            <Input placeholder="Давайте знакомиться" value={name} onChange={(e) => setName(e.target.value)} />
          </FormItem>
          <FormItem top="Адрес доставки">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, номер дома и квартиры"
            />
          </FormItem>
          <FormItem top="Предпочитаемые кухни">
            <ChipsSelect
              value={kitchens}
              placeholder="Можно все"
              options={kitchensDictionary.map((item) => ({ value: item, label: item }))}
              onChange={(options) => {
                setKitchens(options);
              }}
            />
          </FormItem>
          <FormItem top="Продукты, которые я не ем">
            <ChipsSelect
              value={blackListProducts}
              placeholder="Аллергии там всякие"
              options={blackListProductsDictionary.map((item) => ({ value: item, label: item }))}
              onChange={(options) => {
                setBlackListProducts(options);
              }}
            />
          </FormItem>
          <FormItem top="Максимальная цена" className="maxPrice">
            <Subhead weight="regular" className="maxPriceLabel">{maxPrice.toLocaleString('ru')}&nbsp;₽</Subhead>
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

