/* eslint-disable camelcase */
import plusFill from '@iconify/icons-eva/plus-fill';
import { Icon } from '@iconify/react';
// material
import { useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD } from 'routes/paths';
import { useEffect, useRef } from 'react';
// components
import Page from 'components/Page';
import { Button, Card } from '@mui/material';
import AccountsList from './components/AccountsList';
//

// ----------------------------------------------------------------------

export default function AccountListPage() {
  const ref = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const form = ref.current?.formControl;
    if (!form) return;
  }, [ref]);

  return (
    <Page
      title="Quản lý tài khoản"
      actions={() => [
        <Button
          key="add-account"
          onClick={() => {
            navigate(PATH_DASHBOARD.accounts.new);
          }}
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
        >
          Tạo mới tài khoản
        </Button>
      ]}
    >
      <Card>
        <AccountsList />
      </Card>
    </Page>
  );
}
