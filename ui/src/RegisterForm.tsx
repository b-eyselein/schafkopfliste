import React from 'react';
import {RegisterUserInput, useRegisterMutation} from './graphql';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';
import * as yup from 'yup';

const initialValues: RegisterUserInput = {
  username: '', password: '', passwordRepeat: ''
};

const registerUserInputSchema: yup.SchemaOf<RegisterUserInput> = yup.object()
  .shape({
    username: yup.string().min(4).required(),
    password: yup.string().min(4).required(),
    passwordRepeat: yup.string().min(4).required()
  })
  .required();

export function RegisterForm(): JSX.Element {

  const {t} = useTranslation('common');
  const [register, {data, loading, error}] = useRegisterMutation();

  function onSubmit(registerUserInput: RegisterUserInput): void {
    register({variables: {registerUserInput}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('registerNewAccount')}</h1>

      <Formik initialValues={initialValues} validationSchema={registerUserInputSchema} onSubmit={onSubmit}>
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
              <label htmlFor="password" className="label">{t('password')}:</label>
              <div className="control">
                <Field type="password" name="password" id="password" placeholder={t('password')}
                       className={classNames('input', {'is-danger': touched.password && errors.password})}/>
              </div>
              <ErrorMessage name="password">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>

            <div className="field">
              <label htmlFor="passwordRepeat">{t('passwordRepeat')}:</label>
              <div className="control">
                <Field type="password" name="passwordRepeat" id="passwordRepeat" placeholder={t('passwordRepeat')}
                       className={classNames('input', {'is-danger': touched.passwordRepeat && errors.passwordRepeat})}/>
              </div>
              <ErrorMessage name="passwordRepeat">{(msg) => <p className="help is-danger">{msg}</p>}</ErrorMessage>
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            {data && <div className="notification is-success has-text-centered">{t('userSuccessfullyRegeistered_{{name}}', {name: data.registerUser})}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('registerNewAccount')}
              </button>
            </div>

          </Form>
        }
      </Formik>
    </div>
  );
}
