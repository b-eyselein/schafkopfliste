import {useTranslation} from 'react-i18next';
import {PlayerInput, usePlayerCreationMutation} from './graphql';
import * as yup from 'yup';
import {Field, Form, Formik, FormikHelpers} from 'formik';
import classNames from 'classnames';

const initialValues: PlayerInput = {
  nickname: '', name: ''
};

const playerInputSchema: yup.SchemaOf<PlayerInput> = yup.object()
  .shape({
    nickname: yup.string().min(2).required(),
    name: yup.string().min(3).notRequired()
  })
  .required();

interface IProps {
  groupId: number;
  onCancel: () => void;
  onCreation: () => void;
}

export function PlayerForm({groupId, onCreation, onCancel}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [createPlayer, {data, loading, error}] = usePlayerCreationMutation();

  function onSubmit(playerInput: PlayerInput, {resetForm}: FormikHelpers<PlayerInput>): void {
    createPlayer({variables: {groupId, playerInput}})
      .then(() => {
        resetForm();
        onCreation();
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="box">
      <h3 className="subtitle is-4 has-text-centered">{t('createNewPlayer')}</h3>

      <Formik initialValues={initialValues} validationSchema={playerInputSchema} onSubmit={onSubmit}>
        {({touched, errors}) =>
          <Form>

            <div className="field">
              <label htmlFor="nickname" className="label">{t('nickname')}:</label>
              <div className="control">
                <Field type="text" name="nickname" id="nickname" placeholder={t('nickname')} autoFocus
                       className={classNames('input', {'is-danger': touched.nickname && errors.nickname})}/>
              </div>
            </div>

            <div className="field">
              <label htmlFor="name" className="label">{t('name')}:</label>
              <div className="control">
                <Field type="text" name="name" id="name" placeholder={t('name')}
                       className={classNames('input', {'is-danger': touched.name && errors.name})}/>
              </div>
            </div>

            {error && <div className="notification is-danger has-text-centered">{error.message}</div>}

            {data &&
            <div className="notification is-success has-text-centered">{t('playerSuccessfullyCreated_{{name}}', {name: data.group.createPlayer})}</div>}

            <div className="columns">
              <div className="column">
                <button type="button" className="button is-warning is-fullwidth" onClick={onCancel}>{t('cancel')}</button>
              </div>
              <div className="column">
                <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                  {t('createNewPlayer')}
                </button>
              </div>

            </div>

          </Form>
        }
      </Formik>

    </div>
  );
}
