import { ISettingsForm } from '../lib/types';

const tabs: Array<ISettingsForm> = [
  {
    name: 'Hinnan mukaan',
    helpText: 'Kytkee releen päälle hinnan alittaessa asetetun arvon',
    controls: [
      {
        name: 'price',
        inputProps: {
          type: 'number',
          placeholder: '0.00',
          label: 'c/kWh',
          labelPosition: 'right',
        },
      },
    ],
  },
  {
    name: 'Halvimmat',
    helpText: 'Kytkee releen päälle vain asetettuna määränä halvimpia tunteja',
    controls: [],
  },
  {
    name: 'Lämpötila',
    helpText:
      'Kytkee releen päälle ulkolämpötilan ylittäessä tai alittaessa asetetun arvon',
    controls: [
      {
        name: 'city',
        label: 'Kaupunki',
        inputProps: {
          type: 'text',
          placeholder: 'Helsinki',
        },
      },
      {
        name: 'temperature',
        label: 'Lämpötila',
        inputProps: {
          type: 'text',
          label: '°C',
          labelPosition: 'right',
          placeholder: '15.00',
        },
      },
      {
        name: 'lesserThanGreater',
        label: '',
        radioButtonProps: [
          {
            label: 'Alittaessa',
            value: 'lesser',
          },
          {
            label: 'Ylittäessä',
            value: 'greater',
          },
        ],
      },
    ],
  },
];

export default tabs;
