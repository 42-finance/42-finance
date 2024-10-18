import { User } from 'frontend-types'
import { CurrencyCode } from 'shared-types'

import { config } from './config'
import { patch, post } from './http'
import { HTTPResponseBody } from './http-response-body.type'

export type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  token: string
  user: User
  currencyCode: CurrencyCode
}

export const login = async (body: LoginRequest) => post<HTTPResponseBody<LoginResponse>>(`${config.apiUrl}/login`, body)

export type AppleLoginRequest = {
  identityToken: string
  name: string
}

type AppleLoginResponse = {
  token: string
  user: User
  currencyCode: CurrencyCode
}

export const loginWithApple = async (body: AppleLoginRequest) =>
  post<HTTPResponseBody<AppleLoginResponse>>(`${config.apiUrl}/login/apple`, body)

export type RegisterRequest = {
  name: string
  email: string
  password: string
}

type RegisterResponse = {
  id: number
  email: string
  name: string
}

export const register = async (body: RegisterRequest) =>
  post<HTTPResponseBody<RegisterResponse>>(`${config.apiUrl}/register`, body)

export type ConfirmEmailRequest = {
  userId: number
  token: string
}

type ConfirmEmailResponse = {
  token: string
  user: User
}

export const confirmEmail = async (body: ConfirmEmailRequest) =>
  post<HTTPResponseBody<ConfirmEmailResponse>>(`${config.apiUrl}/confirm-email`, body)

export type ForgotPasswordRequest = {
  email: string
}

export const forgotPassword = async (body: ForgotPasswordRequest) =>
  post<HTTPResponseBody<object>>(`${config.apiUrl}/forgot-password`, body)

export type ResetPasswordRequest = {
  userId: number
  token: string
  newPassword: string
}

export const resetPassword = async (body: ResetPasswordRequest) =>
  patch<HTTPResponseBody<object>>(`${config.apiUrl}/reset-password`, body)

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export const changePassword = async (body: ChangePasswordRequest) =>
  patch<HTTPResponseBody<object>>(`${config.apiUrl}/change-password`, body)

export type SetPasswordRequest = {
  password: string
}

export const setPassword = async (body: SetPasswordRequest) =>
  patch<HTTPResponseBody<object>>(`${config.apiUrl}/set-password`, body)
