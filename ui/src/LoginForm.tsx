import React, {Dispatch} from 'react';
import {useTranslation} from 'react-i18next';
import {Credentials, useLoginMutation} from './graphql';
import * as yup from 'yup';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import classNames from 'classnames';
import {useDispatch, useSelector} from 'react-redux';
import {currentUserSelector} from './store/store';
import {Redirect} from 'react-router-dom';
import {StoreAction, userLoginAction} from './store/actions';

const initialValues: Credentials = {username: '', password: ''};

const credentialsSchema: yup.SchemaOf<Credentials> = yup.object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required()
  })
  .required();

export function LoginForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [login, {loading, error}] = useLoginMutation();
  const dispatch = useDispatch<Dispatch<StoreAction>>();
  const currentUser = useSelector(currentUserSelector);

  if (currentUser) {
    return <Redirect to={'/'}/>;
  }

  function onSubmit(credentials: Credentials): void {
    login({variables: {credentials}})
      .then(({data}) => data?.login && dispatch(userLoginAction(data.login)))
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('login')}</h1>

      <Formik initialValues={initialValues} validationSchema={credentialsSchema} onSubmit={onSubmit}>

        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="username" className="label">{t('username')}:</label>
              <div className="control">
                <Field type="text" name="username" id="username" placeholder={t('username')} autoFocus
                       className={classNames('input', {'is-danger': touched.username && errors.username})}/>
              </div>
              <ErrorMessage name="username">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>

            <div className="field">
              <label htmlFor="password" className="label">{t('password')}</label>
              <div className="control">
                <Field type="password" name="password" id="password" placeholder={t('password')}
                       className={classNames('input', {'is-danger': touched.password && errors.password})}/>
              </div>
              <ErrorMessage name="password">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('login')}
              </button>
            </div>
          </Form>
        }

      </Formik>

    </div>
  );
}
