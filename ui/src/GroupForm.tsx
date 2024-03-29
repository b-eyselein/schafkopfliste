import {Field, Form, Formik, FormikHelpers} from 'formik';
import {useTranslation} from 'react-i18next';
import {useGroupCreationMutation} from './graphql';
import * as yup from 'yup';
import classNames from 'classnames';

interface GroupInput {
  name: string;
}

const groupInputSchema: yup.SchemaOf<GroupInput> = yup.object()
  .shape({name: yup.string().min(2).required()})
  .required();

const initialValues: GroupInput = {
  name: '',
};

interface IProps {
  onGroupCreated: () => void;
}

export function GroupForm({onGroupCreated}: IProps): JSX.Element {

  const {t} = useTranslation('common');
  const [createGroup, {data, loading, error}] = useGroupCreationMutation();

  function onSubmit(groupInput: GroupInput, {resetForm}: FormikHelpers<GroupInput>): void {
    createGroup({variables: groupInput})
      .then(() => {
        resetForm();
        onGroupCreated();
      })
      .catch((error) => console.error(error));
  }

  return (
    <>
      <h2 className="subtitle is-3 has-text-centered">{t('createNewGroup')}</h2>


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

            {error && <div className="notifications is-danger has-text-centered">{error.message}</div>}

            {data && <div className="notification is-success has-text-centered">{t('groupSuccessfullyCreated_{{id}}', {id: data.createGroup})}</div>}

            <div className="my-3">
              <button type="submit" className={classNames('button', 'is-link', 'is-fullwidth', {'is-loading': loading})} disabled={loading}>
                {t('createNewGroup')}
              </button>
            </div>
          </Form>
        }
      </Formik>

    </>
  );
}
