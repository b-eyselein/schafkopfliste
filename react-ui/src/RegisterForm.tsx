import React from 'react';
import {RegisterUserInput, useRegisterMutation} from './graphql';
import {Formik} from 'formik';

const initialValues: RegisterUserInput = {
  username: '',
  password: '',
  passwordRepeat: ''
};

function t(str: string): string {
  return str
}

export function RegisterForm(): JSX.Element {

  // const {t} = useTranslation('common');
  const [register, registerMutationResult] = useRegisterMutation();

  function onSubmit(registerUserInput: RegisterUserInput): void {
    register({variables: {registerUserInput}})
      .catch((error) => console.error(error));
  }

  return (
    <div className="container">
      <h1 className="title is-3 has-text-centered">{t('registerNewAccount')}</h1>

      <Formik initialValues={initialValues} onSubmit={onSubmit}>

      </Formik>
    </div>
  );
}
