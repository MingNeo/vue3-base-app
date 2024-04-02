/**
 * 正则表达式验证常量
 */

/**
 * 用户名由字母数字下划线组成的字符串，且长度位于5~20之间。
 * @example "my_username123"
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,20}$/

/**
 * 密码包含数字、字母和特殊字符，且长度为8~16个字符。
 * @example "my_Passw0rd!"
 */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/

/**
 * 邮箱格式合法性验证。
 * @example "my_email@example.com"
 */
export const EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

/**
 * 手机号码合法性校验。
 * @example "1[3,4,5,6.7,8,9]xxxxxxxxx"
 */
export const PHONE_NUMBER_REGEX = /^[1][3,4,5,6.7,8,9][0-9]{9}$/

/**
 * 座机合法性校验。
 * @example ""
 */
export const LANDLINE_NUMBER_REGEX = /^(\d{3,4}-)?\d{7,8}$/

/**
 * 座机 + 手机号合法性校验。
 * @example ""
 */
export const LANDLINE_PHONE_NUMBER_REGEX = /^((0\d{2,3}(-)?\d{7,8})|(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8})$/

/**
 * 身份证号码必须符合中国公民身份证号码的规范。
 * @example "35018119880101234X"
 */
export const ID_CARD_REGEX = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

/**
 * 验证中国邮政编码格式合法性。
 * @example "350000"
 */
export const POSTAL_CODE_REGEX = /^[1-9]\d{5}$/

/**
 * 验证金额数值，允许小数点前后两位。
 * @example 100.00
 * @example 99
 */
export const CURRENCY_AMOUNT_REGEX = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/
