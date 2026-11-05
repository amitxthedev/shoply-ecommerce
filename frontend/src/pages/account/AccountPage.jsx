import { Outlet } from 'react-router-dom'
import { AccountLayout } from '../../layouts/AccountLayout'

/*
 * AccountPage — account section wrapper with shared AccountLayout.
 * Nested routes render inside AccountLayout.
 */
export function AccountPage() {
  return (
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  )
}




