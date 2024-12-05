import { HomePage } from "../pages/HomePage/HomePage";
import { OrderPage } from "../pages/OrderPage/OrderPage";
import { ProductDetailPage } from "../pages/ProductDetailPage/ProductDetailPage";
import { ProductsPage } from "../pages/ProductsPage/ProductsPage";
import { TypeProductPage } from "../pages/TypeProductPage/TypeProductPage";
import { SignInPage } from "../pages/SignInPage/SignInPage";
import { SignUpPage } from "../pages/SignUpPage/SignUpPage";
import { ProfilePage } from "../pages/Profile/ProfilePage";
import { AdminPage } from "../pages/AdminPage/AdminPage";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShow: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShow: true,
  },
  {
    path: "/products",
    page: ProductsPage,
    isShow: false,
  },
  {
    path: "/product/:type",
    page: TypeProductPage,
    isShow: true,
  },
  {
    path: "/type",
    page: TypeProductPage,
    isShow: true,
  },
  {
    path: "/product-detail/:id",
    page: ProductDetailPage,
    isShow: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShow: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShow: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShow: false,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShow: false,
    isPrivate: true,
  },
];
