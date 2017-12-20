import { StackNavigator } from 'react-navigation'

import Home from './drawerNavigator'
import Login from './../screens/auth/login'
import InitialScreen from './../screens/home/initialScreen'
import Signup from './../screens/auth/signup'
import AuthVerifyMobile from './../screens/auth/verifyMobile'
import SetUsername from './../screens/auth/setUsername'
import ForgetPassword from './../screens/auth/forgetPassword'
import SendMoney from './../screens/transfer/amountEntry'
import SendTo from './../screens/transfer/sendTo'
import QRcodeScanner from './../screens/transfer/qrcodeScanner'
import AccountCurrencies from './../screens/accounts/accountCurrencies'
import UploadImage from './../screens/settings/profileImage/uploadImage'
import SettingsPersonalDetails from './../screens/settings/personalDetails'
import SettingsMobileNumbers from './../screens/settings/mobileNumbers/mobileNumbers'
import AddMobileNumber from './../screens/settings/mobileNumbers/addMobileNumber'
import VerifyMobileNumber from './../screens/settings/mobileNumbers/verifyMobile'
import SettingsEmailAddresses from './../screens/settings/emailAddresses/emailAddresses'
import AddEmailAddress from './../screens/settings/emailAddresses/addEmailAddress'
import SettingsGetVerified from './../screens/settings/getVerified/getVerified'
import Document from './../screens/settings/getVerified/document'
import DocumentUpload from './../screens/settings/getVerified/documentUpload'
import SettingsAddress from './../screens/settings/address'
import SettingsSecurity from './../screens/settings/security/security'
import ChangePassword from './../screens/settings/security/changePassword'
import TwoFactor from '../screens/settings/security/twoFactor/twoFactor'
import TwoFactorSmsAuth from '../screens/settings/security/twoFactor/twoFactorSmsAuth'
import TwoFactorToken from '../screens/settings/security/twoFactor/twoFactorToken'
import AuthVerifySms from '../screens/settings/security/twoFactor/authoVerifySms'
import Pin from './../screens/settings/security/pin'
import SettingsNotifications from './../screens/settings/notifications/notifications'
import EmailNotifications from './../screens/settings/notifications/emailNotifications'
import MobileNotifications from './../screens/settings/notifications/mobileNotifications'

const Stack = {
    Home: {
        screen: Home,
    },
    InitialScreen: {
        screen: InitialScreen
    },
    Login: {
        screen: Login,
    },
    Signup: {
        screen: Signup,
    },
    SetUsername: {
        screen: SetUsername,
    },
    AuthVerifyMobile: {
        screen: AuthVerifyMobile,
    },
    ForgetPassword: {
        screen: ForgetPassword,
    },
    SendMoney: {
        screen: SendMoney,
    },
    SendTo: {
        screen: SendTo,
    },
    QRcodeScanner: {
        screen: QRcodeScanner,
    },
    AccountCurrencies: {
        screen: AccountCurrencies,
    },
    UploadImage: {
        screen: UploadImage,
    },
    SettingsPersonalDetails: {
        screen: SettingsPersonalDetails,
    },
    SettingsMobileNumbers: {
        screen: SettingsMobileNumbers,
    },
    AddMobileNumber: {
        screen: AddMobileNumber,
    },
    VerifyMobileNumber: {
        screen: VerifyMobileNumber,
    },
    SettingsEmailAddresses: {
        screen: SettingsEmailAddresses,
    },
    AddEmailAddress: {
        screen: AddEmailAddress,
    },
    SettingsGetVerified: {
        screen: SettingsGetVerified,
    },
    Document: {
        screen: Document,
    },
    DocumentUpload: {
        screen: DocumentUpload,
    },
    SettingsAddress: {
        screen: SettingsAddress,
    },
    SettingsSecurity: {
        screen: SettingsSecurity,
    },
    ChangePassword: {
        screen: ChangePassword,
    },
    TwoFactor: {
        screen: TwoFactor,
    },
    TwoFactorSmsAuth: {
        screen: TwoFactorSmsAuth,
    },
    TwoFactorToken: {
        screen: TwoFactorToken,
    },
    AuthVerifySms: {
        screen: AuthVerifySms
    },
    Pin: {
        screen: Pin,
    },
    SettingsNotifications: {
        screen: SettingsNotifications,
    },
    EmailNotifications: {
        screen: EmailNotifications,
    },
    MobileNotifications: {
        screen: MobileNotifications,
    },
}


export default StackNavigator(Stack, {
    headerMode: 'none',
})
