export type EditProfileValues = {
  full_name: string
  phone?: string
}

export type ChangePasswordValues = {
  current_password?: string
  new_password?: string
}

export type AddressFormValues = {
  label?: string
  recipient_name: string
  phone: string
  address_line: string
  city: string
  province: string
  postal_code: string
  is_default: boolean
}
