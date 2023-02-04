/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Card } from '@mui/material';
import brandApi from 'api/brand';
import Page from 'components/Page';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { TStoreCreate } from 'types/store';
import * as yup from 'yup';
import CreateNewStoreOfBrandForm from './CreateNewStoreForm';

const CreateStorePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { brandId } = useParams();

  const schema = yup.object({
    name: yup.string().required('Vui lòng nhập tên cửa hàng'),
    shortName: yup.string().required('Vui lòng nhập tên rút gọn'),
    email: yup.string().email().required('Vui lòng nhập email'),
    phone: yup.string().required('Vui lòng nhập số điện thoại'),
    code: yup.string().required('Vui lòng nhập code cửa hàng')
  });

  const createNewBrandForm = useForm<TStoreCreate>({
    resolver: yupResolver(schema),
    defaultValues: {
      brandId: '',
      name: '',
      shortName: '',
      email: '',
      phone: '',
      code: '',
      address: ''
    }
  });
  const onSubmitCreateNewStoreOfBrand = (values: TStoreCreate) => {
    console.log('value ne:', values);
    const dataToUpdate = { ...values };
    dataToUpdate.brandId = brandId ?? '';
    console.log('value update ne:', dataToUpdate);
    brandApi
      .createNewBrandStore(dataToUpdate)
      .then((res) => {
        enqueueSnackbar(`Tạo thành công ${values.name}`, {
          variant: 'success'
        });
        navigate(-1);
        console.log(res);
      })
      .catch((err) => {
        enqueueSnackbar(`Có lỗi xảy ra. Vui lòng thử lại`, {
          variant: 'error'
        });
      });
  };

  return (
    <Page title="Tạo cửa hàng">
      <Card>
        <FormProvider {...createNewBrandForm}>
          <CreateNewStoreOfBrandForm
            onFinish={createNewBrandForm.handleSubmit(onSubmitCreateNewStoreOfBrand)}
          />
        </FormProvider>
      </Card>
    </Page>
  );
};

export default CreateStorePage;
