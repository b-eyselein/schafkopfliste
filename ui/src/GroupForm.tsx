import {Field, Form, Formik, FormikHelpers} from 'formik';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {GroupInput, RuleSetListQuery, useGroupCreationMutation, useRuleSetListQuery} from './graphql';
import {WithQuery} from './WithQuery';
import * as yup from 'yup';
import classNames from 'classnames';
import {useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import {Redirect} from 'react-router-dom';
import {groupsBaseUrl} from './urls';

const groupInputSchema: yup.SchemaOf<GroupInput> = yup.object()
  .shape({
    name: yup.string().min(2).required(),
    ruleSetName: yup.string().min(2).required()
  })
  .required();

export function GroupForm(): JSX.Element {

  const {t} = useTranslation('common');
  const ruleSetListQuery = useRuleSetListQuery();
  const [createGroup, {data, loading, error}] = useGroupCreationMutation();

  const currentUser = useSelector(currentUserSelector);

  if (!currentUser) {
    return <Redirect to={groupsBaseUrl}/>;
  }

  function render({ruleSets}: RuleSetListQuery): JSX.Element {

    const initialValues: GroupInput = {
      name: '',
      ruleSetName: ruleSets.length > 0 ? ruleSets[0].name : ''
    };

    function onSubmit(groupInput: GroupInput, {resetForm}: FormikHelpers<GroupInput>): void {
      createGroup({variables: groupInput})
        .then(() => resetForm())
        .catch((error) => console.error(error));
    }

    return (
      <Formik initialValues={initialValues} validationSchema={groupInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="name" className="label">{t('name')}:</label>
              <div className="control">
                <Field type="text" name="name" id="name" placeholder={t('name')} autoFocus
                       className={classNames('input', {'is-danger': touched.name && errors.name})}/>
              </div>
            </div>

            <div className="field">
              <label htmlFor="ruleSetName" className="label">{t('ruleSet')}:</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <Field as="select" name="ruleSetName" id="ruleSetName">
                    {ruleSets.map(({name}) => <option key={name}>{name}</option>)}
                  </Field>
                </div>
              </div>
            </div>

            {error && <div className="notifications is-danger has-text-centered">{error.message}</div>}

            {data && <div className="notification is-success has-text-centered">{t('groupSuccessfullyCreated_{{name}}', {name: data.createGroup.name})}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('createNewGroup')}
              </button>
            </div>
          </Form>
        }
      </Formik>
    );
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('createNewGroup')}</h1>

      <WithQuery query={ruleSetListQuery} render={render}/>
    </div>
  );
}
