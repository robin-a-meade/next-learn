'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createOrUpdateInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
//import { useEffect } from 'react';

export default function CreateEditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm | null;
  customers: CustomerField[];
}) {
  const initialState: State = { message: null, errors: {} };
  const createOrUpdateInvoiceBinded = createOrUpdateInvoice.bind(
    null,
    invoice?.id,
  );
  const [state, formAction] = useActionState(
    createOrUpdateInvoiceBinded,
    initialState,
  );

  // // This `useEffect` is a workaround for bug that prevents setting of `defaultValue`
  // // on `select` controls after initial render.
  // // [Bug: `defaultValue` is not consistent between `input` and `select` · Issue #24165 · facebook/react](
  // //   https://github.com/facebook/react/issues/24165
  // // )
  // // Remove this when that bug is fixed.
  // useEffect(() => {
  //   const selectElement = document.getElementById(
  //     'customer',
  //   ) as HTMLSelectElement | null;
  //   if (selectElement) {
  //     selectElement.value = state.payload
  //       ? (state.payload.get('customerId') as string)
  //       : invoice
  //         ? invoice.customer_id
  //         : '';
  //   }
  // }, [state]);

  // Update 2025-02-11: A better way was found
  // The better way is to set `key` in addition to `defaultValue`
  // Why it works is a mystery, though
  // [React 19] Controlled <select> component is subject to automatic form reset #30580
  // https://github.com/facebook/react/issues/30580

  // We use this value twice: for defaultValue and key
  // We therefore calculate it once up here to be DRY
  const customerDefaultValue = (state.payload?.get('customerId') ??
    invoice?.customer_id ??
    '') as string;

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={customerDefaultValue}
              key={customerDefaultValue}
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>

          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                defaultValue={
                  (state.payload?.get('amount') ??
                    invoice?.amount ??
                    '') as string
                }
                step="0.01"
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={
                    (state.payload?.get('status') ?? invoice?.status ?? '') ===
                    'pending'
                  }
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={
                    (state.payload?.get('status') ?? invoice?.status ?? '') ===
                    'paid'
                  }
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>

        <div aria-live="polite" aria-atomic="true">
          {state.message ? (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">{invoice ? 'Edit' : 'Create'} Invoice</Button>
      </div>
    </form>
  );
}
