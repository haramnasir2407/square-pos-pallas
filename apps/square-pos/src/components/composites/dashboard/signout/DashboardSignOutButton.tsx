'use client'

import { Button } from '@/components/primitives/ui/button'
import { signOut } from 'next-auth/react'
import { VscSignOut } from 'react-icons/vsc'
import { css } from '~/styled-system/css'

export function DashboardSignOutButton() {
  console.log("dashboard button is client component")
  return (
    <Button
      variant="link"
      onClick={() => signOut()}
      className={css({
        cursor: 'pointer',
      })}
    >
      <VscSignOut color="black" size={25} />
    </Button>
  )
}
