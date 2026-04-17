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

export type CheckoutFormValues = {
  address_id: string
  payment_method: "cod"
  notes?: string
}
