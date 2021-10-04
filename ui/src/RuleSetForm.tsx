import {ErrorMessage, Field, Form, Formik} from 'formik';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {CountLaufende, RuleSetInput, useNewRuleSetMutation} from './graphql';
import classNames from 'classnames';
import * as yup from 'yup';

const initialValues: RuleSetInput = {
  name: 'default',
  basePrice: 5,
  soloPrice: 15,
  countLaufende: CountLaufende.Always,
  laufendePrice: 5,
  minLaufendeIncl: 3,
  maxLaufendeIncl: 8,
  hochzeitAllowed: false,
  bettelAllowed: false,
  ramschAllowed: false,
  geierAllowed: false,
  farbWenzAllowed: false,
  farbGeierAllowed: false
};

const countLaufendeAllValues = [CountLaufende.Always, CountLaufende.OnlyLosers, CountLaufende.Never];

const ruleSetInputSchema: yup.SchemaOf<RuleSetInput> = yup.object()
  .shape({
    name: yup.string().min(2).required(),
    basePrice: yup.number().positive().required(),
    soloPrice: yup.number().positive().required(),
    countLaufende: yup.mixed().oneOf(countLaufendeAllValues).required(),
    laufendePrice: yup.number().positive().required(),
    minLaufendeIncl: yup.number().positive().required(),
    maxLaufendeIncl: yup.number().positive().required(),
    hochzeitAllowed: yup.boolean().required(),
    bettelAllowed: yup.boolean().required(),
    ramschAllowed: yup.boolean().required(),
    geierAllowed: yup.boolean().required(),
    farbWenzAllowed: yup.boolean().required(),
    farbGeierAllowed: yup.boolean().required()
  })
  .required();

interface IProps {
  groupId: number;
  onCreation: () => void;
  onCancel: () => void;
}

export function RuleSetForm({groupId, onCreation, onCancel}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [createRuleSet, {data, loading, error}] = useNewRuleSetMutation();

  function onSubmit(ruleSetInput: RuleSetInput): void {
    createRuleSet({variables: {groupId, ruleSetInput}})
      .then(onCreation)
      .catch((error) => console.error(error));
  }

  return (
    <div className="box">
      <h3 className="subtitle is-4 has-text-centered">{t('createNewRuleSet')}</h3>

      <Formik initialValues={initialValues} validationSchema={ruleSetInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="name" className="label">{t('name')}:</label>
              <div className="control">
                <Field name="name" id="name" placeholder={t('name')} className={classNames('input', {'is-danger': touched.name && errors.name})}/>
              </div>
              <ErrorMessage name="name">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label htmlFor="basePrice" className="label">{t('basePrice')}:</label>
                  <div className="control">
                    <Field type="number" name="basePrice" id="basePrice" placeholder={t('basePrice')}
                           className={classNames('input', {'is-danger': touched.basePrice && errors.basePrice})}/>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label htmlFor="soloPrice" className="label">{t('soloPrice')}:</label>
                  <div className="control">
                    <Field type="number" name="soloPrice" id="soloPrice" placeholder={t('soloPrice')}
                           className={classNames('input', {'is-danger': touched.soloPrice && errors.soloPrice})}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div className="field"><label htmlFor="countLaufende" className="label">{t('countLaufende')}:</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <Field as="select" name="countLaufende" id="countLaufende">
                        {countLaufendeAllValues.map((countLaufende) => <option key={countLaufende}>{countLaufende}</option>)}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label htmlFor="laufendePrice" className="label">{t('laufendePrice')}:</label>
                  <div className="control">
                    <Field type="number" name="laufendePrice" id="laufendePrice" placeholder={t('laufendePrice')}
                           className={classNames('input', {'is-danger': touched.laufendePrice && errors.laufendePrice})}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <div className="field">
                  <label htmlFor="minLaufendeIncl" className="label">{t('minLaufendeIncl')}:</label>
                  <div className="control">
                    <Field type="number" name="minLaufendeIncl" id="minLaufendeIncl" placeholder={t('minLaufendeIncl')}
                           className={classNames('input', {'is-danger': touched.minLaufendeIncl && errors.minLaufendeIncl})}/>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label htmlFor="maxLaufendeIncl" className="label">{t('maxLaufendeIncl')}:</label>
                  <div className="control">
                    <Field type="number" name="maxLaufendeIncl" id="maxLaufendeIncl" placeholder={t('maxLaufendeIncl')}
                           className={classNames('input', {'is-danger': touched.maxLaufendeIncl && errors.maxLaufendeIncl})}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="columns is-multiline">
              <div className="column">
                <div className="field">
                  <label htmlFor="hochzeitAllowed" className="checkbox">
                    <Field type="checkbox" name="hochzeitAllowed" id="hochzeitAllowed"/> {t('hochzeit')}
                  </label>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label htmlFor="bettelAllowed" className="checkbox">
                    <Field type="checkbox" name="bettelAllowed" id="bettelAllowed"/> {t('bettel')}
                  </label>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label htmlFor="ramschAllowed" className="checkbox">
                    <Field type="checkbox" name="ramschAllowed" id="ramschAllowed"/> {t('ramsch')}
                  </label>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label htmlFor="geierAllowed" className="checkbox">
                    <Field type="checkbox" name="geierAllowed" id="geierAllowed"/> {t('geier')}
                  </label>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label htmlFor="farbWenzAllowed" className="checkbox">
                    <Field type="checkbox" name="farbWenzAllowed" id="farbWenzAllowed"/> {t('farbWenz')}
                  </label>
                </div>
              </div>

              <div className="column">
                <div className="field">
                  <label htmlFor="farbGeierAllowed" className="checkbox">
                    <Field type="checkbox" name="farbGeierAllowed" id="farbGeierAllowed"/> {t('farbGeier')}
                  </label>
                </div>
              </div>
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            {data && <div className="notification is-success has-text-centered">{t('ruleSetCreated_{{name}}', {name: data.group.createRuleSet})}</div>}

            <div className="my-3">
              <div className="columns">
                <div className="column">
                  <button type="button" className="button is-warning is-fullwidth" onClick={onCancel}>{t('cancel')}</button>
                </div>
                <div className="column">
                  <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                    {t('createNewRuleSet')}
                  </button>
                </div>

              </div>
            </div>
          </Form>
        }
      </Formik>
    </div>
  );
}
