import {RuleSetFragment} from './graphql';
import {useTranslation} from 'react-i18next';
import {BulmaCard} from './BulmaCard';

export function RuleSetCard({ruleSet}: { ruleSet: RuleSetFragment }): JSX.Element {

  const {t} = useTranslation('common');
  const {
    name,
    basePrice, soloPrice,
    laufendePrice, countLaufende, minLaufendeIncl, maxLaufendeIncl,
    hochzeitAllowed, ramschAllowed, bettelAllowed, geierAllowed, farbWenzAllowed, farbGeierAllowed,
  } = ruleSet;

  return (
    <BulmaCard title={name} isReducible={true} isReducedInitially={true}>
      <table className="table is-fullwidth">
        <tbody>
          <tr>
            <td>{t('price_plural')}</td>
            <td>{basePrice} ct / {soloPrice} ct</td>
          </tr>
          <tr>
            <td>{t('countLaufende')}</td>
            <td>{laufendePrice} ct, {countLaufende}, {minLaufendeIncl} - {maxLaufendeIncl}</td>
          </tr>
          <tr>
            <td>{t('hochzeitAllowed')}</td>
            <td>{hochzeitAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
          <tr>
            <td>{t('ramschAllowed')}</td>
            <td>{ramschAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
          <tr>
            <td>{t('bettelAllowed')}</td>
            <td>{bettelAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
          <tr>
            <td>{t('geierAllowed')}</td>
            <td>{geierAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
          <tr>
            <td>{t('farbWenzAllowed')}</td>
            <td>{farbWenzAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
          <tr>
            <td>{t('farbGeierAllowed')}</td>
            <td>{farbGeierAllowed ? <span>&#10004;</span> : <span>&#10008;</span>}</td>
          </tr>
        </tbody>
      </table>
    </BulmaCard>
  );
}
