/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import { Avatar, Button, Card, Stack } from '@mui/material';
import categoryApi from 'api/category';
import CategoryModal from 'components/CategoryModal';
import DeleteConfirmDialog from 'components/DelectConfirmDialog';
import Label from 'components/Label';
import Page from 'components/Page';
import ResoTable from 'components/ResoTable/ResoTable';
import useLocales from 'hooks/useLocales';
import { get } from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
// components
import { useNavigate } from 'react-router-dom';
import { addCategoy, deleteCategoyById, editCategory } from 'redux/category/api';
import { PATH_DASHBOARD } from 'routes/paths';
import { CategoryStatus, TCategory } from 'types/category';
import { TTableColumn } from 'types/table';

const CategoryListPage = ({ isExtra = false }: { isExtra?: boolean }) => {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  console.log(`isExtra`, isExtra);

  const tableRef = useRef<any>();
  const [formModal, setFormModal] = useState(false);
  const [updateCateId, setUpdateCateId] = useState<number | null>(null);
  const [currentDeleteItem, setCurrentDeleteItem] = useState<TCategory | null>(null);

  const columns: TTableColumn<TCategory>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      hideInSearch: true
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'picUrl',
      hideInSearch: true,
      render: (src, { product_name }: any) => (
        <Avatar
          alt={product_name}
          src={src}
          variant="square"
          style={{ width: '54px', height: '54px' }}
        />
      )
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name'
    },
    {
      title: 'Mã danh mục',
      dataIndex: 'code',
      hideInSearch: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      hideInSearch: true,
      render: (status) => {
        return status === CategoryStatus.ACTIVE ? (
          <Label color="primary">Hoạt động </Label>
        ) : (
          <Label color="warning"> Không hoạt động </Label>
        );
      }
    }
  ];

  useEffect(() => {
    const form = tableRef.current?.formControl;
    if (form) {
      form.setValue('is-extra', isExtra);
    }
  }, [isExtra, tableRef]);

  const addCategoryHander = (values: TCategory) =>
    addCategoy(values)
      .then(() =>
        enqueueSnackbar(`Tạo thành công`, {
          variant: 'success'
        })
      )
      .then(() => setUpdateCateId(null))
      .then(tableRef.current?.reload)
      .catch((err) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error'
        });
      });

  const editCategoryHander = (values: TCategory) =>
    editCategory(updateCateId!, values)
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Cập nhật thành công`, {
          variant: 'success'
        })
      )
      .catch((err) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error'
        });
      });

  const deleteCategoryHander = () =>
    deleteCategoyById(currentDeleteItem!.id)
      .then(() => setCurrentDeleteItem(null))
      .then(tableRef.current?.reload)
      .then(() =>
        enqueueSnackbar(`Xóa thành công`, {
          variant: 'success'
        })
      )
      .then(() => tableRef.current?.reload())
      .catch((err) => {
        const errMsg = get(err.response, ['data', 'message'], `Có lỗi xảy ra. Vui lòng thử lại`);
        enqueueSnackbar(errMsg, {
          variant: 'error'
        });
      });

  return (
    <Page
      title={isExtra ? 'Danh mục extra' : 'Danh mục sản phẩm'}
      actions={() => [
        <Button
          key="add-category"
          onClick={() => {
            navigate(PATH_DASHBOARD.categories.new);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          {translate('categories.addBtn')}
        </Button>
      ]}
    >
      <CategoryModal
        open={formModal}
        cate_id={updateCateId}
        onClose={() => setFormModal(false)}
        onAdd={addCategoryHander}
        onEdit={editCategoryHander}
      />
      <DeleteConfirmDialog
        open={Boolean(currentDeleteItem)}
        onClose={() => setCurrentDeleteItem(null)}
        onDelete={deleteCategoryHander}
        title={
          <>
            {translate('common.confirmDeleteTitle')} <strong>{currentDeleteItem?.name}</strong>
          </>
        }
      />
      <Card>
        <Stack spacing={2}>
          <ResoTable
            defaultFilters={{
              'is-extra': isExtra
            }}
            ref={tableRef}
            onEdit={(cate: TCategory) => {
              navigate(`${PATH_DASHBOARD.categories.editById(cate.id)}`);
            }}
            onDelete={(cate: TCategory) => setCurrentDeleteItem(cate)}
            rowKey="id"
            getData={categoryApi.get}
            columns={columns}
          />
        </Stack>
      </Card>
    </Page>
  );
};

export default CategoryListPage;
