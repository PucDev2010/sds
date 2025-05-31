import { useTranslation } from 'react-i18next'
import { VnpayQueryDR } from '~/types/utils.type'
import { formatCurrency, getVnpayTransactionStatusMessage, getVnpayTransactionTypeMessage } from '~/utils/utils'

function QueryTransaction({ data }: { data: VnpayQueryDR }) {
  const { t } = useTranslation()
  const {
    vnp_OrderInfo,
    vnp_Amount,
    vnp_BankCode,
    vnp_CardHolder,
    vnp_CardNumber,
    vnp_FeeAmount,
    vnp_TransactionNo,
    vnp_TransactionStatus,
    vnp_TransactionType
  } = data
  return (
    <div className=''>
      <div className='text-xl my-4 text-orange-500 text-primary'>{t('orderManage:tranInformation')}</div>
      <table className='w-full text-sm text-left text-gray-500'>
        <thead className='text-xs text-gray-700 uppercase text-primary bg-primary'>
          <th scope='col' className='px-6 py-3'>
            {t('orderManage:title')}
          </th>
          <th scope='col' className='px-6 py-3'>
            {t('orderManage:detail')}
          </th>
        </thead>
        <tbody>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:contentBilling')}
            </th>
            <td className='px-6 py-4'>{vnp_OrderInfo}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:amount')}
            </th>
            <td className='px-6 py-4'>{formatCurrency(parseInt(vnp_Amount) / 100)}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:tranBankCode')}
            </th>
            <td className='px-6 py-4'>{vnp_BankCode}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:cardNumber')}
            </th>
            <td className='px-6 py-4'>{vnp_CardNumber}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:cardHolder')}
            </th>
            <td className='px-6 py-4'>{vnp_CardHolder}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:tranStatus')}
            </th>
            <td className='px-6 py-4'>{getVnpayTransactionStatusMessage(vnp_TransactionStatus)}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:tranType')}
            </th>
            <td className='px-6 py-4'>{getVnpayTransactionTypeMessage(vnp_TransactionType)}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:vnpayTranCode')}
            </th>
            <td className='px-6 py-4'>{vnp_TransactionNo}</td>
          </tr>
          <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-primary'>
            <th scope='row' className='px-6 py-4 font-medium text-gray-900 text-primary '>
              {t('orderManage:fee')}
            </th>
            <td className='px-6 py-4'>{vnp_FeeAmount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default QueryTransaction
