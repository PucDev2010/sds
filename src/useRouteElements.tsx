import { Suspense, lazy } from 'react'
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'
import FormLayout from './layout/FormLayout'
import path from './constant/path'
import MainLayout from './layout/MainLayout/MainLayout'
import UserLayout from './layout/UserLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import LoadingModal from './components/Loading/LoadingModal'
import OAuth2Redirect from '~/pages/OAuth2Redirect'
import VnpayReturn from './pages/VnpayReturn'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { getRedirectUrlFromLS, setRedirectUrlToLS } from './utils/utils'

const Verify = lazy(() => import('~/pages/Verify'))
const ForgetPassword = lazy(() => import('~/pages/ForgetPassword'))
const NotFound = lazy(() => import('~/pages/NotFound'))
const Me = lazy(() => import('~/pages/Me'))
const MeMobile = lazy(() => import('~/pages/MeMobile'))
const ProductDetail = lazy(() => import('~/pages/ProductDetail'))
const Products = lazy(() => import('~/pages/Products'))
const Guide = lazy(() => import('~/pages/Guide'))
const CartPage = lazy(() => import('~/pages/Cart'))
const ResetPassword = lazy(() => import('~/pages/ResetPassword'))
const Purchase = lazy(() => import('~/pages/Purchase'))
const OrderSuccess = lazy(() => import('~/pages/OrderSuccess'))
const Coupon = lazy(() => import('~/pages/Coupon'))
const OrderManage = lazy(() => import('~/pages/OrderManage'))
const ChangePassword = lazy(() => import('~/pages/ChangePassword'))
const AddressBook = lazy(() => import('~/pages/AddressBook'))
const ProductVoucher = lazy(() => import('~/pages/ProductVoucher'))
const UserVoucherManage = lazy(() => import('~/pages/UserVoucherManage'))

function ProtectedRoute() {
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

function RejectedRoute() {
  const { isAuthenticated } = useSelector((root: RootState) => root.user)
  const { pathname } = useLocation()
  let redirect: string = path.home
  if (pathname === path.login) {
    redirect = getRedirectUrlFromLS()
    setRedirectUrlToLS('')
  }
  return !isAuthenticated ? <Outlet /> : <Navigate to={redirect} />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    // Public Route
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.home,
          element: <Home />
        },
        {
          path: path.productDetail,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: path.products,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <Products />
            </Suspense>
          )
        },
        {
          path: path.guide,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <Guide />
            </Suspense>
          )
        },
        {
          path: path.coupon,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <Coupon />
            </Suspense>
          )
        },
        {
          path: path.vnpayReturn,
          element: <VnpayReturn />
        },
        {
          path: path.productVoucher,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <ProductVoucher />
            </Suspense>
          )
        }
      ]
    },
    {
      path: path.oauth2redirect,
      element: <OAuth2Redirect />
    },
    {
      path: '',
      element: <FormLayout />,
      children: [
        {
          path: path.forgetpassword,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <ForgetPassword />
            </Suspense>
          )
        }
      ]
    },
    {
      path: path.verifyInformation,
      element: (
        <Suspense fallback={<LoadingModal loading />}>
          <Verify />
        </Suspense>
      )
    },
    // Rejeted Route
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <FormLayout socialOption />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <Register />
                </Suspense>
              )
            }
          ]
        },
        {
          path: '',
          element: <FormLayout />,
          children: [
            {
              path: path.resetpassword,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <ResetPassword />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    // Protected Route
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '',
          element: <MainLayout />,
          children: [
            {
              path: path.cart,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <CartPage />
                </Suspense>
              )
            },
            {
              path: path.purchase,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <Purchase />
                </Suspense>
              )
            },
            {
              path: path.orderSuccess,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <OrderSuccess />
                </Suspense>
              )
            },
            {
              path: path.me,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <Me />
                  </UserLayout>
                </Suspense>
              )
            },

            {
              path: path.address,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <AddressBook />
                  </UserLayout>
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <ChangePassword />
                  </UserLayout>
                </Suspense>
              )
            },
            {
              path: path.orderManagement,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <OrderManage />
                  </UserLayout>
                </Suspense>
              )
            },
            {
              path: path.me,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <Me />
                  </UserLayout>
                </Suspense>
              )
            },
            {
              path: path.userVoucher,
              element: (
                <Suspense fallback={<LoadingModal loading />}>
                  <UserLayout>
                    <UserVoucherManage />
                  </UserLayout>
                </Suspense>
              )
            }
          ]
        },
        {
          path: path.meMobile,
          element: (
            <Suspense fallback={<LoadingModal loading />}>
              <MeMobile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return routeElements
}
